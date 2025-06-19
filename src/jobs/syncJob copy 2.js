const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { fetchXML, saveJSON } = require("../utils/xmlParser");
const xmlUrl = process.env.XML_FEED_URL;

const BATCH_SIZE = 20;

const PARAM_MODELS = {
  Производитель: { model: "brand", field: "brandId" },
  "Совместимый бренд": { model: "compatibleBrand", field: "compatibleBrandId" },
  "Список совместимых устройств товара": {
    model: "compatibleDevices",
    field: "compatibleDevicesId",
  },
  Тип: { model: "type", field: "typeId" },
  Поверхность: { model: "surface", field: "surfaceId" },
  Вид: { model: "view", field: "viewId" },
  "Форм фактор": { model: "formFactor", field: "formFactorId" },
  Материал: { model: "material", field: "materialId" },
  Цвет: { model: "color", field: "colorId" },
};

const cache = {
  brand: new Map(),
  compatibleBrand: new Map(),
  compatibleDevices: new Map(),
  type: new Map(),
  surface: new Map(),
  view: new Map(),
  formFactor: new Map(),
  material: new Map(),
  color: new Map(),
};

async function getOrCreate(model, name) {
  if (!name) return null;

  // Проверяем кеш
  if (cache[model].has(name)) {
    return cache[model].get(name);
  }

  // Ищем в БД
  const existing = await prisma[model].findUnique({ where: { name } });
  if (existing) {
    cache[model].set(name, existing.id);
    return existing.id;
  }

  // Создаём и сохраняем в кеш
  const created = await prisma[model].create({ data: { name } });
  cache[model].set(name, created.id);
  return created.id;
}

async function sync() {
  console.log("🔄 Starting XML sync...");

  const xml = await fetchXML(xmlUrl);
  saveJSON(xml);

  const categories = Array.isArray(xml.yml_catalog.shop.categories.category)
    ? xml.yml_catalog.shop.categories.category
    : [xml.yml_catalog.shop.categories.category];

  const offers = Array.isArray(xml.yml_catalog.shop.offers.offer)
    ? xml.yml_catalog.shop.offers.offer
    : [xml.yml_catalog.shop.offers.offer];

  // Очистка
  await prisma.picture.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.category.deleteMany();

  // Удаляем атрибуты всех типов
  await prisma.color.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.compatibleBrand.deleteMany();
  await prisma.compatibleDevices.deleteMany();
  await prisma.type.deleteMany();
  await prisma.surface.deleteMany();
  await prisma.view.deleteMany();
  await prisma.formFactor.deleteMany();
  await prisma.material.deleteMany();

  // Категории
  for (const category of categories) {
    await prisma.category.create({
      data: {
        id: parseInt(category.$.id),
        name: category._,
        parentId: category.$.parentId ? parseInt(category.$.parentId) : null,
      },
    });
  }

  // Офферы
  for (let i = 0; i < offers.length; i += BATCH_SIZE) {
    const batch = offers.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async offer => {
        const id = parseInt(offer.$.id);
        const categoryId = parseInt(offer.categoryId);
        if (isNaN(categoryId)) return;

        const attrRefs = {};
        const params = Array.isArray(offer.param) ? offer.param : [offer.param];

        for (const p of params) {
          if (!p?.$?.name || !p._) continue;
          const match = PARAM_MODELS[p.$.name];
          if (match) {
            const attrId = await getOrCreate(match.model, p._);
            if (attrId) attrRefs[match.field] = attrId;
          }
        }

        await prisma.offer.create({
          data: {
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
            ...attrRefs,
          },
        });

        const pictures = Array.isArray(offer.picture)
          ? offer.picture
          : [offer.picture];

        for (const url of pictures.filter(Boolean)) {
          await prisma.picture.create({ data: { url, offerId: id } });
        }
      })
    );

    const percent = Math.round(((i + BATCH_SIZE) / offers.length) * 100);
    console.log(
      `✅ Processed ${Math.min(i + BATCH_SIZE, offers.length)} / ${offers.length} (${percent}%)`
    );
  }

  console.log("🎉 XML sync complete.");
}

module.exports = sync;
