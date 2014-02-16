"use strict";

/**
The Card data class.

@module data
@class Card
**/
define(function(EventTarget) {
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
