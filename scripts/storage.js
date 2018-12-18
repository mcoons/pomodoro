// Save options to local storage
// Save logging to local storage

function loadOptions(){
    // data = JSON.parse(localStorage.getItem(s))
    let sWorkLength = localStorage.getItem("worklength");
    if (sWorkLength) workLength = Number(sWorkLength);    
    
    let sRestLength = localStorage.getItem("restlength");
    if (sRestLength) restLength = Number(sRestLength);

    let sButtonClick = localStorage.getItem("buttonclick");
    if (sButtonClick) buttonClick = sButtonClick === 'true' ? true : false;

    let sMuted = localStorage.getItem("muted");
    if (sMuted) muted = sMuted === 'true' ? true : false;

    let sVolume = localStorage.getItem("volume");
    if (sVolume) masterVolume = Number(sVolume);
}

function saveOptions(){
    // localStorage.setItem(s, JSON.stringify(data))
    localStorage.setItem("worklength", workLength);
    localStorage.setItem("restlength", restLength);
    localStorage.setItem("buttonclick", buttonClick);
    localStorage.setItem("muted", muted);
    localStorage.setItem("volume", masterVolume);
}