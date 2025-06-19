const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { fetchXML, saveJSON } = require("../utils/xmlParser");
const xmlUrl = process.env.XML_FEED_URL;

const BATCH_SIZE = 20;

async function sync() {
  console.log("🔄 Starting XML sync...");

  // 1. Получаем XML
  console.log("📡 Fetching XML feed...");
  const xml = await fetchXML(xmlUrl);
  console.log("📁 Saving XML as JSON for debug...");
  saveJSON(xml);

  const categories = Array.isArray(xml.yml_catalog.shop.categories.category)
    ? xml.yml_catalog.shop.categories.category
    : [xml.yml_catalog.shop.categories.category];

  const offers = Array.isArray(xml.yml_catalog.shop.offers.offer)
    ? xml.yml_catalog.shop.offers.offer
    : [xml.yml_catalog.shop.offers.offer];

  // 2. Удаление зависимостей офферов
  console.log("🧹 Clearing old offers (params, pictures, offers)...");
  await prisma.picture.deleteMany();
  await prisma.param.deleteMany();
  await prisma.offer.deleteMany();
  console.log("✅ Offers cleared.");

  // 3. Обработка категорий
  console.log(`🧹 Deleting ${categories.length} categories...`);
  await prisma.category.deleteMany();
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    await prisma.category.create({
      data: {
        id: parseInt(category.$.id),
        name: category._,
        parentId: category.$.parentId ? parseInt(category.$.parentId) : null,
      },
    });
    const percent = Math.floor(((i + 1) / categories.length) * 100);
    console.log(`📂 Category ${i + 1}/${categories.length} (${percent}%)`);
  }
  console.log("✅ Categories synced.");

  // 4. Обработка офферов батчами
  console.log(
    `💾 Saving ${offers.length} offers in batches of ${BATCH_SIZE}...`
  );
  for (let i = 0; i < offers.length; i += BATCH_SIZE) {
    const batch = offers.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async offer => {
        const id = parseInt(offer.$.id);
        const categoryId = parseInt(offer.categoryId);

        if (isNaN(categoryId)) {
          console.warn(
            `⚠️ Skipping offer ID ${id} due to invalid categoryId:`,
            offer.categoryId
          );
          return; // Пропускаем оффер без валидной категории
        }

        await prisma.offer.upsert({
          where: { id },
          update: {
            name: offer.name,
            nameUa: offer.name_ua,
            price: parseFloat(offer.price),
            currencyId: offer.currencyId,
            vendor: offer.vendor,
            barcode: offer.barcode,
            description: offer.description,
            descriptionUa: offer.description_ua,
            ean: offer.EAN,
            quantityInStock: parseInt(offer.quantity_in_stock || "0"),
            categoryId,
          },
          create: {
            id,
            name: offer.name,
            nameUa: offer.name_ua,
            price: parseFloat(offer.price),
            currencyId: offer.currencyId,
            vendor: offer.vendor,
            barcode: offer.barcode,
            description: offer.description,
            descriptionUa: offer.description_ua,
            ean: offer.EAN,
            quantityInStock: parseInt(offer.quantity_in_stock || "0"),
            categoryId,
          },
        });

        const params = Array.isArray(offer.param) ? offer.param : [offer.param];
        for (const p of params) {
          if (!p?.$?.name || !p._) continue;
          await prisma.param.create({
            data: {
              name: p.$.name,
              value: p._,
              offerId: id,
            },
          });
        }

        const pictures = Array.isArray(offer.picture)
          ? offer.picture
          : [offer.picture];
        for (const url of pictures.filter(Boolean)) {
          await prisma.picture.create({
            data: {
              url,
              offerId: id,
            },
          });
        }
      })
    );

    const done = Math.min(i + BATCH_SIZE, offers.length);
    const percent = Math.floor((done / offers.length) * 100);
    console.log(`📦 Offers progress: ${done}/${offers.length} (${percent}%)`);
  }

  console.log("🎉 XML sync complete.");
}

module.exports = sync;
