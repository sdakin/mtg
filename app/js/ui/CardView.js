/**
The Card view class.

@module ui
@class CardView
**/
define(function() {
    "use strict";

    /**
        The CardView class provides an interface to all UI operations for cards.
        @constructor
    */
    function CardView($initCard) {
        this.$card = $initCard;
    }

    CardView.prototype.isTapped = function() {
        return this.$card.attr("data-tapped") == "true";
    };

    CardView.prototype.setActive = function() {
        var self = this;
        // find the highest zIndex of all the cards, not including the one that was clicked on,
        // and set the clicked on card's zIndex to 1 more than that to make sure it shows up
        // on top of all of the other cards
        var maxZIndex = 0;
        $(".card").each(function(index, card) {
            if (card != self.$card[0])
                maxZIndex = Math.max($(card).zIndex(), maxZIndex);
        });
        self.$card.zIndex(maxZIndex + 1);
    };

    CardView.prototype.tap = function() {
        var self = this;
        if (!self.isTapped())
            self.$card.rotate({angle:0, animateTo:90, duration:500});
        self.$card.attr("data-tapped", true);
    };

    CardView.prototype.untap = function() {
        var self = this;
        if (self.isTapped())
            self.$card.rotate({angle:90, animateTo:0, duration:500});
        self.$card.attr("data-tapped", false);
    };

    CardView.prototype.toggleTappedState = function() {
        this.isTapped() ? this.untap() : this.tap();
    };

    return CardView;
});
