//run after DOM loads
$(document).ready(function () {

    //DECLARE VARIABLES
    //===================================================================

    var characters = {
        "Obi-Wan Kenobi": {
            name: "Obi-Wan Kenobi",
            health: 120,
            attack: 8,
            imageUrl: "assets/images/obiImage.jpg",
            enemyAttackBack: 15
        },
        "Luke Skywalker": {
            name: "Luke Skywalker",
            health: 100,
            attack: 14,
            imageUrl: "assets/images/lukeImage.jpg",
            enemyAttackBack: 5
        },
        "Darth Sidious": {
            name: "Darth Sidious",
            health: 150,
            attack: 8,
            imageUrl: "assets/images/darSidImage.jpg",
            enemyAttackBack: 5
        },
        "Darth Maul": {
            name: "Darth Maul",
            health: 180,
            attack: 7,
            imageUrl: "assets/images/darMaulImage.jpg",
            enemyAttackBack: 25
        }
    };
    var currSelectedCharacter;
    var combatants = [];

    //FUNCTIONS
    //================================================================

    console.log(characters);
    //fucntion to render the character card to the page
    //character rendered and the area they are rendered to
    var renderOne = function (character, renderArea, charStatus) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

        //if character is an enemy or defender (active opponent) add appropriate class
        if (charStatus === "enemy") {
            $(charDiv).addClass("enemy");
        }
    };

    //handles the rendering of characters based on which area they are to be rendered in
    var renderCharacters = function (charObj, areaRender) {

        //"characters-section" is the div where all of our charactes begin the game
        //if true, render all characters to the starting area 
        if (areaRender === "#characters-section") {
            $(areaRender).empty();
            // Loop through the characters object and call the renderOne function on each character to the card.
            for (var key in charObj) {
                if (charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender);
                }
            }
        }

        //"selected-character" is where the selected character appears
        //if true, render the selected player to this area
        if (areaRender === "#selected-character") {
            renderOne(charObj, areaRender);
        }

        // "#availabel to attack" is the div where our "inactive" opponents reside 
        //If true, render the selected character to this area
        if (areaRender === "#available-to-attack-section") {

            //loop through the combatants array and call the renerOne function 
            for (var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender);
            }
        }
    }

    //render all characters to the page at the beginning of the game
    renderCharacters(characters, "#characters-section");

    //on-click event for selecting characters
    $(document).on("click", ".character", function () {
        //saves the clicked character's name
        var name = $(this).attr("data-name");
        console.log(name);

        //if a character has not been chosen
        if (!currSelectedCharacter) {
            //populate currSelectedCharacter with the selected character's info
            currSelectedCharacter = characters[name];
            //loop through the other chars and send them to the combatants array
            for (var key in characters) {
                if (key !== name) {
                    combatants.push(characters[key]);
                }
            }

            console.log(combatants);
            //hide the character select section
            $("#characters-section").hide();

            //then render our selected character and the combatants
            renderCharacters(currSelectedCharacter, "#selected-character");
            renderCharacters(combatants, "#available-to-attack-section");
        }
    })
});