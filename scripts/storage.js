// JSON USAGE
// localStorage.setItem(s, JSON.stringify(data))
// data = JSON.parse(localStorage.getItem(s))

function loadOptions() {
    let sMode = localStorage.getItem("mode");
    if (sMode) mode = sMode;

    let sWorkLength = localStorage.getItem("pomodoroworklength");
    if (sWorkLength) workLength = Number(sWorkLength);

    let sRestLength = localStorage.getItem("pomodororestlength");
    if (sRestLength) restLength = Number(sRestLength);

    let sTimerMinuteLength = localStorage.getItem("timerminutelength");
    if (sTimerMinuteLength) timerMinuteLength = Number(sTimerMinuteLength);

    let sTimerSecondLength = localStorage.getItem("timersecondlength");
    if (sTimerSecondLength) timerSecondLength = Number(sTimerSecondLength);

    let sButtonClick = localStorage.getItem("buttonclick");
    if (sButtonClick) buttonClick = sButtonClick === "true";

    let sMuted = localStorage.getItem("muted");
    if (sMuted) muted = sMuted === "true";

    let sVolume = localStorage.getItem("volume");
    if (sVolume) masterVolume = Number(sVolume);
}

function saveOptions() {
    localStorage.setItem("mode", mode);
    localStorage.setItem("pomodoroworklength", workLength);
    localStorage.setItem("pomodororestlength", restLength);
    localStorage.setItem("timerminutelength", timerMinuteLength);
    localStorage.setItem("timersecondlength", timerSecondLength);
    localStorage.setItem("buttonclick", buttonClick);
    localStorage.setItem("muted", muted);
    localStorage.setItem("volume", masterVolume);
}

