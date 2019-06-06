$(document).ready(function () {

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

    console.log(characters);
    //fucntion to render the character card to the page
    //character rendered and the area they are rendered to
    var renderOne = function (character, renderArea) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
    }

    //handles the rendering of characters based on which area they are to be rendered in
    var renderCharacters = function (charObj, areaRender) {
        if (areaRender === "#characters-section") {
            $(areaRender).empty();
            for (var key in charObj) {
                if (charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender);
                }
            }
        }
    }

    //render all characters to the page at the beginning of the game
    renderCharacters(characters, "#characters-section");

});