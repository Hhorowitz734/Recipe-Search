const bigtext = document.querySelector('.bigtext');
const smalltext = document.querySelector('.smalltext');
const arrow = document.querySelector('.arrow');


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
function loggedIn(){
    bigtext.innerText = ``;
}


//Checks if user is logged in