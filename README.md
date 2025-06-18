![Version](https://img.shields.io/badge/Version-1.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Runs with Node.js](https://img.shields.io/badge/Runs%20with-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Uses Prisma ORM](https://img.shields.io/badge/Uses-Prisma%20ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Runs with MySQL](https://img.shields.io/badge/Runs%20with-MySQL-00758F?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Uses xml2js](https://img.shields.io/badge/Uses-xml2js-4B4B77?style=flat-square)](https://www.npmjs.com/package/xml2js)
[![Uses dotenv](https://img.shields.io/badge/Uses-dotenv-ECD53F?style=flat-square&logo=dotenv&logoColor=000)](https://www.npmjs.com/package/dotenv)

# 📦 XML Product Sync Backend

This is a backend application for automatically syncing products from an XML feed.  
The data is imported into a database (categories, products, parameters, images), clearing the previous state. Suitable for marketplaces, dropshipping platforms, and other eCommerce projects.

---

## ⚙️ Technologies

- **Node.js** — runtime environment
- **Prisma ORM** — database interaction with MySQL using a type-safe ORM
- **MySQL** — relational database for storing product structure
- **xml2js** — for parsing XML into JSON
- **dotenv** — for managing environment variables

---

## 🔧 Core Features

- 🔄 Downloading XML feed
- 📁 Saving the XML feed as JSON for debugging
- 🧹 Fully clearing the database before import
- 🗂️ Importing categories
- 📦 Importing product offers, including parameters and images
- ⚡ Batch processing for stability

---

## 🛠️ Installation & Usage

1. **Clone the repository:**

```bash
git clone https://github.com/YOUR-USERNAME/xml-product-sync.git
cd xml-product-sync
```

2.  **Install dependencies:**

```bash
npm install
```

3. **Create a .env file in the root directory:**

```bash
DATABASE_URL=mysql://user:password@localhost:3306/database
XML_FEED_URL=https://example.com/feed.xml
```

4. **Generate Prisma client and apply migrations:**

```bash
npx prisma generate
npx prisma migrate deploy
```

5. **Run the sync script:**
6.

```bash
node src/jobs/syncJob.js
```

## 🧬 Project Structure

```bash
├── src/
│   ├── jobs/
│   │   └── syncJob.js        # Main sync logic
│   ├── utils/
│   │   └── xmlParser.js      # XML parsing and JSON
├── prisma/
│   └── schema.prisma         # Database schema
├── .env
├── package.json

```

## 📌 Notes

- Supports syncing offers with nested <param> and <picture> elements
- XML feed may contain arrays or single elements — parsing logic handles both cases
- Tables picture, param, offer, and category are fully cleared before each sync

---

Let me know if you want a shortened version or want it adjusted for publishing on npm or as a public GitHub package.
