let BOXWIDTH = 300;
let CLOCKWIDTH = BOXWIDTH-50;
var centerX = centerY = CLOCKWIDTH/2;

var overlayAlpha = .3;
var workColor = "rgba(0, 250, 0, " + overlayAlpha + ")"; 
var restColor = "rgba(250, 0, 0, " + overlayAlpha + ")"; 
var workLength = 25;  // minutes
var restLength = 5;   // minutes
var working = resting = false;

var workStartRotation = workEndRotation = restStartRotation = restEndRotation = null;
var workStartTime = workEndTime = restStartTime = restEndTime = null;

var appcontainer = document.getElementById("appcontainer");
appcontainer.style.width = BOXWIDTH+"px";
appcontainer.style.height = BOXWIDTH+150+"px";

var container = document.getElementById("clockcontainer");
container.style.width = container.style.height = BOXWIDTH+"px";

var clockFace = document.getElementById("clockface");
var faceCtx = clockFace.getContext("2d");
clockFace.width = clockFace.height = CLOCKWIDTH; 

var hands = document.getElementById("hands");
var handsCtx = hands.getContext("2d");
hands.width = hands.height = CLOCKWIDTH;

var overlay = document.getElementById("overlay");
var overlayCtx = hands.getContext("2d");
overlay.width = overlay.height = CLOCKWIDTH;

document.getElementById("workLengthInput").setAttribute("value", workLength);
document.getElementById("restLengthInput").setAttribute("value", restLength);

drawFace();
setInterval( refreshClock, 50);

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

    drawHands(hrRotation, minRotation, secRotation);

    if (working && workEndTime < baseTime && !alarm1) {
        alarm1 = soundAlarm1();
        document.getElementById("led").innerText = "BREAK TIME";
    }

    if (resting && restEndTime < baseTime && !alarm2) {
        alarm2 = soundAlarm2();
        document.getElementById("led").innerText = "TIME TO WORK";
    }

    if (working || resting)
        drawOverlays(workStartRotation, workEndRotation, restStartRotation, restEndRotation);
}

function drawFace(){
   faceCtx.font = CLOCKWIDTH/10 + "px Serif";
    
    // draw circle
    faceCtx.beginPath();
    faceCtx.arc(centerX, centerY, CLOCKWIDTH/2, 0, 2 * Math.PI, false);
    faceCtx.fillStyle = 'white';
    faceCtx.fill();
    faceCtx.lineWidth = 2;
    faceCtx.strokeStyle = '#000000';
    faceCtx.stroke();
    
    for (let degrees = 0; degrees < 360; degrees+=6){
        let rad = degrees*Math.PI/180;  
        let tickLength = CLOCKWIDTH/72;
        faceCtx.lineWidth=1;
 
        if (degrees%90===0){ 
            tickLength=CLOCKWIDTH/24;
            faceCtx.lineWidth=CLOCKWIDTH/60; 
        }  
        else 
        if (degrees%30===0){ 
            tickLength=CLOCKWIDTH/48;
            faceCtx.lineWidth=CLOCKWIDTH/120; 
        }  
        
        let x1 = Math.cos(rad)*CLOCKWIDTH/2+centerX;
        let y1 = Math.sin(rad)*CLOCKWIDTH/2+centerY;
        let x2 = Math.cos(rad)*(CLOCKWIDTH/2-tickLength)+centerX;
        let y2 = Math.sin(rad)*(CLOCKWIDTH/2-tickLength)+centerY;
        
        faceCtx.beginPath();
        faceCtx.moveTo(x1,y1);
        faceCtx.lineTo(x2,y2);
        faceCtx.stroke();
    }

    // Draw face text
    faceCtx.fillStyle = '#967A45';
    faceCtx.fillText("XII",CLOCKWIDTH/2-18, 40);
    faceCtx.fillText("III",CLOCKWIDTH-43, CLOCKWIDTH/2+8);
    faceCtx.fillText("VI",CLOCKWIDTH/2-16, CLOCKWIDTH - 22);
    faceCtx.fillText("IX",18, CLOCKWIDTH/2+8);

    faceCtx.font = "12px Serif";
    faceCtx.fillText("Pomodoro",CLOCKWIDTH/2-26, CLOCKWIDTH/2+20);
    faceCtx.fillText("by",CLOCKWIDTH/2-5, CLOCKWIDTH/2+30);
    faceCtx.fillText("Coons",CLOCKWIDTH/2-15, CLOCKWIDTH/2+40);
}

function drawHands(hrRotation, minRotation, secRotation){
    handsCtx.clearRect(0, 0, CLOCKWIDTH, CLOCKWIDTH);

    handsCtx.fillStyle = 'black';
    drawHand(hrRotation, 5, -CLOCKWIDTH/2+CLOCKWIDTH/6);
    drawHand(minRotation, 3, -CLOCKWIDTH/2+CLOCKWIDTH/15);
 
    // MINUTE HAND AXIS CIRCLE
    handsCtx.resetTransform();
    handsCtx.beginPath();
    handsCtx.arc(centerX, centerY, 7, 0, 2 * Math.PI, false);
    handsCtx.lineWidth = 1;
    handsCtx.fill();
    handsCtx.strokeStyle = '#000000';
    handsCtx.stroke();

    handsCtx.fillStyle = 'red';
    drawHand(secRotation, 1, -CLOCKWIDTH/2+CLOCKWIDTH/30);
 
    // SECOND HAND AXIS CIRCLE
    handsCtx.resetTransform();
    handsCtx.beginPath();
    handsCtx.arc(centerX, centerY, 3, 0, 2 * Math.PI, false);
    handsCtx.lineWidth = 1;
    handsCtx.fill();
    handsCtx.strokeStyle = '#ff0000';
    handsCtx.stroke();
}

