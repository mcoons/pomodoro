// Log work and break times to local storage
// Times based off of "Start Working", "Start Breaking" and "Clear buttons"

class Log{
    constructor(){
        this.logArray = [];
    }

    add(logObj){
        this.logArray.push(logObj);
    }

    list(){
        console.log(this.logArray);
    }

    load(){
        let sLog = localStorage.getItem("log");
        if (sLog) this.logArray = JSON.parse(sLog);
    }

    save(){
        localStorage.setItem("log", JSON.stringify(this.logArray));
    }

    last(){
        return Object.keys(this.logArray[this.logArray.length-1])[0];
    }
}
