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
        console.log('TEST CASE 2 PASSED -> Able to generate version ID')
    } else {
        console.log('TEST CASE 2 FAILED: unspecified error')
    }
});

// How can I create unique IDs with JS? https://stackoverflow.com/questions/3231459/how-can-i-create-unique-ids-with-javascript
function generateID() {
    return crypto.randomUUID();
}