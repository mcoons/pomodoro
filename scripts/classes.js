class Face {
    constructor(centerX, centerY, width) {
        this.context = document.querySelector("#clockface").getContext("2d");
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        document.querySelector("#clockface").width = this.width;
        document.querySelector("#clockface").height = this.width;
    }

    draw() {
        this.context.font = this.width / 10 + "px Serif";

        // draw circle
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.width / 2, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'white';
        this.context.fill();
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'black';
        this.context.stroke();

        // draw ticks
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
    constructor(clockWidth) {
        this.context = document.querySelector("#overlay").getContext("2d");
        this.color = "black";
        this.clockWidth = clockWidth;
        document.querySelector("#overlay").width = this.clockWidth;
        document.querySelector("#overlay").height = this.clockWidth;
    }

    clear() {
        this.context.clearRect(0, 0, this.clockWidth, this.clockWidth);
    }

    setColor(color) {
        this.color = color;
    }

    // draw a piece of pie
    draw(start, end) {
        if (start === end) end += Math.PI*2;
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.moveTo(this.clockWidth / 2, this.clockWidth / 2);
        this.context.arc(this.clockWidth / 2, this.clockWidth / 2, this.clockWidth / 2, start, end, false);
        this.context.closePath();
        this.context.fill();
    }
}

class Hand {
    constructor(color, width, length, centerX, centerY, clockWidth) {
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

    // clears the whole hand canvas.  only needs called for first hand at start
    clear() {
        this.context.clearRect(0, 0, this.clockWidth, this.clockWidth);
    }

    draw(rotation) {
        this.context.shadowBlur = 2;
        this.context.shadowColor = "rgba(0,0,0,.3)";
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 3;

        this.context.fillStyle = this.color;

        // MINUTE HAND AXIS CIRCLE
        this.context.resetTransform();
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.width * 1.25, 0, 2 * Math.PI, false);
        this.context.fill();

        // draw hand
        this.context.translate(this.centerX, this.centerY);
        this.context.rotate(rotation);
        this.context.translate(-this.centerX, -this.centerY);
        this.context.fillRect(this.centerX - this.width / 2, this.centerY, this.width, this.length);
    }
}

class Storage{
    save() {
        localStorage.setItem("mode", mode);
        localStorage.setItem("worklength", workLength);
        localStorage.setItem("restlength", restLength);
        localStorage.setItem("buttonclick", buttonClick);
        localStorage.setItem("muted", muted);
        localStorage.setItem("volume", masterVolume);
    }

    load() {
        let sMode = localStorage.getItem("mode");
        if (sMode) mode = sMode;
    
        let sWorkLength = localStorage.getItem("worklength");
        if (sWorkLength) workLength = Number(sWorkLength);
    
        let sRestLength = localStorage.getItem("restlength");
        if (sRestLength) restLength = Number(sRestLength);
    
        let sButtonClick = localStorage.getItem("buttonclick");
        if (sButtonClick) buttonClick = sButtonClick === "true";
    
        let sMuted = localStorage.getItem("muted");
        if (sMuted) muted = sMuted === "true";
    
        let sVolume = localStorage.getItem("volume");
        if (sVolume) masterVolume = Number(sVolume);
    }
}
