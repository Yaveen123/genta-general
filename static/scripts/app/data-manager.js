// Init the user data
let currentUserData = {
    user_db_id: null,
    user_version_tag: null,
    projects: []
}
let googleIdToken = null;
let currentProjectId = null;
window.currentProjectId = currentProjectId;
let activeProjectData = null;
let inEditMode = null;
const autosaveInterval = 30000; // autosave interval is 30s
let readyForAutosave = false;


const API_URL = "https://genta-api.online/"

// Set the auth token, called from g-sign-in.js 
function setAuthToken(token) {
    googleIdToken = token;
}

// Get the auth token by looking into the const
function getAuthToken() {
    if (!googleIdToken) {
        console.warn("gId token is not set");
    }
    return googleIdToken
}

// MARK: fetchAPI()
// Generic function for fetching the API.
async function fetchAPI(endpoint, body = null) {
    const token = getAuthToken();
    const url = `${API_URL}${endpoint}`;
    try {
        let options;

        // If theres a body, that means that it's definitely a POST request (GET req ! body)
        if (body) {
            options = {
                method: 'POST', 
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        } else {
            options = {
                method: 'GET', 
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }
        }
        
        // Now we can actually fetch from the URL
        console.log(body)
        const response = await fetch(url, options);
        
        if (response.status == 401) {
            throw new Error("Unauthorised (401). Reload page.")
        }

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error.message);
        return false; // Verification failed
    }
}

//MARK: setActiveProject(projectId)
function setActiveProject(projectId) {
    // if a project ID exists and there are actually projects to show, only then we can store the ID 
    if (!projectId && currentUserData.projects && currentUserData.projects.length > 0) {
        window.currentProjectId = currentUserData.projects[0].id || currentUserData.projects[0].__tempId
    } else {
        window.currentProjectId = projectId
    }

    activeProjectData = null;
    

    
    // loop over all projects and match either the .id or .__tempId to the currentPorjectId
    if (window.currentProjectId) {
        let i = 0
        let length = currentUserData.projects.length

        // if (project.id || project.__tempId) {
        //         activeProjectData = project
        //         break
        // }

        while (i < length) {
            let project = currentUserData.projects[i];
            // currentUserData.forEach((project)=>{})

            if ((project.id || project.__tempId) == window.currentProjectId) {
                activeProjectData = project
                break
            }
            i = i + 1;
        }
    }


    renderDataIntoUI();
}
window.setActiveProject = setActiveProject; 






// MARK: Test cases
document.addEventListener('DOMContentLoaded', async function() {
    let caseResult = false;

    // TEST CASE 1
    // Tests if auth token is functional

    try {
        let timeout = 10000; // 10 seconds timeout
        let elapsed = 0;
        while (!getAuthToken() && elapsed < timeout) {
            await new Promise(resolve => setTimeout(resolve, 100));
            elapsed = elapsed + 100;
        }
        if (!getAuthToken()) {
            caseResult = false;
            console.error("TEST CASE 1 FAILED: Auth token timeout - failed to retrieve token within 10s");
            return; // Exit early if timeout reached
        }

        const verifyLoginResponseResult = await fetchAPI('/verify-login')
        caseResult = Boolean(verifyLoginResponseResult)
    } catch (error) {
        console.log(`TEST CASE 1 FAILED: ${error}`)
        return
    }

    if (caseResult) {
        console.log('TEST CASE 1 PASSED -> Able to retrieve and verify google ID')
    } else {
        console.log('TEST CASE 1 FAILED: unspecified error')
    }

    // TEST CASE 2
    // Able to generate a valid UUID
    try {
        caseResult = Boolean(generateID());
    } catch (error) {
        console.log(`TEST CASE 2 FAILED: ${error}`)
        return
    }

    if (caseResult) {
        console.log(`TEST CASE 2 PASSED -> Able to generate version ID, example: ${generateID()}`)
    } else {
        console.log('TEST CASE 2 FAILED: unspecified error')
        return
    }


    if (!await loadInitialUserData()) {
        console.log("TEST CASE 3 FAILED -> Unable to get user data")
        return
    } else {
        console.log("TEST CASE 3 PASSED -> able to get user data")
        document.querySelector(".header__chip__text").textContent = "Saved"
    }

    window.startTitlebar();
});

