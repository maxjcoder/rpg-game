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

    //will be populated when player selects the character
    var currSelectedCharacter;
    //populated with all the characters the player didn't select
    var combatants = [];
    //will be populated when the player chooses an opponent
    var currDefender;
    //will keep track of turns during combat. Used for calculating player damage.
    var turnCounter = 1;
    //tracks number of defeated opponents
    var killCount = 0;

    //FUNCTIONS
    //================================================================

    //function to render the character card to the page
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
        else if (charStatus === "defender") {
            //populate currentDefender with selected opponent's information
            currDefender = character;
            $(charDiv).addClass("target-enemy");
        }
    };


    //function to handle game messages
    var renderMessage = function (message) {

        //builds the message and appends it to the page
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);

        //if we pass a certain message in, clear the message area
        if (message === "clearMessage") {
            gameMessageSet.text("");
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
                    renderOne(charObj[key], areaRender, "");
                }
            }
        }

        //"selected-character" is where the selected character appears
        //if true, render the selected player to this area
        if (areaRender === "#selected-character") {
            renderOne(charObj, areaRender, "");
        }

        // "#available-to-attack" is the div where our "inactive" opponents reside 
        //If true, render the selected character to this area
        if (areaRender === "#available-to-attack-section") {

            //loop through the combatants array and call the renderOne function 
            for (var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender, "enemy");
            }

            //create an on click event for each enemy
            $(document).on("click", ".enemy", function () {
                var name = ($(this).attr("data-name"));

                //if there is no defender, the clicked enemy will become the defender
                if ($("#defender").children().length === 0) {
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });
        }

        //"defender" is the div where the active opponent will appear
        //if true, render the selected enemy in this location
        if (areaRender === "#defender") {
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++) {
                if (combatants[i].name === charObj) {
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }

        //re-render defender when attacked 
        if (areaRender === "playerDamage") {
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender");
        }

        //re-render player characetr when attacked
        if (areaRender === "enemyDamage") {
            $("#selected-character").empty();
            renderOne(charObj, "#selected-character", "");
        }

        //render defeated enemy 
        if (areaRender === "enemyDefeated") {
            $("#defender").empty();
            var gameStateMessage = ("You have defeated " + charObj.name + ", you can choose to fight another enemy");
            renderMessage(gameStateMessage);
        }
    };

    //function to handle restarting the game after victory defeat
    var restartGame = function (inputEndGame) {

        //when the 'restart' button if clicked, reload the page.
        var restart = $("<button>Restart</button>").click(function () {
            location.reload();
        });

        //this is a div that will display the victory/defeat message
        var gameState = $("<div>").text(inputEndGame);

        //render the restart button and victory/defeat message to the page
        $("body").append(gameState);
        $("body").append(restart);
    };

    //============================================================================================

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
    });

    //when the player clicks the attack button, run the folllowing game logic
    $("#attack-button").on("click", function () {

        if ($("#defender").children().length !== 0) {

            //create message for our attack and our opponents counter attack 
            var attackMessage = ("You attacked " + currDefender.name + " for " + currSelectedCharacter.attack + turnCounter + " damage.");
            var counterAttackMessage = (currDefender.name + " attacked back for " + currDefender.enemyAttackBack + " damage.");
            renderMessage("clearMessage");

            //reduce defender's health by your attack value
            currDefender.health -= (currSelectedCharacter.attack * turnCounter);

            //if the enemy still has health ...
            if (currDefender.health > 0) {

                //render the enemy's updated character card
                renderCharacters(currDefender, "playerDamage");

                //render the combat message 
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                //render your health by the opponent's attack value
                currSelectedCharacter.health -= currDefender.enemyAttackBack;

                //render the player's updated character card 
                renderCharacters(currSelectedCharacter, "enemyDamage");

                //if you have less than zero health the game ends 
                //we call the restartGame function to allow the user to restart the game 
                if (currSelectedCharacter.health <= 0) {
                    renderMessage("clearMessage");
                    restartGame("You have been defeated...GAME OVER!!");
                    $("#attack-button").unbind("click");
                }
            }
            else {
                //remove opponent's character card
                renderCharacters(currDefender, "enemyDefeated");
                //increment player's kill count
                killCount++;
                //if you've killed all of your opponents, you've won
                //call the restartGame function to allow the user to restart and play again
                if (killCount >= 3) {
                    renderMessage("clearMessage");
                    restartGame("You won. The force is with you! GAME OVER!!")
                }
            }
        }
        //if the enemy has less than zero health, they're defeated

        turnCounter++;
    });
});