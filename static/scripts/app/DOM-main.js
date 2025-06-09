
// expandable content html
// <div class="expandable-content__expand-collapse-container__text-container" style="cursor: pointer;">
//     <img class="expandable-content__expand-collapse-container__text-container__arrow-icon unselectable" src="/static/images/icons/up-arrow.svg" ">
//     <p class="typography__body--clickable unselectable">Expand</p>
// </div>




// MARK:createEventCardDOM()
function createEventCardDOM(projectData, eventData) {
    // console.log(`Creating event card for: ${eventData.title}, Event Data: ${JSON.stringify(eventData)}`);
    // MARK:>event-outer-box
    const outerBox = document.createElement('div');
    // let projectId, eventId;

    // if (projectData.id) {
    //     projectId = projectData.id;
    // } else {
    //     projectId = projectData.__tempId;
    // }

    // JC taught me how to do these things better omg
    const projectId = projectData.id || projectData.__tempId
    const eventId = eventData.id || eventData.__tempId;

    // if (eventData.id) {
    //     eventId = eventData.id
    // } else {
    //     eventId = eventData.__tempId
    // }

    // DOM for outer-box
    outerBox.className = 'event-outer-box';
    outerBox.dataset.projectId = projectId
    outerBox.dataset.eventId = eventId;
    outerBox.dataset.projectCard = eventData.projectCard || false; //set proj card js so we know what is what

    

    
    
    // DOM for event
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event'
    
    
    // MARK:>header
    // Includes date and title
    // DOM for header
    const eventHeader = document.createElement('div');
    eventHeader.className = 'event__header';

    


    // DOM for title
    const title = document.createElement('p')
    const titleDateContainer = document.createElement('div');
    titleDateContainer.className = 'event__title-date-container'
    title.className = 'event__title-date-container__text typography__heading unselectable event-title-clickable'
    title.textContent =  eventData.title || "Untitled event"

    
    
    
    // DOM for header > date container
    const dateContainer = document.createElement('div')
    dateContainer.className = 'event__title-date-container__date-container'
    

    
    // DOM for header > datecontainer > date chip
    const dateChip = document.createElement('div')
    dateChip.className = 'date-chip';
    dateChip.innerHTML = `
        <div class="date-chip__date-container ">
            <img  class="unselectable" src="/static/images/icons/clock.svg" >
            <p class="typography__code unselectable">
                ${eventData.dueDate || "No date"}
            </p>
        </div>`
    dateContainer.appendChild(dateChip)
    titleDateContainer.appendChild(title)
    titleDateContainer.appendChild(dateContainer);

    
    
    
    // DOM for header > settings icon
    const settingsIcon = document.createElement('img')
    settingsIcon.src = "/static/images/icons/settings.svg"
    settingsIcon.className = "event_title__settings-icon unselectable event-settings-clickable"; 

    eventHeader.appendChild(titleDateContainer)
    eventHeader.appendChild(settingsIcon)
    eventDiv.appendChild(eventHeader)


    
    // if (eventData.collapsed) { expandCollapseButtonType = 'down' } else 
    // { expandCollapseButton = 'up' }


    // MARK: >expandcollapse
    // DOM for expand and collapse button
    const expandableContent = document.createElement('div')
    
    expandableContent.className = 'expandable-content'

    // expandableContent.className = 'expandable-content'
    

    let expandCollapseButtonType, expandCollapseButtonText;
    if (eventData.collapsed) {
        expandCollapseButtonType = 'down';
        expandCollapseButtonText = 'Expand'
    } else {
        expandCollapseButtonText = 'Close';
        expandCollapseButtonType = 'up'
    }

    const expandCollapseButton = document.createElement('div')
    expandCollapseButton.className = 'event-collapse-clickable expandable-content__expand-collapse-container'
    expandCollapseButton.innerHTML = `
        <div class="expandable-content__expand-collapse-container__text-container" style="cursor: pointer;">
            <img class="expandable-content__expand-collapse-container__text-container__arrow-icon unselectable"  src="/static/images/icons/${expandCollapseButtonType}-arrow.svg"  ">
            <p class="typography__body--clickable unselectable">${expandCollapseButtonText}</p>
        </div>`;
    expandableContent.appendChild(expandCollapseButton)


    const contentContainer = document.createElement('div')
    contentContainer.className = 'expandable-content__content_container';

    if (eventData.collapsed) { contentContainer.style.display = 'none' }

    // MARK:>todo
    // There is supposed to be a show/hide function for todos but I don't want to implement it yet
    // Todo > title (says "todo" at the top)
    const todoDiv = document.createElement('div')
    todoDiv.className = 'ev__todo-container '
    todoDiv.innerHTML = `
    <p class="typography__subtitle--bold unselectable" style="position: sticky; top: 0; width: 100%; background: #FDFDFC;">Todo</p>
    `

    // Todo > actual todo list
    const todoListDiv = document.createElement('div')
    todoListDiv.className = 'todo-list'

    if (eventData.todo && eventData.todo.length > 0) { 
        eventData.todo.forEach(todoItem => {
            todoListDiv.appendChild(createTodoItemDOM(projectId, eventId, todoItem));
        });
    }


    todoDiv.appendChild(todoListDiv);

    // Todo > todo input item
    const newTodoInputDiv = document.createElement('div');
    newTodoInputDiv.className = 'ev__todo-item todo-input'
    newTodoInputDiv.innerHTML = `<input class="temp-type-newtypoico todo-input-item-main new-todo-input" type="text" placeholder="Type new item..." autocomplete="off">`;
    todoDiv.appendChild(newTodoInputDiv)
    contentContainer.appendChild(todoDiv)




    // MARK: > notes
    // Notes title
    const notesDiv = document.createElement('div');
    notesDiv.innerHTML = `<p class="typography__subtitle--bold unselectable">Notes</p>`
    notesDiv.className = 'ev__notes-content';

    // The actual notes textarea
    const notesTextarea = document.createElement('textarea')
    notesTextarea.value = eventData.notes || "";
    notesTextarea.className = 'typography__body--light event-notes-textarea ev__notes-content__content-container';
    notesTextarea.placeholder = "Type away!"

    notesDiv.appendChild(notesTextarea)
    contentContainer.appendChild(notesDiv)


    expandableContent.appendChild(contentContainer);
    eventDiv.appendChild(expandableContent);



    // MARK: >edit mode
    const editbox = document.createElement('div')
    editbox.className = 'edit-box'

    let titlePlaceholder, saveButtonText, deleteButtonText;
    if (eventData.projectCard) {
        titlePlaceholder = "Untitled project"
        saveButtonText = "Save project"
        deleteButtonText = "Delete project"
    } else {
        titlePlaceholder = "Untitled event"
        saveButtonText = "Save event"
        deleteButtonText = "Delete event"
    }

    editbox.innerHTML = `
        <div class="edit-box__cancel-box">
            <img src="static/images/icons/cross2.svg" alt="cross button">
            <p class="typography__subtitle--warn">Cancel</p>
        </div>
        <div class="edit-box__edit-info">
            <input class="typography__heading--editable event-title-input" placeholder="${eventData.title || titlePlaceholder}" type="text" style="width: 100%;"></input>
            <div class="edit-box__edit-info__date-edit-box">
                <input class="typography__body--editable event-date-input" type="date" value="${eventData.dueDate || ''}">
                <span class="event-date-display typography__body--editable"></span>
            </div>
        </div>
        <div style="display: flex; flex-direction: row; gap: 10px;">
            <button class="edit-box__box save-project">
                <p class="typography__button">${saveButtonText}</p>
            </button>
            <button class="edit-box__box del-project" style="background-color: rgb(0, 0, 0);">
                <p class="typography__button" style="color: rgb(255, 68, 68);">${deleteButtonText}</p>
            </button>
        </div>
`

    if (eventData.projectCard) {
        editbox.querySelector(".del-project").addEventListener('click', () => {
            window.deleteProjectLocalStorage()
        });
    }

    outerBox.appendChild(eventDiv);
    outerBox.appendChild(editbox);

    return outerBox;
}




