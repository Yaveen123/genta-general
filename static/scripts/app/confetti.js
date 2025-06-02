// W3Schools (n.d.) JavaScript Random https://www.w3schools.com/JS/js_random.asp
function randomNumber() {
    return Math.floor(Math.random() * 10);
}


// "catdad" (2024) Canvas-confetti documentation github https://github.com/catdad/canvas-confetti
function generateConfettiEffect (eventVar) {
    // On click, generate the confetti effect!
    // There is a random chance that the effect will be rainbow small or large genta green
    // "snowmonkey" (2019) Pass the event to the callback within the event listener that triggered it? https://forum.freecodecamp.org/t/pass-the-event-to-the-callback-within-the-event-listener-that-triggered-it/258259
    if (eventVar.target.className.includes("--uncompleted")) {
        if (randomNumber() < 1) {
            const rect = eventVar.target.getBoundingClientRect();
            confetti({
                particleCount: 60,
                spread: 360,
                startVelocity: 5,
                scalar: 0.7,
                origin: {
                    x: (rect.left + 10) / window.innerWidth,
                    y: (rect.top + 10) / window.innerHeight
                },
                decay: 0.98,
                ticks:100,
                gravity:0,
                colors: ['AFF200', '5C7F00'], 
            });  
        } else {
            const rect = eventVar.target.getBoundingClientRect();
            confetti({
                particleCount: 20,
                spread: 360,
                startVelocity: 7,
                scalar: 0.7,
                origin: {
                    x: (rect.left + 10) / window.innerWidth,
                    y: (rect.top + 10) / window.innerHeight
                },
                decay: 0.9,
                ticks:50,
                gravity:0,
            });  
        }
    }
}

window.generateConfettiEffect = generateConfettiEffect;
window.randomNumber = randomNumber;


// document.addEventListener('DOMContentLoaded', function() {
//     Array.from(document.getElementsByClassName('ev__todo-item__icon--uncompleted')).forEach((checkboxElement) => {
    
//         checkboxElement.addEventListener("click", generateConfettiEffect)
//     }); 
// });