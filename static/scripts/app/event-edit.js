// This is to make the edit button on the event functional
function startEditEventListeners() {

    
    Array.from(document.getElementsByClassName("event-outer-box")).forEach(element => {

        // for every element, if the settings button has been clicked, change everythin to edit mode
        element.querySelector(".event_title__settings-icon").addEventListener("click", function() {
            console.log("Settings icon clicked!")
            // remove edit mode from all other event-outer-boxes
            document.querySelectorAll('.event-outer-box').forEach(box => {
                box.querySelector(".event").classList.remove('event--in-edit-mode');
                box.querySelector(".edit-box").classList.remove('edit-box--in-edit-mode');
            });
            // add edit mode to the current one
            element.querySelector(".event").classList.add('event--in-edit-mode');
            element.querySelector(".edit-box").classList.add('edit-box--in-edit-mode');
        });


        // for every element, if the cancel button has been clicked, change everything to not edit mode 
        element.querySelector(".edit-box__cancel-box").addEventListener("click", function() {
            element.querySelector(".edit-box").classList.remove('edit-box--in-edit-mode');
            element.querySelector(".event").classList.remove('event--in-edit-mode');
        });
    });

}


window.startEditEventListeners = startEditEventListeners;


// document.addEventListener('DOMContentLoaded', function() {
//     Array.from(document.getElementsByClassName("event-outer-box")).forEach(element => {

//         // Use class selectors for date input/display
//         const dateInput = element.querySelector('.event-date-input');

//         // set day to today
//         dateInput.valueAsDate = new Date();

//     });
// });





















// OLDDDDDDDDDDDDD
// document.addEventListener('DOMContentLoaded', function() {
//     Array.from(document.getElementsByClassName("event-outer-box")).forEach(element => {

//         // for every element, if the settings button has been clicked, change everythin to edit mode
//         element.querySelector(".event_title__settings-icon").addEventListener("click", function() {
//             // remove edit mode from all other event-outer-boxes
//             document.querySelectorAll('.event-outer-box').forEach(box => {
//                 box.querySelector(".event").classList.remove('event--in-edit-mode');
//                 box.querySelector(".edit-box").classList.remove('edit-box--in-edit-mode');
//             });
//             // add edit mode to the current one
//             element.querySelector(".event").classList.add('event--in-edit-mode');
//             element.querySelector(".edit-box").classList.add('edit-box--in-edit-mode');
//         });


//         // for every element, if the cancel button has been clicked, change everything to not edit mode 
//         element.querySelector(".edit-box__cancel-box").addEventListener("click", function() {
//             element.querySelector(".edit-box").classList.remove('edit-box--in-edit-mode');
//             element.querySelector(".event").classList.remove('event--in-edit-mode');
//         });
//     });
// });
