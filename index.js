// note to self: run json-server --watch db.json

let items = [];

async function get(){
    console.log("Gotten!");

    const response = await fetch("http://localhost:3000/items");
    const data = await response.json();
    items = data;

    renderItems();
}

const itemsContainer = document.querySelector("#items-container");

function renderItems(){
    console.log(items);

    itemsContainer.innerHTML = `
        <ul class="item-group">
            ${items.map(item => `
                    <li class="item-group-li" onclick="del(${item.id})">${item.name}</li>`).join("")}
        </ul>
    `
}

const deleteButton = document.getElementById("delete-button");
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
    else {
        console.warn(`Item with ID ${idx} not found in frontend array to delete.`);
    }
    
    // update the ui
    renderItems();
}

const textbox = document.getElementById("textbox");
const selection = document.getElementById("p-select");

async function create() {
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