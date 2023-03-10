//Important elements
cols = document.querySelectorAll('.col');
title_h3 = document.querySelectorAll('.col-title');
recipe_images = document.querySelectorAll('.col-img');
mealtype_text = document.querySelectorAll('.mealtype');
calories = document.querySelectorAll('.calories');
enjoy_your = document.querySelectorAll('.enjoy_div');
ingredient1 = document.querySelectorAll('.ing1');
ingredient2 = document.querySelectorAll('.ing2');
recipehighlightbox = document.querySelectorAll('.recipe-description');
const foodselector = document.querySelector('.foodselector');

let isLoggedIn; //=false

// List of swiped recipes
recipeSwipedList = [];

//Retrieves default recipes from API when page is loaded in
async function getDefaultRecipes(meal_type){
    let recipesList = []
    let data;
    if (meal_type == 'all'){
        data = await (await fetch("https://api.edamam.com/api/recipes/v2?type=public&app_id=93d1c4ab&app_key=163e394acf18c25c3cca0e802ac15dc5&mealType=Breakfast&mealType=Dinner&mealType=Lunch&mealType=Snack&mealType=Teatime&random=true")).json();
    }
    else {
        data = await (await fetch(`https://api.edamam.com/api/recipes/v2?type=public&app_id=93d1c4ab&app_key=163e394acf18c25c3cca0e802ac15dc5&mealType=${meal_type}&random=true`)).json();
    }
        //Hits refers to the dicitonary with all information on the recipe
    const hits = data.hits;
    //Iterates over first 8 hits and returns recipes
    for (let hit of hits.slice(0, 12)){
        let recipeDict = {}
        recipeDict['Name'] = hit.recipe.label;
        recipeDict['Image'] = hit.recipe.image;
        recipeDict['Cuisinetype'] = hit.recipe.cuisineType;
        recipeDict['calories'] = hit.recipe.calories;
        recipeDict['Mealtype'] = hit.recipe.mealType;
        recipeDict['Dishtype'] = hit.recipe.dishType; //Take a look at this
        recipeDict['Link'] = hit.recipe.url; //INSERT LINK HERE
        //Here make it so that / is changed to ' or ' and , is switched to ' ' in Mealtype
        recipesList.push(recipeDict);
    }
    return recipesList;
}

function setupCardClasses(meal_type){
    //Currently generates randomly, can be adjusted later --> This can me modified by changing function below
    getDefaultRecipes(foodselector.value).then(recipes => {
        //Iterates over each recipe provided by API, sets it up with elements in a Card object.
        let count = 0;

        let cardsDisplayed = [] //List representing cards currently displayed on screen
        recipes.forEach(recipe => {
            elementdict = {}
            elementdict['title_h3'] = title_h3[count];
            elementdict['recipe_image'] = recipe_images[count];
            elementdict['mealtype_text'] = mealtype_text[count];
            elementdict['calories'] = calories[count];
            elementdict['enjoy_your'] = enjoy_your[count];
            elementdict['ingredient1'] = ingredient1[count];
            elementdict['ingredient2'] = ingredient2[count];
            elementdict['col'] = cols[count];
            elementdict['highlightbox'] = recipehighlightbox[count];
            
            cardsDisplayed.push(new Card(recipe, elementdict))

            count += 1;
        })
        cardsDisplayed.forEach(card => {
            card.setRecipeInformation();
        })
    })
    .catch(error => {
        console.log(error);
    });
}

setupCardClasses('all');

class Card {
    //Static variable representing which div is being dragged
    static itemMoving = 0;
    static recipeBacklog = []
    static currentRecipeType = 'all';

    constructor(recipeDict, elementsDict) {
        // Recipe Dictionary
        this.recipeDict = recipeDict;

        // Recipe Information
        this.name = recipeDict.Name;
        this.image = recipeDict.Image;
        this.cuisineType = recipeDict.Cuisinetype;
        this.calories = recipeDict.calories;
        this.mealtype = recipeDict.Mealtype;
        this.dishtype = recipeDict.Dishtype;
        this.link = recipeDict.Link;

        // Element Information
        this.div = elementsDict.col;
        this.titleText = elementsDict.title_h3;
        this.recipeImage = elementsDict.recipe_image;
        this.mealtypeText = elementsDict.mealtype_text;
        this.caloriesText = elementsDict.calories;
        this.enjoyYour = elementsDict.enjoy_your;
        this.ingredient1 = elementsDict.ingredient1; //Note that this is actually just the category, not ingredients.
        this.ingredient2 = elementsDict.ingredient2;
        this.highlightbox = elementsDict.highlightbox;

        // Dragging Variables
        this.originalPosition = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.isDragging = false;
        this.div.style.position = "relative";
        this.div.style.transform = "translate(0, 0)";

        this.div.addEventListener("mousedown", (event) => this.startDrag(event));
        this.div.addEventListener("mouseup", (event) => this.stopDrag(event));
        this.div.addEventListener("mousemove", (event) => this.drag(event));
    }

    setRecipeInformation() {
        //Sets the recipe up on the card
        this.titleText.innerText = this.name;
        this.recipeImage.style.backgroundImage = `url(${this.image})`;
        this.mealtypeText.innerText = this.cuisineType;
        this.caloriesText.innerText = Math.floor(this.calories);
        this.enjoyYour.innerText = `Enjoy your ${this.mealtype}!`;
        this.ingredient1.innerText = 'Category:';
        this.ingredient2.innerText = this.dishtype;
    }

