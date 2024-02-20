// KEYBOARD RELATED VARIABLES

const rkeyboard = document.getElementsByClassName("presetscorebutton");
const lkeyboard = document.getElementsByClassName("presetscorebuttonop");

let ractive = true;
let lactive = true;

// BANNER RELATED VARIABLES

const pointsdifferencelabel = document.getElementById('pointsdifferencelabel');
const pointsdifferencecolor = document.getElementById('color')

const rtotallabel = document.getElementById("rtotallabel");
const ltotallabel = document.getElementById("ltotallabel");


let pointsdifference = 0;

let rtotal = 0;
let ltotal = 0;

// GRAPH VARIABLES
const ctx = document.getElementById('diffchart').getContext('2d');

let historicdiffs = [];

// DATA SAVING VARIABLES

let saveJSON = {
    rtotal: 0,
    ltotal: 0,
    pointsdifference: 0,
    historicdiffs: []
}

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
        rtotal += key;

        deactivate(rkeyboard);
        updatescreen();
        savestate();
    }
}

function lclick(key){
    if (lactive){
        ltotal += key;
        
        deactivate(lkeyboard);
        updatescreen();
        savestate();
    }
}

// END OF CLICK DETECTING FUNCTIONS



// START OF DATA MODIFYING FUNCTIONS

function updatescreen(){
    rtotallabel.innerHTML = rtotal; // Update the content of the label to match the new score
    ltotallabel.innerHTML = ltotal; // Update the content of the label to match the new score

    // The next if statement checks if the full turn has been
    // entered, if it has, calculates the difference and
    // displays it, it also enables both keyboards.

    // When reached this point, ractive and lactive can only be the
    // same if both are deactivated.
    if (ractive === lactive){ 
        pointsdifference = rtotal - ltotal; // Calculates points difference

        historicdiffs.push(Number(pointsdifference)); // Adds the difference to the historic


        diffchart.update(); // Updates the chart with the new data

        pointsdifferencelabel.innerHTML = pointsdifference; // Edits points difference

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
    }
    else if (pointsdifference < 0){ // Diff is smaller than 0
        pointsdifferencecolor.removeAttribute("class", "positive");
        pointsdifferencecolor.setAttribute("class", "negative");
    }
    else{ // Diff is 0
        pointsdifferencecolor.removeAttribute("class", "positive");
        pointsdifferencecolor.removeAttribute("class", "negative");
    }
}

// END OF DATA MODIFYING FUNCTIONS


// START OF CHART CONTROL

const diffchart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        datasets: [{
            label: 'Tirades',
            data: historicdiffs,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: true
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

        for (let i = 0; i < storedcontents.historicdiffs.length - 1; i++) {
            historicdiffs.push(storedcontents.historicdiffs[i]);
        }

        updatescreen(); // Updates the screen with the new data

    }
    else{
        updatescreen();
    }
}

function savestate(){

    // Saving all the data to an object
    saveJSON.rtotal = rtotal;
    saveJSON.ltotal = ltotal;
    saveJSON.pointsdifference = pointsdifference;
    saveJSON.historicdiffs = historicdiffs;

    localStorage.setItem("save", JSON.stringify(saveJSON)); // Converting the object to a JSON and saving to localstorage

}

function erasecontents(){
    localStorage.clear();

    location.reload();
}

// END OF LOCALSTORAGE CONTROL FUNCTIONS

diffchart.update();
checksave();