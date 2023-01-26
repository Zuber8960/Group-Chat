const form = document.getElementById('chat-form');
const backendAPIs = 'http://localhost:3000/chat';
const token = localStorage.getItem('token');

form.addEventListener('click' , async (e) => {
    if(e.target.classList.contains('sendchat')){
        try{
            e.preventDefault();
            const message = e.target.parentNode.message.value;
    
            const response = await axios.post(`${backendAPIs}/sendMessage`, {message : message} , { headers : {'Authorization' : token}});
            console.log(response);
        }catch(err){
            console.log(err);
            if(err.response.status == 400){
                return alert(err.response.data.message);
            }
            return document.body.innerHTML += `<div class="error">Something went wrong !</div>`;
        }
        
    }
})