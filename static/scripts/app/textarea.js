// "DreamTek" (2014) creating a text area with auto-resize https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize

// We use this function to resize the textbox
function resizeTextarea(element) {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
}

// When the document is loaded
function startTextAreaEventListeners () {

    // For each textbox
    document.querySelectorAll("textarea").forEach(function(textarea) {

        // Initial resize with delay to ensure content is rendered
        // This means the box doedsnt need to wait for an update to resize its area
        setTimeout(() => resizeTextarea(textarea), 100);
        
        // We add an event listener to the text area func 
        // When there is change in input, it runs the resizeTextarea function
        textarea.addEventListener("input", function() {
            try {
                resizeTextarea(this);
                window.markDataHasChanged()
            } catch (error) {
                console.warn("Textarea resize error:", error);
            }
        });


        // This enables me to disable the spellcheck func when the user is not clicked on the box
        // Wendelin, E (2008) Disable spellchecking on HTML textfields, https://stackoverflow.com/questions/254712/disable-spell-checking-on-html-textfields
        // when user is clicked on, enable
        textarea.addEventListener("focus", function() {
            try {
                this.spellcheck = true;
            } catch (error) {
                console.warn("Spellcheck setting error:", error);
            }
        });
        

        // when user is not clicked, disable
        // MDN (n.d) Element: blur event https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
        textarea.addEventListener("blur", function() {
            try {
                this.spellcheck = false;
            } catch (error) {
                console.warn("Spellcheck setting error:", error);
            }
        });
    });
};

window.startTextAreaEventListeners = startTextAreaEventListeners;
window.resizeTextarea = resizeTextarea;