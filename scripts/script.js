// KEYBOARD RELATED VARIABLES

const rkeyboard = document.getElementsByClassName("presetscorebutton");
const lkeyboard = document.getElementsByClassName("presetscorebuttonop");

let ractive = true;
let lactive = true;

// MATH VARIABLES

let currentthrow = -1;
let totalthrows = 36;

let relativethrows = 1;

let calcmeans = true;

let pastdiff;

let pastrtotal;
let pastltotal;

let pastrmean;
let pastlmean;

let currentround;
let currentplayer;
let currentplayerthrow;
let throwsperround;

// BANNER RELATED VARIABLES

const pointsdifferencelabel = document.getElementById('pointsdifferencelabel');
const totalpointsdifferencelabel = document.getElementById('totalpointsdifferencelabel');
const pointsdifferencecolor = document.getElementById('color')
const totalpointsdifferencecolor = document.getElementById('totalcolor')

const rtotallabel = document.getElementById("rtotallabel");
const ltotallabel = document.getElementById("ltotallabel");

const rmeanlabel = document.getElementById("rmeanlabel");
const lmeanlabel = document.getElementById("lmeanlabel");


let pointsdifference = 0;
let totalpointsdifference = 0;

let rtotal = 0;
let ltotal = 0;

let rmean = 0;
let lmean = 0;

// GRAPH VARIABLES
const ctx = document.getElementById('diffchart').getContext('2d');

let historicdiffs = [];
let historicrmeans = [];
let historiclmeans = [];

// DATA SAVING VARIABLES

let saveJSON = {
    rtotal: 0,
    ltotal: 0,
    pointsdifference: 0,
    historicdiffs: [],
    currentthrow: 0,
    rmean: 0,
    lmean: 0,
    historicrmeans: [],
    historiclmeans: []
}

// SHARING VARIABLES
let host = "";
let linktoshorten = "";
let shortenedurl = "";

// INSTALLER VARIABLES
let installprompt = null;
const installbutton = document.getElementById("installbutton");

// SETTINGS VARIABLES
const settingsscreen = document.getElementById("settingsscreen");

const playersinput = document.getElementById("players");
const roundsinput = document.getElementById("rounds");

const undobutton = document.getElementById("undobutton");

let players = 4;
let rounds = 3;

let labels = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

// INFOTABLE VARIABLES
const currentthrowlabel = document.getElementById("currentthrowlabel")

// START OF STATE CONTROL FUNCTIONS

// This functions disables the buttons and applies a spcial style
function deactivate(keyboard){
    for (var i=0; i < keyboard.length; i++) { // Loop trough every item and add the deactivated id
        keyboard[i].setAttribute("id", "deactivated");
    }

    if (keyboard === rkeyboard){ractive = false;} // Define that a keybord has been disabled
    else{lactive = false;}

}

// This functions enables the buttons and removes the spcial style
function activate(keyboard){
    for (var i=0; i < keyboard.length; i++) { // Loop trough every item and remove the deactivated id
        keyboard[i].removeAttribute("id", "deactivated");
    }

    if (keyboard === rkeyboard){ractive = true;} // Define that a keybord has been enabled
    else{lactive = true;}
}

// END OF STATE CONTROL FUNCTIONS

// START OF CLICK DETECTING FUNCTIONS

function rclick(key){
    if (ractive){
        pastrtotal = rtotal;
        rtotal += key;

        deactivate(rkeyboard);
        updatescreen(true);
        savestate();
    }
}

function lclick(key){
    if (lactive){
        pastltotal = ltotal;
        ltotal += key;
        
        deactivate(lkeyboard);
        updatescreen(true);
        savestate();
    }
}

// END OF CLICK DETECTING FUNCTIONS



// START OF DATA MODIFYING FUNCTIONS

