var controller, signal, inProcess;

function fetchWithTimeout(url, options, timeout = 7000) {
  return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
          setTimeout(() => {
            console.log("aborting fetch after " + timeout + " ms");
            controller.abort();
            inProcess = false;
            reject(new Error('timeout'))
          }, timeout)
      )
  ]);
}

$(document).ready(function() {

  // set the background to a random color
  var hue = 350;
  
  // cache the jquery elements to prevent dom queries during the animation events
  var $body = $("body");
  var $svg = $("svg");
  var $word = $(".word");

  inProcess = false;

  window.setInterval(function() {

    if (inProcess) {
      console.log("active request in progress -- skipping interval...");
    } else {
      console.log("no request in progress -- starting new fetch...");
      inProcess = true;
      controller = new AbortController();
      var signal = controller.signal;    

      const el = $word.fadeOut(100);
  
      fetchWithTimeout('/getword', {signal}, 5000)
      .then(function(response) {
        return response.text();
      })
      .then(function(myWord) {
        // replace the header with a random word
        $word.text(myWord);
        $word.fadeIn(300);
  
        // update the background color
        hue += 47;
        $body.css("background-color", "hsl(" + hue + ", 100%, 50%)");            
      })
      .finally(() => {
        inProcess = false;  
      });
    }

  }, 2000);
});