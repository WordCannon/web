var express = require('express')
var app = express()
const https = require('https');
const fetch = require("node-fetch");

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/web/index.html');
});

app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + '/web/style.css');
});

app.get('/index.js', function (req, res) {
    res.sendFile(__dirname + '/web/index.js');
});

app.get('/getword', async function (req, res) {

    try {
        const response = await fetch("http://app:8080/word");
        const word = await response.text();
        res.send(word);
      } catch (error) {
        console.log(error);
      }

})

app.listen(8888);
