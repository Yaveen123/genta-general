// This is to make the edit button on the event functional
document.addEventListener('DOMContentLoaded', function() {
    Array.from(document.getElementsByClassName("event-outer-box")).forEach(element => {

        // for every element, if the settings button has been clicked, change everythin to edit mode
        element.querySelector(".event_title__settings-icon").addEventListener("click", function() {
            element.querySelector(".event").classList.add('event--in-edit-mode');
            element.querySelector(".edit-box").classList.add('edit-box--in-edit-mode');
        });

        // for every element, if the cancel button has been clicked, change everything to not edit mode 
        element.querySelector(".edit-box__cancel-box").addEventListener("click", function() {
            element.querySelector(".edit-box").classList.remove('edit-box--in-edit-mode');
            element.querySelector(".event").classList.remove('event--in-edit-mode');
        });
    });
});



document.addEventListener('DOMContentLoaded', function() {
    Array.from(document.getElementsByClassName("event-outer-box")).forEach(element => {

        // Use class selectors for date input/display
        const dateInput = element.querySelector('.event-date-input');

        // set day to today
        dateInput.valueAsDate = new Date();

    });
});