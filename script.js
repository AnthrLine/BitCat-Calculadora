// KEYBOARD RELATED VARIABLES

const rkeyboard = document.getElementsByClassName("presetscorebutton");
const lkeyboard = document.getElementsByClassName("presetscorebuttonop");

let ractive = true;
let lactive = true;

// BANNER RELATED VARIABLES

const pointsdifferencelabel = document.getElementById('pointsdifferencelabel');

const rtotallabel = document.getElementById("rtotallabel");
const ltotallabel = document.getElementById("ltotallabel");


let pointsdifference = 0;

let rtotal = 0;
let ltotal = 0;


// OTHER vARIABLES


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
    }
}

function lclick(key){
    if (lactive){
        ltotal += key;
        
        deactivate(lkeyboard);
        updatescreen();
    }
}

// END OF CLICK DETECTING FUNCTIONS



// START OF SCREEN MODIFYING FUNCTIONS

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

        pointsdifferencelabel.innerHTML = pointsdifference; // Edits points difference

        activate(rkeyboard); // Activates keyboards back
        activate(lkeyboard);
    }

}

// END OF SCREEN MODIFYING FUNCTIONS

updatescreen();