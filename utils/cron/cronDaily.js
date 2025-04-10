const db = require('../../src/models/index');
const moment = require("moment");

exports.cronDaily = async () => {
    const tasks = await db.task.find().handleWeeklyTasklean();
    const dailyTasks = tasks.filter((t) => t.recurrence == "daily");
    const weeklyTasks = tasks.filter((t) => t.recurrence == "weekly");
    const monthlyTasks = tasks.filter((t) => t.recurrence == "montly");


    handleDailyTask(dailyTasks);
    handleWeeklyTask(weeklyTasks);
    handleMonthlyTask(monthlyTasks);
}

function handleDailyTask(tasks) {
    const bodyArray = tasks.map((t) => {
        const { createdAt, updatedAt, status, ...rest } = t;
        return rest;
    });

    db.task.create(bodyArray);
}

function handleWeeklyTask(tasks) {
    const oneWeekAgo = moment().subtract(7, 'days');

    const filteredTasks = tasks.filter(t => moment(t.createdAt).isBefore(oneWeekAgo));

    const bodyArray = filteredTasks.map(t => {
        const {createdAt, updatedAt, status, ...rest} = t;
        return rest;
    })

    db.task.create(bodyArray);
}

function handleMonthlyTask(tasks) {
    const oneMonthAgo = moment().subtract(1, 'months');

    const filteredTasks = tasks.filter(t => moment(t.createdAt).isBefore(oneMonthAgo));

    const bodyArray = filteredTasks.map((t) => {
        const { createdAt, updatedAt, status, ...rest } = t;
        return rest;
    });

    db.task.create(bodyArray)
}

