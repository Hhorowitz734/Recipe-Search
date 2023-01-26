
//Elements
const bigtext = document.querySelector('.bigtext');
const smalltext = document.querySelector('.smalltext');
const arrow = document.querySelector('.arrow');
const deckview = document.querySelector('.deck');
const textarea = document.querySelector('.textarea');
const deckgrid = document.querySelector('.card-grid');

let isLoggedIn = false;

//Script for text management
bigtext.addEventListener('mouseover', colorText);
bigtext.addEventListener('mouseout', cleanText);
smalltext.addEventListener('mouseover', colorText);
smalltext.addEventListener('mouseout', cleanText);
arrow.addEventListener('mouseover', colorText);
arrow.addEventListener('mouseout', cleanText);

function colorText(){
    bigtext.style.color = '#F0BB32';
    smalltext.style.color = '#F0BB32';
    arrow.style.color = '#F0BB32';
}

function cleanText(){
    bigtext.style.color = 'white';
    smalltext.style.color = 'white';
    arrow.style.color = 'white';
}

//Sets text to 'logged in' state
function loggedIn(username){
    bigtext.innerText = `${username}'s deck.`;
    smalltext.innerText = `Delicious. Classy. Innovative. Click here to see the recipes that ${username} saved.`
    smalltext.style.fontSize = '1.8rem';
    arrow.innerText = "\u2304";
}


// Checks if user is logged in
document.addEventListener("DOMContentLoaded", () => {
    if(document.cookie.indexOf("token") >= 0) {
        const token = ('; '+document.cookie).split(`; token=`).pop().split(';')[0];
        fetch('/api/validate-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'ok') {
              document.getElementById('signin').remove();
              isLoggedIn = true; //USE THIS TO HANDLE NAVBAR COMPRESSION
              loggedIn(data.data.username);
            } else {
              console.log(data.error); // logged the error message
            }
          })
          .catch(error => console.log(error));
    } else {
        console.log("Not logged in yet.");
    }
    
    //Here, get the cookie token (if it exists) and validate it against the backend
    //Then, if it is valid, remove the signin text, and don't render a 'log in' option in the dropdown
})

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
        deckOption.setAttribute("selected", "selected");
        newSelect.appendChild(deckOption);
        if (!isLoggedIn){
            var signinOption = document.createElement("option");
            var signinLink = document.getElementById("signin").querySelector("a");
            signinOption.appendChild(signinLink.cloneNode(true));
            newSelect.appendChild(signinOption);
        }
        var navselector = document.getElementById("navselector");
        navselector.appendChild(newSelect);
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
            window.location = "/deck";
        }
        else {
            window.location = "/login";
        }
})}

//Handles text being clicked
textarea.addEventListener('click', () => {
        if (isLoggedIn){
        let topPos = deckview.getBoundingClientRect().top;

        // Scroll the window smoothly to the element
        window.scroll({
        top: topPos,
        left: 0,
        behavior: 'smooth'
    });
    }
    else{
        window.location = "/login";
    }
})

//Creates cards for deck
function createCards(cardlist){
    for (let card of cardlist){
        var col = document.createElement("div");
        col.classList.add("col");

        var colTitle = document.createElement("h3");
        colTitle.classList.add("col-title");
        colTitle.innerHTML = "Col1";

        var colImg = document.createElement("div");
        colImg.classList.add("col-img");

        var colBottom = document.createElement("div");
        colBottom.classList.add("col-bottom");

        var checkout = document.createElement("button");
        checkout.classList.add("checkout");
        checkout.innerHTML = "Recipe";

        colBottom.appendChild(checkout);
        col.appendChild(colTitle);
        col.appendChild(colImg);
        col.appendChild(colBottom);

        deckgrid.appendChild(col);

        console.log('here');
}   }

createCards([0, 1, 2, 3, 4, 5, 6, 7, 2, 2, 2, 2, 2, 2, 2, 2,2, 2, 2, 2,2, 2, 2 ]);