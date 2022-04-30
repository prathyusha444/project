
var express = require('express');
var router = express.Router();
const connection = require('../util/connection');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require("nodemailer");
const { parse } = require('json2csv');
var smtpTransport = require('nodemailer-smtp-transport');
var zip = new require('node-zip')();

var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
mongoClient.connect("mongodb://localhost:27017", {
  useUnifiedTopology: true
}, function (error, client) {
  var database = client.db("project_1");
  console.log("Database connected.");
  router.get("/", async function (request, result) {



    // number of records you want to show per page
    const perPage = 100000;

    // total number of records from database
    const total = 500000;

    // Calculating number of pagination links required
    let pages = Math.ceil(total / perPage);

    // get current page number
    //var pageNumber = (request.query.page == null) ? 1 : request.query.page;

    // get records to skip
    //var skip = (pageNumber - 1) * perPage;

    for(let i=0;i<pages;i++){
    var users = await database.collection("transactiondetails").find({})
      .sort({ "id": -1 })
      .skip(total-(i*perPage))
      .limit(perPage)
      .toArray();
      console.log(users)
    }

const csv = parse(users, ["_id", "Date", "Description", "Deposits", "Withdrawls", "Balance"]);
    //console.log(csv,"csv")
    fs.appendFile("result.csv", csv, (err) => {
      if (err) {
        console.log(err);
      }
      else {
        // Get the file contents after the append operation
        console.log("\nFile Contents of file after append:",
          fs.readFileSync("result.csv", "utf8"));
      }
      });
     

 
    var transporter = nodemailer.createTransport({
      service: "hotmail",
      port: 587,
      auth: {
        user: "prathyushatummala99@outlook.com",
        pass: "janaki@99",
      },
    });
    
    transporter.sendMail(
      {
        from: "prathyushatummala99@outlook.com",
        to: "prathyushatummala99@outlook.com",
        subject: "**IMPORTANT**RECORD**",
        text: "Please check the attachment for your reference! 😊",
        html: "<b>Ola! Please check the attachment for a surprise! 😊</b>",
        //here is the magic
        attachments: [
          {
            filename: "result.csv",
            content: csv,
            
          },
        ],
      },
      (err, info) => {
        if (err) {
          console.log("Error occurred. " + err.message);
          return process.exit(1);
        }
        console.log("Message sent: %s", info.messageId);
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        //res.send("Message sent: %s", info.messageId);
      }
    );
    result.send("<h2>Message sent:</h2>");

  })
})
module.exports = router;