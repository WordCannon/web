var inProcess;
var retries = 0;

const fetchWithTimeout = (uri, options = {}, time = 5000) => {
  // Lets set up our `AbortController`, and create a request options object
  // that includes the controller's `signal` to pass to `fetch`.
  const controller = new AbortController();
  const config = { ...options, signal: controller.signal };
  // Set a timeout limit for the request using `setTimeout`. If the body of this
  // timeout is reached before the request is completed, it will be cancelled.
  const timeout = setTimeout(() => {
    controller.abort();
  }, time);
  return fetch(uri, config)
    .then(response => {
      // Because _any_ response is considered a success to `fetch`,
      // we need to manually check that the response is in the 200 range.
      // This is typically how I handle that.
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response;
    })
    .catch(error => {
      // When we abort our `fetch`, the controller conveniently throws a named
      // error, allowing us to handle them seperately from other errors.
      if (error.name === "AbortError") {
        throw new Error("Response timed out");
      }
      throw new Error(error.message);
    });
};

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

      fetchWithTimeout("/getword", {}, 1000)
        .then(function(response) {
          if (response.ok) {
            retries = 0;
            return response.text();
          } else {
            throw "server error";
          }
        })
        .then(function(myWord) {
          var ml4 = {};
          ml4.opacityIn = [0, 1];
          ml4.scaleIn = [0.2, 1];
          ml4.scaleOut = 3;
          ml4.durationIn = 500;
          ml4.durationOut = 800;
          ml4.delay = 500;

          var animation = anime.timeline().add({
            targets: ".word",
            opacity: 0,
            scale: ml4.scaleOut,
            duration: ml4.durationOut,
            easing: "easeInExpo",
          });

          animation.finished.then(() => {

            // update the background color
            hue += 47;
            $body.css("background-color", "hsl(" + hue + ", 100%, 50%)");


            $word.text(myWord);

            anime.timeline().add({
              targets: ".word",
              opacity: ml4.opacityIn,
              scale: ml4.scaleIn,
              duration: ml4.durationIn
            });
          });
        })
        .catch(error => {
          console.error(error.message);
          $word.text(".".repeat(++retries));
        })
        .finally(() => {
          inProcess = false;
        });
    }
  }, 2000);
});