//MARK:createTodoItemDOM
// Thhis function creates just todos as they're a repeated element inside the class itself.
function createTodoItemDOM(projectId, eventId, todoData) {
    // console.log(todoData)
    

    const todoId = todoData.id || todoData.__tempId

    // if () { todoId = todoData.id } 
    // else { todoId = todoData.__tempId }

    // Create the todo item and add attributes
    const itemDiv = document.createElement('div')
    itemDiv.className = 'ev__todo-item';
    itemDiv.dataset.todoId = todoId
    itemDiv.dataset.projectId = projectId
    itemDiv.dataset.eventId = eventId;

    // Stuff inside todo item
    const content = document.createElement('p')

    // if it's checked or not
    const checkboxDiv = document.createElement('div')
    checkboxDiv.innerHTML = `<img src="/static/images/icons/tick.svg" class="ev__todo-item__icon__tick unselectable">`
    if (todoData.checked) {
        checkboxDiv.className = 'ev__todo-item__icon--completed todo-checkbox-clickable unselectable'
        content.className = 'typography__body--strikethrough todo-item__text unselectable';
    } else {
        checkboxDiv.className = 'ev__todo-item__icon--uncompleted todo-checkbox-clickable'
        content.className = 'typography__body todo-item__text unselectable';
    }

    checkboxDiv.addEventListener('click', function(eventObject) {
        window.toggleTodoStatus(checkboxDiv, eventObject)
        window.markDataHasChanged()
    })

    content.textContent = todoData.content || ''

    const trashIcon = document.createElement('img')
    trashIcon.src = "/static/images/icons/delete.svg"
    trashIcon.className = "ev__todo-item__icon--trash todo-trash-clickable";
    
    trashIcon.addEventListener('click', function() {itemDiv.remove(); window.markDataHasChanged()})

    itemDiv.appendChild(checkboxDiv)
    itemDiv.appendChild(content)
    itemDiv.appendChild(trashIcon)
    return itemDiv
}



