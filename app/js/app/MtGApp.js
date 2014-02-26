/**
The main application module for the Magic the Gathering app.

@module app
@class MtGApp
@extends EventTarget
**/
define(
    ["xlib/EventTarget", "jqueryUI", "jqueryRotate", "data/card", "ui/CardView", "app/Battlefield"],
    function(EventTarget, jqu, jqr, Card, CardView, Battlefield)
{
    "use strict";

    /**
        The MtGApp object.
        @constructor
    */
    function MtGApp() {
        EventTarget.call(this);

        this.hand = [];
        this.library = [];
        this.graveyard = [];
        this.exiled = [];
    }

    MtGApp.prototype = new EventTarget();
    MtGApp.prototype.constructor = MtGApp;

    // TODO: events fired by this object

    MtGApp.prototype.init = function() {
        var self = this;

        function fetchCards(type, coll) {
            $.get("/" + type).success(function(data) {
                var cardData = JSON.parse(data);
                cardData.forEach(function(data) {
                    coll.push(new Card(data));
                });
                self.updateMyStatsUI();
            });
        }

        self.battlefield = new Battlefield();

        fetchCards("hand", self.hand);
        fetchCards("library", self.library);

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
        if (this.hand) {
            this.hand.forEach(function(card) {
                var $cardUI = $('<li><img src="' + card.getImageURL() + '"/></li>');
                $cardListUI.append($cardUI);
            });
    		$handView.width($(".board").width() - parseInt($(".handview").css("left")) - 2);
        }
		$handView.show();
        $(".hand-closebox").show();
    };

    MtGApp.prototype.updateMyStatsUI = function() {
        if (this.hand)
            $("#my-hand-nav .badge").text(this.hand.length);
        if (this.library)
            $("#my-library-nav .badge").text(this.library.length);
        $("#my-graveyard-nav .badge").text(this.graveyard.length);
        $("#my-exiled-nav .badge").text(this.exiled.length);
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
