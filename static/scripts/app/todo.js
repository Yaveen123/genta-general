function startTodoEventListeners () {
    document.querySelectorAll('.todo-input-item-main').forEach((todoInputItem) => {
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

function addTodo(text, todoList, todoInput) {
    if (!text.trim()) {
        return;
    }

    // console.log(todoList)

    const item = document.createElement('div');
    item.className = 'ev__todo-item';
    item.innerHTML = `
        <div class="ev__todo-item__icon--uncompleted unselectable">
            <img class="unselectable ev__todo-item__icon__tick" src="/static/images/icons/tick.svg" alt="">
        </div>
        <img class="unselectable ev__todo-item__icon--trash" src="/static/images/icons/delete.svg" alt="" style="position: absolute; left: 20px; top:-3px; z-index: 10;">
    `;  

    const textP = document.createElement('p');
    textP.className = 'typography__body todo-item__text';
    textP.textContent = text; 
    item.appendChild(textP);

    const icon = item.querySelector('.ev__todo-item__icon--uncompleted');
    icon.addEventListener('click', function(eventObject) {
        toggleTodoStatus(icon, eventObject);
    });



    const trashIcon = item.querySelector('.ev__todo-item__icon--trash');

    // item.addEventListener('mouseenter', function() {
    //     trashIcon.style.opacity = 100;
    //     trashIcon.style.pointerEvents = ''; 
    // });
    // item.addEventListener('mouseleave', function() {
    //     trashIcon.style.opacity = 0;
    //     trashIcon.style.pointerEvents = 'none';
    // });

    // JC moved tis to the CSS which yk makes sense maybe he's less stresso than me
    trashIcon.addEventListener('click', function() {
        item.remove();
    });

    todoList.appendChild(item);
}

// toggles the todo 
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
window.toggleTodoStatus = toggleTodoStatus 