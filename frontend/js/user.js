const form = document.getElementById('form')

form.addEventListener('click' , (e) => {
    if(e.target.classList.contains('btn-success')){
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

        axios.post('http://localhost:3000/user/signup', obj)
        .then(res => {
            console.log(res)
            if(res.data.message){
                return alert(res.data.message);
            }
        })
        .catch(err => {
            console.log(err);
            if(err.response.status == 404){
                return document.body.innerHTML += `<div class="error">${err.response.data.message}</div>`;
            }
            return document.body.innerHTML += `<div class="error">Something went wrong !</div>`;
        })
    }
})

