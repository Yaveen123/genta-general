// toggles the todo 
function toggleTodoStatus(todoItem, eventObject) {
    if (todoItem.className === "ev__todo-item__icon--completed") {
        todoItem.className = "ev__todo-item__icon--uncompleted";

    } else {
        generateConfettiEffect(eventObject); // if its uncompleted then we can add the little confetti effect
        todoItem.className = "ev__todo-item__icon--completed";
        
    }
}



function addTodo(text) {
    // "bobbyg603" (2019) How to detect string which contains only spaces? https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces 
    if (!text.trim()) {
        return;
    } // stop func if the todo has nothing or just spaces

    // because FOR WHATEVER REASON passing these through the func itself didnt work, i just remade them honestly im so done
    const todoList = document.getElementById('todo-list');
    const todoInput = document.getElementById('todo-input');
    

    // we can create the div element and then generate the html of it passing in the text
    const item = document.createElement('div');
    item.className = 'ev__todo-item';
    item.innerHTML = `
                <div class="ev__todo-item__icon--uncompleted unselectable">
                    <img class="unselectable ev__todo-item__icon__tick" src="/static/images/icons/tick.svg" alt="">
                </div>
                <img class="unselectable ev__todo-item__icon--trash" src="/static/images/icons/delete.svg" alt="" style="position: absolute; left: 20px; top:-3px; z-index: 10;">
            `;  

    // I have learnt that using just innerhtml and the ${var} isnt XSS secure, so we can just make it outselves and use textContent
    // Gallegos, J (2023) XSS: Using 'innerText' or 'textContent vs InnerHTML' https://medium.com/@xjgalleg/xss-using-innertext-or-textcontent-vs-innerhtml-e60ac660167e
    const textP = document.createElement('p');
    textP.className = 'typography__body todo-item__text';
    textP.textContent = text; 
    item.appendChild(textP);

    // Add event listener to the new todo item's icon
    const icon = item.querySelector('.ev__todo-item__icon--uncompleted');
    icon.addEventListener('click', function(eventObject) {
        toggleTodoStatus(icon, eventObject);
    });
            
    // Add hover event listeners for trash icon
    const trashIcon = item.querySelector('.ev__todo-item__icon--trash');
    item.addEventListener('mouseenter', function() { // MDN (n.d.) Element: mouseover event https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event apparently mouseenter is more "sensible" so i just used that instead
        trashIcon.style.opacity = 100;
        trashIcon.style.pointerEvents = ''; 
    });
    item.addEventListener('mouseleave', function() { // same source above but theres a section with mouseleave
        trashIcon.style.opacity = 0;
        trashIcon.style.pointerEvents = 'none'; // because elements with 0 opacity are still clickable, we have to disable the mouseevents
    });
    
    // Add click event listener to trash icon for deletion
    trashIcon.addEventListener('click', function() {
        item.remove();
        console.log("clicked!");
    });
    
    todoList.insertBefore(item, todoInput.parentElement);
}





// When the content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // We can get the todolist and todoinput elements
    const todoInput = document.getElementById('todo-input');
    // Listen for an enter keypress
    // MDN docs (n.d.) Element: keydown event https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
    todoInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // add that to the list
            addTodo(todoInput.value);

            // make the input field blank
            todoInput.value = '';
        }
    });

    // Add event listeners to existing todo items
    document.querySelectorAll('.ev__todo-item__icon--uncompleted, .ev__todo-item__icon--completed').forEach((todoItem) => {
        todoItem.addEventListener("click", function(event) {
            // toggles from complete to uncomplete
            toggleTodoStatus(todoItem, event);
        });
    });
});
