//https://www.youtube.com/watch?v=ILviQic0c8g
//Use this file





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
        return newSelect;
    }
});