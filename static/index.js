let idToken = 'NULL';

async function getData() {
    document.getElementById('hello').innerText = "Fetching..."

    const url = "https://genta-api.online/add_user";
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization':'Bearer ' + idToken,
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
        console.error(error.message);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const getDataButton = document.getElementById('getDataButton');
    if (getDataButton) {
        getDataButton.addEventListener('click', getData);
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
    }
    window.onload = function () {
        google.accounts.id.initialize({
            client_id: "348119995581-cdr89isvh3cl90i8s7ui1rsabghdvrbr.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
}