// MARK: generateID()
// How can I create unique IDs with JS? https://stackoverflow.com/questions/3231459/how-can-i-create-unique-ids-with-javascript a
function generateID() {
    return crypto.randomUUID();
}

// MARK: assignTempIds()
// Process projects and their nested items for temp IDs if necessary
function assignTempIds(items) {
    // Just in case i nee d to check if it's an array and i can do that using Array.isArray()
    // "fela" (2012) How can I check if an object is an array? https://stackoverflow.com/questions/4775722/how-can-i-check-if-an-object-is-an-array 
    if (!Array.isArray(items)) {
        console.error('assignTempIds > returned data is not an array')
        return
    };
    
    // use __ for temp/internal tasks
    // loop over each item
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.id && !item.__tempId) { // if the item does not have an ID or a temp id
            item.__tempId = generateID();
        }
        
        if (item.events) { // potentially complex logic, but if item has events then it can treat it like a project and loop back into the function to assign ids
            // this works because event's dont have subevents.
            assignTempIds(item.events); 

            // currentUserData.projects.forEach( (events) 

            // loop over each event
            for (let j = 0; j < item.events.length; j++) {
                if (item.events[j].todo) {
                    // loop through again but for todos
                    assignTempIds(item.events[j].todo);
                }
            }
        }
    }
}

// MARK: loadInitialUserData()
// This is the first load of data 
async function loadInitialUserData() {
    if (!getAuthToken()) {
        // This should never happen, there are many tests before this, and this cant happen unless someone is tampering with the client
        console.log('loadInitialUserData > No auth token present. How did you get here?');
        return;
    }

    document.getElementById('loading-animation').style.display = 'block'; // show the loading anim

    try {
        // try to get user data
        const data = await fetchAPI('/get-data');
        if (!data) {
            console.error('loadInitialUserData > Failed to fetch user data:', response);
            return
        }

        // potentially null if it's a new user
        currentUserData.user_db_id = data.user_db_id;
        currentUserData.user_version_tag = data.user_version_tag;
        localStorage.setItem('gentaUserVersionTag', data.user_version_tag);

        // if (data.projects) { // if there are projects we don't want a false we want a empty list so iterators can handle this well
        //     currentUserData.projects = data.projects;
        // } else {
        //     currentUserData.projects = [];
        // }

        currentUserData.projects = data.projects || [];

        // assign the temporary ids
        assignTempIds(currentUserData.projects);

        if (currentUserData.projects && currentUserData.projects.length > 0) {
            const lastActiveProjectId = localStorage.getItem('gentaLastActiveProjectId')
            let projectExists = null;

            if (lastActiveProjectId) {
                for (let i = 0; i < currentUserData.projects.length; i++) {
                    let proj = currentUserData.projects[i]
                    if ((proj.id || proj.__tempId) == lastActiveProjectId) {
                        projectExists = proj;
                        break;
                    }

                    // if ( p.__tempId == lastActiveProjectId) {
                    //     projectExists = p;
                    //     break;
                    // }
                }
            }

            if (projectExists) {
                setActiveProject(lastActiveProjectId);
            } else {
                setActiveProject(currentUserData.projects[0].id || currentUserData.projects[0].__tempId); 
            }
        } else {
            setActiveProject(null);
        }

        console.log("loadInitialUserData > User data loaded: ")
        console.log(currentUserData)
        // renderDataIntoUI() 
        return true;
    } catch (error) {
        console.error("loadInitialUserData > Error in loading data: " + error)
        return false;
    } finally {
        document.getElementById('loading-animation').style.display = 'none'
    }
}

