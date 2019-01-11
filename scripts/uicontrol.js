var workLengthSlider = document.querySelector("#workLengthSlider");
workLengthSlider.setAttribute("value", workLength);

var workLengthLabel = document.querySelector("#workLengthLabel");
workLengthLabel.innerHTML = "Pomodoro Work Length: " + workLengthSlider.value;
workLengthSlider.oninput = function () { workLengthLabel.innerHTML = "Pomodoro Work Length: " + this.value; };

var restLengthSlider = document.querySelector("#restLengthSlider");
restLengthSlider.setAttribute("value", restLength);

var restLengthLabel = document.querySelector("#restLengthLabel");
restLengthLabel.innerHTML = "Pomodoro Break Length: " + restLengthSlider.value;
restLengthSlider.oninput = function () { restLengthLabel.innerHTML = "Pomodori Break Length: " + this.value; };


var timerLengthMinutesSlider = document.querySelector("#timerLengthMinutesSlider");
timerLengthMinutesSlider.setAttribute("value", timerMinuteLength);

var timerLengthMinutesLabel = document.querySelector("#timerLengthMinutesLabel");
timerLengthMinutesLabel.innerHTML = "Timer Minuteds: " + timerLengthMinutesSlider.value;
timerLengthMinutesSlider.oninput = function () { timerLengthMinutesLabel.innerHTML = "Timer Minutes: " + this.value; };

var timerLengthSecondsSlider = document.querySelector("#timerLengthSecondsSlider");
timerLengthSecondsSlider.setAttribute("value", timerSecondLength);

var timerLengthSecondsLabel = document.querySelector("#timerLengthSecondsLabel");
timerLengthSecondsLabel.innerHTML = "Timer Seconds: " + timerLengthSecondsSlider.value;
timerLengthSecondsSlider.oninput = function () { timerLengthSecondsLabel.innerHTML = "Timer Seconds: " + this.value; };








var volumeSlider = document.querySelector("#volumeSlider");
volumeSlider.setAttribute("value", masterVolume * 100);

var volumeLabel = document.querySelector("#volumeLabel");
volumeLabel.innerHTML = "Volume: " + volumeSlider.value + (muted ? " (MUTED)" : "");
volumeSlider.oninput = function () { volumeLabel.innerHTML = "Volume: " + this.value }

masterVolume = volumeSlider.value / 100;

document.querySelector("#buttonClickCheckbox").checked = buttonClick;
document.querySelector("#buttonClickCheckbox").onchange = buttonCheckboxChange;

document.querySelector("#muteButton").innerText = muted ? "Unmute Sounds" : "Mute Sounds";
document.querySelector("#muteButton").onclick = muteButtonClick;

document.querySelector("#workButton").onclick = workButtonClick;
document.querySelector("#breakButton").onclick = restButtonClick;
document.querySelector("#clearButton").onclick = clearButtonClick;
document.querySelector("#optionsButton").onclick = optionsButtonClick;
document.querySelector("#instructionButton").onclick = instructionsButtonClick;
document.querySelector("#saveOptionsButton").onclick = saveOptionsButtonClick;
document.querySelector("#finishedButton").onclick = function(){if (!muted && buttonClick) soundClick(); document.getElementById('instructionsModal').style.marginBottom='-215px'; return false;};

document.querySelectorAll(".mode").forEach( m => m.oninput = modeChange);

// Get the options tab with id="defaultOpen" and click on it
document.querySelector("#defaultOpen").click();

function modeChange(event){
    console.log(event.target.value);
    mode = event.target.value;

    document.querySelectorAll(".pomodoromode").forEach(e => e.classList.add("hidden")); 
    document.querySelectorAll(".timermode").forEach(e => e.classList.add("hidden")); 
    document.querySelectorAll(".stopwatchmode").forEach(e => e.classList.add("hidden")); 

    document.querySelectorAll("."+mode.toLowerCase()+"mode").forEach(e => e.classList.remove("hidden"));
}

function optionsButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }
    document.getElementById("optionsModal").style.marginBottom = "0";
    return false;
}

function instructionsButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }
    document.getElementById("instructionsModal").style.marginBottom = "0";
    return false;
}

function workButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }
    let time = new Date();
    if (!working || log.last() === "End Work Alarm") {
        log.add({ "Work Button": time });
    }
    stopSounds();
    document.querySelector("#led-red").classList.remove("led-red-blink");
    document.querySelector("#led-green").classList.remove("led-green-blink");
    working = true;
    resting = false;
    calculateWorkRestRotations(time);
    document.querySelector("#lcd").innerHTML = "WORKING" + (muted ? " (MUTED)" : "");
    return false;
}

function restButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }
    let time = new Date();
    if (!resting || log.last() === "End Break Alarm") {
        log.add({ "Break Button": time });
    }
    stopSounds();
    document.querySelector("#led-red").classList.remove("led-red-blink");
    document.querySelector("#led-green").classList.remove("led-green-blink");
    resting = true;
    working = false;
    calculateRestWorkRotations(time);
    document.querySelector("#lcd").innerHTML = "TAKING A BREAK" + (muted ? " (MUTED)" : "");
    return false;
}

function clearButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }
    if (working || resting) {
        log.add({ "Clear Button": new Date() })
    } else {
        return;
    }
    stopSounds();
    document.querySelector("#led-red").classList.remove("led-red-blink");
    document.querySelector("#led-green").classList.remove("led-green-blink");
    resting = false;
    working = false;
    document.querySelector("#lcd").innerHTML = "CLOCK MODE";
    workOverlay.clear();
    return false;
}

function saveOptionsButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }
    document.getElementById("optionsModal").style.marginBottom = "-215px";

    workLength = workLengthSlider.value;
    restLength = restLengthSlider.value;

    timerMinuteLength = timerLengthMinutesSlider.value;
    timerSecondLength = timerLengthSecondsSlider.value;

    masterVolume = volumeSlider.value / 100;

    saveOptions();

    if (working) {
        calculateWorkRestRotations(new Date(workStartTime));
    } else {
        if (resting) {
            calculateRestWorkRotations(new Date(restStartTime));
        }
    }
    return false;
}

function muteButtonClick() {
    muted = !muted;
    if (!muted && buttonClick) {
        soundClick();
    }
    if (muted) {
        stopSounds();
    }
    document.querySelector("#muteButton").innerText = muted ? "Unmute Sounds" : "Mute Sounds";
    volumeLabel.innerHTML = "Volume: " + volumeSlider.value + (muted ? " (MUTED)" : "");
    saveOptions();
    return false;
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tabLinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function buttonCheckboxChange() {
    buttonClick = document.querySelector("#buttonClickCheckbox").checked;
    return false;
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
