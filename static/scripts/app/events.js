// this adds functionality ot the expand/close bit

document.addEventListener('DOMContentLoaded', function() {
    Array.from(document.getElementsByClassName("event-outer-box")).forEach(element => {
        element.querySelector(".expandable-content__expand-collapse-container").addEventListener("click", function() {

            // already  closed?
            if (element.querySelector(".expandable-content__content_container").style.display == 'none') { 
                element.querySelector(".expandable-content__content_container").style.display = ''; // open wiiide!
                element.querySelector(".typography__body--clickable").textContent = "Close" // make me show "closed"
                element.querySelector(".expandable-content__expand-collapse-container__text-container__arrow-icon").style.rotate = ""; // remove the rotation of the icon
                
            // open?
            } else {
                element.querySelector(".expandable-content__content_container").style.display = 'none'; // close it up
                element.querySelector(".typography__body--clickable").textContent = "Expand" // show expand
                element.querySelector(".expandable-content__expand-collapse-container__text-container__arrow-icon").style.rotate = "180deg"; // rotate the arrow
            }    
        });
    });
});