// MARK:handleAddProject()
// add a new proj, need to fix for dev
function handleAddProject () {
    forceUpdateDataServerForProjectAdd(true)
    const newProject = {
        __tempId: generateID(),
        projectTitle: "Untitled project",
        dueDate: "2025-05-22",
        events: []
    };
    setActiveProject(newProject.__tempId); 
    localStorage.setItem('gentaLastActiveProjectId', newProject.__tempId);
    console.log(`project added: ${newProject}`)
    window.addProjectLocalStorage(newProject)
}
window.handleAddProject = handleAddProject;



let dataChanged = false
// MARK:markDataHasChanged()
function markDataHasChanged() {
    document.querySelector(".header__chip__text").textContent = "Saving..."
    dataChanged = true;
    // console.log("Data has been marked as to-change")
}
window.markDataHasChanged = markDataHasChanged





// MARK:updateProjDetails
// proj details can be updated seperately as it's own element but also has effects on the active proj
function updateProjDetails (projectId, newData) {
    let project = findProjectById (projectId);
    if (project) {
        // update proj title and duedate
        project.dueDate = newData.dueDate
        project.projectTitle = newData.projectTitle


        // activeProjectData.projectTitle = newData.projectTitle;
        // activeProjectData.dueDate = newData.dueDate;
        markDataHasChanged()
        console.log(`updateProjDetails > updated to title: ${project.projectTitle}, ${project.dueDate}`)
    } else {
        console.error(`updateProjDetails > Project ${projectId} not found!!`);
    }
}


// MARK: updateEventDetails()
// for every normal event, edit-box pings this.
function updateEventDetails (eventId, newData) {
    let event = findEventById(eventId)
    if (event) {
        event.eventTitle = newData.eventTitle
        event.dueDate = newData.dueDate 
        event.notes = newData.notes 

        markDataHasChanged()
        console.log(`updateEventDetails > updated to: title: ${event.eventTitle}, due date: ${event.dueDate}, notes: ${event.notes}`)
    } else {
        console.error(`updateEventDetails > event '${eventId}' not found!`)
    }
}


// MARK:updateTodoDetails
function updateTodoDetails(projectId, eventId, todoId, newData) {
    let project=findProjectById(projectId), event=findEventById(project, eventId), todo=findTodoById(event, todoId) // i think this is very smexy

    if (todo) {
        todo.content = newData.content;
        todo.checked = newData.checked
    } else {
        console.error("updateTodoDetails > todo doesnt exist")
        return
    }

    markDataHasChanged()
    console.log("updateTodoDetails > todo updated")
}



async function addProjectLocalStorage (projectData) {
    currentUserData.projects.push(projectData)
    console.log(`Forcing update`)
    await forceUpdateDataServerForProjectAdd()
}

window.addProjectLocalStorage = addProjectLocalStorage





async function forceUpdateDataServerForProjectAdd (shouldntReload) {
    console.log("forceUpdateDataServerForProjectAdd > adding project")
    
    const body = { 
        user_version_tag: currentUserData.user_version_tag,
        projects: currentUserData.projects
    }
    console.log(body)

    try {
        const result = await fetchAPI('update-data', body);
        console.log(`result: ${result}`)

        if (result) {
            if (result.newVersionTag) {
                currentUserData.user_version_tag = result.newVersionTag;
                localStorage.setItem('gentaUserVersionTag', result.newVersionTag);
                console.log("Autosave server response > project data saved successfully, new version tag:", result.newVersionTag);
                dataChanged = false;

                if (!shouldntReload) {window.location.reload()}
                
            } else if (result.error) {
                if (result.error.includes("Autosave server response > Client data is outdated")) {
                    console.error("Autosave server response > Autosave conflict, reload Genta.")
                } else {
                    console.error("Autosave server response > An error occured.")
                }
            } else {
                console.error("Autosave server response > An unknown error occured.")
            }
        } else {
            console.error("Autosave server response > No response from server.")
        }
    } catch (e) {
        console.error("Autosave > Client fetch error", e)
    }
}










