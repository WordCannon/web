$(document).ready(function() {
  
  // set the background to a random color
  var hue = 350;
  
  // cache the jquery elements to prevent dom queries during the animation events
  var $body = $("body");
  var $svg = $("svg");
  var $word = $(".word");

  // when the animation iterates
  $("h1").on('webkitAnimationIteration oanimationiteration msAnimationIteration animationiteration ', function() {
    fetch('/getword')
    .then(function(response) {
      return response.text();
    })
    .then(function(myWord) {
      // replace the header with a random word
      $word.text(myWord);

      // update the background color
      hue += 47;
      $body.css("background-color", "hsl(" + hue + ", 100%, 50%)");      
    });
  });
});