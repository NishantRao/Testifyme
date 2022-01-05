require('dotenv').config()
const express = require("express");
const app = express();
//  for databse 
require("./db/conn");
//  for dynamic html 
app.set("view engine","hbs");
const path = require("path");
const viewpath = path.join(__dirname + "/../Templates/views");
app.set("views",viewpath);

// ****************************** for reading form data 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ******************* for cookie read
const cookieparser = require("cookie-parser");
app.use(cookieparser());
//  for Partials 
const hbs = require("hbs");
const partialpath = path.join(__dirname + "/../Templates/Partials");
hbs.registerPartials(partialpath);

//  for public
app.use(express.static('public'))

//  For Notes section body parser 
const bodyParser = require("body-parser");

// Configurations for "body-parser"
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//  for routes 
const router = require("../Routes/routes");
const { urlencoded } = require('express');
app.use(router);
app.listen(2000,() =>{
    console.log(`Listened at ${2000}`);
})



// const cookieparser = require("cookie-parser")
// const app = express();
// const Port = process.env.PORT || 2021;
// app.use(cookieparser());