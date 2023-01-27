const form = document.getElementById('chat-form');
const backendAPIs = 'http://localhost:3000/chat';
const token = localStorage.getItem('token');
const chat = document.getElementById('chat');

window.addEventListener('DOMContentLoaded' , async() => {
    const response = await axios.get(`${backendAPIs}/getMessage` ,{headers : {'Authorization' : token} });
    console.log(response);
    response.data.messages.forEach(ele => {
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

            const response = await axios.post(`${backendAPIs}/sendMessage`, { message: message }, { headers: { 'Authorization': token } });
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
    chat.innerHTML += `
            <li class="me">
            <div class="entete">
              <h3>${timeForUser}, Today</h3>
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
                    ${obj.message};
                </div>
            </li>
          `
}


function time(string){
    const time_object = new Date(string);
    return time_object.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function date(string){
    const date_object = new Date(string);
    return date_object.toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"});
}