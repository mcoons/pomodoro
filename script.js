// updateHands();

let WIDTH = 250
var clockFace = document.getElementById("clockface");
var container = document.getElementById("container");
var ctx = clockFace.getContext("2d");

container.style.width = WIDTH+WIDTH/20+"px";
container.style.height = WIDTH+WIDTH/20+"px";
clockFace.style.width = WIDTH+"px";
clockFace.style.height = WIDTH+"px";

container.width = WIDTH+WIDTH/20;
container.height = WIDTH+WIDTH/20;
clockFace.width = WIDTH;
clockFace.height = WIDTH;

ctx.translate(0.5, 0.5);

ctx.beginPath();
ctx.arc(WIDTH/2, WIDTH/2, WIDTH/2, 0, 2 * Math.PI, false);
ctx.fillStyle = 'blue';
ctx.fill();
ctx.lineWidth = 1;
ctx.strokeStyle = '#003300';
ctx.stroke();

ctx.translate(-0.5, -0.5);


function updateHands(){
    let div = document.querySelector("#hrhand");

    deg = 0;

    div.style.webkitTransform = 'rotate('+deg+'deg)'; 
    div.style.mozTransform    = 'rotate('+deg+'deg)'; 
    div.style.msTransform     = 'rotate('+deg+'deg)'; 
    div.style.oTransform      = 'rotate('+deg+'deg)'; 
    div.style.transform       = 'rotate('+deg+'deg)'; 
}