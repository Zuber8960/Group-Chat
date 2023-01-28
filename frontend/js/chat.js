const form = document.getElementById('chat-form');
const backendAPIs = 'http://localhost:3000/chat';
const chat = document.getElementById('chat');


const token = localStorage.getItem('token');
const groupId = localStorage.getItem('groupId');
const groupName = localStorage.getItem('groupName');
let username = localStorage.getItem('username');
username = username.split(" ")[0];

let chatArray = [];
let lastMessageId ;

// setInterval(function() {
//     location.reload();
//  }, 8000);


window.addEventListener('DOMContentLoaded' , async() => {
    document.getElementById('groupname').innerText = groupName;
    document.getElementById('username').innerText = `Hey ${username} !`;

    let message = JSON.parse(localStorage.getItem(`messages${groupId}`));
    if(message == undefined || message.length == 0 ){
        lastMessageId = 0;
    }else{
        lastMessageId = message[message.length -1].id;
    }

    const response = await axios.get(`${backendAPIs}/getMessage/${groupId}?lastMessageId=${lastMessageId}` ,{headers : {'Authorization' : token} });
    console.log(response.data);
    const backendArray = response.data.messages;

    if(message){
        chatArray = message.concat(backendArray);
    }else{
        chatArray = chatArray.concat(backendArray);
    }

    // while(chatArray.length>10){
    //     chatArray.shift();
    // }

    if(chatArray.length>10){
        chatArray = chatArray.slice(chatArray.length-10);
    }

    const localStorageMessages = JSON.stringify(chatArray);

    localStorage.setItem(`messages${groupId}`, localStorageMessages);

    console.log(`messages===>` , JSON.parse(localStorage.getItem(`messages${groupId}`)));

    chatArray.forEach(ele => {
        if(ele.currentUser){
            showMyMessageOnScreen(ele);
        }else{
            showOtherMessgeOnScreen(ele);
        }
    });
})

form.addEventListener('click', async (e) => {
    if (e.target.classList.contains('sendchat')) {
        try {
            e.preventDefault();
            const message = e.target.parentNode.message.value;

            const response = await axios.post(`${backendAPIs}/sendMessage/${groupId}`, { message: message }, { headers: { 'Authorization': token } });
            console.log(response);
            showMyMessageOnScreen(response.data.data);
            e.target.parentNode.message.value = null;

        } catch (err) {
            console.log(err);
            if (err.response.status == 400) {
                return alert(err.response.data.message);
            }
            return document.body.innerHTML += `<div class="error">Something went wrong !</div>`;
        }

    }
})

function showMyMessageOnScreen(obj){
    const timeForUser = time(obj.createdAt);
    const dateOfUser = date(obj.createdAt);
    chat.innerHTML += `
            <li class="me">
            <div class="entete">
              <h3>${timeForUser}, ${dateOfUser}</h3>
              <h2>${obj.name}</h2>
              <span class="status blue"></span>
            </div>
            <div class="triangle"></div>
            <div class="message">
              ${obj.message}
            </div>
          </li>
          `
}

function showOtherMessgeOnScreen(obj){
    const timeForUser = time(obj.createdAt);
    const dateOfUser = date(obj.createdAt);
    
    chat.innerHTML += `
            <li class="you">
                <div class="entete">
                    <span class="status green"></span>
                    <h2>${obj.name}</h2>
                    <h3>${timeForUser}, ${dateOfUser}</h3>
                </div>
                <div class="triangle"></div>
                <div class="message">
                    ${obj.message}
                </div>
            </li>
          `
}


function time(string){
    const time_object = new Date(string);
    return time_object.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function date(string){
    const today = new Date();
    const date_object = new Date(string);
    
    const today_date = `${today.getDate()}-${(today.getMonth() +1)}-${today.getFullYear()}`;
    const yesterday_date = `${today.getDate() -1}-${(today.getMonth() +1)}-${today.getFullYear()}`;
    const gettingDate = `${date_object.getDate()}-${(date_object.getMonth() +1)}-${date_object.getFullYear()}`;
    if(today_date == gettingDate){
        return 'Today';
    }else if(gettingDate == yesterday_date){
        return 'Yesterday'
    }
    return date_object.toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"});
}



//burger-button funtionallity
const menuBtn = document.querySelector('.menu-btn');
let menuOpen = false;
menuBtn.addEventListener('click', ()=> {
    if(!menuOpen) {
        menuBtn.classList.add('open');
        menuOpen=true;
    }
    else {
        menuBtn.classList.remove('open');
        menuOpen=false;
    }
})

