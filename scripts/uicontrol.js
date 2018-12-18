var workLengthSlider = document.getElementById("workLengthSlider");
var workLengthLabel = document.getElementById("workLengthLabel");
workLengthLabel.innerHTML = "Work Length: " + workLengthSlider.value;

workLengthSlider.oninput = function () { workLengthLabel.innerHTML = "Work Length: " + this.value }

var restLengthSlider = document.getElementById("restLengthSlider");
var restLengthLabel = document.getElementById("restLengthLabel");
restLengthLabel.innerHTML = "Break Length: " + restLengthSlider.value;

restLengthSlider.oninput = function () { restLengthLabel.innerHTML = "Break Length: " + this.value }

var volumeSlider = document.getElementById("volumeSlider");
var volumeLabel = document.getElementById("volumeLabel");
volumeLabel.innerHTML = "Volume: " + volumeSlider.value;

volumeSlider.oninput = function () { volumeLabel.innerHTML = "Volume: " + this.value }

var masterVolume = volumeSlider.value / 100;

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

function optionsButtonClick() {
    soundClick();
    document.getElementById('optionsModal').style.marginBottom = '0';
}

function instructionsButtonClick() {
    soundClick();
    document.getElementById('instructionsModal').style.marginBottom = '0';
}

function workButtonClick() {
    soundClick();
    stopSounds();
    working = true;
    resting = false;
    calculateWorkRestRotations(new Date());
    document.getElementById("lcd").innerHTML = "WORKING" + (masterVolume === 0 ? " (MUTED)" : "");
}

function restButtonClick() {
    soundClick();
    stopSounds();
    resting = true;
    working = false;
    calculateRestWorkRotations(new Date());
    document.getElementById("lcd").innerHTML = "TAKING A BREAK" + (masterVolume === 0 ? " (MUTED)" : "");
}

function clearButtonClick() {
    soundClick();
    stopSounds();
    resting = false;
    working = false;
    document.getElementById("lcd").innerHTML = "CLOCK MODE";
    overlayCtx.clearRect(0, 0, CLOCKWIDTH, CLOCKWIDTH);
}

function saveOptionsButtonClick() {
    soundClick();
    document.getElementById('optionsModal').style.marginBottom = '-215px';

    workLength = workLengthSlider.value;
    restLength = restLengthSlider.value;
    masterVolume = volumeSlider.value / 100;

    if (working) calculateWorkRestRotations(new Date(workStartTime));
    else
    if (resting) calculateRestWorkRotations(new Date(restStartTime));
}

function muteButtonClick() {
    stopSounds();
    masterVolume = 0;
    volumeSlider.value = 0;
    volumeLabel.innerHTML = "Volume: " + volumeSlider.value;
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