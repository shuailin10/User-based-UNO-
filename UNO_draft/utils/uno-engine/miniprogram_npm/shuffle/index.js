module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1544010459261, function(require, module, exports) {
var deck = require('./deck');
var playingCardDeck = require('./playingCardDeck');
var shuffle = module.exports = {};
var defaultOptions = {
  deck: new playingCardDeck().cards,
  random: function(){ return Math.random(); }
};

shuffle.playingCards = function(){
  return new playingCardDeck().cards;
}

shuffle.shuffle = function(options){
  if(!options)
    options = defaultOptions;

  if(!options.deck)
    options.deck = defaultOptions.deck;
  if(!options.random)
    options.random = defaultOptions.random;

  return new deck(options.deck, options.random);
};

}, function(modId) {var map = {"./deck":1544010459262,"./playingCardDeck":1544010459263}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1544010459262, function(require, module, exports) {
module.exports = function(cards, random){
  this.reset = function(){
    this.cards = cards.slice(0);
    this.length = this.cards.length;
  };
  this.shuffle = function(){
    fisherYates(this.cards);
  };

  this.reset();
  this.shuffle();

  this.deal = function(numberOfCards, arrayOfHands){
    for(var i = 0; i < numberOfCards; i++)
      for(var j = 0; j < arrayOfHands.length; j++)
        arrayOfHands[j].push(this.cards.pop());
    this.length = this.cards.length;
  };

  this.draw = function(num){
    if(!num || num <= 1){
      this.length = this.cards.length - 1;
      return this.cards.pop();
    }

    var ret = [];
    for(var i = 0; i < num; i++)
      ret.push(this.cards.pop());
    this.length = this.cards.length;
    return ret;
  };

  this.drawFromBottomOfDeck = function(num){
    if(!num || num < 1) {
      num = 1;
    }

    var ret = [];
    for(var i = 0; i < num; i++) {
      ret.push(this.cards.shift());
    }
    this.length = this.cards.length;

    if (ret.length === 1) {
      return ret[0];
    } else {
      return ret;
    }
  };

  this.drawRandom = function(num){
    var _draw = function(){
      var index = Math.floor(random() * this.cards.length);
      var card = this.cards[index];
      this.cards.splice(index, 1);
      this.length = this.cards.length;
      return card;
    };

    if(!num || num <= 1){
      return _draw.apply(this);
    }else{
      var cards = [];
      for(var i = 0; i < num; i++){
        cards.push(_draw.apply(this));
      }
      return cards;
    }
  };

  this.putOnTopOfDeck = function(cards){
    if(!cards instanceof Array)
      this.cards.push(cards);
    else
      for(var i = 0; i < cards.length; i++)
        this.cards.push(cards[i]);
    this.length = this.cards.length;
  };

  this.putOnBottomOfDeck = function(cards){
    if(!cards instanceof Array)
      this.cards.unshift(cards);
    else
      for(var i = 0; i < cards.length; i++)
        this.cards.unshift(cards[i]);
    this.length = this.cards.length;
  };

  //array shuffling algorithm: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  function fisherYates(arr){
    var i = arr.length;
    if(i === 0)
      return false;
    while(--i){
       var j = Math.floor(random() * (i + 1));
       var tempi = arr[i];
       var tempj = arr[j];
       arr[i] = tempj;
       arr[j] = tempi;
    }
  }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1544010459263, function(require, module, exports) {
var playingCard = require('./playingCard');

module.exports = function(){
  this.cards = [
    new playingCard('Club', 'Two', 2),
    new playingCard('Club', 'Three', 3),
    new playingCard('Club', 'Four', 4),
    new playingCard('Club', 'Five', 5),
    new playingCard('Club', 'Six', 6),
    new playingCard('Club', 'Seven', 7),
    new playingCard('Club', 'Eight', 8),
    new playingCard('Club', 'Nine', 9),
    new playingCard('Club', 'Ten', 10),
    new playingCard('Club', 'Jack', 11),
    new playingCard('Club', 'Queen', 12),
    new playingCard('Club', 'King', 13),
    new playingCard('Club', 'Ace', 14),
    new playingCard('Diamond', 'Two', 2),
    new playingCard('Diamond', 'Three', 3),
    new playingCard('Diamond', 'Four', 4),
    new playingCard('Diamond', 'Five', 5),
    new playingCard('Diamond', 'Six', 6),
    new playingCard('Diamond', 'Seven', 7),
    new playingCard('Diamond', 'Eight', 8),
    new playingCard('Diamond', 'Nine', 9),
    new playingCard('Diamond', 'Ten', 10),
    new playingCard('Diamond', 'Jack', 11),
    new playingCard('Diamond', 'Queen', 12),
    new playingCard('Diamond', 'King', 13),
    new playingCard('Diamond', 'Ace', 14),
    new playingCard('Heart', 'Two', 2),
    new playingCard('Heart', 'Three', 3),
    new playingCard('Heart', 'Four', 4),
    new playingCard('Heart', 'Five', 5),
    new playingCard('Heart', 'Six', 6),
    new playingCard('Heart', 'Seven', 7),
    new playingCard('Heart', 'Eight', 8),
    new playingCard('Heart', 'Nine', 9),
    new playingCard('Heart', 'Ten', 10),
    new playingCard('Heart', 'Jack', 11),
    new playingCard('Heart', 'Queen', 12),
    new playingCard('Heart', 'King', 13),
    new playingCard('Heart', 'Ace', 14),
    new playingCard('Spade', 'Two', 2),
    new playingCard('Spade', 'Three', 3),
    new playingCard('Spade', 'Four', 4),
    new playingCard('Spade', 'Five', 5),
    new playingCard('Spade', 'Six', 6),
    new playingCard('Spade', 'Seven', 7),
    new playingCard('Spade', 'Eight', 8),
    new playingCard('Spade', 'Nine', 9),
    new playingCard('Spade', 'Ten', 10),
    new playingCard('Spade', 'Jack', 11),
    new playingCard('Spade', 'Queen', 12),
    new playingCard('Spade', 'King', 13),
    new playingCard('Spade', 'Ace', 14)
  ];
}
}, function(modId) { var map = {"./playingCard":1544010459264}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1544010459264, function(require, module, exports) {
module.exports = function(suit, description, sort){
  this.suit = suit;
  this.description = description;
  this.sort = sort;

  this.toString = function(){
    return this.description + ' of ' + this.suit + 's';
  }

  this.toShortDisplayString = function(){
    var suit = this.suit.substring(0,1);
    var value;
    switch(this.sort){
      case 11:
        value = 'J';
        break;
      case 12:
        value = 'Q';
        break;
      case 13:
        value = 'K';
        break;
      case 14:
        value = 'A';
        break;
      default:
        value = this.sort;
    }
    return value + suit;
  }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1544010459261);
})()
//# sourceMappingURL=index.js.map