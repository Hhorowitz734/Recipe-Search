//Important elements
title_h3 = document.querySelectorAll('.col-title');
recipe_images = document.querySelectorAll('.col-img');
mealtype_text = document.querySelectorAll('.mealtype');
calories = document.querySelectorAll('.calories');
enjoy_your = document.querySelectorAll('.enjoy_div');
ingredient1 = document.querySelectorAll('.ing1');
ingredient2 = document.querySelectorAll('.ing2');


console.log(getDefaultRecipes());
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
        recipeDict['cuisineType'] = hit.recipe.cuisineType;
        recipeDict['Calories'] = hit.recipe.calories;
        recipeDict['Mealtype'] = hit.recipe.mealType;
        recipeDict['Dishtype'] = hit.recipe.dishType; //Take a look at this
        console.log(hit.recipe.dishType);
        //Here make it so that / is changed to ' or ' and , is switched to ' ' in Mealtype
        recipesList.push(recipeDict);
    }
    return recipesList;
}

function SetRecipeInformation(){
    //Defines recipe list
    let recipeList;
    //Currently generates randomly, can be adjusted later
    getDefaultRecipes().then(recipes => {
        //For each recipe, sets proper information
        let count = 0;
        recipes.forEach(recipe => {
            title_h3[count].innerText = recipe.Name;
            recipe_images[count].style.backgroundImage = `url(${recipe.Image})`;
            mealtype_text[count].innerText = recipe.cuisineType;
            calories[count].innerText = Math.floor(recipe.Calories);
            enjoy_your[count].innerText = `Enjoy your ${recipe.Mealtype}!`;
            ingredient1[count].innerText = 'Category:'
            ingredient2[count].innerText = recipe.Dishtype;
            
            
            count += 1;
        })
    })
    .catch(error => {
        console.log(error);
    });
}

SetRecipeInformation();

