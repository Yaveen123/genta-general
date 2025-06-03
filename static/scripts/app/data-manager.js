let currentUserData = {
    user_db_id: null,
    user_version_tag: null,
    projects: []
}
let googleIdToken = null;
const API_URL = "https://genta-api.online/"

function setAuthToken(token) {
    googleIdToken = token;
    console.log("Auth token has been retrieved.")
}

function getAuthToken() {
    if (!googleIdToken) {
        console.warn("gId token is not set");
    }
    return googleIdToken
}

async function fetchAPI(endpoint, body = null) {
    const token = getAuthToken();
    const url = `https://genta-api.online${endpoint}`;
    try {
        let options;

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

document.addEventListener('DOMContentLoaded', async function() {
    // Wait for the auth token to be set
    while (!getAuthToken()) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const test = await fetchAPI('/verify-login')
    console.log(test)
});