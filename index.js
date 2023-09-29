const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const util = require("util");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const axios = require('axios');
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'insta',
  password: 'vc@123',
  port: 5432, 
});

app.post("/insta/user/register", async (req, res) => {

// Generate a random UUID (Version 4)
const uniqueId = uuidv4();

  let body = req.body
  let record = body.record
  record.userName = record.inputFirstName + record.inputLastName
  record.id = uniqueId
  delete record.inputFirstName,record.inputLastName
  const keysToRemove = ['inputFirstName', 'inputLastName'];

for (const key of keysToRemove) {
  delete record[key];
}
let columns = ["email","password","mobile_no","username","id"]
let values = []
for(let key in record){
  values.push(record[key])
}


const transporter = nodemailer.createTransport({
    service: "Gmail", 
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "pr1650644@gmail.com",
        pass: "cuch bpxd ojsw bzgz",
    },
});

const randomNumber = Math.floor(Math.random() * 9000) + 1000;

const mailOptions = {
    from: "pr1650644@gmail.com",
    to: "ashikasuthar@gmail.com",
    subject: "Verification Code",
    text: `This is One Time Password verification code : ${randomNumber}`,
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email:", error);
    } else {
        console.log("Email sent:", info.response);
    }
});

res.status(200).json("success")
// newRegisterQuery(columns,values)
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0].now);
  }
});

function newRegisterQuery(columns,values){
  const insertQuery = `INSERT INTO registered.usersdata (${columns.join(", ")}) VALUES ('${values.join("', '")}');`;
  
  pool.query(insertQuery, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
        } else {
          console.log('Data inserted successfully');
        }
      })
}

pool.connect();


process.on('exit', () => {
  pool.end();
});


const port = 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
