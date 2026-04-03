function welcome_start() {
    // set welcome button to active state by adding pseudo class
    // document.getElementById("welcome-button").classList.add("active");
    document.getElementById("welcome-button").classList.add("p-active");
    
    // set mouse cursor to loading
    document.body.style.cursor = "wait";

    setTimeout(() => {
        
        // document.getElementById("welcome").classList.add("inactive");
        document.getElementById("upload").classList.remove("hidden");
        document.getElementById("welcome-button").classList.remove("p-active");
        document.body.style.cursor = "default";
    }, 400);
}

function displayTodo() {
    document.getElementById("todoWindow").classList.remove("hidden");
}

function reset() {
    document.getElementById("upload").classList.add("hidden");
    document.getElementById("uploadProgress").classList.add("hidden");
    document.getElementById("imagePreviewWindow").classList.add("hidden");
    document.getElementById("filmSelectWindow").classList.add("hidden");
    document.getElementById("filmstripPreviewWindow").classList.add("hidden");
    document.getElementById("contactSheetWindow").classList.add("hidden");
    document.getElementById("todoWindow").classList.add("hidden");
}

function showFilmSelect() {
    document.getElementById("imagePreviewWindow").classList.add("hidden");
    document.getElementById("filmSelectWindow").classList.remove("hidden");
}

function hideFilmSelect() {
    document.getElementById("filmSelectWindow").classList.add("hidden");
}

function startLoad() {
    document.getElementById("uploadProgress").classList.remove("hidden");
}

function finishLoad() {
    document.getElementById("uploadProgress").classList.add("hidden");
    document.getElementById("upload").classList.add("hidden");
    document.getElementById("imagePreviewWindow").classList.remove("hidden");
}

function showFilmstrip() {
    previewDraw();
    document.getElementById("filmstripPreviewWindow").classList.remove("hidden");
}

function hideFilmstrip() {
    document.getElementById("filmstripPreviewWindow").classList.add("hidden");
}

function showContactSheet() {
    document.getElementById("contactSheetWindow").classList.remove("hidden");
}

function hideContactSheet() {
    document.getElementById("contactSheetWindow").classList.add("hidden");
}

function selectFilmStock(select_id) {
    let buttons = document.getElementsByClassName("filmstock");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    document.getElementById(select_id).classList.add("active");
    const is120 = FILM[select_id] && FILM[select_id].format === '120';
    document.getElementById('film120Options').classList.toggle('hidden', !is120);
}

// MARK: js check if document is ready
function onReady() {
    addUploaderEventListener();
    populateFilmStocks();
}

if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');
    onReady();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        onReady();
    });
}

// MARK: interact.js
const ids = [
    "welcome", "upload", "uploadProgress", "imagePreviewWindow", 
    "filmstripPreviewWindow", "contactSheetWindow", "todoWindow", "filmSelectWindow",
    "errorDialog"
];

let window_positions = {};
function setup_interactive_window(id) {
    window_positions[id] = {x: 0, y: 0}
    interact(`#${id}`).draggable({
        listeners: {
            move (event) {
                window_positions[id].x += event.dx
                window_positions[id].y += event.dy
                event.target.style.transform =
                    `translate(${window_positions[id].x}px, ${window_positions[id].y}px)`
                },
        },
        cursorChecker () { return null },
        ignoreFrom: '.window-body'
    })
}

// run when document is ready
document.addEventListener('DOMContentLoaded', function () {
    ids.forEach(id => {
        setup_interactive_window(id);
    });
});

// MARK: error dialog
function displayErrorDialog(title, message) {
    let dialog = document.getElementById("errorDialog");
    let titleElement = dialog.querySelector(".title-bar-text");
    let messageElement = dialog.querySelector("p.error-message");
    
    // Use the title and message elements as needed
    titleElement.textContent = title;
    messageElement.textContent = message;

    // Show the dialog
    dialog.classList.remove("hidden");
}

function dismissErrorDialog() {
    let dialog = document.getElementById("errorDialog");
    dialog.classList.add("hidden");
}