function drawHand(rotation, handWidth, handLength){
    handsCtx.resetTransform();
    handsCtx.translate(centerX, centerY);
    handsCtx.rotate(rotation);
    handsCtx.translate(-centerX, -centerY);
    handsCtx.fillRect(centerX-handWidth/2, centerY, handWidth, handLength);
}

function drawOverlays(workStartRotation, workEndRotation, restStartRotation, restEndRotation){
    drawOverlay(overlayCtx, workStartRotation, workEndRotation, workColor);
    drawOverlay(overlayCtx, restStartRotation, restEndRotation, restColor);
}

function drawOverlay(ctx, start, end, color){
    ctx.beginPath();
    ctx.moveTo(CLOCKWIDTH/2, CLOCKWIDTH/2);
    ctx.arc(CLOCKWIDTH/2, CLOCKWIDTH/2, CLOCKWIDTH/2, 
        start, end, false);
    ctx.closePath();
    ctx.fillStyle = color; 
    ctx.fill();
}

function calculateWorkRestRotations(starting){
    let baseTime = new Date(starting.getTime());
    let sec = baseTime.getSeconds();

    workStartTime = new Date(baseTime.getTime());
    workEndTime = new Date(workStartTime.getTime());
    let newWorkMinutes = workEndTime.getMinutes() + Number(workLength);
    workEndTime.setMinutes(newWorkMinutes);

    workStartRotation = ((workStartTime.getMinutes()*360/60)+(sec*(360/60)/60))*Math.PI/180 - Math.PI/2;
    workEndRotation = ((workEndTime.getMinutes()*360/60)+(sec*(360/60)/60))*Math.PI/180 - Math.PI/2;

    restStartTime = new Date(workEndTime.getTime());
    restEndTime = new Date(restStartTime.getTime());
    let newRestMinutes = restEndTime.getMinutes() + Number(restLength);
    restEndTime.setMinutes(newRestMinutes);

    restStartRotation = ((restStartTime.getMinutes()*360/60)+(sec*(360/60)/60))*Math.PI/180 - Math.PI/2;
    restEndRotation = ((restEndTime.getMinutes()*360/60)+(sec*(360/60)/60))*Math.PI/180 - Math.PI/2;

}

function calculateRestWorkRotations(starting){
    let baseTime = new Date(starting);
    let sec = baseTime.getSeconds();

    console.log("baseTime: ", baseTime);

    restStartTime = new Date(baseTime.getTime());
    restEndTime = new Date(restStartTime.getTime());
    console.log("first restEndTime: ",restEndTime);

    console.log("restEndTime minutes: ",restEndTime.getMinutes())
    let newRestMinutes = restEndTime.getMinutes() + Number(restLength);
    console.log("newRestMinutes: ", newRestMinutes);

    restEndTime.setMinutes(newRestMinutes);

    console.log("restStartTime: ",restStartTime);
    console.log("restEndTime: ",restEndTime);

    restStartRotation = ((restStartTime.getMinutes()*360/60)+(sec*(360/60)/60))*Math.PI/180 - Math.PI/2;
    restEndRotation = ((restEndTime.getMinutes()*360/60)+(sec*(360/60)/60))*Math.PI/180 - Math.PI/2;

    workStartTime = new Date(restEndTime.getTime());
    workEndTime = new Date(workStartTime.getTime());
    let newWorkMinutes = workEndTime.getMinutes() + Number(workLength);
    workEndTime.setMinutes(newWorkMinutes);

    workStartRotation = ((workStartTime.getMinutes()*360/60)+(sec*(360/60)/60))*Math.PI/180 - Math.PI/2;
    workEndRotation = ((workEndTime.getMinutes()*360/60)+(sec*(360/60)/60))*Math.PI/180 - Math.PI/2;
}

function optionButtonClick(){
    soundClick();
    document.getElementById('optionsmodal').style.marginBottom='0'; 
}

function workButtonClick(){

    console.log("-------------------------");
    console.log("workLength: ", workLength);
    console.log("restLength: ", restLength);

    soundClick();
    stopSounds();

    working=true; 
    resting=false; 

    calculateWorkRestRotations(new Date());

    document.getElementById("led").innerText = "WORKING";

}

function restButtonClick(){

    console.log("-------------------------");
    console.log("workLength: ", workLength);
    console.log("restLength: ", restLength);

    soundClick();
    stopSounds();

    resting=true; 
    working=false; 

    calculateRestWorkRotations(new Date());

    document.getElementById("led").innerText = "TAKING A BREAK";

}

function clearButtonClick(){
    soundClick();
    stopSounds();

    resting=false; 
    working=false;

    document.getElementById("led").innerText = "CLOCK MODE";

}

function saveOptionsButtonClick(){
    soundClick();


    document.getElementById('optionsmodal').style.marginBottom='-150px';

    let newWorkLength = document.getElementById("workLengthInput").value;
    if (newWorkLength != workLength ) {
        workLength = newWorkLength;
    }


    let newRestLength = document.getElementById("restLengthInput").value;
    if (newRestLength != restLength ) {
        restLength = newRestLength;
    }

    if (working){
        calculateWorkRestRotations(new Date(workStartTime));
    }

    if (resting){
        calculateRestWorkRotations(new Date(restStartTime));
    }    
}

function workLengthChange(){

}

function restLengthChange(){

}