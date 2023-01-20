//Important elements
title_h3 = document.querySelectorAll('.col-title');
recipe_images = document.querySelectorAll('.col-img');
mealtype_text = document.querySelectorAll('.mealtype');
calories = document.querySelectorAll('.calories');
enjoy_your = document.querySelectorAll('.enjoy_div');
ingredient1 = document.querySelectorAll('.ing1');
ingredient2 = document.querySelectorAll('.ing2');


//Retrieves default recipes from API when page is loaded in
async function getDefaultRecipes(){
    let recipesList = []
    let data = await (await fetch('https://api.edamam.com/api/recipes/v2?type=public&beta=true&app_id=93d1c4ab&app_key=163e394acf18c25c3cca0e802ac15dc5&imageSize=REGULAR&random=true')).json();
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
        //Here make it so that / is changed to ' or ' and , is switched to ' ' in Mealtype
        recipesList.push(recipeDict);
    }
    return recipesList;
}

function setupCardClasses(){
    //Currently generates randomly, can be adjusted later --> This can me modified by changing function below
    getDefaultRecipes().then(recipes => {
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

setupCardClasses();

class Card {
    constructor(recipeDict, elementsDict){
        
        // Recipe Information
        this.name = recipeDict.Name;
        this.image = recipeDict.Image;
        this.cuisineType = recipeDict.Cuisinetype;
        this.calories = recipeDict.calories;
        this.mealtype = recipeDict.Mealtype;
        this.dishtype = recipeDict.Dishtype;

        // Element Information
        this.div = elementsDict.col;
        this.titleText = elementsDict.title_h3;
        this.recipeImage = elementsDict.recipe_image;
        this.mealtypeText = elementsDict.mealtype_text;
        this.caloriesText = elementsDict.calories;
        this.enjoyYour = elementsDict.enjoy_your;
        this.ingredient1 = elementsDict.ingredient1; //Note that this is actually just the category, not ingredients.
        this.ingredient2 = elementsDict.ingredient2;

    }

    setRecipeInformation(){
        //Sets the recipe up on the card
        this.titleText.innerText = this.name;
        this.recipeImage.style.backgroundImage = `url(${this.image})`;
        this.mealtypeText.innerText = this.cuisineType;
        this.caloriesText.innerText = Math.floor(this.calories);
        this.enjoyYour.innerText = `Enjoy your ${this.mealtype}!`;
        this.ingredient1.innerText = 'Category:';
        this.ingredient2.innerText = this.dishtype;
    }
}