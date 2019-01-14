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
timerLengthMinutesLabel.innerHTML = "Timer Minutes: " + timerLengthMinutesSlider.value;
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

document.querySelector("#startButton").onclick = startButtonClick;
// document.querySelector("#startButton").innerText = 
//     mode = "Pomodoro" ? "Start Working" :
//     mode = "Timer" ? "Start Timer" :
//     "Start Stopwatch";

document.querySelector("#endButton").onclick = endButtonClick;
// document.querySelector("#endButton").innerText =
//     mode = "Pomodoro" ? "Start Breaking" :
//     mode = "Timer" ? "End Timer" :
//     "End Stopwatch";

document.querySelector("#clearButton").onclick = clearButtonClick;
document.querySelector("#optionsButton").onclick = optionsButtonClick;
document.querySelector("#instructionButton").onclick = instructionsButtonClick;
document.querySelector("#saveOptionsButton").onclick = saveOptionsButtonClick;
document.querySelector("#finishedButton").onclick = function(){if (!muted && buttonClick) soundClick(); document.getElementById('instructionsModal').style.marginBottom='-215px'; return false;};


document.querySelectorAll(".mode").forEach( m => m.checked=false );
// document.querySelector("#"+mode.toLowerCase()+"Mode").checked = true;
document.querySelectorAll(".mode").forEach( m => m.oninput = modeChange );
document.querySelector("#"+mode.toLowerCase()+"Mode").click();




// Get the options tab with id="defaultOpen" and click on it
document.querySelector("#defaultOpen").click();

function modeChange(event){

    // clear all functions???  allow simultanious functions??? ***

    console.log(event.target.value);
    mode = event.target.value;

    document.querySelectorAll(".pomodoromode").forEach(e => e.classList.add("hidden")); 
    document.querySelectorAll(".timermode").forEach(e => e.classList.add("hidden")); 
    document.querySelectorAll(".stopwatchmode").forEach(e => e.classList.add("hidden")); 

    document.querySelectorAll("."+mode.toLowerCase()+"mode").forEach(e => e.classList.remove("hidden"));

    document.querySelector("#startButton").innerText = 
        mode === "Pomodoro" ? "Start Working" :
        mode === "Timer" ? "Start Timer" :
        "Start Stopwatch";

    document.querySelector("#endButton").innerText =
        mode === "Pomodoro" ? "Start Breaking" :
        mode === "Timer" ? "End Timer" :
        "End Stopwatch";

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

function startButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }

    let time = new Date();


    switch (mode) {
        case "Pomodoro":  // start working
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
        break;
    
        case "Timer":  // start timer
            if (!timing || log.last() === "End Timer Alarm"){
                log.add({"Timer Start Button": time });
            }
            stopSounds();
            document.querySelector("#led-red").classList.remove("led-red-blink");
            document.querySelector("#led-green").classList.remove("led-green-blink");
            timing = true;
            calculateTimerRotations(time);
            document.querySelector("#lcd").innerHTML = "TIMING" + (muted ? " (MUTED)" : "");            
        break;

        case "Stopwatch":  // start stopwatch

        break;

        default:
            console.log("ERROR: mode error in startButtonClick()")
        break;
    }


    return false;
}

function endButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }
    let time = new Date();

    switch (mode) {
        case "Pomodoro":  // start breaking
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
        break;
    
        case "Timer":  // end timer
            if (!timing || log.last() === "End Timer Alarm") {
                log.add({ "End Timer Button": time });
            }
            stopSounds();
            document.querySelector("#led-red").classList.remove("led-red-blink");
            document.querySelector("#led-green").classList.remove("led-green-blink");
            timing = false;
            timerOverlay.clear();
            // document.querySelector("#lcd").innerHTML = "TAKING A BREAK" + (muted ? " (MUTED)" : "");

        break;

        case "Stopwatch":  // end stopwatch

        break;

        default:
            console.log("ERROR: mode error in endButtonClick()")
        break;
    }

    return false;
}

function clearButtonClick() {
    if (!muted && buttonClick) {
        soundClick();
    }
    if (working || resting || timing || stopwatching) {
        log.add({ "Clear Button": new Date() })
    } else {
        return;
    }
    stopSounds();
    document.querySelector("#led-red").classList.remove("led-red-blink");
    document.querySelector("#led-green").classList.remove("led-green-blink");
    resting = false;
    working = false;
    timing = false;
    stopwatching = false;
    document.querySelector("#lcd").innerHTML = mode.toUpperCase() + " MODE";
    workOverlay.clear();
    timerOverlay.clear();
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
    } else 
    if (resting) {
        calculateRestWorkRotations(new Date(restStartTime));
    } else
    if (timing) {
        calculateTimerRotations(new Date(timerStartTime));
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

function calculateTimerRotations(starting) {
    let baseTime = new Date(starting.getTime());
    let sec = baseTime.getSeconds();
    sec += baseTime.getMilliseconds()/1000;

    if (Number(timerLengthMinutesSlider.value) > 0 || (Number(timerLengthMinutesSlider.value) === 0 && Number(timerLengthSecondsSlider.value) === 60)) {
        timerStartTime = new Date(baseTime.getTime());
        timerEndTime = new Date(timerStartTime.getTime());
        let newTimerMinutes = timerEndTime.getMinutes() + Number(timerLengthMinutesSlider.value);
        timerEndTime.setMinutes(newTimerMinutes);   
        let newTimerSeconds = timerEndTime.getSeconds() + Number(timerLengthSecondsSlider.value); 
        timerEndTime.setSeconds(newTimerSeconds);
        
        timerStartRotation = ((timerStartTime.getMinutes() * 360 / 60) + (sec * (360 / 60) / 60)) * Math.PI / 180 - Math.PI / 2;
        timerEndRotation = ((timerEndTime.getMinutes() * 360 / 60) + (timerEndTime.getSeconds() * 360 / 60 / 60)) * Math.PI / 180 - Math.PI / 2;
    } else {
        timerStartTime = new Date(baseTime.getTime());
        timerEndTime = new Date(timerStartTime.getTime());
        let newTimerSeconds = timerEndTime.getSeconds() + Number(timerLengthSecondsSlider.value); 
        timerEndTime.setSeconds(newTimerSeconds);
        
        timerStartRotation = (sec * 360 / 60) * Math.PI / 180 - Math.PI / 2;
        timerEndRotation = ((sec + Number(timerLengthSecondsSlider.value)) * 360 / 60 ) * Math.PI / 180 - Math.PI / 2;

    }
}
