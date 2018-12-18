let BOXWIDTH = 270;
let CLOCKWIDTH = BOXWIDTH - 50;
var CENTERX = CENTERY = CLOCKWIDTH / 2;

var workLength = 25;  // minutes
var restLength = 5;   // minutes
var working = resting = false;

var overlayAlpha = .3;
var workColor = "rgba( 0, 250, 0, " + overlayAlpha + " )";
var restColor = "rgba( 250, 0, 0, " + overlayAlpha + " )";

var muted = false;
var buttonClick = true;
var logging = true;

var workStartRotation = workEndRotation = restStartRotation = restEndRotation = null;
var workStartTime = workEndTime = restStartTime = restEndTime = null;

var appcontainer = document.getElementById("appcontainer");
appcontainer.style.width = BOXWIDTH + "px";
appcontainer.style.height = BOXWIDTH + 210 + "px";

var container = document.getElementById("clockcontainer");
container.style.width = container.style.height = BOXWIDTH + "px";

var clockFace = document.getElementById("clockface");
var faceCtx = clockFace.getContext("2d");
clockFace.width = clockFace.height = CLOCKWIDTH;

var clockShadow = document.getElementById("clockshadow");
clockShadow.width = clockShadow.height = CLOCKWIDTH;

var hands = document.getElementById("hands");
var handsCtx = hands.getContext("2d");
hands.width = hands.height = CLOCKWIDTH;

var overlay = document.getElementById("overlay");
var overlayCtx = overlay.getContext("2d");
overlay.width = overlay.height = CLOCKWIDTH;


drawFace(faceCtx);
setInterval(refreshClock, 50);

