document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.todo-input-item-main').forEach((todoInputItem) => {
        todoInputItem.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const todoList = todoInputItem.closest('.todo-list');
                addTodo(todoInputItem.value, todoList, todoInputItem);
                todoInputItem.value = '';
            }
        });
    });
});

function addTodo(text, todoList, todoInput) {
    if (!text.trim()) {
        return;
    }

    console.log(todoList)

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

    todoList.insertBefore(item, todoInput.parentElement);
}

// toggles the todo 
function toggleTodoStatus(todoItem, eventObject) {
    if (todoItem.className === "ev__todo-item__icon--completed") {
        todoItem.className = "ev__todo-item__icon--uncompleted";

    } else {
        generateConfettiEffect(eventObject); // if its uncompleted then we can add the little confetti effect
        todoItem.className = "ev__todo-item__icon--completed";
        
    }
}
