// note to self: run json-server --watch db.json

// blank before getting
let items = [];

// gets and displays the items in the JSON
async function get(){
    // debug
    console.log("Gotten!");

    // get the items in the json
    const response = await fetch("http://localhost:3000/items");
    const data = await response.json();
    items = data;

    // update ui
    renderItems();
}

const itemsContainer = document.querySelector("#items-container");

// renders the items in the JSON onto the screen
function renderItems(){
    // debug
    console.log(items);

    // get the items onto the screen
    itemsContainer.innerHTML = `
        <ul class="item-group">
            ${items.map(item => `
                    <li class="item-group-li" onclick="del(${item.id})">${item.name}</li>`).join("")}
        </ul>
    `
}

const deleteButton = document.getElementById("delete-button");

// can't pass parameters in HTML, so we add event listener instead
deleteButton.addEventListener('click', () => {
    if (items.length > 0){
        // get last item in array
        const lastItem = items[items.length - 1].id;
        del(lastItem);
    }
    else {
        console.warn("No items in array");
    }
});

// deletes the items from the JSON and renders what's left, if anything, to the screen
async function del(idx){
    // debug
    console.log("del function called with argument 'idx':", idx);
    console.log("Type of 'idx':", typeof idx);

    // delete from back end
    const response = await fetch("http://localhost:3000/items/" + idx, {
        method: "DELETE",
    });

    // check to ensure backend deletion worked
    if (!response.ok) {
        const errorText = await response.text(); // Get raw error if any
        console.error(`Failed to delete item from backend: Status: ${response.status}. Error: ${errorText}`);
        // Potentially re-render to show original state if backend deletion failed
        renderItems();
        return; // Stop execution if backend delete failed
    }

    // delete from front end
    const index = items.findIndex(li => li.id === idx);

    // make sure index was found
    if (index > -1){
        items.splice(index, 1);
    }
    // otherwise, display warning message in console that the item does not exist in the array
    else {
        console.warn(`Item with ID ${idx} not found in frontend array to delete.`);
    }
    
    // update the ui
    renderItems();
}

const textbox = document.getElementById("textbox");
const selection = document.getElementById("p-select");

// creates a new item in the JSON and renders it to the screen
async function create() {
    // get the info from the text boxes in the HTML
    const newItemData = {
        name: textbox.value,
        priority: parseInt(selection.value)
    }

    // add on backend
    const response = await fetch("http://localhost:3000/items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemData)
    });
    const createdItem = await response.json();
    console.log("Created Item:", createdItem);

    // add on frontend
    items.push(createdItem);

    // update ui
    renderItems();
}