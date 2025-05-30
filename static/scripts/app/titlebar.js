let element_hamburgerButton;
let element_headerInnerBox;
let element_header;
let element_headerLinkContainer;

document.addEventListener('DOMContentLoaded', function() {
    element_hamburgerButton = document.getElementById('hamburger-button'); // Assuming you have a button with this ID
    element_headerInnerBox = document.getElementById('header__inner-box');
    element_header = document.getElementById('header');
    element_headerLinkContainer = document.getElementById('header__link-container');
    
    if (element_hamburgerButton) {
        element_hamburgerButton.addEventListener('click', toggleTitlebarState);
    }
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function toggleTitlebarState() {
    if (element_header) {
        element_header.classList.toggle('header--open');
    }
    if (element_headerInnerBox) {
        element_headerInnerBox.classList.toggle('header__inner-box--open');
    }

    const isOpen = element_header && element_header.classList.contains('header--open');
    
    let heightToSet = 50 + document.getElementsByClassName("header__link").length * 68;
    
    if (element_header) {
        if (isOpen) {
            element_header.style.height = heightToSet.toString() + "px";
        } else {
            element_header.style.height = "50px";
        }
    }

    
    const hamburgerIcon = document.getElementById("hamburger-icon");
    if (hamburgerIcon) {
        hamburgerIcon.src = isOpen ? "./static/images/icons/cross.svg" : "./static/images/icons/hamburger.svg";
    }
    
    if (!element_headerLinkContainer) return;

    const currentOpacity = element_headerLinkContainer.style.opacity || "0";
    
    if (parseFloat(currentOpacity) < 1 && isOpen) {
        for (let linkElement of document.getElementsByClassName("header__link")) {
            linkElement.style.opacity = "0";
        }
        element_headerLinkContainer.style.opacity = "1";
        for (let linkElement of document.getElementsByClassName("header__link")) {
            linkElement.style.opacity = "1";
            await delay(50);
        }
    } else {
        element_headerLinkContainer.style.opacity = "0";
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