var workLengthSlider = document.getElementById("workLengthSlider");
workLengthSlider.setAttribute("value", workLength);
var workLengthLabel = document.getElementById("workLengthLabel");
workLengthLabel.innerHTML = "Work Length: " + workLengthSlider.value;

workLengthSlider.oninput = function () { workLengthLabel.innerHTML = "Work Length: " + this.value }

var restLengthSlider = document.getElementById("restLengthSlider");
restLengthSlider.setAttribute("value", restLength);
var restLengthLabel = document.getElementById("restLengthLabel");
restLengthLabel.innerHTML = "Break Length: " + restLengthSlider.value;

restLengthSlider.oninput = function () { restLengthLabel.innerHTML = "Break Length: " + this.value }

var volumeSlider = document.getElementById("volumeSlider");
var volumeLabel = document.getElementById("volumeLabel");
volumeLabel.innerHTML = "Volume: " + volumeSlider.value;

volumeSlider.oninput = function () { volumeLabel.innerHTML = "Volume: " + this.value }

masterVolume = volumeSlider.value / 100;

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

function optionsButtonClick() {
    if (!muted && buttonClick) soundClick();
    document.getElementById('optionsModal').style.marginBottom = '0';
}

function instructionsButtonClick() {
    if (!muted && buttonClick) soundClick();
    document.getElementById('instructionsModal').style.marginBottom = '0';
}

function workButtonClick() {
    if (!muted && buttonClick) soundClick();
    stopSounds();
    working = true;
    resting = false;
    calculateWorkRestRotations(new Date());
    document.getElementById("lcd").innerHTML = "WORKING" + (muted ? " (MUTED)" : "");
}

function restButtonClick() {
    if (!muted && buttonClick) soundClick();
    stopSounds();
    resting = true;
    working = false;
    calculateRestWorkRotations(new Date());
    document.getElementById("lcd").innerHTML = "TAKING A BREAK" + (muted ? " (MUTED)" : "");
}

function clearButtonClick() {
    if (!muted && buttonClick) soundClick();
    stopSounds();
    resting = false;
    working = false;
    document.getElementById("lcd").innerHTML = "CLOCK MODE";
    overlayCtx.clearRect(0, 0, CLOCKWIDTH, CLOCKWIDTH);
}

function saveOptionsButtonClick() {
    if (!muted && buttonClick) soundClick();
    document.getElementById('optionsModal').style.marginBottom = '-215px';

    workLength = workLengthSlider.value;
    restLength = restLengthSlider.value;
    masterVolume = volumeSlider.value / 100;

    saveOptions();

    if (working) calculateWorkRestRotations(new Date(workStartTime));
    else
    if (resting) calculateRestWorkRotations(new Date(restStartTime));
}

function muteButtonClick() {
    muted = !muted;
    if (!muted && buttonClick) soundClick();
    if (muted) stopSounds();
    document.getElementById("mutebutton").innerText = muted ? "Unmute Sounds" : "Mute Sounds";
    volumeLabel.innerHTML = "Volume: " + volumeSlider.value + (muted ? " (MUTED)" : "");
    saveOptions();
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

function buttonCheckboxChange(){
    buttonClick = document.getElementById("buttonClickCheckbox").checked;
}

// this.setAttribute("checked", "checked");
// this.checked = buttonClick = true;

// this.setAttribute("checked", ""); // For IE
// this.removeAttribute("checked"); // For other browsers
// this.checked = buttonClick = false;