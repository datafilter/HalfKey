
"use strict";

if (!"content" in document.createElement("template")) {
    alert("Browser doest not support document.createElement(template)")
}

import { combineHash } from "./hash.js";

const HalfKey = (name, salt, outputSize) => ({ name, salt, outputSize, id: crypto.randomUUID(), timeStamp: Date.now() })

const saveHalfKey = (halfKey) => {
    localStorage.setItem(`HK-${halfKey.id}`, JSON.stringify(halfKey));

    const card = document.querySelector(`#HK-${halfKey.id}`)

    if (card) {
        card.dataset.name = halfKey.name
        card.dataset.salt = halfKey.salt
        card.dataset.outputSize = halfKey.outputSize

        const cardName = card.querySelector("#name");
        cardName.textContent = halfKey.name
    }
}

const deleteHalfKey = (halfKey) => {
    localStorage.removeItem(`HK-${halfKey.id}`)
    const card = document.querySelector(`#HK-${halfKey.id}`)
    if (card) {
        card.remove()
    }
}

const keysContainer = document.getElementById("keys-container")

const dgSAVE = "save"
const dgDELETE = "delete"

const copyKeyDataToEditModal = (editDialog, halfKey, action) => {
    editDialog.halfKey = halfKey
    editDialog.action = action

    const nameInput = editDialog.querySelector('#set-name')
    const saltInput = editDialog.querySelector('#set-salt')
    const sizeInput = editDialog.querySelector('#set-size')

    nameInput.value = halfKey.name
    saltInput.value = halfKey.salt
    sizeInput.value = halfKey.outputSize
}

const getModalHalfKey = (editDialog) => {
    const nameInput = editDialog.querySelector('#set-name')
    const saltInput = editDialog.querySelector('#set-salt')
    const sizeInput = editDialog.querySelector('#set-size')

    editDialog.halfKey.name = nameInput.value
    editDialog.halfKey.salt = saltInput.value
    editDialog.halfKey.outputSize = sizeInput.value

    return editDialog.halfKey
}

const configureDeleteDialog = (deleteDialog, editDialog) => {
    const yesBtn = deleteDialog.querySelector("#yes")
    const noBtn = deleteDialog.querySelector("#no")

    yesBtn.addEventListener("click", (event) => {
        const hk = getModalHalfKey(editDialog)
        deleteHalfKey(hk)
        editDialog.close(dgDELETE)
        deleteDialog.close()
    })
    noBtn.addEventListener("click", (event) => {
        deleteDialog.close()
    })

    // Close by clicking outside of dialog card
    deleteDialog.addEventListener("click", (event) => {
        if (event.target.id == deleteDialog.id) {
            deleteDialog.close();
        }
    })
}

const configureEditDialog = (editDialog) => {
    const editDeleteBtn = editDialog.querySelector("#edit-delete")
    const editSaveBtn = editDialog.querySelector("#edit-save")

    editDeleteBtn.addEventListener("click", (event) => {
        deleteDialog.showModal()
    })
    editSaveBtn.addEventListener("click", (event) => {
        const hk = getModalHalfKey(editDialog)
        saveHalfKey(hk)
        editDialog.close(dgSAVE)
    })

    editDialog.addEventListener("close", (e) => {
        // action save/delete (dgDELETE, dgSAVE)
        // console.log(`dialog requests action ${editDialog.returnValue}`)
        // console.log(`                on key ${JSON.stringify(editDialog.halfKey)}`)
    });

    // Close by clicking outside of dialog card
    editDialog.addEventListener("click", (event) => {
        if (event.target.id == editDialog.id) {
            editDialog.close();
        }
    })
}

const animateRunButton = (runBtn) => {
    runBtn.disabled = true;
    runBtn.classList.toggle('contrast');
    runBtn.textContent = "Copied to clipboard"

    setTimeout(() => {
        runBtn.disabled = false;
        runBtn.classList.toggle('contrast');
        runBtn.textContent = "Run"
    }, 1500);
}

const configurePepperDialog = (pepperDialog) => {
    // Close by clicking outside of dialog card
    pepperDialog.addEventListener("click", (event) => {
        if (event.target.id == pepperDialog.id) {
            pepperDialog.close();
        }
    })

    const pepperInput = pepperDialog.querySelector('#set-pepper')
    const ENTER_keycode = 13
    pepperInput.addEventListener("keyup", (event) => {
        if (event.keyCode == ENTER_keycode) {
            document.getElementById('confirmPepper').click()
        }
    })

    const confirmBtn = pepperDialog.querySelector("#confirmPepper")

    confirmBtn.addEventListener("click", async (event) => {
        const article = pepperDialog.article

        const pepperInput = pepperDialog.querySelector('#set-pepper')

        let pepper = pepperInput.value
        let calculated = await combineHash(article.dataset.salt, pepper, article.dataset.outputSize)

        pepper = ""
        pepperInput.value = ""

        await navigator.clipboard.writeText(calculated)

        calculated = ""

        const runBtn = article.querySelector("#run")
        animateRunButton(runBtn)

        pepperDialog.close()
    })
}

const editDialog = document.querySelector("#editDialog");
configureEditDialog(editDialog)

const deleteDialog = document.querySelector("#deleteDialog");
configureDeleteDialog(deleteDialog, editDialog)

const pepperDialog = document.querySelector("#pepperDialog");
configurePepperDialog(pepperDialog)

const addKeyCard = (halfKey) => {

    const tbody = keysContainer
    const template = document.querySelector("#key-template");

    // Clone the new row and insert it into the table
    const clone = template.content.cloneNode(true);
    const name = clone.querySelector("#name");
    name.textContent = halfKey.name

    const article = clone.querySelector("#articledata")

    article.dataset.name = halfKey.name
    article.dataset.salt = halfKey.salt
    article.dataset.outputSize = halfKey.outputSize
    article.id = `HK-${halfKey.id}`

    const editButton = clone.querySelector("#edit")

    editButton.addEventListener("click", (event) => {

        copyKeyDataToEditModal(editDialog, halfKey)

        editDialog.showModal();
    })

    const runButton = clone.querySelector("#run")

    runButton.addEventListener("click", (event) => {
        const article = event.target.parentNode

        pepperDialog.article = article
        pepperDialog.showModal()
    })

    tbody.appendChild(clone);
}

const newKeyBtn = document.querySelector("#new-key");

newKeyBtn.addEventListener("click", () => {
    const newKey = HalfKey("", "", 8)

    copyKeyDataToEditModal(editDialog, newKey)
    editDialog.showModal();

    const afterClose = () => {
        editDialog.removeEventListener("close", afterClose)
        switch (editDialog.returnValue) {
            case dgSAVE:
                addKeyCard(editDialog.halfKey);
                break;
            case dgDELETE:
                break;
        }
    }
    editDialog.addEventListener("close", afterClose)
})

const loadKeys = () => {
    const halfKeyIds = Object.keys(localStorage).filter(k => k.startsWith('HK-'))
    const halfKeys = halfKeyIds.map(id => localStorage.getItem(id)).map(JSON.parse)
    return halfKeys.toSorted((a, b) => a.timeStamp - b.timeStamp)
}

loadKeys().forEach(addKeyCard)

// const loadedKeys = [
//     HalfKey("My Bank", "ResponsibleDolphin", 8),
//     HalfKey("Investment", "SatelliteFolklore", 7)
// ]
// loadedKeys.forEach(addKeyCard)

