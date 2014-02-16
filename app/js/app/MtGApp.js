"use strict";

/**
The main application module for the Magic the Gathering app.

@module app
@class MtGApp
@extends EventTarget
**/
define(
    ["xlib/EventTarget", "jqueryUI", "jqueryRotate"],
    function(EventTarget)
{
    /**
        The MtGApp object.
        @constructor
    */
    function MtGApp() {
        EventTarget.call(this);
    }

    MtGApp.prototype = new EventTarget();
    MtGApp.prototype.constructor = MtGApp;

    // TODO: events fired by this object

    MtGApp.prototype.init = function() {
        var self = this;

		var $cards = $(".card");
		$cards.draggable({
		    stop: function(event, ui) {
		        // event.toElement is the element that was responsible for
		        // triggering this event. The handle, in case of a draggable.
		        $( event.toElement ).one('click', function(e){ e.stopImmediatePropagation(); } );
		    }
		});
		$cards.click(onCardClick);

        $(".turn-phases button").click(onTurnPhaseClick);

		$("#my-hand-nav").click(function(e) {
			$(e.currentTarget).addClass("active");
			self.showHand();
		});

		$(".hand-closebox").click(function() { self.hideHand(); });
    };

    MtGApp.prototype.hideHand = function() {
    	var $handView = $(".handview");
    	$handView.hide();
    	$("#my-hand-nav").removeClass("active");
        $(".hand-closebox").hide();
    };

    MtGApp.prototype.showHand = function() {
    	var $handView = $(".handview");
		$handView.width($(".board").width() - parseInt($(".handview").css("left")) - 2);
		$handView.show();
        $(".hand-closebox").show();
    };

    return MtGApp;
});

function onCardClick(e) {
    var $card = $(e.target);

    // find the highest zIndex of all the cards, not including the one that was clicked on,
    // and set the clicked on card's zIndex to 1 more than that to make sure it shows up
    // on top of all of the other cards
    var maxZIndex = 0;
    $(".card").each(function(index, card) {
        if (card != e.target)
            maxZIndex = Math.max($(card).zIndex(), maxZIndex);
    });
    $card.zIndex(maxZIndex + 1);

    var tapped = $card.attr("data-tapped") == "true";
    if (tapped) {
        $card.rotate({angle:90, animateTo:0, duration:750});
    } else {
        $card.rotate({angle:0, animateTo:90, duration:750});
    }
    $card.attr("data-tapped", !tapped);
}

function onTurnPhaseClick(e) {
    console.log($(e.target).text());
    switch ($(e.target).text()) {
        case "Untap":
            $(".card").each(function(index, card) {  
                var $card = $(card);
                if ($card.attr("data-tapped") == "true") {
                    $card.rotate({angle:90, animateTo:0, duration:750});
                    $card.attr("data-tapped", false);
                }
            });
    }
}