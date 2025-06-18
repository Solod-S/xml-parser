const fs = require("fs");
const axios = require("axios");
const xml2js = require("xml2js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const XML_URL = "https://your-feed-url.xml"; // <-- замени на рабочий URL

async function fetchXML(url) {
  const { data } = await axios.get(url);
  return data;
}

async function parseXML(xml) {
  const parser = new xml2js.Parser({ explicitArray: false });
  return await parser.parseStringPromise(xml);
}

async function saveJSONToFile(data, filename = "data.json") {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Saved parsed XML to ${filename}`);
}

async function upsertCategories(categories) {
  for (const category of categories) {
    const id = parseInt(category.$.id);
    await prisma.category.upsert({
      where: { id },
      update: {
        name: category._,
        parentId: category.$.parentId ? parseInt(category.$.parentId) : null,
      },
      create: {
        id,
        name: category._,
        parentId: category.$.parentId ? parseInt(category.$.parentId) : null,
      },
    });
  }
  console.log(`✅ Categories upserted: ${categories.length}`);
}

async function upsertOffers(offers) {
  for (const offer of offers.slice(0, 5)) {
    // Убери .slice() для полного парсинга
    const id = parseInt(offer.$.id);

    // Удаляем старые характеристики и изображения
    await prisma.param.deleteMany({ where: { offerId: id } });
    await prisma.picture.deleteMany({ where: { offerId: id } });

    // Собираем динамические параметры
    const params = Array.isArray(offer.param)
      ? offer.param
      : offer.param
        ? [offer.param]
        : [];
    const validParams = [];

    for (const param of params) {
      const name = param?.$?.name?.trim();
      const value = param?._?.trim();
      if (name && value) {
        validParams.push({ name, value });
      } else {
        console.warn(
          `⚠️ Пропущен параметр без имени или значения в offer ${id}`
        );
      }
    }

    // Картинки
    const pictures = Array.isArray(offer.picture)
      ? offer.picture
      : offer.picture
        ? [offer.picture]
        : [];

    // Upsert самого оффера
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

    for (const { name, value } of validParams) {
      await prisma.param.create({
        data: {
          name,
          value,
          offerId: id,
        },
      });
    }

    for (const url of pictures) {
      await prisma.picture.create({
        data: {
          url,
          offerId: id,
        },
      });
    }

    console.log(`🔁 Offer ${id} processed`);
  }
}

async function main() {
  try {
    console.log("📡 Fetching XML...");
    const xml = await fetchXML(XML_URL);

    console.log("📦 Parsing XML...");
    const parsed = await parseXML(xml);
    await saveJSONToFile(parsed);

    const categories = parsed?.yml_catalog?.shop?.categories?.category || [];
    const offers = parsed?.yml_catalog?.shop?.offers?.offer || [];

    console.log("📂 Syncing categories...");
    await upsertCategories(
      Array.isArray(categories) ? categories : [categories]
    );

    console.log("📂 Syncing offers...");
    await upsertOffers(Array.isArray(offers) ? offers : [offers]);

    console.log("✅ Sync completed successfully");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
