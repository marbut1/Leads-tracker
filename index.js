import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js"
import { getDatabase, 
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://leads-tracker-app-8842f-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "leads")

/*  
The above statements are necessary to use a real database with firebase  
Do the setup on firebase.google.com
We deleted the Tab-button and all his dependencies.
We deleted also localStorage because we will use a database and all his dependencies.
We deleted also myLeads because we use a database "leads".
For more explanation: sea index.js from PushingDataInDatabase
*/

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")

function render(array) {
    let listItems = ""
    for (let i = 0; i < array.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${array[i]}'>
                    ${array[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems  
}

// OnValue is a function that listens to changes (adding, deleting, updating) data in the database.
// In order to display the database data in the application we must change the object snapsot in an array.

onValue(referenceInDB, function(snapshot) {
    /*
    Snapshot does not exist anymore after we removed the data and this function generates an error.
    So we have to test if there is an snapshot.
    */
    const snapshotDoesExist = snapshot.exists()
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val()
        const leads = Object.values(snapshotValues)  // This is how we transform an object into an array
        /*
        This array contains only the values.
        Other posibiliteies:
        object.keys(snapshotValues) -> array contains the keys
        object.entries(snapshotValues) -> array contains the keys and the values
        */
        render(leads)
    }
})

deleteBtn.addEventListener("dblclick",function() {    
    remove(referenceInDB)
    // If we remove referenceInDB than the onValue-function fails because alle data is gone.
    // Therefore we need a if-statement in de onValue-function
    ulEl.innerHTML=""
})


inputBtn.addEventListener("click", function() {
    push(referenceInDB, inputEl.value)
    inputEl.value = ""
      
})
