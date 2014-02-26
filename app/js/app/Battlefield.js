/**
This class handles all user interaction with the Battlefield area.

@module app
@class Battlefield
@extends EventTarget
**/
define(
	["xlib/EventTarget", "jqueryUI", "jqueryRotate", "data/card", "ui/CardView"],
	function(EventTarget, jqu, jqr, Card, CardView)
{
	"use strict";

	/**
		The Battlefield object.
		@constructor
	*/
	function Battlefield() {
		EventTarget.call(this);

		var self = this;
		$.get("/battlefield").success(function(data) {
			var cardData = JSON.parse(data);
			var $cardArea = $(".cardarea");
			$cardArea.empty();
			cardData.myCards.forEach(function(data) {
				var card = new Card(data);
				var $newCard = $('<div class="card"></div>');
				$newCard.css("top", card.pos.top);
				$newCard.css("left", card.pos.left);
				$newCard.css("background-image", "url('" + card.getImageURL() + "')");
				$cardArea.append($newCard);
			});
			var $cards = $(".card");
			$cards.draggable({
				stop: function(event, ui) {
					// event.toElement is the element that was responsible for
					// triggering this event. The handle, in case of a draggable.
					$( event.toElement ).one('click', function(e){ e.stopImmediatePropagation(); } );
				}
			});
			$cards.click(function(e) { self.onCardClick(e); });
		});

        $("#card-menu>li>a").click(function(e) { self.onCardMenuClick(e); });
	}

	Battlefield.prototype = new EventTarget();
	Battlefield.prototype.constructor = Battlefield;

    Battlefield.prototype.onCardClick = function(e) {
        var self = this;
        self.$activeCard = new CardView($(e.target));
        self.$activeCard.setActive();
        var $cardMenu = $("#card-menu");
        var offset = self.$activeCard.$card.offset();
        $("#card-menu>li>a").first().text(self.$activeCard.isTapped() ? "Untap" : "Tap");
        $cardMenu.show();
        $cardMenu.offset({ top: offset.top + 3, left: offset.left + 23 });
    };

    Battlefield.prototype.onCardMenuClick = function(e) {
        var self = this;
        var $cardMenu = $("#card-menu");

        switch ($(e.target).text()) {
            case "Tap":
            case "Untap":
                self.$activeCard.toggleTappedState();
                $cardMenu.hide();
                break;
        }
    };

	return Battlefield;
});
