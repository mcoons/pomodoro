// click
var sound_click = new Howl({src: ['./sounds/click.wav']});
function soundClick(){sound_click.volume(.15); sound_click.play()}

// beep beep
var sound_alarm1 = new Howl({src: ['./sounds/alarm1.wav'], loop: true});
function soundAlarm1(){sound_alarm1.volume(.15); return sound_alarm1.play()}

// chimes
var sound_alarm2 = new Howl({src: ['./sounds/alarm2.wav'], loop: true});
function soundAlarm2(){sound_alarm2.volume(.15); return sound_alarm2.play()}

// zingle
var sound_alarm3 = new Howl({src: ['./sounds/alarm3.wav'], loop: true});
function soundAlarm3(){sound_alarm3.volume(.15); return sound_alarm3.play()}

// triple bleep
var sound_alarm4 = new Howl({src: ['./sounds/alarm4.wav'], loop: true});
function soundAlarm4(){sound_alarm4.volume(.15); return sound_alarm4.play()}
