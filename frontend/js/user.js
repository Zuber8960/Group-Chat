const form = document.getElementById('form');
const backendAPIs = 'http://localhost:3000/user'

form.addEventListener('click' , (e) => {
    if(e.target.classList.contains('signup')){
        e.preventDefault();
        console.log('abcd');
        let name;
        const first_name = e.target.parentNode.parentNode.first_name.value.trim();
        const last_name = e.target.parentNode.parentNode.last_name.value.trim();
        if(last_name){
            name = first_name+" "+last_name;
        }else{
            name = first_name;
        }
        const email = e.target.parentNode.parentNode.email.value.trim();
        const phonenumber = e.target.parentNode.parentNode.phonenumber.value.trim();
        const password = e.target.parentNode.parentNode.password.value;
        const confirm_password = e.target.parentNode.parentNode.confirm_password.value;
        if(password !== confirm_password){
            return alert('massword not matched');
        }
        const obj = {name, email, phonenumber, password};
        console.log(obj);

        axios.post(`${backendAPIs}/signup`, obj)
        .then(res => {
            console.log(res)
            if(res.data.message){
                return alert(res.data.message);
            }
            return alert('Signed up Successfuly !');
        })
        .catch(err => {
            console.log(err);
            return document.body.innerHTML += `<div class="error">Something went wrong !</div>`;
        })
    }

    if(e.target.classList.contains('login')){
        e.preventDefault();
        const email = e.target.parentNode.parentNode.email.value.trim();
        const password = e.target.parentNode.parentNode.password.value;
        const obj = {email, password};
        console.log(obj);
        axios.post(`${backendAPIs}/login`, obj)
        .then(res => {
            console.log(res);
            if(res.data.message){
                return alert(res.data.message);
            }
            return alert('Logged in Successfuly !');
        })
        .catch(err => console.log(err));
    }
})

