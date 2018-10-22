$(document).ready(function() {
  
  // set the background to a random color
  var hue = 350;
  
  // cache the jquery elements to prevent dom queries during the animation events
  var $body = $("body");
  var $svg = $("svg");
  var $word = $(".word");

  // when the animation iterates
window.setInterval(function() {

    const el = $word.fadeOut(100);

    fetch('/getword')
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
    });
  }, 2000);
});