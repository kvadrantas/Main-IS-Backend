// Fast, unopinionated, minimalist web framework for node.
// const express = require('express')
// const app = express()
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
// app.listen(3000)

// HTML URL STRUCTURE
// https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL

// EXPRESS SERVER HELP 
// http://expressjs.com/en/5x/api.html#req.query

// HANDLERS HELP
// https://handlebarsjs.com/guide/#what-is-handlebars



// *****************************************************************************
// SSL

import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
const app = express();
const PORTS = 3343;
const WEB = "web";

app.use(cors());
app.use(express.static(WEB, {    // Like "Default Document" on ISS
  index: ["index.html"]
}));
var privateKey = fs.readFileSync('./cert/private.key');
var certificate = fs.readFileSync('./cert/certificate.crt');
// console.log(privateKey,certificate);

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(PORTS, function() {
  console.log(`Server listening for https at https://rolandasseputis.lt:3443/json/zmones/`)
});
// *****************************************************************************


// *****************************************************************************
// EXPRESS WEBSERVER IMPORT
// MAIN/DEFAULT WEB SERVER PARAMETERS
// import express from "express";
// const app = express();
// const PORT = 29372;    // Sets default website port
// app.listen(PORT, () => {
//   console.log(`Server listening at http://localhost:${PORT}`);
// });
// const WEB = "web";
// app.use(express.static(WEB, {    // Like "Default Document" on ISS
//   index: ["index.html"]
// }));

// ADDITIONAL WEB SERVER PARAMETERS 
// Suteikia funkcionaluma automatiskai iskaidyti URL'e esancius parametrus
// i atskirus objektus. Visu ju vertes tekstines, todel skaitines reiksmes reikia
// konvertuotis i skaicius.
app.use(express.urlencoded({
  extended: true,
}));
// Suteikia galimybe duomenis konvertuoti i json formatą
app.use(express.json());



// HANDLEBARS FOR EXPRESS WEB SERVER IMPORT 
import handleBars from "express-handlebars";
app.engine('handlebars', handleBars());
app.set('view engine', 'handlebars');
// *****************************************************************************

//-----------------
// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://rolandasseputis.lt');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
//-----------------




// DATA IMPORT FROM EXTERNAL DATA FILE
import {zmones, nextId} from "./data/zmones.js";
let nextId2 = nextId;



// ************************************* FOR FRONTEND ****************************************
// DATA EXPORT IN JSON FORMAT
app.get('/json/zmones', (req, res) => {
  res.set('Content-Type', 'application/json');  // pakeičia turinio tipą į json
  res.send(JSON.stringify(zmones)); //converts zmones object to json and sends as response
})

// DELETE RECORD
app.delete('/json/zmones/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = zmones.findIndex((e) => e.id === id);
  if (index >= 0) {
    zmones.splice(index, 1);
  }
  // response code indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
  res.status(204).end();
})

// ADD NEW RECORD
app.post('/json/zmones', (req, res) => {
  zmones.push({
    id: nextId2++,
    vardas: req.body.vardas,
    pavarde: req.body.pavarde,
    alga: req.body.alga,
    gimimo_metai: req.body.gimimo_metai,
    telefonas: req.body.telefonas,
    adresas: req.body.adresas
  })
  res.status(204).end();
})

// EDIT RECORD
app.put('/json/zmones', (req, res) => {
    const id = parseInt(req.body.id);
    const zmogus = zmones.find((e) => e.id === id);
    if (zmogus) {
      zmogus.vardas = req.body.vardas;
      zmogus.pavarde = req.body.pavarde;
      zmogus.alga = req.body.alga;
      zmogus.gimimo_metai = req.body.gimimo_metai;
      zmogus.telefonas = req.body.telefonas;
      zmogus.adresas = req.body.adresas;
      res.status(204).end();
    } else {
      // response code indicates that the server can't find the requested resource
      res.status(404).end();
    }
    
})



// *****************************************************************************
// TEST INFO
// app.get("/labas", (req, res) => {
//   console.log(req.ip);
//   console.log(req.method);
//   console.log(req.path);
//   console.log(req.query);
//   res.send("labas");
// });