//MARK:renderDataIntoUI()


//                     <p class="header__link__text typography__subtitle--link">Software Engineering Major</p>

function renderDataIntoUI () {
    // console.log("rendering data")
    // console.log(currentUserData)

    const mainBody = document.querySelector('.main-body')
    const headerLinkContainer = document.querySelector(".header__link-container")

    // because the +add event element is always below the Project event and above every other event, I can get that and slot in the project (event) card above and everything else below

    headerLinkContainer.querySelectorAll('.header__link--project-link').forEach(link => link.remove());
    
    mainBody.querySelectorAll(".event-outer-box").forEach(eventItem => {
        if (eventItem.dataset.projectCard === "false" || eventItem.dataset.projectCard === "true") {
            eventItem.remove()
        }
    })

    if (headerLinkContainer && currentUserData.projects && currentUserData.projects.length > 0) {
        const newProjectButton = headerLinkContainer.querySelector('.header__new-proj-button__main')
        const addEventPlaceholder = mainBody.querySelector('.add-event-card');
        // for (i=0, i=length) {}

        currentUserData.projects.forEach (project => {
            const projectId = project.id || project.__tempId;
            const linkDiv = document.createElement('div')

            // added a new class to easily distinguish between projects and signout/addproj w/o using ...else {}
            linkDiv.className = 'header__link header__link--project-link' 

            if (projectId == currentProjectId) { linkDiv.style.backgroundColor = '#AFF20020'}

            linkDiv.innerHTML = `<p class="header__link__text typography__subtitle--link">${project.projectTitle}</p>`

            linkDiv.addEventListener('click', () => {
                localStorage.setItem('gentaLastActiveProjectId', projectId)
                setActiveProject(projectId);

            })

            try {
                headerLinkContainer.insertBefore(linkDiv, newProjectButton);
            } catch (e) {
                console.error("headerlinkcontainer", e)
            }
        })

        if (activeProjectData) {
            const projectAsEventData = {
                id: `project-${activeProjectData.id || activeProjectData.__tempId}`, 
                __tempId: `project-${activeProjectData.__tempId}`,
                title: activeProjectData.projectTitle,
                dueDate: activeProjectData.dueDate,
                projectCard: true,
                collapsed: activeProjectData.projectCardCollapsed || false, // falsy (cuz undefined) into false
                todo: [],
                notes: ""
            };

            // eventFIrst = activeProjectData.events[0];
            // const settingsIcon = projectCardElement.querySelector('.event-settings-clickable') FIX LATER
            
            // project card on the top takes the first event (0) and displays that
            if (activeProjectData.events && activeProjectData.events.length > 0) {
                projectAsEventData.todo = activeProjectData.events[0].todo || []; 
                projectAsEventData.notes = activeProjectData.events[0].notes || "";
            }

            const projectCardElement = createEventCardDOM(activeProjectData, projectAsEventData);

            try {
                mainBody.insertBefore(projectCardElement, addEventPlaceholder)
            } catch (e) {
                console.error("projcardelement", e)
            }
            
            if (activeProjectData.events && activeProjectData.events.length > 0) {
                let insertAfterElement = addEventPlaceholder // inserts after this element first, then before every event after 
                // Needs to change for date formatting

                // Start iterating from the second event (index 1) nbecause proj card is itself
                for (let i = 1; i < activeProjectData.events.length; i++) {
                    const event = activeProjectData.events[i];
                    const eventCardElement = createEventCardDOM(activeProjectData, event);
                    // nothing called "insert after" (why???????????) so i found this
                    // "Native dev" (2018) How to insert an element after another element in JavaScript without using another library https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib?rq=4 
                    insertAfterElement.insertAdjacentElement('afterend', eventCardElement);
                    insertAfterElement = eventCardElement;                    
                }
            }
        }
        window.startTodoEventListeners();
        window.startEventEventListeners();
        window.startEditEventListeners();
        window.startTextAreaEventListeners();
    } else {
        // asdfasdf;uahwefkjawekfkjlajwfhljkhaweflk
        emptyText = document.createElement('div')
        emptyText.innerHTML = `
        <p class="typography__body" style="padding: 20px 20px;"> Add an event to this project using the '+ Click to add event' button </p>
        `
        mainBody.appendChild(emptyText);
    }
}