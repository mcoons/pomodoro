// updateHands();

let WIDTH = 250
var clockFace = document.getElementById("clockface");
var hands = document.getElementById("hands");
var container = document.getElementById("container");
var faceCtx = clockFace.getContext("2d");
var handsCtx = hands.getContext("2d");

container.style.width = WIDTH+WIDTH/20+10+"px";
container.style.height = WIDTH+WIDTH/20+10+"px";
clockFace.style.width = WIDTH+12+"px";
clockFace.style.height = WIDTH+12+"px";

hands.style.width = WIDTH+12+"px";
hands.style.height = WIDTH+12+"px";

container.width = WIDTH+WIDTH/20;
container.height = WIDTH+WIDTH/20;
clockFace.width = WIDTH;
clockFace.height = WIDTH;
hands.width = WIDTH;
hands.height = WIDTH;

drawFace();

setInterval( drawHands, 1000);

function drawFace(){

    // draw circle
    faceCtx.beginPath();
    faceCtx.arc(WIDTH/2, WIDTH/2, WIDTH/2, 0, 2 * Math.PI, false);
    faceCtx.fillStyle = 'white';
    faceCtx.fill();
    faceCtx.lineWidth = 2;
    faceCtx.strokeStyle = '#003300';
    faceCtx.stroke();

    // draw minute ticks
    faceCtx.beginPath();
    for (let rad = 0; rad < 2*Math.PI; rad+=2*Math.PI/60) {
        let x1 = Math.cos(rad)*WIDTH/2+WIDTH/2
        let y1 = Math.sin(rad)*WIDTH/2+WIDTH/2
        let x2 = Math.cos(rad)*(WIDTH/2-WIDTH/120)+WIDTH/2
        let y2 = Math.sin(rad)*(WIDTH/2-WIDTH/120)+WIDTH/2
        faceCtx.moveTo(x1,y1)
        faceCtx.lineTo(x2,y2);
        faceCtx.lineWidth=1;
        faceCtx.stroke();
    }

    // draw 5 minute ticks
    faceCtx.beginPath();
    for (let rad = 0; rad < 2*Math.PI; rad+=2*Math.PI/12) {
        let x1 = Math.cos(rad)*WIDTH/2+WIDTH/2
        let y1 = Math.sin(rad)*WIDTH/2+WIDTH/2
        let x2 = Math.cos(rad)*(WIDTH/2-WIDTH/40)+WIDTH/2
        let y2 = Math.sin(rad)*(WIDTH/2-WIDTH/40)+WIDTH/2
        faceCtx.moveTo(x1,y1)
        faceCtx.lineTo(x2,y2);
        faceCtx.lineWidth=WIDTH/120;  // 5 = 600/120
        faceCtx.stroke();
    }

    // draw 15 minute ticks
    faceCtx.beginPath();
    for (let rad = 0; rad < 2*Math.PI; rad+=2*Math.PI/4) {
        let x1 = Math.cos(rad)*WIDTH/2+WIDTH/2
        let y1 = Math.sin(rad)*WIDTH/2+WIDTH/2
        let x2 = Math.cos(rad)*(WIDTH/2-WIDTH/24)+WIDTH/2
        let y2 = Math.sin(rad)*(WIDTH/2-WIDTH/24)+WIDTH/2
        faceCtx.moveTo(x1,y1)
        faceCtx.lineTo(x2,y2);
        faceCtx.lineWidth=WIDTH/60;  // 10 = 600/60
        faceCtx.stroke();
    }
}

function drawHands(){
    handsCtx.clearRect(0, 0, WIDTH, WIDTH);

    let centerX = centerY = WIDTH/2;
    
    let baseTime = new Date();

    let hr = baseTime.getHours();
    let min = baseTime.getMinutes();
    let sec = baseTime.getSeconds();

    let hrPosition = (hr*360/12+(min*(360/60)/12))*Math.PI/180;
    let minPosition = ((min*360/60)+(sec*(360/60)/60))*Math.PI/180;
    let secPosition = (sec*360/60)*Math.PI/180;

    // Matrix transformation
    handsCtx.resetTransform();

    handsCtx.translate(centerX, centerY);
    handsCtx.rotate(hrPosition);
    handsCtx.translate(-centerX, -centerY);

    // Rotated rectangle
    handsCtx.fillStyle = 'black';
    handsCtx.fillRect(centerX-2.5, centerY, 5, -WIDTH/2+40);


    // Matrix transformation
    handsCtx.resetTransform();

    handsCtx.translate(centerX, centerY);
    handsCtx.rotate(minPosition);
    handsCtx.translate(-centerX, -centerY);

    // Rotated rectangle
    handsCtx.fillStyle = 'gblackray';
    handsCtx.fillRect(centerX-1.5, centerY, 3, -WIDTH/2+15);


    // Matrix transformation
    handsCtx.resetTransform();

    handsCtx.translate(centerX, centerY);
    handsCtx.rotate(secPosition);
    handsCtx.translate(-centerX, -centerY);

    // Rotated rectangle
    handsCtx.fillStyle = 'red';
    handsCtx.fillRect(centerX-.5, centerY, 1, -WIDTH/2);


    handsCtx.resetTransform();
    // draw circle
    faceCtx.beginPath();
    faceCtx.arc(WIDTH/2, WIDTH/2, 5, 0, 2 * Math.PI, false);
    faceCtx.fillStyle = 'red';
    faceCtx.lineWidth = 1;
    faceCtx.fill();
    faceCtx.strokeStyle = '#ff0000';
    faceCtx.stroke();

}


