// Init vars so they remain global
let element_hamburgerButton;
let element_headerInnerBox;
let element_header;
let element_headerLinkContainer;


// Create vars that represent elements when page has loaded (DOMContentLoad)
document.addEventListener('DOMContentLoaded', function() {
    element_hamburgerButton = document.getElementById('hamburger-button'); // Assuming you have a button with this ID
    element_headerInnerBox = document.getElementById('header__inner-box');
    element_header = document.getElementById('header');
    element_headerLinkContainer = document.getElementById('header__link-container');
    
    if (element_hamburgerButton) {
        element_hamburgerButton.addEventListener('click', toggleTitlebarState);
    }
});

// Delay func
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Titlebar and elements inside are toggled based on open/close
async function toggleTitlebarState() {
    // Header is opened, adding/removing the open tag based on whether its opened or not
    if (element_header) {
        element_header.classList.toggle('header--open');
    }
    if (element_headerInnerBox) {
        element_headerInnerBox.classList.toggle('header__inner-box--open');
    }
    const isOpen = element_header && element_header.classList.contains('header--open');
    
    // Calc the height to set the header
    let heightToSet = 50 + document.getElementsByClassName("header__link").length * 68;
    

    // If its open then change the header height to that otherwise make it smaller
    if (element_header) {
        if (isOpen) {
            element_header.style.height = heightToSet.toString() + "px";
        } else {
            element_header.style.height = "50px";
        }
    }

    // hamburger icon changes to an x when opened
    const hamburgerIcon = document.getElementById("hamburger-icon");
    if (hamburgerIcon) {
        if (isOpen) {
            hamburgerIcon.src = "./static/images/icons/cross.svg"
        } else {
            hamburgerIcon.src = "./static/images/icons/hamburger.svg";

        }
    }
}

// N.A. (2018) How do i click outside an element? https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element 
// Close header when clicking outside
document.addEventListener('click', function(event) {
    const isOpen = element_header && element_header.classList.contains('header--open');
    
    if (isOpen && element_header && !element_header.contains(event.target)) {
        toggleTitlebarState();
    }
});


function startTitlebar () {
    const newProjectButton = document.querySelector('.header__new-project-button')

    newProjectButton.addEventListener('click', () => {
        window.handleAddProject();
        console.log("new proj butt(on) slapped");
    })
}

window.startTitlebar = startTitlebar