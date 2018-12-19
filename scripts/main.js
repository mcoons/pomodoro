const BOXWIDTH = 270;
const CLOCKWIDTH = BOXWIDTH - 50;
const CENTERX = CENTERY = CLOCKWIDTH / 2;
const overlayAlpha = .3;

var workStartRotation = workEndRotation = restStartRotation = restEndRotation = null;
var workStartTime = workEndTime = restStartTime = restEndTime = null;
var working = resting = false;

var logging = false;
var muted = false;
var buttonClick = true;
var workLength = 15;  // minutes
var restLength = 1;   // minutes
var workColor = "rgba( 0, 250, 0, " + overlayAlpha + " )";
var restColor = "rgba( 250, 0, 0, " + overlayAlpha + " )";
var masterVolume = .5;

loadOptions();  // storage.js

document.querySelector("#buttonClickCheckbox").checked = buttonClick;
document.querySelector("#mutebutton").innerText = muted ? "Unmute Sounds" : "Mute Sounds";
document.querySelector("#volumeSlider").setAttribute("value", masterVolume*100);

var appcontainer = document.querySelector("#appcontainer");
appcontainer.style.width = BOXWIDTH + "px";
appcontainer.style.height = BOXWIDTH + 210 + "px";

var container = document.querySelector("#clockcontainer");
container.style.width = container.style.height = BOXWIDTH + "px";

var clockShadow = document.querySelector("#clockshadow");
clockShadow.width = clockShadow.height = CLOCKWIDTH;

let face        = new Face(CENTERX, CENTERY, CLOCKWIDTH);
let hourHand    = new Hand('black', 6, -CLOCKWIDTH / 2 + CLOCKWIDTH / 6, CENTERX, CENTERY, CLOCKWIDTH);
let minuteHand  = new Hand('black', 4, -CLOCKWIDTH / 2 + CLOCKWIDTH / 15, CENTERX, CENTERY, CLOCKWIDTH);
let secondHand  = new Hand('red', 2, -CLOCKWIDTH / 2 + CLOCKWIDTH / 30, CENTERX, CENTERY, CLOCKWIDTH);

let workOverlay = new Overlay(CLOCKWIDTH);
workOverlay.setColor(workColor);

let restOverlay = new Overlay(CLOCKWIDTH);
restOverlay.setColor(restColor);

face.draw();
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

    drawHands(hrRotation, minRotation, secRotation);

    if (working && workEndTime < baseTime) {
        if (!alarm1 && !muted) {
            alarm1 = soundAlarm1();
        }
        document.querySelector("#led-red").classList.add("led-red-blink");
        document.querySelector("#lcd").innerHTML = "BREAK TIME" + (muted ? " (MUTED)" : "") + "&#10;" + (baseTime.getSeconds() % 2 === 0 ? "PRESS 'START BREAKING'" : "");
    } else
        if (working && workEndTime > baseTime) {
            let timeDiff = (workEndTime - baseTime) / 60 / 1000;
            let minutesLeft = Math.trunc(timeDiff);
            let secondsLeft = ("0" + (Math.trunc(timeDiff % 1 * 60).toString())).slice(-2);
            document.querySelector("#lcd").innerHTML = "WORKING" + (muted ? " (MUTED)" : "") + "&#10;" + minutesLeft + ":" + secondsLeft;
        }

    if (resting && restEndTime < baseTime) {
        if (!alarm2 && !muted) {
            alarm2 = soundAlarm2();
        }
        document.querySelector("#led-green").classList.add("led-green-blink");
        document.querySelector("#lcd").innerHTML = "TIME TO WORK" + (muted ? " (MUTED)" : "") + "&#10;" + (baseTime.getSeconds() % 2 === 0 ? "PRESS 'START WORKING'" : "");
    } else
        if (resting && restEndTime > baseTime) {
            let timeDiff = (restEndTime - baseTime) / 60 / 1000;
            let minutesLeft = Math.trunc(timeDiff);
            let secondsLeft = ("0" + (Math.trunc(timeDiff % 1 * 60).toString())).slice(-2);
            document.querySelector("#lcd").innerHTML = "TAKING A BREAK" + (muted ? " (MUTED)" : "") + "&#10;" + minutesLeft + ":" + secondsLeft;
        }

    if (working || resting) drawOverlays(workStartRotation, workEndRotation, restStartRotation, restEndRotation);
    if (!working && !resting) document.querySelector("#lcd").innerHTML = "CLOCK MODE&#10;" + baseTime.toLocaleTimeString();
}

function drawHands(hrRotation, minRotation, secRotation) {
    hourHand.clear();
    hourHand.draw(hrRotation);
    minuteHand.draw(minRotation);
    secondHand.draw(secRotation);
}

function drawOverlays(workStartRotation, workEndRotation, restStartRotation, restEndRotation) {
    workOverlay.clear();
    workOverlay.draw(workStartRotation, workEndRotation);
    restOverlay.draw(restStartRotation, restEndRotation);
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
