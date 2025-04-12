const cron = require("node-cron");
const { cronDaily } = require('./cronDaily');

function dailyCron() {
    cron.schedule("1 0 * * *", async () =>{  // run the cron on everyday at 00:01 am
        console("Renning Task Recurrence Cron")
        await cronDaily();
    })
}

module.exports = { dailyCron };