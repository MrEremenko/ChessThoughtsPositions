var express = require('express');
var router = express.Router();
const fs = require("fs");
const { request } = require('http');
const path = require("path");


router.get('/all', (req, res, next) => {
  const files = fs.readdirSync("../../positions");
  var build = [];
  files.map(file => {
    var local = {};
    local["fen"] = file.replaceAll("-", "/").replace(".json", "");
    local["file"] = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../positions/" + file)));
    build.push(local);
  });

  return res.status(200).json({ positions: build });
});

router.post('/add', (req, res, next) => { 
  console.log(req.body);
  
  //if file exists, read it
  var build = [];
  var file = req.body.fen.replaceAll("/", "-") + ".json";
  var exists = false;

  try {
    fs.statSync(path.join(__dirname, "../../../positions/" + file))
    exists = true;
  } catch(err) {
    exists = false;
  }
  
  if(exists) {
    // console.log("Such a file exists...");
    build = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../positions/" + file)));
    console.log("file contents now is var")
    console.log(build);
  }

  //now add onto it
  build.push({ 
    "link": req.body.link,
    "dateAdded": new Date().toISOString().substr(0,10),
    "addedBy": req.body.username
  });

  fs.writeFileSync(path.join(__dirname, "../../../positions/" + file), JSON.stringify(build, null, 2));

  return res.status(200).json({ fen: req.body.fen, file: build });
});


module.exports = router;