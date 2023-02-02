const form = document.getElementById('form');
const backendAPIs = 'http://localhost:3000/group';
const token = localStorage.getItem('token');
const groups = document.getElementById('groups');
const otherGroups = document.getElementById('otherGroups');

//getting all groups on screen
window.addEventListener('DOMContentLoaded', async() => {
    const response = await axios.get(`${backendAPIs}/getGroup`, {headers : {'Authorization' : token} });
    console.log(response.data);

    if(!response.data.groups.length){
       groups.style.display = "none";
    }

    const groupsId = [];
    response.data.groups.forEach(ele => {
        groupsId.push(ele.id);
        groups.innerHTML += `
        <div  class="group-name" id="${ele.id}">${ele.name}
            <button class="delete"">delete</button>
        </div>
        `
    });

    const result = await axios.post(`${backendAPIs}/getAllGroups` , {groupsId : groupsId});
    console.log(result.data);
    if(!result.data.allOtherGroups.length){
        return otherGroups.style.display = "none";
     }

    result.data.allOtherGroups.forEach(ele => {
        otherGroups.innerHTML += `
        <div  class="other-group-name" id="${ele.id}">${ele.name}
            <button class="join">JOIN</button>
        </div>
        `
    })
})

//creating a group
form.addEventListener('click' , async (e) => {
    if(e.target.classList.contains('group')){
        e.preventDefault();
        console.log('group=======>');

        const group_name = e.target.parentNode.parentNode.group.value.trim();

        const response = await axios.post(`${backendAPIs}/createGroup`, {group_name : group_name} , {headers : {'Authorization' : token} });
        console.log(response);
        e.target.parentNode.parentNode.group.value = null;

        if(groups.style.display == 'none'){
            groups.style.display = 'block';
        }

        groups.innerHTML += `
        <div  class="group-name" id="${response.data.id}">${response.data.name}
            <button class="delete"">delete</button>
        </div>
        `
    }
})


groups.addEventListener('click' , async (e) => {
    
    if(e.target.classList.contains('group-name')){
        const id = e.target.id;
        const name = e.target.innerText.split("\n")[0];
        
        localStorage.setItem('groupId', id);
        localStorage.setItem('groupName', name);
        return window.location.href = './chat.html'
    }

    if(e.target.classList.contains('delete')){
        if(confirm(`Are you sure ?`)){
            try{
                const id = e.target.parentNode.id;
                const response = await axios.get(`${backendAPIs}/delete/${id}`, { headers : {'Authorization' : token} });
                // console.log(response.data);
        
                e.target.parentNode.remove();
                alert(response.data.message);
        
            }catch(err){
                console.log(err);
                alert(err.response.data.message);
            }
        }
    }
})


//for joining any other group.
otherGroups.addEventListener('click' , async (e) => {
    if(e.target.classList.contains('join')){
        const name = e.target.parentNode.innerText.split('\n')[0];
        const id = e.target.parentNode.id;
        const result = await axios.get(`${backendAPIs}/join/${id}` , { headers : {'Authorization' : token} });
        console.log(result);

        e.target.parentNode.remove();

        groups.innerHTML += `
        <div  class="group-name" id="${id}">${name}
            <button class="delete"">delete</button>
        </div>
        `
        if(groups.style.display == "none"){
            groups.style.display = "block";
        }

        alert(result.data.message);

    }
})

function logout(){
    if(confirm('Are you sure ?')){
        localStorage.clear();
        return window.location.href = './login.html';
    }
}