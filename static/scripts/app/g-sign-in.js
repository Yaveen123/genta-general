
function signOut() {
    // 1. Remove the idToken from localStorage
    localStorage.removeItem('idToken');
    console.log("User signed out. idToken removed from localStorage.");

    // 3. Optionally, update the UI
    const buttonDiv = document.getElementById("buttonDiv");
    if (buttonDiv) {
        buttonDiv.style.display = 'block'; // Show the sign-in button again
    }
    // 4. Optionally, redirect the user to a different page (e.g., the homepage)
    window.location.href = '/';
}

// You'll need to attach this function to a button or some other UI element
document.addEventListener('DOMContentLoaded', function() {
    const signOutButton = document.getElementById('signOutButton'); // Assuming you have a button with this ID
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
