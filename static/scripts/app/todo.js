// This function adds a query selector to all todo sections 
function startTodoEventListeners () {
    document.querySelectorAll('.todo-input-item-main').forEach((todoInputItem) => {
        
        // Adds an event listener for the input item itself so when mouse enter then add todo.
        todoInputItem.addEventListener('keydown', function(event) {
            if (event.key == 'Enter') {
                
                const todoEventContainer = todoInputItem.closest('.ev__todo-container');
                if (!todoEventContainer) {
                    console.error("Error: '.ev__todo-container' not found for todo input.");
                    return;
                }
                const todoList = todoEventContainer.querySelector('.todo-list');
                if (!todoList) {
                    console.error("Error: '.todo-list' not found within '.ev__todo-container'.");
                    return;
                }
                window.markDataHasChanged()
                addTodo(todoInputItem.value, todoList, todoInputItem);
                todoInputItem.value = '';
            }
        });
    });
}
window.startTodoEventListeners = startTodoEventListeners; 
// now it can be used in dom-main and datamgr

// This function actually adds the todo
function addTodo(text, todoList, todoInput) {
    // If after whitespaces are removed there isnt anything then dont add an empty todo
    if (!text.trim()) {
        return;
    }

    // Add the tood item
    const item = document.createElement('div');
    item.className = 'ev__todo-item';
    item.innerHTML = `
        <div class="ev__todo-item__icon--uncompleted unselectable">
            <img class="unselectable ev__todo-item__icon__tick" src="/static/images/icons/tick.svg" alt="">
        </div>
        <img class="unselectable ev__todo-item__icon--trash" src="/static/images/icons/delete.svg" alt="" style="position: absolute; left: 20px; top:-3px; z-index: 10;">
    `;  


    // Create the todo content
    const textP = document.createElement('p');
    textP.className = 'typography__body todo-item__text';
    textP.textContent = text; 
    item.appendChild(textP);

    // if it's uncompleted when click change the todo (as previously only unmodifed normal todo items will have the event listener ik itz bad)
    const icon = item.querySelector('.ev__todo-item__icon--uncompleted');
    icon.addEventListener('click', function(eventObject) {
        toggleTodoStatus(icon, eventObject);
    });


    // Trash icon, enabling deleting todos
    const trashIcon = item.querySelector('.ev__todo-item__icon--trash');

    // JC moved this to the CSS which yk makes sense maybe he's less stresso than me
    trashIcon.addEventListener('click', function() {
        item.remove();
    });

    
    todoList.appendChild(item);
}

// This function as a callback switches the todo's classes to it's accurate modifier - completed/uncompleted
function toggleTodoStatus(todoItem, eventObject) {
    const textElement = todoItem.parentElement.querySelector('.todo-item__text');
    
    if (todoItem.className == "ev__todo-item__icon--completed") {
        todoItem.className = "ev__todo-item__icon--uncompleted";
        textElement.className = "typography__body todo-item__text";
    } else {
        generateConfettiEffect(eventObject); // if its uncompleted then we can add the little confetti effect
        todoItem.className = "ev__todo-item__icon--completed";
        textElement.className = "typography__body--strikethrough todo-item__text";
    }
}

// Expose to window
window.toggleTodoStatus = toggleTodoStatus 