
function signOut() {
    localStorage.removeItem('idToken');
    console.log("User signed out. idToken removed from localStorage.");

    const buttonDiv = document.getElementById("buttonDiv");
    if (buttonDiv) {
        buttonDiv.style.display = 'block'; 
    }
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', function() {
    const signOutButton = document.getElementById('signOutButton'); 
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }
});

window.onload = function () {
    if (localStorage.getItem('idToken') === null || localStorage.getItem('idToken') === 'NULL') {
        window.location.replace("/");
    } else {
        verifyLogin().then(isValid => {
            if (isValid) {
                document.getElementById('loading-animation').style.display = "None";
                // document.getElementById('signOutButton').style.display = "Block";
            } else {
                window.location.replace("/");
            }
        });
    }
}

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
