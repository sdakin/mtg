"use strict";

/**
The main application module for the Magic the Gathering app.

@module app
@class MtGApp
@extends EventTarget
**/
define(
    ["xlib/EventTarget", "jqueryUI", "jqueryRotate", "data/card", "ui/CardView"],
    function(EventTarget, jqu, jqr, Card, CardView)
{
    /**
        The MtGApp object.
        @constructor
    */
    function MtGApp() {
        EventTarget.call(this);

        this.hand = [new Card(378521), new Card(378516), new Card(378517)];
        this.library = [378379, 378403, 378398];
        this.graveyard = [];
        this.exiled = [];
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
        $cards.click(function(e) { self.onCardClick(e); });
        $("#card-menu>li>a").click(function(e) { self.onCardMenuClick(e); });
        $(".turn-phases button").click(function(e) { self.onTurnPhaseClick(e); });

        $("#my-hand-nav").click(function(e) {
            $(e.currentTarget).addClass("active");
            self.showHand();
        });

        $(".hand-closebox").click(function() { self.hideHand(); });

        self.updateMyStatsUI();
    };

    MtGApp.prototype.hideHand = function() {
        var $handView = $(".handview");
        $handView.hide();
        $("#my-hand-nav").removeClass("active");
        $(".hand-closebox").hide();
    };

    MtGApp.prototype.showHand = function() {
        var $handView = $(".handview");
        var $cardListUI = $handView.find("ul");
        $cardListUI.empty();
        this.hand.forEach(function(card) {
            var $cardUI = $('<li><img src="' + card.getImageURL() + '"/></li>');
            $cardListUI.append($cardUI);
        });
		$handView.width($(".board").width() - parseInt($(".handview").css("left")) - 2);
		$handView.show();
        $(".hand-closebox").show();
    };

    MtGApp.prototype.updateMyStatsUI = function() {
        $("#my-hand-nav .badge").text(this.hand.length);
        $("#my-library-nav .badge").text(this.library.length);
        $("#my-graveyard-nav .badge").text(this.graveyard.length);
        $("#my-exiled-nav .badge").text(this.exiled.length);
    };

    MtGApp.prototype.onCardClick = function(e) {
        var self = this;
        self.$activeCard = new CardView($(e.target));
        self.$activeCard.setActive();
        var $cardMenu = $("#card-menu");
        var offset = self.$activeCard.$card.offset();
        $("#card-menu>li>a").first().text(self.$activeCard.isTapped() ? "Untap" : "Tap");
        $cardMenu.show();
        $cardMenu.offset({ top: offset.top + 3, left: offset.left + 23 });
    };

    MtGApp.prototype.onCardMenuClick = function(e) {
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

    MtGApp.prototype.onTurnPhaseClick = function(e) {
        var self = this;

        switch ($(e.target).text()) {
            case "Untap":
                $(".card").each(function(index, card) {  
                    var $card = $(card);
                    if ($card.attr("data-tapped") == "true") {
                        $card.rotate({angle:90, animateTo:0, duration:750});
                        $card.attr("data-tapped", false);
                    }
                });
                break;
            case "Draw":
                self.drawCard();
                break;
        }
    };

    MtGApp.prototype.drawCard = function() {
        var self = this;

        if (self.library.length == 0) {
            alert("no cards left");
        } else {
            var newCardID = self.library[0];
            self.library = self.library.slice(1);
            self.hand.unshift(new Card(newCardID));
            self.showHand();
            self.updateMyStatsUI();
        }
    };

    return MtGApp;
});
