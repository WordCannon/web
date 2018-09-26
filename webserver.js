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

app.get('/healthz', function (req, res) {
    res.send('I am happy and healthy\n');
});

const server = app.listen(8888);

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
    console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
    shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
    console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
    shutdown();
});

// shut down server
function shutdown() {
    server.close(function onServerClosed(err) {
        if (err) {
            console.error(err);
            process.exitCode = 1;
        }
        process.exit();
    })
}

