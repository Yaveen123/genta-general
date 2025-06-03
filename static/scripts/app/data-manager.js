// Init the user data
let currentUserData = {
    user_db_id: null,
    user_version_tag: null,
    projects: []
}
let googleIdToken = null;
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
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json();
        if (response.status === 401) {
            throw new Error("Unauthorised (401). Reload page.")
        }
        return json;
    } catch (error) {
        console.error(error.message);
        return false; // Verification failed
    }
}

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
        if (!verifyLoginResponseResult) { caseResult = false } else { caseResult = true }
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
        if (generateID()) {
            caseResult = true;
        } else {
            caseResult = false;
        }
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
    }
});

// MARK: generateID()
// How can I create unique IDs with JS? https://stackoverflow.com/questions/3231459/how-can-i-create-unique-ids-with-javascript
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

        if (data.projects) { // if there are projects we don't want a false we want a empty list so iterators can handle this well
            currentUserData.projects = data.projects;
        } else {
            currentUserData.projects = [];
        }

        // assign the temporary ids
        assignTempIds(currentUserData.projects);

        console.log("loadInitialUserData > User data loaded: " + JSON.stringify(currentUserData))
        return true;
    } catch (error) {
        console.error("loadInitialUserData > Error in loading data: " + error)
        return false;
    } finally {
        document.getElementById('loading-animation').style.display = 'none'
    }
}

