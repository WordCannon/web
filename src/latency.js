const delay = require('delay');
var weighted = require('weighted');

var increasing = true;

var maxLatency = 600;
var jitter = 0;
var baseLatency = (maxLatency / 2) * .75;

const getLatency = function () {
    var bellFactor = 3;
    var bellcurveRandom = 0;
    for (var i = 0; i < bellFactor; i++) {
        bellcurveRandom += Math.random() * (maxLatency / bellFactor);
    }
    bellcurveRandom += jitter;

    return Math.floor(bellcurveRandom);
}

const randomDelay = async function() {
    return await delay(getLatency());
}

// adjust jitter frequently
setInterval(() => {
    const DIE_SIDES = 3;
    const roll = Math.ceil(Math.random() * DIE_SIDES);
    if (roll < 3) {
        if (increasing && jitter < 52) {
            jitter += 10;
        } else if (!increasing && jitter > -52) {
            jitter -= 10;
        }
    }
}, 10000)

// change increasing/decreasing direction infrequently
setInterval(() => {
    const DIE_SIDES = 30;
    const roll = Math.ceil(Math.random() * DIE_SIDES);
    if (roll === 1) {
        increasing = !increasing;
    }
}, 10000)

module.exports = {
    randomDelay: randomDelay
}