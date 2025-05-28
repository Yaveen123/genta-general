let idToken = localStorage.getItem('idToken') || 'NULL';

async function getData() {
    document.getElementById('hello').innerText = "Fetching...";

    const url = "https://genta-api.online/get-data";
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + idToken,
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        let stringJSON = JSON.stringify(json);
        document.getElementById('hello').innerText = stringJSON;
        console.log(json);

    } catch (error) {
        document.getElementById('hello').innerText = error.message;
        console.error(error.message);
    }
}

async function verifLogin() {
    document.getElementById('hello').innerText = "Fetching..."
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
        let stringJSON = JSON.stringify(json);
        document.getElementById('hello').innerText = stringJSON;
        console.log(json);
    } catch (error) {
        document.getElementById('hello').innerText = error.message;
        console.error(error.message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const getDataButton = document.getElementById('getDataButton');
    if (getDataButton) {
        getDataButton.addEventListener('click', getData);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const verifyLoginButton = document.getElementById('verifyLoginButton');
    if (verifyLoginButton) {
        verifyLoginButton.addEventListener('click', verifLogin);
    }
});


function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    idToken = response.credential;
    localStorage.setItem('idToken', idToken);

    // Update UI elements after successful button sign-in
    const buttonDiv = document.getElementById("buttonDiv");
    const signOutButton = document.getElementById('signOutButton');

    if (buttonDiv) {
        buttonDiv.style.display = 'none'; // Hide the sign-in button
    }
    if (signOutButton) {
        signOutButton.style.display = 'block'; // Show the sign-out button
    }

    UpdateUISuccessful () 


}

function UpdateUISuccessful () {
    document.getElementById('signOutButton').style.display = 'block';
    document.getElementById('textcorr').innerText = "You're signed in! Try fetching the data from the API now."
    document.getElementById('textcorr').style.color = 'Green'

    buttonDiv.style.display = 'none';
}


window.onload = function () {
    google.accounts.id.initialize({
        client_id: "348119995581-cdr89isvh3cl90i8s7ui1rsabghdvrbr.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    

    // Only prompt for sign-in if there is no idToken in localStorage
    if (localStorage.getItem('idToken') === null || localStorage.getItem('idToken') === 'NULL') {
        google.accounts.id.prompt(); // Display the One Tap dialog
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            {
                theme: "outline", size: "large"
            }  // customization attributes
        );
        buttonDiv.style.display = 'block';
        document.getElementById('textcorr').innerText = "Click the button below or the One-Tap sign-in on the top left to Sign in with Google."
        document.getElementById('textcorr').style.color = 'Purple'

        
    } else {
        console.log("User already signed in (token found in localStorage).");
        UpdateUISuccessful () 
        
        // Optionally, you can call getData() here to immediately fetch data
        // if a token is present.
        // getData();
    }
}

function signOut() {
    // 1. Remove the idToken from localStorage
    localStorage.removeItem('idToken');
    console.log("User signed out. idToken removed from localStorage.");

    // 3. Optionally, update the UI
    const buttonDiv = document.getElementById("buttonDiv");
    if (buttonDiv) {
        buttonDiv.style.display = 'block'; // Show the sign-in button again
    }
    const helloElement = document.getElementById('hello');
    if (helloElement) {
        helloElement.innerText = "Signed out."; // Update any displayed user info
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