// MARK: addEventLocalStorage()
// For +Add new event
function addEventLocalStorage (eventData, projectId) {
    let project = findProjectById(projectId)
    if (project) {
        if (!project.events) {
            project.events = [];
        }

        if (!eventData.__tempId ) {
            eventData.__tempId = generateID()
        }

        project.events.push(eventData) //put into the proj. this might not be safe but its fine

        markDataHasChanged();
        console.log(`addEventLocalStorage > added to project ${eventData}`)
    } else {
        // i can't see when this could happen but its a good failsafe
        console.error("addEventLocalStorage > What??")
    }
}

// MARK:addTodoLocalStorage()
// adding todo data
function addTodoLocalStorage(todoData, eventId, projectId) {
    let project = findProjectById(projectId), event = findEventById(eventId);

    if (event) {
        if (!event.todo) { event.todo = []; }
        todoData.__tempId = todoData.__tempId || generateID()
        event.todo.push(todoData)

        markDataHasChanged()
    } else {
        console.error("addTodoLocalStorage > how?")
    }
}





// MARK:deleteProjectLocalSorage()
function deleteProjectLocalStorage () {
    const projectId = window.currentProjectId;
    // why. is. deleting from an array. so. complicated
    // i had to figure out this one by searchign because i did not realise that there was no .remove thing like in py
    // How can I remove a specific item from an array in JavaScript? https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
    currentUserData.projects = currentUserData.projects.filter(project => projectId != (project.__tempId || project.id) )
    // JC explained me the semantics: essentailly the .filter takes a func (item)=>{} where in {} is something like {return item only if its not <specific item>} 

    // markDataHasChanged();
    // //MARK:!!!!!!!!!!!!!! I NEED TO FORCE AN UPDATE BEFORE RELOAD!

    window.forceUpdateDataServerForProjectAdd()

    localStorage.removeItem('gentaLastActiveProjectId');
}

// MARK: deleteEventLocalStorage()
function deleteEventLocalStorage(projectId, eventId) {
    const project = findProjectById(projectId)
    if (!project) { console.error("deleteEventLocalStorage > what"); return }
    if (!project.events) { console.error("deleteEventLocalStorage > what2"); return }
    markDataHasChanged()

    project.events.filter ( event => (eventId != (event.id || event.__tempid)))

    console.log(`deleteEventLocalStorage > event deleted ${eventId} `)
}
// MARK:deleteTodoLocalStorage()
function deleteTodoLocalStorage (projectId, eventId, todoId) {
    let project=findProjectById(projectId), event=findEventById(project, eventId)

    if (!event) { console.error("deleteEventLocalStorage > what"); return }
    if (!event.todo) { console.error("deleteEventLocalStorage > what2"); return }

    event.todo = event.todo.filter ( todo => (todo.id | todo.__tempId) != todoId)
    markDataHasChanged ()
    
    console.log ("deleteTodoLocalStorage > todo deleted")
}



// MARK:findProjectById()
function findProjectById(projectId) {
    // go through each project and find the proj that's open
    for (let i = 0; i< currentUserData.projects.length; i++) {
        const project = currentUserData.projects[i];
        if ((project.id || project.__tempId) == projectId) {
            return project;
        }
    }

    return null;
}

// MARK:findEventById()
function findEventById (project, eventId) {
    if (project && project.events) {
        // i shouldnt have made this whole project card thing tbh
        // Salvado, C (2011) how to check if a string "StartsWith" another string https://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
        if (eventId.startsWith('project-')) {
            return project.events[0]
        }

        // let toReturn = null 
        for (let event of project.events) {
            if ((event.__tempId || event.id) == eventId) {return event}
        }
        return null
    } else { return null; }
}

// MARK: findTodoById ()
function findTodoById (todoId, event) {
    if (event.todo) {
        for (let todoItem of event.todo) {
            if ((todoItem.__tempId || todoItem.id) == todoId) { return todoItem }
        }
    }
    // this js makes it easier for me to fid a specific todo in a event
    return null
} 


