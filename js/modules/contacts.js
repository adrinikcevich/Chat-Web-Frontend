import {getIDBData,getDataByEmail,getDataByName} from "../index.js";
import { refrescarContactos,mostrarChatInfo,Chat, newChat, modalOcultarChat} from "../modules/chats.js";
export let existente;
export let lastContactAddedKey;

export const añadirContacto = (contacto)=>{
    const IDBData = getIDBData("contacts","readwrite");
    IDBData[0].add(contacto)
    IDBData[1].addEventListener("complete",()=>console.log("contacto añadido"))
    newChat();
}


export const eliminarContacto = (key)=>{
    const IDBData = getIDBData("contacts","readwrite");
    IDBData[0].delete(key)
    IDBData[1].addEventListener("complete",()=>console.log("contacto eliminado"))
    modalOcultarChat.classList.remove("hidden")
}
export const eliminarChat = (key)=>{
    const IDBData = getIDBData("chats","readwrite");
    IDBData[0].delete(key)
    IDBData[1].addEventListener("complete",()=>console.log("chat eliminado"))
}

export const mostrarContactos = ()=>{
    const IDBData = getIDBData("contacts","readonly");
    const cursor = IDBData[0].openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector("#lista-contactos").innerHTML ="";
    cursor.addEventListener("success", ()=>{
        if(cursor.result){
            let element = listaContactos(cursor.result.key,cursor.result.value);
            fragment.appendChild(element);
            lastContactAddedKey=cursor.result.key;
            
            cursor.result.continue()
            
        }
        else {
            document.querySelector("#lista-contactos").appendChild(fragment);
            refrescarContactos(document.querySelectorAll(".contacto"))
            setFirstContact(lastContactAddedKey)
        }
    });
}


export const listaContactos = (key,name)=>{
    const contenedor = document.createElement("DIV");
    const h1 = document.createElement("H1");
    const pfpContenedor = document.createElement("DIV");
    const pfp = document.createElement("IMG");
    contenedor.classList.add("contacto");
    contenedor.setAttribute("id","c-"+key);
    h1.classList.add("contacto-nombre");
    pfpContenedor.classList.add("pfp-contenedor");
    pfp.classList.add("contacto-pfp");
    if(key < 11){
        pfp.setAttribute("src",defaultPfps[key])
    }else{
        pfp.setAttribute("src","https://i.pinimg.com/474x/9b/47/a0/9b47a023caf29f113237d61170f34ad9.jpg")
    }
    
    h1.textContent = name.name;

    pfpContenedor.appendChild(pfp);
    contenedor.appendChild(h1);
    contenedor.appendChild(pfpContenedor);
    return contenedor;
}



export const loadDefaultContacts = async()=>{
    const req = await fetch("https://jsonplaceholder.typicode.com/users")
    const data = await req.json();
    const IDBDataContacts = getIDBData("contacts","readwrite");
    const IDBDataChats = getIDBData("chats","readwrite");
    console.log(IDBDataChats)
    data.map((contact)=>{
        const newChat = new Chat([])
        IDBDataContacts[0].add(contact);
        IDBDataChats[0].add(newChat)
    })
    mostrarChatInfo(10,defaultPfps[10]);
    mostrarContactos();

}

export const defaultPfps = [
    'https://1.bp.blogspot.com/-wDSq0sy-Lro/YQqbRZ3HboI/AAAAAAAAGKs/uV4K5FhUOsAdn9U2YpmnmyzgqJ_MUYOQgCLcBGAsYHQ/s634/Screenshot_20210804-144347_1.png',
    'https://www.movilzona.es/app/uploads-movilzona.es/2019/05/Foto-de-Perfil-en-WhatsApp.jpg?x=480&y=375&quality=40',
    'https://meragor.com/files/styles//ava_800_800_wm/_s1200_21_0.jpg',
    'https://wl-genial.cf.tsp.li/resize/728x/jpg/91b/430/964a9c5ac9933cc012d0bd80be.jpg',
    'https://1.bp.blogspot.com/-UbSotTBNCgQ/YPr1sHfh8fI/AAAAAAAAF1M/LXWIyUwN5QQ-cY257yjcDNYaz4TcAxbrwCLcBGAsYHQ/s652/Screenshot_20210723-175150_1.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhb5bDAz1GiId4eVGSdBAVXa4WbfVJkltttQ&usqp=CAU',
    'https://holatelcel.com/wp-content/uploads/2019/09/foto-whatsapp.jpg',
    'https://i.pinimg.com/originals/1c/5f/74/1c5f74351d381693e1570423c8ccdaf8.jpg',
    'https://i.pinimg.com/originals/c4/1c/3b/c41c3b1b0475c61089bca75ec472e883.jpg',
    'https://i1.wp.com/support.discord.com/hc/article_attachments/360060702392/best_doggo.png?resize=278%2C239&ssl=1',
    'https://i.pinimg.com/236x/f6/bc/ec/f6bcec6f4aa612010380ee1c4355db3b--animal-testing-experiment.jpg'
]

export const setFirstContact = (key)=>{
    let newFirstContactID = 'c-'+key
    let listaContactos = document.getElementById("lista-contactos")
    let firstContact = listaContactos.firstElementChild
    let newFirstContact =  document.getElementById(newFirstContactID)
    listaContactos.insertBefore(newFirstContact,firstContact)
}