    startDrag(event) {
        if (Card.itemMoving == 0) {
            this.offset.x = event.clientX;
            this.isDragging = true;
            Card.itemMoving = this.image;
            this.originalRotation = parseFloat(getComputedStyle(this.div).getPropertyValue("transform").split(",")[1]);
            document.querySelectorAll("*").forEach(function(node) {
                node.style.pointerEvents = "none";
            });
            this.div.style.pointerEvents = 'auto';
        }
        document.addEventListener("mouseup", () => this.stopDrag());
    }

    stopDrag(event) {
        if (this.isDragging){
            this.isDragging = false;
            this.div.style.transition = "transform .3s ease-out";
            // Return card to its original position
            this.div.style.transform = `rotate(${this.originalRotation}deg)`;
            Card.itemMoving = 0;
            document.querySelectorAll("*").forEach(function(node) {
                node.style.pointerEvents = "auto";
            });
            this.highlightbox.style.backgroundColor = '#4C4948';
            let rotation = (event.clientX - this.offset.x) / 1.5;
            if (rotation <= -30){
                this.generateNew();
            }
            if (rotation >= 30){
                console.log(this.recipeDict);
                recipeSwipedList.push(this.recipeDict);
                this.generateNew();
            }
        }
    }

    drag(event) {
        if (this.isDragging) {
            let rotation = (event.clientX - this.offset.x) / 1.5;
            this.div.style.transform = `rotate(${rotation}deg)`;
            if (rotation >= 0){
                this.highlightbox.style.backgroundColor = `rgb(${0}, ${rotation * 7}, ${0})`;
            }
            else {
                this.highlightbox.style.backgroundColor = `rgb(${rotation * -7}, ${0}, ${0})`
            }
        }
    }

    async generateNew(){
        if (Card.recipeBacklog.length == 0 || foodselector.value != Card.currentRecipeType){
            console.log('here');
            if (foodselector.value == 'all'){
                Card.recipeBacklog = await (await fetch('https://api.edamam.com/api/recipes/v2?type=public&beta=true&app_id=93d1c4ab&app_key=163e394acf18c25c3cca0e802ac15dc5&imageSize=REGULAR&random=true')).json();
            }
            else {
                Card.recipeBacklog = await (await fetch(`https://api.edamam.com/api/recipes/v2?type=public&app_id=93d1c4ab&app_key=163e394acf18c25c3cca0e802ac15dc5&mealType=${foodselector.value}&random=true`)).json();
            }
                Card.recipeBacklog = Card.recipeBacklog.hits;
                Card.currentRecipeType = foodselector.value;
        }
        
        this.name = Card.recipeBacklog[0].recipe.label;
        this.image = Card.recipeBacklog[0].recipe.image;
        this.cuisineType = Card.recipeBacklog[0].recipe.cuisineType;
        this.calories = Card.recipeBacklog[0].recipe.calories;
        this.mealtype = Card.recipeBacklog[0].recipe.mealType;
        this.dishtype = Card.recipeBacklog[0].recipe.dishType;
        this.link = Card.recipeBacklog[0].recipe.url;
        
        this.recipeDict = {}
        this.recipeDict['Name'] = this.name;
        this.recipeDict['Image'] = this.image;
        this.recipeDict['Cuisinetype'] = this.cuisineType;
        this.recipeDict['calories'] = this.calories;
        this.recipeDict['Mealtype'] = this.mealtype;
        this.recipeDict['Dishtype'] = this.dishtype;
        this.recipeDict['Link'] = this.link;

        this.setRecipeInformation();
        Card.recipeBacklog.shift();
    }


}

// Event Listeners for Pulldown Menus
// Food Menu
foodselector.addEventListener('change', () => {
    setupCardClasses(foodselector.value);
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
            window.location = "/deck"
        }
        else {
            window.location = "/login";
        }
})}


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
                let signin = document.getElementById('signin');
                signin.innerText = 'Sign Out';
                signin.style.cursor = 'pointer';
                signin.style.color = 'white';
                signin.addEventListener('click', (event) => {
                    event.preventDefault;
                    logOut();
                    location.reload();
              })
              isLoggedIn = true;
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


//WRITE A FUNCTION THAT SENDS THE LIST OF DICTIONARIES TO THE BACKEND WHEN THE USER LEAVES THIS PAGE
//THEN In THE BACKEND, IF A USER IS LOGGED IN ADD THIS TO THEIR DECK, OTHERWISE SAVE THEM FOR WHEN THEY DO LOG IN
// Sends card list
const sendCardList = (cardList) => {
    fetch('/api/addCards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cardList,
        password: ('; '+document.cookie).split(`; token=`).pop().split(';')[0] //DONT FORGET WE NEED TO CHANGE THIS TO PASSWORD AND THEN UNHASH IT IN SERVER AND THEN IF THE USER ISNT LOGGED IN JUST TAKE THE LIST
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  
  window.onbeforeunload = function (){
      if (checkForToken('token')){
        sendCardList(recipeSwipedList);
      }
  }

  function checkForToken(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return true;
    return false;
}

//Logs the user out
function logOut(){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    isLoggedIn = false;
}