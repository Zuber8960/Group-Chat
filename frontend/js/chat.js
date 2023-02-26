const form = document.getElementById('chat-form');
const backendAPIs = 'http://3.83.227.86:3000/chat';
const chat = document.getElementById('chat');
const searchBoxForm = document.getElementById('form-group');

const token = localStorage.getItem('token');
const groupId = localStorage.getItem('groupId');
const groupName = localStorage.getItem('groupName');
let userEmail = localStorage.getItem('email');
let username = localStorage.getItem('username');

let chatArray = [];
let lastMessageId;

let flag = true;
//for each 5 sec getting all messages store it on local storage as well as on frontend.
setInterval(async () => {
    await dom();
}, 2000);

//whenever page refresh sending last messageId of perticular group to backend and getting all messages with respective group.
window.addEventListener('DOMContentLoaded', dom());

async function dom(){
    document.getElementById('groupname').innerText = groupName;
    document.getElementById('username').innerText = `Hey! ${username.split(" ")[0]}`;

    let message = JSON.parse(localStorage.getItem(`messages${groupId}`));

    if (message == undefined || message.length == 0) {
        lastMessageId = 0;
    } else {
        lastMessageId = message[message.length - 1].id;
    }

    const response = await axios.get(`${backendAPIs}/getMessage/${groupId}?lastMessageId=${lastMessageId}`, { headers: { 'Authorization': token } });
    // console.log(response.data);
    const backendArray = response.data.arrayOfMessages;
    // console.log(backendArray);
    if(flag == false && backendArray.length==0){
        return ;
    }else{
        chatArray = [];
        chat.innerHTML = "";
    }

    if (message) {
        chatArray = message.concat(backendArray);
    } else {
        chatArray = chatArray.concat(backendArray);
    }
    

    if (chatArray.length > 50) {
        chatArray = chatArray.slice(chatArray.length - 50);
    }

    const localStorageMessages = JSON.stringify(chatArray);

    localStorage.setItem(`messages${groupId}`, localStorageMessages);

    // console.log(`messages===>`, JSON.parse(localStorage.getItem(`messages${groupId}`)));

    //display all messages on frontend.
    chatArray.forEach(ele => {
        // console.log(ele.message);
        if (ele.currentUser) {
            showMyMessageOnScreen(ele);
        } else {
            showOtherMessgeOnScreen(ele);
        }
    });
    flag = false;
    if(backendArray.length){
        chat.scrollTo(0, chat.scrollHeight);
    }
}


//whenever sending messages in group.
form.addEventListener('click', async (e) => {
    if (e.target.classList.contains('sendchat')) {
        try {
            e.preventDefault();
            const message = e.target.parentNode.message.value;
            const response = await axios.post(`${backendAPIs}/sendMessage/${groupId}`, { message: message }, { headers: { 'Authorization': token } });
            console.log(response.data);
            showMyMessageOnScreen(response.data.data);
            e.target.parentNode.message.value = null;

        } catch (err) {
            console.log(err);
            if (err.response.status == 400) {
                e.target.parentNode.message.value = null;
                return alert(err.response.data.message);
            }
            return document.body.innerHTML += `<div class="error">Something went wrong !</div>`;
        }
    }
})

//to add user inside group by searching his email in input box.
searchBoxForm.addEventListener('click', async (e) => {
    if (e.target.classList.contains('search-btn')) {
        try {
            e.preventDefault();
            const email = e.target.parentNode.email.value.trim();
            const response = await axios.post(`${backendAPIs}/addUser/${groupId}`, { email: email }, { headers: { 'Authorization': token } });

            console.log(response);

            alert(response.data.message);
        } catch (err) {
            console.log(err);
            alert(err.response.data.message);
        }

        e.target.parentNode.email.value = "";

    }
})

//function for my message will display on screen.
function showMyMessageOnScreen(obj) {
    const timeForUser = time(obj.createdAt);
    const dateOfUser = date(obj.createdAt);
    if(obj.message.indexOf('https://') == 0 || obj.message.indexOf('http://') == 0){
        chat.innerHTML += `
            <li class="me">
            <div class="entete">
              <h3>${timeForUser}, ${dateOfUser}</h3>
              <h2>${username}</h2>
              <span class="status blue"></span>
            </div>
            <div class="triangle"></div>
            <div class="message">
                <a href="${obj.message}">Link</a>
            </div>
          </li>
          `
    }else{
        chat.innerHTML += `
            <li class="me">
            <div class="entete">
              <h3>${timeForUser}, ${dateOfUser}</h3>
              <h2>${username}</h2>
              <span class="status blue"></span>
            </div>
            <div class="triangle"></div>
            <div class="message">
              ${obj.message}
            </div>
          </li>
          `
    }
}

