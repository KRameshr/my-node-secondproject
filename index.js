// take input from the user and store in the server in form of json data

const express = require("express");
const CONFIG = require("./config.json");
const mongoose = require("mongoose");
const app = express();
const PORT = CONFIG.PORT || process.env.PORT;

// app.set("view engine", "pug");
// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));

// middleware

// app.use(express.static(__dirname + "/public", { index: "default.html" }));
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// DB Connection

let dbstring =
  "mongodb+srv://{{dbusername}}:{{dbpassword}}@cluster0.{{dbuserString}}.mongodb.net/{{dbname}}?retryWrites=true&w=majority&appName=Cluster0";

let url = dbstring
  .replace("{{dbusername}}", CONFIG.dbusername)
  .replace("{{dbpassword}}", CONFIG.dbpassword)
  .replace("{{dbuserString}}", CONFIG.dbuserString)
  .replace("{{dbname}}", CONFIG.dbname);
mongoose
  .connect(url)
  .then((res) => console.log("DB connected"))
  .catch((err) => console.log("Err", err));

// model

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let Hero = mongoose.model(
  "Heroe",
  new Schema({
    id: ObjectId,
    title: String,
    firstName: String,
    lastName: String,
    email: String,
    city: String,
  })
);

// Db commands

setTimeout(function () {
  // Read
  // Hero.find()
  //   .then((dbres) => console.log(dbres))
  //   .catch((err) => console.log(err));
  // create
  // let hero = new Hero({
  //   title: "Hulk",
  //   fname: "Ramesh",
  //   lname: "ss",
  //   email: "@gmail.com",
  //   city: "ohio",
  // });
  // hero.save()
  //   .then((dre) => console.log("DB Response", dre))
  //   .catch((err) => console.log("Error" + err));
}, 1000);

// Routers

app.get("/data", (req, res) => {
  Hero.find()
    .then((dbres) => res.send(dbres))
    .catch((err) => console.log(err));
});

app.post("/data", (req, res) => {
  let hero = new Hero(req.body);
  hero
    .save()
    .then((dres) =>
      res.status(200).send({ message: dres.title + "hero added" })
    )
    .catch((dberr) => res.status(500).send({ dberr: "Error" }));
});

app.delete("/delete/:hid", (req, res) => {
  Hero.findByIdAndDelete(req.params.hid)
    .then((dbres) => {
      console.log(dbres);
      res.status(200).send({ message: "hero deleted" });
    })
    .catch((err) => console.log(err));
});
app.get("/updata/:hid", (req, res) => {
  Hero.findById(req.params.hid)
    .then((dbres) => res.status(200).send(dbres))
    .catch((err) => console.log(err));
});
app.post("/updata/:hid", (req, res) => {
  Hero.findByIdAndUpdate(req.params.hid, {
    title: req.body.title,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    city: req.body.city,
  })
    .then((dbres) => {
      console.log(dbres);
      res.status(200).send({ message: "hero updated" });
    })
    .catch((err) => console.log(err));
});

// webserver
app.listen(PORT, CONFIG.HOST, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`The website is Running at ${PORT}`);
  }
});
