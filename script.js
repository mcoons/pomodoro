
// let WIDTH = 300;
let BOXWIDTH = 320;
let CLOCKWIDTH = BOXWIDTH-50;
var centerX = centerY = CLOCKWIDTH/2;

var appcontainer = document.getElementById("appcontainer");
appcontainer.style.width = BOXWIDTH+"px";
appcontainer.style.height = BOXWIDTH+120+"px";

var container = document.getElementById("clockcontainer");
container.style.width = BOXWIDTH+"px";
container.style.height = BOXWIDTH+"px";

var clockFace = document.getElementById("clockface");
var faceCtx = clockFace.getContext("2d");
clockFace.width = CLOCKWIDTH;
clockFace.height = CLOCKWIDTH;

var hands = document.getElementById("hands");
var handsCtx = hands.getContext("2d");
hands.width = CLOCKWIDTH;
hands.height = CLOCKWIDTH;

var overlay = document.getElementById("overlay");
var overlayCtx = hands.getContext("2d");
overlay.width = CLOCKWIDTH;
overlay.height = CLOCKWIDTH;


var overlayAlpha = .3;
var workColor = "rgba(0, 250, 0, " + overlayAlpha + ")"; 
var restColor = "rgba(250, 0, 0, " + overlayAlpha + ")"; 
var workLength = 20;  // minutes
var rest = 5;   // minutes
var working = false;
var resting = false;

var workStartRotation = null;

drawFace();

setInterval( refreshClock, 1);

function refreshClock(){
    
    var baseTime = new Date();

    var hr = baseTime.getHours();
    var min = baseTime.getMinutes();
    var sec = baseTime.getSeconds();
    var milliSec = baseTime.getMilliseconds();
    sec += milliSec/1000;

    var hrRotation = (hr*360/12+(min*(360/60)/12))*Math.PI/180;
    var minRotation = ((min*360/60)+(sec*(360/60)/60))*Math.PI/180;
    var secRotation = (sec*360/60)*Math.PI/180;

    var workStart = new Date(baseTime.getTime());
    var restStart = new Date(baseTime.getTime());
    var newRestMinutes = restStart.getMinutes() + workLength;
    restStart.setMinutes(newRestMinutes);
    
    if (!workStartRotation) workStartRotation = minRotation;

    drawHands(hrRotation, minRotation, secRotation);

    if (working || resting)
        drawOverlays(workStartRotation);

}



function drawFace(){
    faceCtx.font = CLOCKWIDTH/10 + "px Serif";
    
    // draw circle
    faceCtx.beginPath();
    faceCtx.arc(CLOCKWIDTH/2, CLOCKWIDTH/2, CLOCKWIDTH/2, 0, 2 * Math.PI, false);
    faceCtx.fillStyle = 'white';
    faceCtx.fill();
    faceCtx.lineWidth = 2;
    faceCtx.strokeStyle = '#003300';
    faceCtx.stroke();
    
    // draw minute ticks
    faceCtx.beginPath();
    for (let rad = 0; rad < 2*Math.PI; rad+=2*Math.PI/60) {
        let x1 = Math.cos(rad)*CLOCKWIDTH/2+CLOCKWIDTH/2
        let y1 = Math.sin(rad)*CLOCKWIDTH/2+CLOCKWIDTH/2
        let x2 = Math.cos(rad)*(CLOCKWIDTH/2-CLOCKWIDTH/72)+CLOCKWIDTH/2
        let y2 = Math.sin(rad)*(CLOCKWIDTH/2-CLOCKWIDTH/72)+CLOCKWIDTH/2
        faceCtx.moveTo(x1,y1)
        faceCtx.lineTo(x2,y2);
        faceCtx.lineWidth=1;
        faceCtx.stroke();
    }

    // draw 5 minute ticks
    faceCtx.beginPath();
    for (let rad = 0; rad < 2*Math.PI; rad+=2*Math.PI/12) {
        let x1 = Math.cos(rad)*CLOCKWIDTH/2+CLOCKWIDTH/2
        let y1 = Math.sin(rad)*CLOCKWIDTH/2+CLOCKWIDTH/2
        let x2 = Math.cos(rad)*(CLOCKWIDTH/2-CLOCKWIDTH/48)+CLOCKWIDTH/2
        let y2 = Math.sin(rad)*(CLOCKWIDTH/2-CLOCKWIDTH/48)+CLOCKWIDTH/2
        faceCtx.moveTo(x1,y1)
        faceCtx.lineTo(x2,y2);
        faceCtx.lineWidth=CLOCKWIDTH/120;  // 5 = 600/120
        faceCtx.stroke();
    }

    //  draw 15 minute ticks
    faceCtx.beginPath();
    for (let rad = 0; rad < 2*Math.PI; rad+=2*Math.PI/4) {
        let x1 = Math.cos(rad)*CLOCKWIDTH/2+CLOCKWIDTH/2
        let y1 = Math.sin(rad)*CLOCKWIDTH/2+CLOCKWIDTH/2
        let x2 = Math.cos(rad)*(CLOCKWIDTH/2-CLOCKWIDTH/24)+CLOCKWIDTH/2
        let y2 = Math.sin(rad)*(CLOCKWIDTH/2-CLOCKWIDTH/24)+CLOCKWIDTH/2
        faceCtx.moveTo(x1,y1)
        faceCtx.lineTo(x2,y2);
        faceCtx.lineWidth=CLOCKWIDTH/60;  // 10 = 600/60
        faceCtx.stroke();
    }


    // faceCtx.beginPath();
    // for (let degrees = 0; degrees < 360; degrees+=6) {
        
    //     let lineWidth = 1;
    //     let lineLength = CLOCKWIDTH/120;

    //     let rad = degrees*Math.PI/180;

    //     // if (!degrees%90) {
    //     //     lineLength = CLOCKWIDTH/40;
    //     //     lineWidth = CLOCKWIDTH/120;
    //     // }
    //     // else 
    //     if (!degrees === 0 || degrees === 90 || degrees === 180 || degrees === 270) {
    //         lineLength = CLOCKWIDTH/24;
    //         lineWidth = CLOCKWIDTH/60;
    //     }
        
    //     let x1 = Math.cos(rad)*CLOCKWIDTH/2+CLOCKWIDTH/2;
    //     let y1 = Math.sin(rad)*CLOCKWIDTH/2+CLOCKWIDTH/2;

    //     let x2 = Math.cos(rad)*(CLOCKWIDTH/2-lineLength)+CLOCKWIDTH/2
    //     let y2 = Math.sin(rad)*(CLOCKWIDTH/2-lineLength)+CLOCKWIDTH/2
        
    //     faceCtx.moveTo(x1,y1)
    //     faceCtx.lineTo(x2,y2);
    //     faceCtx.lineWidth=lineWidth;
    //     faceCtx.stroke();

    // }

    // Draw face text
    faceCtx.fillStyle = '#967A45';
    faceCtx.fillText("XII",CLOCKWIDTH/2-22, 40);
    faceCtx.fillText("III",CLOCKWIDTH-45, CLOCKWIDTH/2+10);
    faceCtx.fillText("VI",CLOCKWIDTH/2-18, CLOCKWIDTH - 20);
    faceCtx.fillText("IX",15, CLOCKWIDTH/2+10);

    faceCtx.font = "10px Serif";
    faceCtx.fillText("Pomodoro",CLOCKWIDTH/2-22, CLOCKWIDTH/2+20);
    faceCtx.fillText("by",CLOCKWIDTH/2-5, CLOCKWIDTH/2+30);
    faceCtx.fillText("Coons",CLOCKWIDTH/2-13, CLOCKWIDTH/2+40);


}

