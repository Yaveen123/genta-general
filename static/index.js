

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

async function getData() {
    document.getElementById('hello').innerText = "Fetching..."

    const url = "https://genta-api.online/add_user";
    try {
        const response = await fetch(url);
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

