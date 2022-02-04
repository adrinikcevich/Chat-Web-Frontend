import {getIDBData} from "../index.js";
import { defaultPfps,setFirstContact} from "./contacts.js";

const inputText = document.getElementById("escribir");
const inputSend = document.getElementById("boton-enviar");
export const modalOcultarChat = document.querySelector(".modal-ocultarchat")
export let currentChat=1;

const guardarMensaje = (id,text,date,hrs)=>{
    const IDBDataChats= getIDBData("chats","readwrite");
    const cursor = IDBDataChats[0].openCursor();
    cursor.addEventListener("success",()=>{
        if(cursor.result.key == id){
            let key = cursor.result.key;
            let mensaje;
            if (cursor.result.value.msgs.length == 0){
                mensaje = new Msg(0,text,date,hrs);
            }else{
                const newID = cursor.result.value.msgs[cursor.result.value.msgs.length -1].id + 1;
                mensaje = new Msg(newID,text,date,hrs);
            }
            let updatedArray = [...cursor.result.value.msgs,mensaje]
            IDBDataChats[0].put({"msgs":updatedArray},key)
        }else{
            cursor.result.continue();
        }
    })
    loadChatMsgs();
}

class Msg{
    constructor(id,content,date,hrs){
        this.id = id,
        this.content = content,
        this.date = date
        this.hrs = hrs
    }
}


document.addEventListener("keydown",(e)=>{
    if (e.key == 'Enter' && modalOcultarChat.classList.contains("hidden")){
        enviarMsg();
    }
})

const enviarMsg = ()=>{
    let date = new Date();
    let hrs = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    if (hrs < 10){
        hrs = "0"+hrs;
    }
    if (min < 10){
        min = "0"+min;
    }
    if (sec < 10){
        sec = "0"+sec;
    }
    const fecha = date.toDateString()
    const hora = `${hrs}:${min}:${sec}`
    if (inputText.value !== "" && inputText.value.trim().length > 0){
        guardarMensaje(currentChat,inputText.value,fecha,hora);
        inputText.value = "";
    }
    setFirstContact(currentChat);
}

inputSend.addEventListener("click",()=>
enviarMsg())

export function refrescarContactos(lista){
    lista.forEach((contact)=>{
        const pfp = contact.firstChild.nextSibling
        contact.addEventListener("click",(e)=>{
            let ID = ""
            for(let i=2;i<contact.id.length;i++){
                ID+=contact.id.charAt(i)
                currentChat=parseInt(ID);
            }
            if(parseInt(ID) < 11){
                mostrarChatInfo(parseInt(ID),defaultPfps[parseInt(ID)]);
            }else{
                mostrarChatInfo(parseInt(ID),"https://i.pinimg.com/474x/9b/47/a0/9b47a023caf29f113237d61170f34ad9.jpg");
            }
            modalOcultarChat.classList.add("hidden")
            document.querySelectorAll('.contacto').forEach((c)=>{
                c.classList.remove("contacto-active")
                document.querySelector("#chat-contenedor").classList.remove("chat-responsive")
            })
            contact.classList.add("contacto-active")
            document.querySelector("#chat-contenedor").classList.add("chat-responsive")
           

            const responsiveBtn = document.querySelector(".responsiveBtn-container")
            const btnStyle = getComputedStyle(responsiveBtn)
            if(btnStyle.display != 'none'){
                document.querySelector("#contactos").classList.add("hidden")
            }
            
        })  

    })
    document.querySelectorAll('.contacto-pfp').forEach((c)=>{
        c.addEventListener("click",(e)=>{
            document.querySelectorAll('.contacto').forEach((c)=>{
                c.classList.remove("contacto-active")
                document.querySelector("#chat-contenedor").classList.remove("chat-responsive")
            })
            e.target.parentElement.parentElement.classList.add("contacto-active")
            document.querySelector("#chat-contenedor").classList.add("chat-responsive")
            
            const responsiveBtn = document.querySelector(".responsiveBtn-container")
            const btnStyle = getComputedStyle(responsiveBtn)
            if(btnStyle.display != 'none'){
                document.querySelector("#contactos").classList.add("hidden")
            }
        })
    })
    
}
export const ocultarChatInfo = ()=>{
    
}
export const mostrarChatInfo = (id,pfp)=>{
    const nombre = document.getElementById("chat-nombre");
    const telefono = document.getElementById("chat-telefono");
    const PFP = document.querySelector('.chat-info__pfp')

    const IDBData = getIDBData("contacts","readonly");
    const cursor = IDBData[0].openCursor();
    cursor.addEventListener("success", ()=>{
        if(id != cursor.result.key){
            cursor.result.continue();
        }else {
            nombre.textContent = cursor.result.value.name;
            telefono.textContent = cursor.result.value.email;
            PFP.setAttribute("src",pfp)
        }
    });
    loadChatMsgs();
}

export class Chat {
    constructor(msgs){
        this.msgs = msgs
    }
}

export const generateChat = (key)=>{
    const IDBDataContacts = getIDBData("contacts","readonly");
    const IDBDataChats= getIDBData("contacts","readwrite");
    const chatInfo = document.createElement("DIV");
    const chat = document.createElement("DIV")
}

export const newChat = ()=>{
    const IDBData = getIDBData("chats","readwrite");
    const newChat = new Chat([])
    IDBData[0].add(newChat);
}

export const loadChatMsgs = ()=>{
    const IDBDataChats = getIDBData("chats","readonly");
    const cursor = IDBDataChats[0].openCursor();
    const fragment =document.createDocumentFragment();
    document.querySelector(".chat").innerHTML ="";
    cursor.addEventListener("success",()=>{
        if(cursor.result.key == currentChat){
            const mensajes = cursor.result.value.msgs;
            mensajes.forEach((msg)=>{
                let m = createMsgElement(msg.id,msg.content,msg.date,msg.hrs);
                //fragment.appendChild(m);
                fragment.insertBefore(m,fragment.firstChild);
            })
            document.querySelector(".chat").appendChild(fragment);

        }else{
            cursor.result.continue();
        }
        
    })
}

const createMsgElement = (id,text,date,hrs)=>{
    const container = document.createElement("SPAN");
    container.classList.add("chat-msg");
    
    const msg = document.createElement("P");
    msg.setAttribute("id",id);
    msg.textContent = text;
    msg.classList.add("msg-content")

    const day = document.createElement("P");
    const hr = document.createElement("P")
    day.textContent = date;
    hr.textContent = hrs;

    const info = document.createElement("div");
    info.appendChild(day);
    info.appendChild(hr);
    info.classList.add("msg-info")

    container.appendChild(msg);
    container.appendChild(info);

    return container;
}  

const responsiveBtn = document.querySelector(".responsiveBtn-container")

responsiveBtn.addEventListener("click",()=>{
    document.querySelector(".chat-contenedor").classList.remove("chat-responsive")
    document.querySelector("#contactos").classList.remove("hidden")
    
})