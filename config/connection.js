const mongoose = require("mongoose");

const env = process.env.NODE_ENV || 'development';
console.log("Running Envirenment ", env);
// const env_vars = require('./config')[env];

const connectToDatabase = async () => {
  mongoose
    .connect("mongodb+srv://sahil:Admin%40123@cluster0.izcms3r.mongodb.net/task-manager?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
      console.log(`MongoDB Connected ${env_vars.connection_url}`);
    })
    .catch((err) => {
      console.log(
        `Error While Connecting Database\n${err}\nRetry Database Connection after 5000ms\n`
      );
      setTimeout(() => {
        connectToDatabase();
      }, 5000);
    });
};

module.exports = connectToDatabase;