// MARK: getDataFromDOM()
function getDataFromDOM() {
    console.log("getting data from DOM")
    try {
        const mainBody = document.querySelector('.main-body')

        // user can js delete every project
        if (!activeProjectData) { return }

        const currentProject = findProjectById(activeProjectData.id || activeProjectData.__tempId);
        if (!currentProject) {
            console.error("There was a problem getting the ID");
            return;
        }

        // Find an element in DOM based on attribute
        // Pantra, N (2018) Find an element in DOM based on attribute value https://stackoverflow.com/questions/2694640/find-an-element-in-dom-based-on-an-attribute-value
        const projectOuterBox = mainBody.querySelector(`.event-outer-box[data-project-id = '${currentProject.id || currentProject.__tempId}'][data-project-card='true']`);

        // from that we can get the project title and project due date
        let projectTitle;
        let projectDueDate;

        // get the things from the project card
        // and then update the initial json stuff
        try {
            projectTitle = projectOuterBox.querySelector('.event__title-date-container__text').textContent.trim();
            projectDueDate = projectOuterBox.querySelector('.typography__code').textContent.trim();
            // console.log(projectTitle)
            // console.log(`${projectTitle} -> ${projectDueDate} `)
        } catch (e) {
            console.error("Couldn't get content from project card: ", e)
        }
        
        const projectAPIData = {
            projectTitle: projectTitle,
            dueDate: projectDueDate,
            events: []
        }


        // update project ids
        if (currentProject.id) {
            projectAPIData.id = currentProject.id;
        } else { 
            if (currentProject.__tempId) { 
                projectAPIData.__tempId = currentProject.__tempId;
            } 
        } 

        // now get all event data
        mainBody.querySelectorAll(".event-outer-box").forEach((eventOuterBox) => {

            if (eventOuterBox.dataset.projectCard === "false" || eventOuterBox.dataset.projectCard === "true") {
                // getting text out of textarea is a little different
                // w3schools (n.d.) textarea value property https://www.w3schools.com/jsref/prop_textarea_value.asp
                let isCollapsed = false;
                if (eventOuterBox.querySelector('.expandable-content__content_container').style.display === 'none') {
                    isCollapsed = true;
                }

                const eventDataForAPI = {
                    title: eventOuterBox.querySelector('.event__title-date-container__text').textContent.trim(),
                    dueDate: eventOuterBox.querySelector('.typography__code').textContent.trim(),
                    notes: eventOuterBox.querySelector('.event-notes-textarea').value.trim(), 
                    collapsed: isCollapsed, 
                    todo: [],
                    notesShown: true,
                    todoShown: true
                } 
                // console.log(eventDataForAPI);
                // I dont actually implement notes or todo shown but i built the api to handle that :(

                eventOuterBox.querySelectorAll('.ev__todo-item').forEach(todoItem => {
                    // w3Schools (n.d.) javascript strng includes() https://www.w3schools.com/Jsref/jsref_includes.asp
                    if (todoItem.className.includes("todo-input")) {return;} // skipped todo input

                    let checkedState = false;
                    try {
                        if (todoItem.querySelector('.ev__todo-item__icon--completed')) {
                            checkedState = true;
                            // console.log("yeah")
                        } 

                        if (todoItem.querySelector('.ev__todo-item__icon--uncompleted')) {
                            checkedState = false;
                            // console.log("nah")
                        }
                    } catch (e) {
                        console.error("Couldn't read todo item, ", e )
                    }

                    const todoToPush = {
                        content: todoItem.querySelector('.todo-item__text').textContent.trim(),
                        checked: checkedState,
                    }
                    // consoog(todoToPush)

                    eventDataForAPI.todo.push(todoToPush)
                })

                projectAPIData.events.push(eventDataForAPI)
            } //else {
                // console.log("Successfully skipped add event element")
        //}
        })
        // console.log(projectAPIData)
        return projectAPIData;
    } catch (e) {
        console.error("autosave > getDataFromDOM > Failed to generate data to update: ", e)
    }


}


