"use strict";
var card_1 = require("../card.js");
var deck_1 = require("../deck.js");
var expect = require('chai').expect;
var filterByValue = function (value) {
    return function (card) { return card.value === value; };
};

var filterByCard = function (value,color) {
    return function (card) { return card.value === value && card.color === color; };
};

describe('Deck', function () {
    var deck;
    
    beforeEach(function createDeck() {
        deck = new deck_1.Deck();
    });

    it('should have 108 cards', function () {
        expect(deck.length === 108).to.be.equal(true);
    });
    
    it('should have 76 numbers', function () {
        var numbers = function (card) {
            return card.value >= card_1.Values.ZERO && card.value <= card_1.Values.NINE;
        };
        expect(deck.cards.filter(numbers).length === 76).to.be.equal(true);
    });
    
    it('should have 4 zeros', function () {
        var zeroes = deck.cards.filter(filterByValue(card_1.Values.ZERO));
        expect(zeroes.length === 4).to.be.equal(true);
    });

    it('should have 1 zeros of each color', function () {
        var zeroes_red = deck.cards.filter(filterByCard(card_1.Values.ZERO, card_1.Colors.RED));
        var zeroes_blue = deck.cards.filter(filterByCard(card_1.Values.ZERO, card_1.Colors.BLUE));
        var zeroes_green = deck.cards.filter(filterByCard(card_1.Values.ZERO, card_1.Colors.GREEN));
        var zeroes_yellow = deck.cards.filter(filterByCard(card_1.Values.ZERO, card_1.Colors.YELLOW));
        expect(zeroes_red.length === 1).to.be.equal(true);
        expect(zeroes_blue.length === 1).to.be.equal(true);
        expect(zeroes_green.length === 1).to.be.equal(true);
        expect(zeroes_yellow.length === 1).to.be.equal(true);
    });

    it('should have 8 nines', function () {
        var nines = deck.cards.filter(filterByValue(card_1.Values.NINE));
        expect(nines.length === 8).to.be.equal(true);
    });

    it('should have 2 nines of each color', function () {
        var nines_red = deck.cards.filter(filterByCard(card_1.Values.NINE, card_1.Colors.RED));
        var nines_blue = deck.cards.filter(filterByCard(card_1.Values.NINE, card_1.Colors.BLUE));
        var nines_green = deck.cards.filter(filterByCard(card_1.Values.NINE, card_1.Colors.GREEN));
        var nines_yellow = deck.cards.filter(filterByCard(card_1.Values.NINE, card_1.Colors.YELLOW));
        expect(nines_red.length === 2).to.be.equal(true);
        expect(nines_blue.length === 2).to.be.equal(true);
        expect(nines_green.length === 2).to.be.equal(true);
        expect(nines_yellow.length === 2).to.be.equal(true);
    });

    it('should have 8 draw two', function () {
        var drawTwos = deck.cards.filter(filterByValue(card_1.Values.DRAW_TWO));
        expect(drawTwos.length === 8).to.be.equal(true);
    });

    it('should have 2 draw two of each color', function () {
        var drawTwos_red = deck.cards.filter(filterByCard(card_1.Values.DRAW_TWO, card_1.Colors.RED));
        var drawTwos_blue = deck.cards.filter(filterByCard(card_1.Values.DRAW_TWO, card_1.Colors.BLUE));
        var drawTwos_green = deck.cards.filter(filterByCard(card_1.Values.DRAW_TWO, card_1.Colors.GREEN));
        var drawTwos_yellow = deck.cards.filter(filterByCard(card_1.Values.DRAW_TWO, card_1.Colors.YELLOW));
        expect(drawTwos_red.length === 2).to.be.equal(true);
        expect(drawTwos_blue.length === 2).to.be.equal(true);
        expect(drawTwos_green.length === 2).to.be.equal(true);
        expect(drawTwos_yellow.length === 2).to.be.equal(true);
    });
    
    it('should have 8 skip', function () {
        var skips = deck.cards.filter(filterByValue(card_1.Values.SKIP));
        expect(skips.length === 8).to.be.equal(true);
    });
    
    it('should have 8 reverse', function () {
        var reverses = deck.cards.filter(filterByValue(card_1.Values.REVERSE));
        expect(reverses.length === 8).to.be.equal(true);
    });
    
    it('should have 4 wild', function () {
        var wilds = deck.cards.filter(filterByCard(card_1.Values.WILD, undefined));
        expect(wilds.length === 4).to.be.equal(true);
    });

    it('should have 4 wild draw four', function () {
        var wildDrawFours = deck.cards.filter(filterByCard(card_1.Values.WILD_DRAW_FOUR, undefined));
        expect(wildDrawFours.length === 4).to.be.equal(true);
    });

    it('should have 107 cards after a draw', function () {
        expect(deck.length === 108).to.be.equal(true);
        deck.draw(1);
        expect(deck.length === 107).to.be.equal(true);
    });

    it('should have 108 cards after all cards are drawn', function () {
        expect(deck.length === 108).to.be.equal(true);
        deck.draw(108);
        expect(deck.length === 108).to.be.equal(true);
    });

    it('should have 107 cards after all cards + 1 are drawn', function () {
        expect(deck.length === 108).to.be.equal(true);
        deck.draw(109);
        expect(deck.length === 107).to.be.equal(true);
    });
    
});
//# sourceMappingURL=deck.js.map