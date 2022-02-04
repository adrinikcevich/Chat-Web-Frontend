import {
    añadirContacto,
    mostrarContactos,
    loadDefaultContacts,
    defaultPfps,
    setFirstContact,
    lastContactAddedKey,
    eliminarContacto,
    eliminarChat
}from './modules/contacts.js'

import {
    mostrarChatInfo,
    generateChat,
    currentChat,
    modalOcultarChat
}from './modules/chats.js'


const IDBRequest = indexedDB.open("database",1);

IDBRequest.addEventListener("success",()=>{
    console.log("Solicitud exitosa");
    mostrarContactos();
    mostrarChatInfo(10,defaultPfps[10])
    generateChat();
    
})
IDBRequest.addEventListener("error",()=>{
    console.log("Error de solicitud");
})
IDBRequest.addEventListener("upgradeneeded",()=>{
    console.log("solicitud finalizada");
    const database = IDBRequest.result;
    database.createObjectStore("contacts",{
        autoIncrement: true
    })
    database.createObjectStore("chats",{
        autoIncrement: true
    })
    console.log("object store creada");
    loadDefaultContacts();
})


export function getIDBData (objStore,modo){
    const database = IDBRequest.result;
    const IDBtransaction =  database.transaction(objStore,modo);
    const almacenContactos = IDBtransaction.objectStore(objStore);
    return [almacenContactos,IDBtransaction];
}

export function getDataByName(name){
    const IDBData = getIDBData("contacts","readonly");
    const cursor = IDBData[0].openCursor();
    cursor.addEventListener("success",()=>{
        if(cursor.result){
            if(cursor.result.value.name == name){
                return nameStatus = true;
            }else{
                cursor.result.continue();
            }
        }else{
            return nameStatus = false;
        }
    })
}

export function getDataByEmail(email){
    const IDBData = getIDBData("contacts","readonly");
    const cursor = IDBData[0].openCursor();
    cursor.addEventListener("success",()=>{
        if(cursor.result){
            if(cursor.result.value.email == email){
                return emailStatus = true;

            }else{
                cursor.result.continue();
            }

        }else{
            return emailStatus = false;
        }
    })
 
}
let nameStatus,emailStatus;
const verificarContacto = (nombre,email)=>{
    console.log("Verificando contacto...")
    getDataByName(nombre)
    getDataByEmail(email)
}


const alert = document.querySelector(".modal-warning")
const botonNuevoContacto = document.getElementById('añadirContacto');
const botonEliminarContacto = document.getElementById('eliminarContacto');
const botonCerrarMenu = document.querySelector(".boton-cerrar")
const modalContactos = document.getElementById("modal-contactos");

const inputNombre = document.getElementById("input-nombre");
const inputEmail = document.getElementById("input-email");
const botonAñadirContacto =document.querySelector(".boton-añadir");


const shake = (element)=>{
    element.style.transform="translateX(5px)"
    setTimeout(()=>{
    element.style.transform="translateX(-10px)"
    },100)
    setTimeout(()=>{
        element.style.transform="translateX(10px)"
    },200)
    setTimeout(()=>{
        element.style.transform="translateX(-10px)"
    },300)
    setTimeout(()=>{
        element.style.transform="translateX(0px)"
    },400)
}

const addedAnimation = ()=>{
    const headerAnimation = document.querySelector(".modal-header-animation")
    headerAnimation.style.transition="all 0s"
    headerAnimation.style.width = "0%";
    headerAnimation.style.opacity = "1";
    headerAnimation.style.color ="transparent";

    headerAnimation.style.transition="width 1s,color 1s,opacity 1s"
    headerAnimation.style.width = "100%";
    headerAnimation.style.color ="white";
    setTimeout(()=>{
        headerAnimation.style.color ="transparent"
        headerAnimation.style.width = "0%";
        
    },2500)
}



const validarCampos = ()=>{
    if(inputNombre.value.length < 4){
        alert.firstChild.textContent = "El Nombre debe contener al menos 4 caracteres."
        alert.style.display="flex";
        shake(alert)
        return false;
    }else if(
        (inputEmail.value.length < 8) ||(!inputEmail.value.includes('@')) ||(inputEmail.value.includes('..'))){
        alert.firstChild.textContent = "Email Inválido."
        alert.style.display="flex";
        shake(alert)
        return false;
    }else return true;
}



botonAñadirContacto.addEventListener("click",()=>{
    if (validarCampos()){
        const name = inputNombre.value;
        const email = inputEmail.value;
        verificarContacto(name,email);
        //modalContactos.style.display="none";
        setTimeout(()=>{

            if(emailStatus == true){

                alert.firstChild.textContent = "Contacto Existente."
                alert.style.display = "flex";

                return shake(alert)
                
            }
            if(nameStatus == true && emailStatus == false){

                alert.firstChild.textContent = "Ya existe un contacto con ese nombre."
                alert.style.display = "flex";

                return shake(alert)
                
            }
            const nuevoContacto = {
                name: name,
                email: email
            }
            añadirContacto(nuevoContacto);
            mostrarContactos();
            addedAnimation();
            alert.firstChild.textContent = ""
            alert.style.display = "none";
            inputNombre.value="";
            inputEmail.value="";
            /* setTimeout(()=>{
                setFirstContact(lastContactAddedKey)
            },600) */
            
        },600)
        
    }
    
})

botonCerrarMenu.addEventListener("click",()=>{
    modalContactos.style.display="none";
    alert.style.display ="none";
})

botonNuevoContacto.addEventListener("click",()=>{
    modalContactos.style.display="flex";
})
//ELIMINAR CONTACTOS
const modalEliminar = document.querySelector(".modal-eliminar-container")
const modalEliminarText = document.querySelector(".modal-eliminar-text")
const modalEliminarImg = document.querySelector(".modal-eliminar-img")
const btnEliminarSi = document.querySelector(".modal-eliminar-btnSi");
const btnEliminarNo = document.querySelector(".modal-eliminar-btnNo");

botonEliminarContacto.addEventListener("click",()=>{
    if(modalOcultarChat.classList.contains("hidden")){
        modalEliminar.classList.toggle("hidden");
        const contactToDeleteID = "c-"+currentChat
        const contactToDelete = document.getElementById(contactToDeleteID)
        modalEliminarText.textContent = `¿Estás seguro de que quieres eliminar a ${contactToDelete.firstElementChild.textContent}?`
        modalEliminarImg.src = contactToDelete.firstElementChild.nextElementSibling.firstElementChild.src
    }else{
        window.alert("Selecciona un contacto primero")
    }
    
})

btnEliminarNo.addEventListener("click",()=>{
    modalEliminar.classList.add("hidden");
})

btnEliminarSi.addEventListener("click",()=>{
    eliminarContacto(currentChat)
    eliminarChat(currentChat)
    modalEliminar.classList.add("hidden");
    mostrarContactos();
})


