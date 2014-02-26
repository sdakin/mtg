/**
The Card data class.

@module data
@class Card
**/
define(['jquery'], function($) {
    "use strict";

    /**
        The Card object.
        @constructor
    */
    function Card(initData) {
        $.extend(this, initData);
    }

    Card.prototype.getImageURL = function() {
        return "/cards/" + this.set + "/" + this.name + ".full.jpg";
        // return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + 
        //         this.id + '&amp;type=card';
    };

    return Card;
});
