require("dotenv").config();
const cron = require("node-cron");
const sync = require("./jobs/syncJob");

console.log("🕓 Cron started. Schedule:", process.env.CRON_SCHEDULE);
// cron.schedule(process.env.CRON_SCHEDULE, async () => {
//   await sync();
// });
sync();
