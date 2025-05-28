
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