// using howler.js

var alarm1 = alarm2 = alarm3 = alarm4 = null;

// click
var sound_click = new Howl({ src: ['sounds/click.wav'] });
function soundClick() {
    sound_click.volume(masterVolume); sound_click.play()
}

// beep beep
var sound_alarm1 = new Howl({ src: ['sounds/alarm1.wav'], loop: true });
function soundAlarm1() {
    sound_alarm1.volume(masterVolume); return sound_alarm1.play()
}

// chimes
var sound_alarm2 = new Howl({ src: ['sounds/alarm2.wav'], loop: true });
function soundAlarm2() {
    sound_alarm2.volume(masterVolume); return sound_alarm2.play()
}

// zingle
var sound_alarm3 = new Howl({ src: ['sounds/alarm3.wav'], loop: true });
function soundAlarm3() {
    sound_alarm3.volume(masterVolume); return sound_alarm3.play()
}

// triple bleep
var sound_alarm4 = new Howl({ src: ['sounds/alarm4.wav'], loop: true });
function soundAlarm4() {
    sound_alarm4.volume(masterVolume); return sound_alarm4.play()
}

function stopSounds() {
    if (alarm1) { sound_alarm1.stop(); alarm1 = null; }
    if (alarm2) { sound_alarm2.stop(); alarm2 = null; }
    if (alarm3) { sound_alarm3.stop(); alarm3 = null; }
    if (alarm4) { sound_alarm4.stop(); alarm4 = null; }
}

// function toggleAlarm1(){
//     if (alarm1) {sound_alarm1.stop(); alarm1 = null;} else alarm1 = soundAlarm1();
// }

// function toggleAlarm2(){
//     if (alarm2) {sound_alarm2.stop(); alarm2 = null;} else alarm2 = soundAlarm2();
// }

// function toggleAlarm3(){
//     if (alarm3) {sound_alarm3.stop(); alarm3 = null;} else alarm3 = soundAlarm3();
// }

// function toggleAlarm4(){
//     if (alarm4) {sound_alarm4.stop(); alarm4 = null;} else alarm4 = soundAlarm4();
// }
