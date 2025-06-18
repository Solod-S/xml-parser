const axios = require("axios");
const xml2js = require("xml2js");
const fs = require("fs");

async function parseXmlFromUrl(url) {
  try {
    // Получаем XML с URL
    const { data: xmlData } = await axios.get(url, { responseType: "text" });

    // Парсим XML в объект JS
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
    });
    const result = await parser.parseStringPromise(xmlData);

    // Навигация по структуре XML
    const shop = result?.yml_catalog?.shop;
    const categories = shop?.categories?.category;
    const offers = shop?.offers?.offer;

    // Преобразуем категории и офферы в массивы (если вдруг пришел объект)
    const categoryList = Array.isArray(categories) ? categories : [categories];
    const offerList = Array.isArray(offers) ? offers : [offers];

    // Берем первые 5 элементов
    const first5Categories = categoryList.slice(0, 5);
    const first5Offers = offerList.slice(0, 5);

    // Подготавливаем результат
    const parsedData = {
      categories: first5Categories.map(cat => ({
        id: cat.id,
        parentId: cat.parentId || null,
        name: cat._,
      })),
      offers: first5Offers.map(offer => ({
        id: offer.id,
        available: offer.available,
        type: offer.type,
        name: offer.name,
        name_ua: offer.name_ua,
        price: offer.price,
        vendor: offer.vendor,
        barcode: offer.barcode,
        categoryId: offer.categoryId,
        currencyId: offer.currencyId,
        description: offer.description,
        description_ua: offer.description_ua,
        pictures: Array.isArray(offer.picture)
          ? offer.picture
          : [offer.picture],
        quantity_in_stock: offer.quantity_in_stock,
        params: offer.param,
        ean: offer.EAN,
      })),
    };

    // Сохраняем в файл
    fs.writeFileSync(
      "parsed_output.txt",
      JSON.stringify(parsedData, null, 2),
      "utf8"
    );

    console.log("Успешно! Данные сохранены в parsed_output.txt");
  } catch (error) {
    console.error("Ошибка при парсинге XML:", error.message);
  }
}

// Пример использования
const xmlUrl = ""; // Замени на свою ссылку
parseXmlFromUrl(xmlUrl);