function updatescreen(calcmeans){
    pastdiff = pointsdifference;
    rtotallabel.innerHTML = rtotal; // Update the content of the label to match the new score
    ltotallabel.innerHTML = ltotal; // Update the content of the label to match the new score

    // The next if statement checks if the full turn has been
    // entered, if it has, calculates the difference and
    // displays it, it also enables both keyboards.

    // When reached this point, ractive and lactive can only be the
    // same if both are deactivated.
    if (ractive === lactive){ 
        if (calcmeans === true){
            pastrmean = rmean;
            pastlmean = lmean;

            undobutton.classList.remove("hidden");

            currentthrow++ // A full throw has been completed, add number to the current throw
            updatecurrentthrow(); // Update the current throw text

            relativethrows = currentthrow/totalthrows; // Calc the relative throws

            // Calculate the means
            rmean = (rtotal/relativethrows).toFixed(2);
            lmean = (ltotal/relativethrows).toFixed(2);

            // If is the start of the match set the means to 0
            if (String(rmean) == "NaN") {
                rmean = 0;
                lmean = 0;
            }
            historicrmeans.push(rmean/10);
            historiclmeans.push(lmean/10);
        }
        rmeanlabel.innerHTML = rmean; // Update the content of the label to match the new mean
        lmeanlabel.innerHTML = lmean; // Update the content of the label to match the new mean

        pointsdifference = rtotal - ltotal; // Calculates points difference
        totalpointsdifference = "(" + (rmean - lmean).toFixed(2) + ")";

        historicdiffs.push(Number(pointsdifference)); // Adds the difference to the historic

        diffchart.update(); // Updates the chart with the new data

        pointsdifferencelabel.innerHTML = pointsdifference; // Edits points difference
        totalpointsdifferencelabel.innerHTML = totalpointsdifference;


        activate(rkeyboard); // Activates keyboards back
        activate(lkeyboard);

        updatecolor();
    }

    diffchart.update();

}

function updatecolor(){ // This function changes the color of the difference banner
    if (pointsdifference > 0){ // Diff is greater than 0
        pointsdifferencecolor.removeAttribute("class", "negative");
        pointsdifferencecolor.setAttribute("class", "positive");

        totalpointsdifferencecolor.removeAttribute("class", "negative");
        totalpointsdifferencecolor.setAttribute("class", "positive");
    }
    else if (pointsdifference < 0){ // Diff is smaller than 0
        pointsdifferencecolor.removeAttribute("class", "positive");
        pointsdifferencecolor.setAttribute("class", "negative");

        totalpointsdifferencecolor.removeAttribute("class", "positive");
        totalpointsdifferencecolor.setAttribute("class", "negative");
    }
    else{ // Diff is 0
        pointsdifferencecolor.removeAttribute("class", "positive");
        pointsdifferencecolor.removeAttribute("class", "negative");

        totalpointsdifferencecolor.removeAttribute("class", "positive");
        totalpointsdifferencecolor.removeAttribute("class", "negative");
    }
}

// END OF DATA MODIFYING FUNCTIONS


// START OF CHART CONTROL

const diffchart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Diferència',
            data: historicdiffs,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 3,
            fill: true
        },
        {
            label: 'Mitjana (·10^-1)',
            data: historicrmeans,
            borderColor: 'rgb(0, 255, 255)',
            borderWidth: 1,
            fill: false
        },
        {
            label: 'Mitjana op. (·10^-1)',
            data: historiclmeans,
            borderColor: 'rgb(95, 158, 160)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        animation: false, // Deactivate animation
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: false
    }
});

// END OF CHART CONTROL

// START OF LOCALSTORAGE CONTROL FUNCTIONS

function checksave(){ // Check if there is a save, if there is, the function applies it.
    storedcontents = localStorage.getItem("save");

    if (storedcontents != null){

        storedcontents = JSON.parse(storedcontents); // Converting the JSON to an object

        // Set variables with previous values
        pointsdifference = storedcontents.pointsdifference;
        rtotal = storedcontents.rtotal;
        ltotal = storedcontents.ltotal;
        currentthrow = storedcontents.currentthrow;
        rmean = storedcontents.rmean;
        lmean = storedcontents.lmean;

        for (let i = 0; i < storedcontents.historicdiffs.length - 1; i++) {
            historicdiffs.push(storedcontents.historicdiffs[i]);
        }

        for (let i = 0; i < storedcontents.historicrmeans.length; i++) {
            historicrmeans.push(storedcontents.historicrmeans[i]);
        }

        for (let i = 0; i < storedcontents.historiclmeans.length; i++) {
            historiclmeans.push(storedcontents.historiclmeans[i]);
        }

        updatescreen(false); // Updates the screen with the new data
        updatecurrentthrow();

    }
    else{
        updatescreen(true);
    }
}

