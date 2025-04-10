const cron = require("node-cron");

function start() {
    cron.schedule("1 0 * * *", async () =>{
        await cronDaily();
    })
}

module.exports = { start };