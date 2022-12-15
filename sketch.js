let video, continuous, interimResults, x, canWidth, canHeight;
let posX = 200;
let posY = 50;
let speedX = 0;
let speedY = 0;
let paddleHeight = 15;
let paddleWidth = 100;

let angle;
let mode = "keyboard";
let input1;
let input2;
let said;


function setup() {
  canWidth = windowWidth;
  canHeight = windowHeight;
  createCanvas(canWidth, canHeight);
  input1 = document.getElementById("key");
  input2 = document.getElementById("cam");
  angle = random(Math.PI);
  speedX = 2 * cos(angle);
  speedY = 2 * sin(angle);
  x = canWidth/2 - paddleWidth/2;
  
  handsfree = new Handsfree({
    showDebug: true,
    hands: {
      enabled: true,
      maxNumHands: 1
    }
    
  })
  
  
  handsfree.enablePlugins('browser');
  handsfree.plugin.pinchScroll.disable();
  
  buttonStart = createButton('Start Webcam');
  buttonStart.class('handsfree-show-when-stopped');
  buttonStart.class('handsfree-hide-when-loading');
  buttonStart.mousePressed(() => handsfree.start());
  
  buttonLoading = createButton('...loading...');
  buttonLoading.class('handsfree-show-when-loading');
  
  buttonStop = createButton('Stop Webcam');
  buttonStop.class('handsfree-show-when-started');
  buttonStop.mousePressed(() => handsfree.stop());
  
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  continuous = true;
  interimResults = false;
  speechRec.start(continuous, interimResults);
}

function draw() {
  const hands = handsfree.data?.hands;
  background(0);
  posX = posX + speedX;
  posY = posY + speedY;
  
  if(posX > canWidth - 15) {speedX *= -1;}
  if(posX < 15) { speedX *= -1;}
  if(posY < 15) { speedY *= -1;}
  if(posY > canHeight + 15) {
    speedX = 0;
    speedY = 0;
    setTimeout(function() {
      posX = 200;
      posY = 50;
      angle = random(Math.PI/2);
      speedX = 2 * cos(angle);
      speedY = 2 * sin(angle);},50);
    }
  if(posY > canHeight-paddleHeight*2-15 && posX <= x+paddleWidth && posX>=x && posY < canHeight-paddleHeight) {speedY *= -1;}
  
  
  rect(x, canHeight - paddleHeight*2, paddleWidth, paddleHeight);
  ellipse(posX, posY, 30, 30);
  if (keyIsDown(65)) {
        x = x-5;
  } else if (keyIsDown(68)) {
        x = x+5;
  }
  camMove();
  if(said == "left") {
    
    x = x-5;
    if(x <= 0) {
      console.log(said);
      said = "";
    }
  } else if(said == "right") {
    x = x+5
    if(x >= canWidth-paddleWidth) {
      said = "";
    }
  }
  
  
  if(x + paddleWidth >= canWidth) {
    x = canWidth-paddleWidth;
  } else if (x <= 0) {
    x = 0;
  }
}

function camMove(){
  const hands = handsfree.data?.hands;
  
  
  if (!hands?.landmarks) return
  
  hands.landmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {
      if(landmarkIndex === 20) {
        if(hands?.multiHandLandmarks[0][20].x > 0.5) {
          x = x-5;
        } else if(hands?.multiHandLandmarks[0][20].x < 0.5) {
          x = x+5;
        }
      }
    })
  })
}

function gotSpeech() {
  if (speechRec.resultValue) {
    said = speechRec.resultString;
  }
}
  