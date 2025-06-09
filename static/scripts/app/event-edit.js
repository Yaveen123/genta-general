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

            // put the inputs from current display into text input
            const titleInputForEdit = element.querySelector(".event-title-input");
            const currentTitleDisplay = element.querySelector('.event__title-date-container__text');
            if (currentTitleDisplay) {
                titleInputForEdit.value = currentTitleDisplay.textContent.trim();
            } else {
                titleInputForEdit.value = ""; 
            }
            
            // time for the date
            const dateInput = element.querySelector(".event-date-input")
            try {
                if (element.querySelector('.date-chip .typography__code').textContent.trim() !== "No date") {
                    try {
                        dateInput.value = element.querySelector('.date-chip .typography__code').textContent.trim()
                    } catch (e) {
                        console.error(e);
                        dateInput.value = '';
                    }
                } else {
                    dateInput.value = ''
                }
            } catch (e) {
                dateInput.value = ''
                console.log(e)
            }
            
        });


        // for every element, if the cancel button has been clicked, change everything to not edit mode 
        element.querySelector(".edit-box__cancel-box").addEventListener("click", function() {
            element.querySelector(".edit-box").classList.remove('edit-box--in-edit-mode');
            element.querySelector(".event").classList.remove('event--in-edit-mode');
        });


        // the save button
        if (element.classList.contains('add-event-card')) {
            const saveNewEventButton = element.querySelector('.save-new-event-button');
            if (saveNewEventButton) {
                // add an attr that highlights if event listener is active
                if (!saveNewEventButton.hasAttribute('data-save-listener-attached')) {
                    saveNewEventButton.setAttribute('data-save-listener-attached', 'true'); // mark as attached
                    saveNewEventButton.addEventListener('click', function() {
                        if (!window.activeProjectData) {
                            return;
                        }

                        const newEventData = {
                            __tempId: window.generateID(),
                            title: element.querySelector(".event-title-input").value.trim() || "Untitled event",
                            dueDate: element.querySelector(".event-date-input").value.trim() || "2025-01-01",
                            projectCard: false,
                            collapsed: true,
                            todo: [],
                            notes: ""
                        };

                        const newCardDOM = window.createEventCardDOM(window.activeProjectData, newEventData);
                        element.insertAdjacentElement('afterend', newCardDOM);
                        
                        element.querySelector(".event-title-input").value = '';
                        element.querySelector(".event-date-input").value = '';

                        element.querySelector(".edit-box").classList.remove('edit-box--in-edit-mode');
                        element.querySelector(".event").classList.remove('event--in-edit-mode');

                        window.markDataHasChanged();
                        console.log(newEventData);

                        window.startTodoEventListeners();
                        window.startEventEventListeners();
                        window.startEditEventListeners();
                        window.startTextAreaEventListeners();
                    });
                }
            }
        } else {
            try {
                let saveButton = element.querySelector('.save-project')
                saveButton.addEventListener("click", function () {
                    // console.log("clicked!")
                    

                    const titleInput = element.querySelector(".event-title-input");
                    const dateInput = element.querySelector(".event-date-input");
                    const projectId = element.dataset.projectId;

                    // console.log(element)
                    let newTitle;
                    // if it is a proj card 
                    if (element.dataset.projectCard) {
                        newTitle = titleInput.value.trim() || titleInput.placeholder || "Untitled project"
                        element.querySelector('.event__title-date-container__text').textContent = newTitle;
                        element.querySelector('.date-chip .typography__code').textContent = dateInput.value || "No date";
                        window.updateProjDetails(projectId, { 
                            projectTitle: newTitle, 
                            dueDate: dateInput.value 
                        })
                    // if not
                    } else {
                        newTitle = titleInput.value.trim() || titleInput.placeholder || "Untitled event"
                        element.querySelector('.event__title-date-container__text').textContent = newTitle;
                        element.querySelector('.date-chip .typography__code').textContent = dateInput.value || "No date";

                    }

                    // remove edit mode
                    element.querySelector(".edit-box").classList.remove('edit-box--in-edit-mode');
                    element.querySelector(".event").classList.remove('event--in-edit-mode');

                    window.markDataHasChanged()
                });
            } catch (e) {
                // console.log(e);
            }
        }
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
