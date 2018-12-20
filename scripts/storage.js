// JSON USAGE
// localStorage.setItem(s, JSON.stringify(data))
// data = JSON.parse(localStorage.getItem(s))

function loadOptions() {
    let sWorkLength = localStorage.getItem("worklength");
    if (sWorkLength) workLength = Number(sWorkLength);

    let sRestLength = localStorage.getItem("restlength");
    if (sRestLength) restLength = Number(sRestLength);

    let sButtonClick = localStorage.getItem("buttonclick");
    // if (sButtonClick) buttonClick = sButtonClick === 'true' ? true : false;
    if (sButtonClick) buttonClick = sButtonClick === 'true';

    let sMuted = localStorage.getItem("muted");
    // if (sMuted) muted = sMuted === 'true' ? true : false;
    if (sMuted) muted = sMuted === 'true';

    let sVolume = localStorage.getItem("volume");
    if (sVolume) masterVolume = Number(sVolume);
}

function saveOptions() {
    localStorage.setItem("worklength", workLength);
    localStorage.setItem("restlength", restLength);
    localStorage.setItem("buttonclick", buttonClick);
    localStorage.setItem("muted", muted);
    localStorage.setItem("volume", masterVolume);
}
