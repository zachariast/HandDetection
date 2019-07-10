const modelParams = {
  flipHorizontal: true,
  maxNumBoxes: 20,
  iouThreshold: 0.5,
  scoreThreshold: 0.45
};

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

const video = document.querySelector("#video");
const canvas = document.querySelector("#canvas");
const div = document.querySelector("#move");
const div2 = document.querySelector("#move2");
const context = canvas.getContext("2d");
let model;

function css(el, styles) {
  for (var property in styles) el.style[property] = styles[property];
}

handTrack.startVideo(video).then(status => {
  if (status) {
    navigator.getUserMedia(
      { video: {} },
      stream => {
        video.srcObject = stream;
        runDetection();
      },
      err => {
        // console.log(err)
      }
    );
  }
});

function runDetection() {
  model.detect(video).then(predictions => {
    model.renderPredictions(predictions, canvas, context, video);
    requestAnimationFrame(runDetection);

    var x = predictions[0].bbox[0];
    var y = predictions[0].bbox[1];
    var ww = jQuery(window).width();
    var wh = jQuery(window).height();
    var x_perc = (x / ww) * 100;
    var y_perc = (y / wh) * 100;
    css(div, {
      left: Math.round(x_perc) + "vw",
      top: Math.round(y_perc) + "vh"
    });
    if (predictions[1]) {
      var x2 = predictions[1].bbox[0];
      var y2 = predictions[1].bbox[1];
      var x_perc2 = (x2 / ww) * 100;
      var y_perc2 = (y2 / wh) * 100;
      css(div2, {
        display: "block",
        left: Math.round(x_perc2) + "vw",
        top: Math.round(y_perc2) + "vh"
      });
    } else {
      css(div2, { display: "none" });
    }
  });
}

handTrack.load(modelParams).then(lmodel => {
  model = lmodel;
});
