const fs = require("fs");
const axios = require("axios");
const xml2js = require("xml2js");

async function fetchXML(url) {
  const { data } = await axios.get(url);
  return await xml2js.parseStringPromise(data, { explicitArray: false });
}

function saveJSON(data, filename = "data.json") {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

module.exports = { fetchXML, saveJSON };