//function for other's messages will display on screen.
function showOtherMessgeOnScreen(obj) {
    const timeForUser = time(obj.createdAt);
    const dateOfUser = date(obj.createdAt);

    if(obj.message.indexOf('https://') == 0 || obj.message.indexOf('http://') == 0){
        chat.innerHTML += `
        <li class="you">
            <div class="entete">
                <span class="status green"></span>
                <h2>${obj.name}</h2>
                <h3>${timeForUser}, ${dateOfUser}</h3>
            </div>
            <div class="triangle"></div>
            <div class="message">
                <a href="${obj.message}">Link</a>
            </div>
        </li>
      `
    }else{
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
    
}

//convert string to getting time in 11:06 PM formet.
function time(string) {
    const time_object = new Date(string);
    return time_object.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

//convert string to getting date/Today/Yesterday.
function date(string) {
    const today = new Date();
    const date_object = new Date(string);

    const today_date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()}`;
    const yesterday_date = `${today.getDate() - 1}-${(today.getMonth() + 1)}-${today.getFullYear()}`;
    const gettingDate = `${date_object.getDate()}-${(date_object.getMonth() + 1)}-${date_object.getFullYear()}`;

    if (today_date == gettingDate) {
        return 'Today';
    } else if (gettingDate == yesterday_date) {
        return 'Yesterday'
    }
    
    return date_object.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

//burger button functionallity
const allName = document.getElementById('group');

const burgerButton = document.querySelector(".burger-button");
const burgerMenu = document.querySelector(".burger-menu");

burgerButton.addEventListener("click", function() {
    burgerButton.classList.toggle("active");
    burgerMenu.classList.toggle("active");
    openBox();
});


//getting all users and admin details.
let numOfUsers;
async function openBox() {
    const users = await axios.get(`${backendAPIs}/getUsers/${groupId}`);
    // console.log(users.data);
    numOfUsers = users.data.userDetails.length;

    allName.innerHTML = `
    <li class="names"><u>User(${numOfUsers})</u><span style="float:right;"><u>Admin Status</u></span></li>
    `
    if (users.data.adminEmail.includes(userEmail)) {
        users.data.userDetails.forEach(user => {
            displayNameForAdmin(user);
        })
    } else {
        users.data.userDetails.forEach(user => {
            displayNameForOther(user);
        })
    }

}

//if user is an Admin
function displayNameForAdmin(user) {
    if (user.isAdmin) {
        allName.innerHTML += `
        <li class="names" id="name${user.email}">${user.name}<button class="delete" onClick="deleteUser('${user.email}')">X</button><button id="admin${user.email}" class="userButton" onClick="removeAdmin('${user.email}')">remove admin</button></li>
        `
    } else {
        allName.innerHTML += `
        <li class="names" id="name${user.email}">${user.name}<button class="delete" onClick="deleteUser('${user.email}')">X</button><button id="admin${user.email}" class="userButton" onClick="makeAdmin('${user.email}')">make admin</button></li>
        `
    }
    if (user.email == userEmail) {
        document.getElementById(`name${userEmail}`).style.color = "rgb(186, 244, 93)";
    }
}

//if user is not Admin.
function displayNameForOther(user) {
    if (user.isAdmin) {
        allName.innerHTML += `
        <li class="names" id="name${user.email}">${user.name}</button><button class="userButton">✔️</button></li>
        `
    } else {
        allName.innerHTML += `
        <li class="names" id="name${user.email}">${user.name}</li>
        `
    }

    if (user.email == userEmail) {
        document.getElementById(`name${userEmail}`).style.color = "rgb(186, 244, 93)";
        document.getElementById(`name${userEmail}`).innerHTML += `
        <button class="delete" onClick="deleteUser('${userEmail}')">X</button>
        `
    }
}

//making another user as an Admin.
async function makeAdmin(email) {
    // console.log(email);
    try {
        const response = await axios.post(`${backendAPIs}/makeAdmin/${groupId}`, { email: email }, { headers: { 'Authorization': token } });
        console.log(response);
        document.getElementById(`admin${email}`).innerText = 'remove admin';
        document.getElementById(`admin${email}`).setAttribute('onClick', `removeAdmin('${email}')`);

        alert(response.data.message);
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }

}

//delete admin functionallity from any Admin user.
async function deleteUser(email) {
    if (confirm('Are you sure')) {
        try {
            console.log(email);
            const response = await axios.post(`${backendAPIs}/deleteUser/${groupId}`, { email: email }, { headers: { 'Authorization': token } });
            console.log(response);
            allName.removeChild(document.getElementById(`name${email}`));
            
            numOfUsers = +numOfUsers - 1;
            allName.firstElementChild.firstElementChild.innerText = `User(${numOfUsers})`;

            alert(response.data.message);
        } catch (err) {
            console.log(err);
            alert(err.response.data.message);
        }
    }
}

//delete user from the group.
async function removeAdmin(email) {
    try {
        if(confirm(`Are you sure ?`)){
            console.log(email);
            const response = await axios.post(`${backendAPIs}/removeAdmin/${groupId}`, { email: email }, { headers: { 'Authorization': token } });
            console.log(response);
            document.getElementById(`admin${email}`).innerText = 'make admin';
            document.getElementById(`admin${email}`).setAttribute('onClick', `makeAdmin('${email}')`);
    
            alert(response.data.message);
        }
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
}



async function uploadFile(){
    try{
        const upload = document.getElementById('uploadFile');
        const formData = new FormData(upload);
        // const file = document.getElementById('sendFile').files[0];
        // formData.append('username', 'Zuber');
        // formData.append('file' , file);
        // console.log(formData);
        const responce = await axios.post(`${backendAPIs}/sendFile/${groupId}` , formData , { headers: { 'Authorization': token, "Content-Type":"multipart/form-data" } });
        console.log(responce.data);
        document.getElementById('sendFile').value = null;
        showMyMessageOnScreen(responce.data.data);
    }catch(err){
        console.log(err);
        if(err.response.status == 400){
            return alert(err.response.data.message);
        }
    }
    
}


//logout functionality
function logout(){
    if(confirm('Are you sure ?')){
        localStorage.clear();
        return window.location.href = './login.html';
    }
}
