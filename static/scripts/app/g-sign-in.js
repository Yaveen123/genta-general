// VENDOR PROVIDED CODE but its pretty easy to understand

// GSI signout removes the idToken from localstorage and resets the position
function signOut() {
    localStorage.removeItem('idToken');
    console.log("User signed out. idToken removed from localStorage.");

    const buttonDiv = document.getElementById("buttonDiv");
    if (buttonDiv) {
        buttonDiv.style.display = 'block'; 
    }
    window.location.href = '/';
}

// Add a click to the GSI specific signout button, which has no purpose anymore (CAN REMOVE)
document.addEventListener('DOMContentLoaded', function() {
    const signOutButton = document.getElementById('signOutButton'); 
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }
});

// Get the ID token from localstorage 
window.onload = function () {
    if (localStorage.getItem('idToken') === null || localStorage.getItem('idToken') === 'NULL') {
        window.location.replace("/");
    } else {
        // verify if JWT is valid by pinging GentaAPI
        verifyLogin().then(isValid => {
            if (isValid) {
                document.getElementById('loading-animation').style.display = "None";
            } else {
                window.location.replace("/");
            }
        });
    }
}

// Ping GentaAPI to verify is JWT is valid. 
// JWT is sent in the authorisation header. 
async function verifyLogin() {
    const idToken = localStorage.getItem('idToken');
    const url = "https://genta-api.online/verify-login";
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + idToken,
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json();

        setAuthToken(idToken)
        
        return true; // Verification successful
    } catch (error) {
        console.error(error.message);
        return false; // Verification failed
    }
}