function refreshClock() {
    var baseTime = new Date();
    var hr = baseTime.getHours();
    var min = baseTime.getMinutes();
    var sec = baseTime.getSeconds();
    var milliSec = baseTime.getMilliseconds();
    sec += milliSec / 1000;

    var hrRotation = (hr * 360 / 12 + (min * (360 / 60) / 12)) * Math.PI / 180;
    var minRotation = ((min * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180;
    var secRotation = (sec * 360 / 60) * Math.PI / 180;

    drawHands(handsCtx, hrRotation, minRotation, secRotation);

    if (working && workEndTime < baseTime) {
        if (!alarm1 && !muted) alarm1 = soundAlarm1();
        document.getElementById("lcd").innerHTML = "BREAK TIME" + (muted ? " (MUTED)" : "") + "&#10;" + (baseTime.getSeconds() % 2 === 0 ? "PRESS 'START BREAKING'" : "");
    } else
        if (working && workEndTime > baseTime) {
            let timeDiff = (workEndTime - baseTime) / 60 / 1000;
            let minutesLeft = Math.trunc(timeDiff);
            let secondsLeft = ("0" + (Math.trunc(timeDiff % 1 * 60).toString())).slice(-2);
            document.getElementById("lcd").innerHTML = "WORKING" + (muted ? " (MUTED)" : "") + "&#10;" + minutesLeft + ":" + secondsLeft;
        }

    if (resting && restEndTime < baseTime) {
        if (!alarm2 && !muted) alarm2 = soundAlarm2();
        document.getElementById("lcd").innerHTML = "TIME TO WORK" + (muted ? " (MUTED)" : "") + "&#10;" + (baseTime.getSeconds() % 2 === 0 ? "PRESS 'START WORKING'" : "");
    } else
        if (resting && restEndTime > baseTime) {
            let timeDiff = (restEndTime - baseTime) / 60 / 1000;
            let minutesLeft = Math.trunc(timeDiff);
            let secondsLeft = ("0" + (Math.trunc(timeDiff % 1 * 60).toString())).slice(-2);
            document.getElementById("lcd").innerHTML = "TAKING A BREAK" + (muted ? " (MUTED)" : "") + "&#10;" + minutesLeft + ":" + secondsLeft;
        }

    if (working || resting) drawOverlays(overlayCtx, workStartRotation, workEndRotation, restStartRotation, restEndRotation);
    if (!working && !resting) document.getElementById("lcd").innerHTML = "CLOCK MODE&#10;" + baseTime.toLocaleTimeString();
}

function drawFace(ctx) {
    ctx.font = CLOCKWIDTH / 10 + "px Serif";

    // draw circle
    ctx.beginPath();
    ctx.arc(CENTERX, CENTERY, CLOCKWIDTH / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    for (let degrees = 0; degrees < 360; degrees += 6) {
        let rad = degrees * Math.PI / 180;
        let tickLength = CLOCKWIDTH / 70;
        ctx.lineWidth = 1;

        if (degrees % 90 === 0) {
            tickLength = CLOCKWIDTH / 20;
            ctx.lineWidth = CLOCKWIDTH / 60;
        }
        else
            if (degrees % 30 === 0) {
                tickLength = CLOCKWIDTH / 40;
                ctx.lineWidth = CLOCKWIDTH / 120;
            }

        let x1 = Math.cos(rad) * CLOCKWIDTH / 2 + CENTERX;
        let y1 = Math.sin(rad) * CLOCKWIDTH / 2 + CENTERY;
        let x2 = Math.cos(rad) * (CLOCKWIDTH / 2 - tickLength) + CENTERX;
        let y2 = Math.sin(rad) * (CLOCKWIDTH / 2 - tickLength) + CENTERY;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Draw face text
    ctx.fillStyle = '#967A45';
    ctx.fillText("XII", CLOCKWIDTH / 2 - 16, 30);
    ctx.fillText("III", CLOCKWIDTH - 35, CLOCKWIDTH / 2 + 8);
    ctx.fillText("VI", CLOCKWIDTH / 2 - 14, CLOCKWIDTH - 13);
    ctx.fillText("IX", 13, CLOCKWIDTH / 2 + 8);

    ctx.font = "12px Serif";
    ctx.fillText("Pomodoro", CLOCKWIDTH / 2 - 26, CLOCKWIDTH / 2 + 20);
    ctx.fillText("by", CLOCKWIDTH / 2 - 5, CLOCKWIDTH / 2 + 30);
    ctx.fillText("Coons", CLOCKWIDTH / 2 - 14, CLOCKWIDTH / 2 + 40);
}

function drawHands(ctx, hrRotation, minRotation, secRotation) {
    ctx.clearRect(0, 0, CLOCKWIDTH, CLOCKWIDTH);

    ctx.fillStyle = 'black';
    
    // MINUTE HAND AXIS CIRCLE
    ctx.resetTransform();
    ctx.beginPath();
    ctx.arc(CENTERX, CENTERY, 7, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    drawHand(ctx, hrRotation, 6, -CLOCKWIDTH / 2 + CLOCKWIDTH / 6);
    drawHand(ctx, minRotation, 4, -CLOCKWIDTH / 2 + CLOCKWIDTH / 15);

    ctx.fillStyle = 'red';
    
    // SECOND HAND AXIS CIRCLE
    ctx.resetTransform();
    ctx.beginPath();
    ctx.arc(CENTERX, CENTERY, 3, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
    
    drawHand(ctx, secRotation, 2, -CLOCKWIDTH / 2 + CLOCKWIDTH / 30);
}

function drawHand(ctx, rotation, handWidth, handLength) {
    ctx.resetTransform();
    ctx.translate(CENTERX, CENTERY);
    ctx.rotate(rotation);
    ctx.translate(-CENTERX, -CENTERY);
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(0,0,0,.3)";
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillRect(CENTERX - handWidth / 2, CENTERY, handWidth, handLength);
}

function drawOverlays(ctx, workStartRotation, workEndRotation, restStartRotation, restEndRotation) {
    ctx.clearRect(0, 0, CLOCKWIDTH, CLOCKWIDTH);
    drawOverlay(ctx, workStartRotation, workEndRotation, workColor);
    drawOverlay(ctx, restStartRotation, restEndRotation, restColor);
}

function drawOverlay(ctx, start, end, color) {
    ctx.beginPath();
    ctx.moveTo(CLOCKWIDTH / 2, CLOCKWIDTH / 2);
    ctx.arc(CLOCKWIDTH / 2, CLOCKWIDTH / 2, CLOCKWIDTH / 2, start, end, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function calculateWorkRestRotations(starting) {
    let baseTime = new Date(starting.getTime());
    let sec = baseTime.getSeconds();

    workStartTime = new Date(baseTime.getTime());
    workEndTime = new Date(workStartTime.getTime());
    let newWorkMinutes = workEndTime.getMinutes() + Number(workLength);
    workEndTime.setMinutes(newWorkMinutes);

    workStartRotation = ((workStartTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;
    workEndRotation = ((workEndTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;

    restStartTime = new Date(workEndTime.getTime());
    restEndTime = new Date(restStartTime.getTime());
    let newRestMinutes = restEndTime.getMinutes() + Number(restLength);
    restEndTime.setMinutes(newRestMinutes);

    restStartRotation = ((restStartTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;
    restEndRotation = ((restEndTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;
}

function calculateRestWorkRotations(starting) {
    let baseTime = new Date(starting);
    let sec = baseTime.getSeconds();

    restStartTime = new Date(baseTime.getTime());
    restEndTime = new Date(restStartTime.getTime());
    let newRestMinutes = restEndTime.getMinutes() + Number(restLength);
    restEndTime.setMinutes(newRestMinutes);

    restStartRotation = ((restStartTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;
    restEndRotation = ((restEndTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;

    workStartTime = new Date(restEndTime.getTime());
    workEndTime = new Date(workStartTime.getTime());
    let newWorkMinutes = workEndTime.getMinutes() + Number(workLength);
    workEndTime.setMinutes(newWorkMinutes);

    workStartRotation = ((workStartTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;
    workEndRotation = ((workEndTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;
}

