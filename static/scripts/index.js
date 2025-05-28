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

    if (localStorage.getItem('idToken') === null || localStorage.getItem('idToken') === 'NULL') {
        document.getElementById('loading-animation').style.display = "none";
        google.accounts.id.prompt();
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }
        );
        buttonDiv.style.display = 'block';
    } else {
        verifyLogin().then(isValid => {
            if (isValid) {
                UpdateUISuccessful();
            } else {
                document.getElementById('loading-animation').style.display = "none";
                localStorage.removeItem('idToken');
                google.accounts.id.prompt();
                google.accounts.id.renderButton(
                    document.getElementById("buttonDiv"),
                    { theme: "outline", size: "large" }
                );
                buttonDiv.style.display = 'block';
            }
        });
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
        
        return true; // Verification successful
    } catch (error) {
        console.error(error.message);
        return false; // Verification failed
    }
}
