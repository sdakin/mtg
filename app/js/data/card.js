/**
The Card data class.

@module data
@class Card
**/
define(function() {
    "use strict";

    /**
        The Card object.
        @constructor
    */
    function Card(initID) {
        this.cardID = initID;
    }

    Card.prototype.getImageURL = function() {
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + 
                this.cardID + '&amp;type=card';
    };

    return Card;
});
