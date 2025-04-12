const db = require("../src/models");
const sendEmail = require('../utils/email');


const findAll = async (collection, searchQuery, sortObject, skip, limit, projectFields, lookupFields) => {
    const result = await collection.aggregate([
        ...lookupFields,
        { $match: { deletedAt: null, ...searchQuery } },
        {
          $facet: {
            totalResponses: [{ $count: "count" }],
            result: [
              { $sort: sortObject},
              { $skip: skip },
              { $limit: limit },
              {
                $project: projectFields
              }
            ]
          }
        },
        {
          $project: {
            totalResponses: { $arrayElemAt: ["$totalResponses.count", 0] },
            result: 1
          }
        }
    ]);
    return result;
}

const checkIfRecordExist = async(collection, _id) => {
  const result = await collection.findById(_id);
  return result ? true : false;
}

const taskNotification = async(taskId) => {
  // get task recurrence from taskId
  const task = await db.task_recurrence
              .find({ taskId })
              .populate("assignedTo")

  const title = task[0].title;
  const description = task[0].description;
  const media = task[0].media;  // will change the path in future.
  const startDate = task[0].startDate;
  const dueDate = task[0].dueDate;
  
  const notificationMailTemplate = await db.email_template.find({name: "task-notiification" });

  let mailBody = notificationMailTemplate[0].body;

  mailBody = mailBody.replace("{{title}}", title);
  mailBody = mailBody.replace("{{description}}", description);
  mailBody = mailBody.replace("{{media}}", media);
  mailBody = mailBody.replace("{{startDate}}", startDate);
  mailBody = mailBody.replace("{{dueDate}}", dueDate);

  // send notification to all assigned users
  for(let i=0;i<task[0].assignedTo.length;i++){
    sendEmail(
      task[0].assignedTo[i].email,
      notificationMailTemplate[0].subject,
      mailBody
    );
  }

}

module.exports = {
    findAll,
    checkIfRecordExist,
    taskNotification
}