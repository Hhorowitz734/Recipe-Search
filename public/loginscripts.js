//https://www.youtube.com/watch?v=ILviQic0c8g
//Use this file

//Important elements
const registertgl = document.querySelector('.registerbtn');
let state = 0 //State of the website - 0 - Currently Login 1 - Currently Register
const signintxt = document.querySelector('.signintxt');
const submitbtn = document.querySelector('.submitbtn');
const loginform = document.querySelector('.loginform');
const usernameinput = document.querySelector('.usernameinput');
const passwordinput = document.querySelector('.passwordinput');
let emailinput;

// Website responsiveness code
document.addEventListener("DOMContentLoaded", function() {
    var newSelect;
    var mediaQuery = window.matchMedia("(max-width: 900px)");
    if (mediaQuery.matches) {
        newSelect = createNewSelect();
    }
    mediaQuery.addListener(function(changed) {
        if (changed.matches) {
            newSelect = createNewSelect();
        } else {
            if (newSelect) {
                var navselector = document.getElementById("navselector");
                navselector.removeChild(newSelect);
                newSelect = null;
            }
        }
    });
    
    function createNewSelect() {
        var newSelect = document.createElement("select");
        var homeOption = document.createElement("option");
        var homeLink = document.getElementById("home").querySelector("a");
        homeOption.appendChild(homeLink.cloneNode(true));
        newSelect.appendChild(homeOption);
        var deckOption = document.createElement("option");
        var deckLink = document.getElementById("deck").querySelector("a");
        deckOption.appendChild(deckLink.cloneNode(true));
        newSelect.appendChild(deckOption);
        var signinOption = document.createElement("option");
        var signinLink = document.getElementById("signin").querySelector("a");
        signinOption.appendChild(signinLink.cloneNode(true));
        newSelect.appendChild(signinOption);
        var navselector = document.getElementById("navselector");
        navselector.appendChild(newSelect);
        newSelect.value = 'Sign In';
        createSelectListener(newSelect);
        return newSelect;
    }
});

function createSelectListener(newSelect){
    newSelect.addEventListener('change', () => {
        console.log('here');
        if (newSelect.value == 'Home'){
            window.location = "/";
        }
        else if (newSelect.value == 'Deck'){
            window.location = "/deck"
        }
        else {
            window.location = "/login";
        }
})}

//Switches Login Section to Register
registertgl.addEventListener('click', (event)=>{
    event.preventDefault();
    if (state == 0){
        signintxt.innerText = 'Register';
        registertgl.innerText = 'Sign In';
        submitbtn.value = 'Sign Up';
        emailinput = document.createElement("input");
        emailinput.type = "text";
        emailinput.placeholder = "email";
        let thirdChild = loginform.childNodes[2];
        loginform.insertBefore(emailinput, thirdChild);

    }
    else {
        signintxt.innerText = 'Sign In';
        registertgl.innerText = 'Register';
        submitbtn.value = 'Login'
        loginform.removeChild(emailinput);
    }
    state = Math.abs(state - 1);
})

//Code to process user login and registration
submitbtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (state == 0){
        executeUserLogin();  //BUILD OUT THIS FUNCTION
    }
    else{
        executeUserRegister(); // BUILD OUT THIS FUNCTION
    }

    let cookies = document.cookie;
    let loggedInCookie = cookies.split(';').find(c => c.trim().startsWith('loggedIn='));

    if (loggedInCookie) {
        let loggedInValue = loggedInCookie.split('=')[1];
    
        if (loggedInValue != 'false') {
            window.location = "/";
        }
    }


})

async function executeUserRegister(){
    //Get values from form
    const email = emailinput.value;
    const username = usernameinput.value;
    const password = passwordinput.value;
    
    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            email
        })
    }).then((res) => res.json());

    if (result.status == 'ok'){
        executeUserLogin();
    } else{
        if (result.error == 'Invalid password'){
            passwordinput.style.border = '1px solid red';
        }
        else if (result.error == 'Invalid email'){
            emailinput.style.border = '1px solid red';
        }
        else {
            usernameinput.style.border = '1px solid red';
        }
    }

}

async function executeUserLogin(){
    const username = usernameinput.value;
    const password = passwordinput.value;

    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json());

    if (result.status == 'ok'){
        window.location = "/"
    } else{
        usernameinput.style.border = '1px solid red';
        passwordinput.style.border = '1px solid red';
    }

}