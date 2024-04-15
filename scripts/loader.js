const queryString = decodeURIComponent(window.location.search);
// Get save from link
const urlParams = new URLSearchParams(queryString);
const save = urlParams.get('save')

localStorage.clear(); // Deleting current save
localStorage.setItem("save", save); // Saving new data

window.location.pathname = "/"