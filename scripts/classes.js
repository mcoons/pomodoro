class Face {
    // constructor(context, centerX, centerY, width) {
    constructor(centerX, centerY, width) {
        // this.context = context;
        this.context = document.querySelector("#clockface").getContext("2d");
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        document.querySelector("#clockface").width = this.width;
        document.querySelector("#clockface").height = this.width;
    }

    draw(){
        this.context.font = this.width / 10 + "px Serif";

        // draw circle
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.width / 2, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'white';
        this.context.fill();
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#000000';
        this.context.stroke();       
    
        for (let degrees = 0; degrees < 360; degrees += 6) {
            let rad = degrees * Math.PI / 180;
            let tickLength = this.width / 70;
            this.context.lineWidth = 1;
    
            if (degrees % 90 === 0) {
                tickLength = this.width / 20;
                this.context.lineWidth = this.width / 60;
            }
            else
                if (degrees % 30 === 0) {
                    tickLength = this.width / 40;
                    this.context.lineWidth = this.width / 120;
                }
    
            let x1 = Math.cos(rad) * this.width / 2 + this.centerX;
            let y1 = Math.sin(rad) * this.width / 2 + this.centerY;
            let x2 = Math.cos(rad) * (this.width / 2 - tickLength) + this.centerX;
            let y2 = Math.sin(rad) * (this.width / 2 - tickLength) + this.centerY;
    
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();
        }    

        // Draw face text
        this.context.fillStyle = '#967A45';
        this.context.fillText("XII", this.width / 2 - 16, 30);
        this.context.fillText("III", this.width - 35, this.width / 2 + 8);
        this.context.fillText("VI", this.width / 2 - 14, this.width - 13);
        this.context.fillText("IX", 13, this.width / 2 + 8);

        this.context.font = "12px Serif";
        this.context.fillText("Pomodoro", this.width / 2 - 26, this.width / 2 + 20);
        this.context.fillText("by", this.width / 2 - 5, this.width / 2 + 30);
        this.context.fillText("Coons", this.width / 2 - 14, this.width / 2 + 40);
    }
}

class Overlay {
    // constructor (context, color, clockWidth){
    constructor (color, clockWidth){
        // this.context = context;
        this.context = document.querySelector("#overlay").getContext("2d");
        this.color = color;
        this.clockWidth = clockWidth;
        document.querySelector("#overlay").width = this.clockWidth;
        document.querySelector("#overlay").height = this.clockWidth;
    }

    clear(){
        this.context.clearRect(0, 0, this.clockWidth, this.clockWidth);
    }

    draw(start, end){
        this.context.beginPath();
        this.context.moveTo(this.clockWidth / 2, this.clockWidth / 2);
        this.context.arc(this.clockWidth / 2, this.clockWidth / 2, this.clockWidth / 2, start, end, false);
        this.context.closePath();
        this.context.fillStyle = this.color;
        this.context.fill();
    }
}

class Hand{
    // constructor(context, color, width, length, centerX, centerY, clockWidth){
    constructor(color, width, length, centerX, centerY, clockWidth){
        // this.context = context;
        this.context = document.querySelector("#hands").getContext("2d");
        this.color = color;
        this.width = width;
        this.length = length;
        this.centerX = centerX;
        this.centerY = centerY;
        this.clockWidth = clockWidth;
        document.querySelector("#hands").width = this.clockWidth;
        document.querySelector("#hands").height = this.clockWidth;
    }

    clear(){
        this.context.clearRect(0, 0, this.clockWidth, this.clockWidth);
    }

    draw(rotation){
        this.context.resetTransform();
        this.context.translate(this.centerX, this.centerY);
        this.context.rotate(rotation);
        this.context.translate(-this.centerX, -this.centerY);
        this.context.shadowBlur = 2;
        this.context.shadowColor = "rgba(0,0,0,.3)";
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 3;
        this.context.fillRect(this.centerX - this.width / 2, this.centerY, this.width, this.length);
    }
}
