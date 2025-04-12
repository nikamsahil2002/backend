const db = require('../../src/models/index');
const moment = require("moment");
const commonFunction = require('../commonFunctions');

exports.cronDaily = async () => {
    const tasks = await db.task.find({
        recurrence: { $ne: "once" }
    }).lean();

    const dailyTasks = tasks.filter((t) => t.recurrence == "daily");
    const weeklyTasks = tasks.filter((t) => t.recurrence == "weekly");
    const monthlyTasks = tasks.filter((t) => t.recurrence == "montly");

    handleDailyTask(dailyTasks);
    handleWeeklyTask(weeklyTasks);
    handleMonthlyTask(monthlyTasks);

    const overDueTasks = await db.task_recurrence.find({
        dueDate: { $lte : moment().format("YYYY-MM-DD HH:mm:ss") }
    });
    console.log(overDueTasks)
    handleOverDueTask(overDueTasks);
}

function handleDailyTask(tasks) {
    try{
        const bodyArray = tasks.map((t) => {
            const { _id, createdAt, updatedAt, recurrence, startDate, ...rest } = t;
            return {
                ...rest,
                taskId: t._id,
                dueDate: moment().add(moment.duration(t.estimatedTime || 0, 'hours')).toISOString(),
                startDate: moment().toISOString()
            }
        });
        db.task_recurrence.create(bodyArray);
        for(let i=0;i<tasks.length;i++){
            commonFunction.taskNotification(tasks[i]._id);
        }
    }
    catch(err){
        console.log(err)
    }
}

function handleWeeklyTask(tasks) {
    try{
        const oneWeekAgo = moment().subtract(7, 'days');
        const filteredTasks = tasks.filter(t => moment(t.createdAt).isBefore(oneWeekAgo));
        const bodyArray = tasks.map((t) => {
            const { _id, createdAt, updatedAt, recurrence, startDate, ...rest } = t;
            return {
                ...rest,
                taskId: t._id,
                dueDate: moment().add(moment.duration(t.estimatedTime || 0, 'hours')).toISOString(),
                startDate: moment().toISOString()
            }
        });
        db.task_recurrence.create(bodyArray);
        for(let i=0;i<tasks.length;i++){
            commonFunction.taskNotification(tasks[i]._id);
        }
    }
    catch(err){
        console.log(err)
    }
}

function handleMonthlyTask(tasks) {
    try{
        const oneMonthAgo = moment().subtract(1, 'months');
        const filteredTasks = tasks.filter(t => moment(t.createdAt).isBefore(oneMonthAgo));
        const bodyArray = tasks.map((t) => {
            const { _id, createdAt, updatedAt, recurrence, startDate, ...rest } = t;
            return {
                ...rest,
                taskId: t._id,
                dueDate: moment().add(moment.duration(t.estimatedTime || 0, 'hours')).toISOString(),
                startDate: moment().toISOString()
            }
        });
        db.task_recurrence.create(bodyArray);
        for(let i=0;i<tasks.length;i++){
            commonFunction.taskNotification(tasks[i]._id);
        }
    }
    catch(err){
        console.log(err);
    }
}

function handleOverDueTask(overDueTasks){
    try{
        for(let i=0;i<overDueTasks.length;i++){
            commonFunction.taskNotification(overDueTasks[i].taskId, true);
        }
    }
    catch(err){
        console.log(err)
    }
}

