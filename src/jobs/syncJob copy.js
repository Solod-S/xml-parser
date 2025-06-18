const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { fetchXML, saveJSON } = require("../utils/xmlParser");
const xmlUrl = process.env.XML_FEED_URL;

async function sync() {
  console.log("🔄 Starting XML sync...");

  // Получаем XML
  console.log("📡 Fetching XML feed...");
  const xml = await fetchXML(xmlUrl);
  console.log("📁 Saving XML as JSON for debug...");
  saveJSON(xml);

  // Обрабатываем категории
  console.log("📂 Parsing categories...");
  const categories = Array.isArray(xml.yml_catalog.shop.categories.category)
    ? xml.yml_catalog.shop.categories.category
    : [xml.yml_catalog.shop.categories.category];

  const offers = Array.isArray(xml.yml_catalog.shop.offers.offer)
    ? xml.yml_catalog.shop.offers.offer
    : [xml.yml_catalog.shop.offers.offer];

  console.log(`🧹 Clearing ${categories.length} old categories...`);
  await prisma.category.deleteMany();

  for (const category of categories) {
    await prisma.category.create({
      data: {
        id: parseInt(category.$.id),
        name: category._,
        parentId: category.$.parentId ? parseInt(category.$.parentId) : null,
      },
    });
  }
  console.log(`✅ Categories synced: ${categories.length}`);

  // Очищаем устаревшие офферы
  const incomingOfferIds = offers.map(o => parseInt(o.$.id));
  const existingOffers = await prisma.offer.findMany({ select: { id: true } });
  const existingIds = existingOffers.map(o => o.id);

  const toDelete = existingIds.filter(id => !incomingOfferIds.includes(id));
  if (toDelete.length) {
    console.log(`🗑️ Removing ${toDelete.length} old offers...`);
    await prisma.picture.deleteMany({ where: { offerId: { in: toDelete } } });
    await prisma.param.deleteMany({ where: { offerId: { in: toDelete } } });
    await prisma.offer.deleteMany({ where: { id: { in: toDelete } } });
    console.log(`🧹 Old offers removed.`);
  } else {
    console.log("ℹ️ No old offers to delete.");
  }

  console.log(`💾 Saving ${offers.length} offers...`);
  for (const offer of offers) {
    const id = parseInt(offer.$.id);
    console.log(`➡️ Processing offer ID: ${id}...`);

    await prisma.param.deleteMany({ where: { offerId: id } });
    await prisma.picture.deleteMany({ where: { offerId: id } });

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
        categoryId: parseInt(offer.categoryId),
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
        categoryId: parseInt(offer.categoryId),
      },
    });

    const params = Array.isArray(offer.param) ? offer.param : [offer.param];
    let paramCount = 0;
    for (const p of params) {
      if (!p?.$?.name || !p._) continue;
      await prisma.param.create({
        data: {
          name: p.$.name,
          value: p._,
          offerId: id,
        },
      });
      paramCount++;
    }

    const pictures = Array.isArray(offer.picture)
      ? offer.picture
      : [offer.picture];
    let pictureCount = 0;
    for (const url of pictures.filter(Boolean)) {
      await prisma.picture.create({
        data: {
          url,
          offerId: id,
        },
      });
      pictureCount++;
    }

    console.log(
      `✅ Offer ${id} saved with ${paramCount} params and ${pictureCount} pictures.`
    );
  }

  console.log("🎉 XML sync complete.");
}

module.exports = sync;
