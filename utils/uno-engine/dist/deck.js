"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shuffle_1 = require("shuffle");
var card_1 = require("./card.js");
function createUnoDeck() {
    /*
      108 张牌
  
      76x 普通牌 (0-9, 所有颜色)
      8x +2牌 (2x 所有颜色)
      8x 反向牌 (2x 所有颜色)
      8x 禁止牌 (2x 所有颜色)
      4x wild
      4x wild draw four
    */
    var deck = [];
    var createCards = function (qty, value, color) {
        var cards = [];
        for (var i = 0; i < qty; i++)
            cards.push(new card_1.Card(value, color));
        return cards;
    };
    for (var color = 0; color <= 3; color++) {
        deck.push.apply(deck, createCards(1, card_1.Values.ZERO, color));
        for (var n = card_1.Values.ONE; n <= card_1.Values.NINE; n++) {
            deck.push.apply(deck, createCards(2, n, color));
        }
        deck.push.apply(deck, createCards(2, card_1.Values.DRAW_TWO, color));
        deck.push.apply(deck, createCards(2, card_1.Values.SKIP, color));
        deck.push.apply(deck, createCards(2, card_1.Values.REVERSE, color));
    }
    deck.push.apply(deck, createCards(4, card_1.Values.WILD, undefined));
    deck.push.apply(deck, createCards(4, card_1.Values.WILD_DRAW_FOUR, undefined));
    return deck;
}
var Deck = /** @class */ (function () {
    function Deck() {
        this.shuffle = shuffle_1.shuffle({ deck: createUnoDeck() });
    }
    Object.defineProperty(Deck.prototype, "cards", {
        get: function () {
            return this.shuffle.cards;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Deck.prototype, "length", {
        get: function () {
            return this.shuffle.length;
        },
        enumerable: true,
        configurable: true
    });
    Deck.prototype.draw = function (num) {
        num = num || 1;
        var cards = [];
        if (num >= this.length) {
            var length_1 = this.length;
            cards = cards.concat(this.shuffle.draw.call(this, length_1));
            this.shuffle.reset();
            this.shuffle.shuffle();
            num = num - length_1;
            if (num === 0)
                return cards;
        }
        return cards.concat(this.shuffle.draw(num));
    };
    return Deck;
}());
exports.Deck = Deck;
