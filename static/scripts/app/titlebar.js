document.addEventListener('DOMContentLoaded', function() {
    const hamburgerButton = document.getElementById('hamburger-button'); // Assuming you have a button with this ID
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', toggleTitlebarState);
    }
});