// MARK:updateDataOnServer()
async function updateDataOnServer() {
    if (!dataChanged) {
        console.log("autosave > no data changed")
        return;
    }

    if (!activeProjectData) {
        console.log("autosave > no active project")
        dataChanged = false;
        return;
    }

    console.log("autosave > starting autosave...")

    const payloadToSend = getDataFromDOM()

    if (!payloadToSend) {
        console.log("autosave > generating data failed.");
        document.querySelector(".header__chip__text").textContent = "Couldn't save";
        return;
    }

    // don't send the not active projects
    const updatedProjects = [];
    currentUserData.projects.forEach(project => {
        let projectToSend = { ...project }; //create copy
        delete projectToSend.__tempId; // Remove __tempId

        if ((project.id || project.__tempId) === (activeProjectData.id || activeProjectData.__tempId)) {
            updatedProjects.push(payloadToSend);
        } else {
            updatedProjects.push(projectToSend);
        }
    });
    

    const body = {
        user_version_tag: currentUserData.user_version_tag,
        projects: updatedProjects,
    }

    console.log(body)

    try {
        const result = await fetchAPI('update-data', body);
        console.log(result)

        if (result) {
            if (result.newVersionTag) {
                currentUserData.user_version_tag = result.newVersionTag;
                localStorage.setItem('gentaUserVersionTag', result.newVersionTag);
                console.log("Autosave server response > project data saved successfully, new version tag:", result.newVersionTag);
                dataChanged = false;

                document.querySelector(".header__chip__text").textContent = "Saved"
            } else if (result.error) {
                if (result.error.includes("Autosave server response > Client data is outdated")) {
                    console.error("Autosave server response > Autosave conflict, reload Genta.")
                } else {
                    console.error("Autosave server response > An error occured.")
                }
                document.querySelector(".header__chip__text").textContent = "Couldn't save";
                document.querySelector(".header__chip__text").style.color = "red"
                document.querySelector(".header__chip__text").className = "typography__body header__chip__text blinking-animation"
            } else {
                console.error("Autosave server response > An unknown error occured.")
                document.querySelector(".header__chip__text").textContent = "Couldn't save";
                document.querySelector(".header__chip__text").style.color = "red"
                document.querySelector(".header__chip__text").className = "typography__body header__chip__text blinking-animation"
            }
        } else {
            console.error("Autosave server response > No response from server.")
            document.querySelector(".header__chip__text").textContent = "Couldn't save";
            document.querySelector(".header__chip__text").style.color = "red"
            document.querySelector(".header__chip__text").className = "typography__body header__chip__text blinking-animation"
        }
    } catch (e) {
        console.error("Autosave > Client fetch error", e)
        document.querySelector(".header__chip__text").textContent = "Couldn't save";
        document.querySelector(".header__chip__text").style.color = "red";
        document.querySelector(".header__chip__text").className = "typography__body header__chip__text blinking-animation"
    }
}




function autosaveInitialiser () {
    updateDataOnServer();
    
    // Schedule the next autosave
    setTimeout(autosaveInitialiser, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Start autosave after initial delay
    setTimeout(autosaveInitialiser, 5000);
});





// expose everything so i can call it from DOM-main
window.updateProjDetails = updateProjDetails
window.updateEventDetails = updateEventDetails
window.updateTodoDetails = updateTodoDetails

window.addEventLocalStorage = addEventLocalStorage
window.addTodoLocalStorage = addTodoLocalStorage
// window.addProjectLocalStorage = addProjectLocalStorage not needed 

window.deleteProjectLocalStorage = deleteProjectLocalStorage
window.deleteEventLocalStorage = deleteEventLocalStorage 
window.deleteTodoLocalStorage = deleteTodoLocalStorage
// window.findProjectById = findProjectById
// window.findEventById = findEvdentById
// window.findTodoById = findTod




// i need to prevent the page from unloading if changes havent been saved
// "Codecaster" and Annesley, P (2011) Warn user before leaving web page with unsaved changes, https://stackoverflow.com/questions/7317273/warn-user-before-leaving-web-page-with-unsaved-changes
window.addEventListener('beforeunload', function(event) {
    if (dataChanged) {
        event.preventDefault();
        event.returnValue = ''; //legacy
        return '';
    }
});