function drawHands(hrRotation, minRotation, secRotation){
    handsCtx.clearRect(0, 0, CLOCKWIDTH, CLOCKWIDTH);

    // HOUR HAND
    // Matrix transformation
    handsCtx.resetTransform();
    handsCtx.translate(centerX, centerY);
    handsCtx.rotate(hrRotation);
    handsCtx.translate(-centerX, -centerY);
    // Rotated rectangle
    handsCtx.fillStyle = 'black';
    handsCtx.fillRect(centerX-2.5, centerY, 5, -CLOCKWIDTH/2+CLOCKWIDTH/6);

    // MINUTE HAND
    // Matrix transformation
    handsCtx.resetTransform();
    handsCtx.translate(centerX, centerY);
    handsCtx.rotate(minRotation);
    handsCtx.translate(-centerX, -centerY);
    // Rotated rectangle
    handsCtx.fillStyle = 'black';
    handsCtx.fillRect(centerX-1.5, centerY, 3, -CLOCKWIDTH/2+CLOCKWIDTH/15);

    // MINUTE HAND AXEL CIRCLE
    handsCtx.resetTransform();
    handsCtx.beginPath();
    handsCtx.arc(centerX, centerY, 7, 0, 2 * Math.PI, false);
    handsCtx.fillStyle = 'black';
    handsCtx.lineWidth = 1;
    handsCtx.fill();
    handsCtx.strokeStyle = '#000000';
    handsCtx.stroke();

    // SECOND HAND
    // Matrix transformation
    handsCtx.resetTransform();
    handsCtx.translate(centerX, centerY);
    handsCtx.rotate(secRotation);
    handsCtx.translate(-centerX, -centerY);
    // Rotated rectangle
    handsCtx.fillStyle = 'red';
    handsCtx.fillRect(centerX-.5, centerY, 1, -CLOCKWIDTH/2+CLOCKWIDTH/30);

    // SECOND HAND AXIS CIRCLE
    handsCtx.resetTransform();
    handsCtx.beginPath();
    handsCtx.arc(centerX, centerY, 3, 0, 2 * Math.PI, false);
    handsCtx.fillStyle = 'red';
    handsCtx.lineWidth = 1;
    handsCtx.fill();
    handsCtx.strokeStyle = '#ff0000';
    handsCtx.stroke();

}

function drawOverlays(minRotation){
    drawOverlay(overlayCtx, minRotation - Math.PI/2, workLength/60*360*Math.PI/180, workColor);
    drawOverlay(overlayCtx, minRotation - Math.PI/2 + workLength/60*360*Math.PI/180, rest/60*360*Math.PI/180, restColor);
}

function drawOverlay(ctx, start, length, color){
    ctx.beginPath();
    ctx.moveTo(CLOCKWIDTH/2, CLOCKWIDTH/2);
    ctx.arc(CLOCKWIDTH/2, CLOCKWIDTH/2, CLOCKWIDTH/2, 
        start, start+length, false);
    ctx.closePath();
    ctx.fillStyle = color; 
    ctx.fill();
}