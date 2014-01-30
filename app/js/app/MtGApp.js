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

		$("#my-hand-nav").click(function(e) {
			$(e.currentTarget).addClass("active");
			self.showHand();
		});

		$(".handview .closebox").click(function() { self.hideHand(); });
    };

    MtGApp.prototype.hideHand = function() {
    	var $handView = $(".handview");
    	$handView.hide();
    	$("#my-hand-nav").removeClass("active");
    };

    MtGApp.prototype.showHand = function() {
    	var $handView = $(".handview");
		$handView.width($(".board").width() - parseInt($(".handview").css("left")) - 2);
		$handView.show();
    };

    return MtGApp;
});

function onCardClick(e) {
	var $card = $(e.target);
	var tapped = $card.attr("data-tapped") == "true";
	if (tapped) {
		$card.rotate({angle:90, animateTo:0, duration:1000});
	} else {
		$card.rotate({angle:0, animateTo:90, duration:1000});
	}
	$card.attr("data-tapped", !tapped);
}
