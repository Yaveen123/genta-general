let idToken = localStorage.getItem('idToken') || 'NULL';

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
    if (buttonDiv) {
        buttonDiv.style.display = 'none'; // Hide the sign-in button
    }
    UpdateUISuccessful();
}

function UpdateUISuccessful () {
    window.location.replace(window.location.href + "app")
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
        
        buttonDiv.style.display = 'block'

        
    } else {
        console.log("User already signed in (token found in localStorage).");
        UpdateUISuccessful();
        
        // Optionally, you can call getData() here to immediately fetch data
        // if a token is present.
        // getData();
    }
}


async function verifyLogin() {
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