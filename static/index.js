

document.getElementById('hello').innerText = "WHLAWR"

async function getData() {
    const url = "http://genta-api.online/add_user";
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

getData()