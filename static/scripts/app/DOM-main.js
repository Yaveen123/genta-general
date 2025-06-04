
// expandable content html
// <div class="expandable-content__expand-collapse-container__text-container" style="cursor: pointer;">
//     <img class="expandable-content__expand-collapse-container__text-container__arrow-icon unselectable" src="/static/images/icons/up-arrow.svg" ">
//     <p class="typography__body--clickable unselectable">Expand</p>
// </div>




// MARK:createEventCardDOM()
function createEventCardDOM(projectData, eventData) {
    console.log(eventData)
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
    
    
    
    // DOM for event
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event'
    if (eventData.isInEditMode) {eventDiv.classList.add('event--in-edit-mode')} 

    
    
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
                ${eventData.dueDate || "No date"}"}
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
    if (eventData.collapsed) { expandableContent.style.display = 'none' }
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
            <p class="typography__body--clickable unsellectable">${expandCollapseButtonText}</p>
        </div>`;
    expandableContent.appendChild(expandCollapseButton)


    const contentContainer = document.createElement('div')
    contentContainer.className = 'expandable-content__content_container';



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

    if (eventData.todo) { if (!eventData.todo.length) {
        eventData.todo.forEach(todoItem => {
            todoListDiv.appendChild(createTodoItemDOM(projectId, eventId, todoItem)); // turns out i can just extract everything as a function
        })
    } }


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
    editbox.classname = 'edit-box'
    editbox.innerHTML = `
        <div class="edit-box__cancel-box">
            <img src="static/images/icons/cross2.svg" alt="cross button">
            <p class="typography__subtitle--warn">Cancel</p>
        </div>
        <div class="edit-box__edit-info">
            <input class="typography__heading--editable event-title-input" placeholder="${eventData.title || "Untitled event"}" type="text"></input>
            <div class="edit-box__edit-info__date-edit-box">
                <input class="typography__body--editable event-date-input" type="date"></input>
                <span class="event-date-display typography__body--editable"></span>
            </div>
        </div>
        <div style="display: flex; flex-direction: row; gap: 10px;">
            <button class="edit-box__box">
                <p class="typography__button">Save event</p>
            </button>
            <button class="edit-box__box" style="background-color: rgb(0, 0, 0);">
                <p class="typography__button" style="color: rgb(255, 68, 68);">Delete event</p>
            </button>
        </div>
`
    outerBox.appendChild(eventDiv);
    outerBox.appendChild(editbox);

    return outerBox;
}




//MARK:createTodoItemDOM
// Thhis function creates just todos as they're a repeated element inside the class itself.
function createTodoItemDOM(projectId, eventId, todoData) {
    console.log(todoData)
    

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
    checkboxDiv.innerHTML = `<img src="/static/images/icons/tick.svg" class="ev__todo-item__icon__tick">`
    if (todoData.checked) {
        checkboxDiv.className = 'ev__todo-item__icon--completed'
        content.className = 'typography__body';
    } else {
        checkboxDiv.className = 'ev__todo-item__icon--uncompleted'
        content.classList = 'typography__body--strikethrough';
    }
    content.textContent = todoData.content || ''

    const trashIcon = document.createElement('img')
    trashIcon.src = "/static/images/icons/trash.svg"
    trashIcon.className = "ev__todo-item__icon--trash todo-trash-clickable";
    
    itemDiv.appendChild(checkboxDiv)
    itemDiv.appendChild(content)
    itemDiv.appendChild(trashIcon)
    return itemDiv
}



//MARK:renderDataIntoUI()

function renderDataIntoUI () {
    console.log("rendering data")
    console.log(currentUserData)

    const mainBody = document.querySelector('.main-body')

    // because the +add event element is always below the Project event and above every other event, I can get that and slot in the project (event) card above and everything else below

    const addEvent = mainBody.querySelector('.add-event-card')

    if (currentUserData.projects && currentUserData.projects.length > 0) {
        currentUserData.projects.forEach( (project) => {
            if (project.events && project.events.length > 0) {
                project.events.forEach((event) => {
                    const eventCardElement = createEventCardDOM(project, event);
                    mainBody.insertBefore(eventCardElement, addEvent)
                })
            }
        })
    } else {
        const emptyText = `
        <p class="typography__body" style="padding: 20px 20px;"> Add an event to this project using the '+ Click to add event' button </p>
        `
        mainBody.appendChild(emptyText);
    }
    
}