function savestate(){

    // Saving all the data to an object
    saveJSON.rtotal = rtotal;
    saveJSON.ltotal = ltotal;
    saveJSON.pointsdifference = pointsdifference;
    saveJSON.historicdiffs = historicdiffs;
    saveJSON.currentthrow = currentthrow;
    saveJSON.rmean = rmean;
    saveJSON.lmean = lmean;
    saveJSON.historicrmeans = historicrmeans;
    saveJSON.historiclmeans = historiclmeans;

    localStorage.setItem("save", JSON.stringify(saveJSON)); // Converting the object to a JSON and saving to localstorage

}

function erasecontents(){
    localStorage.clear();

    location.reload();
}

// END OF LOCALSTORAGE CONTROL FUNCTIONS

// START OF SHARING CONTOL FUNCTION

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sharelink(){
    host = window.location.hostname;

    if (host === undefined) {
        alert("El vostre host és undefined, utilitzaré punts.anthr.net");
        host = "punts.anthr.net";
    }

    linktoshorten = encodeURI(host + "/loading.html" + "?save=" + encodeURIComponent(JSON.stringify(saveJSON)));

    shortenurl().then(text => shortenedurl = text);

    let n = 0

    while (shortenedurl == "" && n < 20){
        await sleep(50);
        n++
    }
    if (n === 20){
        prompt("Copia el següent enllaç:", linktoshorten);
    }
    else{
        prompt("Copia el següent enllaç:", shortenedurl);
    }
}

async function shortenurl() {
    url = "https://tinyurl.com/api-create.php?url=" + linktoshorten;
    let response = await fetch(url);
    let shortenedurl = await response.text();

    return(shortenedurl);
}

// END OF SHARING CONTOL FUNCTION

// START OF INSTALLER CONTROLLER

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installprompt = event;
  installbutton.classList.remove("hidden");
});

installbutton.addEventListener("click", async () => {
    if (!installprompt) {
      return;
    }
    const result = await installprompt.prompt();
    disableinstallprompt();
  });
  
  window.addEventListener("appinstalled", () => {
    disableinstallprompt();
  });

  function disableinstallprompt() {
    installprompt = null;
    installbutton.classList.add("hidden");
  }

// END OF INSTALLER CONTROLLER

// START OF SETTINGS FUNCTIONS

function opensettings(){
    settingsscreen.classList.remove("hidden");
}

function updatesettings(){
    settingsscreen.classList.add("hidden");

    players = playersinput.value;
    rounds = roundsinput.value;

    totalthrows = players*rounds*3;

    labels = [''];

    for (let i=0; i<totalthrows; i++){
        labels.push('');
    }

    diffchart.data.labels = labels;
    diffchart.update();
}

// END OF SETTINGS FUNCTIONS

// START OF UNDO FUNCTIONS

function undo(){
    currentthrow--;
    historicdiffs.splice(-1,1);

    historicrmeans.splice(-1,1);
    historiclmeans.splice(-1,1);

    pointsdifference = pastdiff;

    rtotal = pastrtotal;
    ltotal = pastltotal;

    rmean = pastrmean;
    lmean = pastlmean;

    rmeanlabel.innerHTML = rmean; // Update the content of the label to match the past mean
    lmeanlabel.innerHTML = lmean; // Update the content of the label to match the past mean

    pointsdifferencelabel.innerHTML = pointsdifference;

    rtotallabel.innerHTML = rtotal;
    ltotallabel.innerHTML = ltotal;

    undobutton.classList.add("hidden");

    diffchart.update();
}

// END OF UNDO FUNCTIONS

// START OF CURRENTTHROW FUNCTIONS

function updatecurrentthrow(){
    throwsperround = 3 * players;
    currentround = Math.trunc(currentthrow/throwsperround + 1)

    currentplayerthrow = currentthrow % 3 + 1;

    currentplayer = Math.floor(currentthrow / 3) % players + 1;

    currentthrowlabel.innerHTML = `J:${currentplayer} T:${currentplayerthrow} R:${currentround} (${currentthrow + 1})`;
}

// END OF CURRENTTHROW FUNCTIONS

diffchart.update();
checksave();

undobutton.classList.add("hidden");
