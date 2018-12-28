"use strict";
var card_1 = require("../card.js");
var deck_1 = require("../deck.js");
var game_directions_1 = require("../game-directions.js");
var player_1 = require("../player.js");
var game_1 = require("../game.js");
var expect = require('chai').expect;

describe('Game', function() {

  describe('with four players', function() {
	  var game;

    beforeEach(function() {
      game = new game_1.Game(['Player', 'Computer1', 'Computer2', 'Computer3']);
      game.newGame();
    });

    describe('#newGame()', function () {
        it('should not start with a special card', function() {
          expect(game.discardedCard.isSpecialCard()).to.be.equal(false);
        });

        it('should start with clockwise', function () {
            expect(game.playingDirection === 1).to.be.equal(true);
        });

        it('The first player should be the \'Player\' ', function () {
            expect(game.currentPlayer === game.getPlayer('Player')).to.be.equal(true);
        });

        it('All players should have 7 card at the beginning', function () {
            expect(game.getPlayer('Player').hand.length === 7).to.be.equal(true);
            expect(game.getPlayer('Computer1').hand.length === 7).to.be.equal(true);
            expect(game.getPlayer('Computer2').hand.length === 7).to.be.equal(true);
            expect(game.getPlayer('Computer3').hand.length === 7).to.be.equal(true);
        });

        it('The deck should remain less than 80 cards', function () {
            expect(game.drawPile.length < 80).to.be.equal(true);
        });

        it('The game should not be over ', function () {
            expect(game._over_flag === 0).to.be.equal(true);
        });


    });

    describe('#play()', function() {
      it('if the card on discard pile does not match with played card, game state do not change', function() {
        const discardedCard = game.discardedCard;
        const blueZero = new card_1.Card(0, 1);
        const redOne = new card_1.Card(1, 0);
        const yellowTwo = new card_1.Card(2, 3);
        const playerCard = discardedCard.matches(blueZero)
          ? discardedCard.matches(redOne)
            ? yellowTwo
            : redOne
          : blueZero;
        //不是blueZero，那么让玩家出blueZero。总之选出来的牌一定是不匹配的牌～
        game.currentPlayer.hand = [playerCard];
        var game_beforePlay = game;
        game.play(playerCard);
        var game_afterPlay = game;
        expect(game_beforePlay === game_afterPlay).to.be.equal(true);
      });

      it('if the played card is out of range, game state do not change', function() {
        const discardedCard = game.discardedCard;
        const playerCard = new card_1.Card(-1, 0);
        game.currentPlayer.hand = [playerCard];
        var game_beforePlay = game;
        game.play(playerCard);
        var game_afterPlay = game;
        expect(game_beforePlay === game_afterPlay).to.be.equal(true);
      });

      it('After playing a wilddraw4 card, it should be accepted no matter the color and the nextplayer will draw 4 cards and be skipped', function () {
          var discardedCard = game.discardedCard;
          var playerCard = new card_1.Card(card_1.Values.WILD_DRAW_FOUR, discardedCard.color === card_1.Colors.RED ? card_1.Colors.BLUE : card_1.Colors.RED);
          game.currentPlayer.hand = [playerCard];
          game.play(playerCard);
          expect(game.getPlayer('Player').hand.length === 0).to.be.equal(true);
          expect(game.getPlayer('Computer1').hand.length === 11).to.be.equal(true);
          expect(game.currentPlayer === game.getPlayer('Computer2')).to.be.equal(true);
      });

      it('After playing a wild card, it should be accepted no matter the color', function () {
          var discardedCard = game.discardedCard;
          var wildCard = new card_1.Card(card_1.Values.WILD, discardedCard.color === card_1.Colors.RED ? card_1.Colors.BLUE : card_1.Colors.RED);
          game.currentPlayer.hand = [wildCard];
          game.play(wildCard);
          expect(game.getPlayer('Player').hand.length === 0).to.be.equal(true);
      });

      it('After playing a nonspecial card, the played player hand length will decrease 1, the discardedCard will be the played card, the currentPlayer will be the next one', function () {
          var discardedCard = game.discardedCard;
          var playerCard = new card_1.Card(discardedCard.value, discardedCard.color == card_1.Colors.BLUE ? card_1.Colors.RED : card_1.Colors.BLUE);
          game.currentPlayer.hand = [playerCard];
          game.play(playerCard);
          expect(game.getPlayer('Player').hand.length === 0).to.be.equal(true);
          expect(game.discardedCard.color === playerCard.color && game.discardedCard.value === playerCard.value).to.be.equal(true);
          expect(game.currentPlayer === game.getPlayer('Computer1')).to.be.equal(true);
      });

      it('After playing a reverse card, the game direction will be changed', function () {
          var discardedCard = game.discardedCard;
          var playerCard = new card_1.Card(card_1.Values.REVERSE, discardedCard.color);
          game.currentPlayer.hand = [playerCard];
          game.play(playerCard);
          expect(game.direction === 2).to.be.equal(true);
      });

      it('After playing a draw 2 card, the nextplayer will draw 2 cards and be skipped', function () {
          var discardedCard = game.discardedCard;
          var playerCard = new card_1.Card(card_1.Values.DRAW_TWO, discardedCard.color);
          game.currentPlayer.hand = [playerCard];
          game.play(playerCard);
          expect(game.getPlayer('Computer1').hand.length === 9).to.be.equal(true);
          expect(game.currentPlayer === game.getPlayer('Computer2')).to.be.equal(true);
      });

      it('After playing a skip card, the nextplayer will be skipped', function () {
          var discardedCard = game.discardedCard;
          var playerCard = new card_1.Card(card_1.Values.SKIP, discardedCard.color);
          game.currentPlayer.hand = [playerCard];
          game.play(playerCard);
          expect(game.currentPlayer === game.getPlayer('Computer2')).to.be.equal(true);
      });

      it('If the played player\'s hand length is 0, then the game is over', function () {
          var discardedCard = game.discardedCard;
          var playerCard = new card_1.Card(discardedCard.value, discardedCard.color);
          game.currentPlayer.hand = [playerCard];
          game.play(playerCard);
          expect(game._over_flag === 1).to.be.equal(true);
      });

    });
    
    describe('#draw()', function () {
        it('if the player has drawn, then game state does not change', function () {
            game.drawn = true;
            var game_beforeDraw = game;
            game.draw();
            var game_afterDraw = game;
            expect(game_beforeDraw === game_afterDraw).to.be.equal(true);
        });
        it('if the player has not drawn and choose to draw, then his hand number will increase 1', function () {
            game.draw();
            expect(game.getPlayer('Player').hand.length === 8).to.be.equal(true);
        });
    });

    describe('#uno()', function () {
        it('if the "UNO" yeller is not currentPlayer, he is doubting uno. should make "UNO" yeller to draw 2 cards if there isn\'t any player with 1 card', function () {
            expect(game.getPlayer('Computer1').hand.length === 7).to.be.equal(true);
            var drawingPlayers = game.uno(game.getPlayer('Computer1'));
            expect(game.getPlayer('Computer1').hand.length === 9).to.be.equal(true);
            expect(drawingPlayers[0] === game.getPlayer('Computer1')).to.be.equal(true);
        });

        it('if the "UNO" yeller is not currentPlayer, he is doubting uno. should make "UNO" yeller to draw 2 cards if all player with 1 card has yelled', function () {
            game.players.forEach(function (p) { return (p.hand = game.drawPile.draw(1)); });
            game.yellers['Player'] = true;
            game.yellers['Computer1'] = true;
            game.yellers['Computer2'] = true;
            game.yellers['Computer3'] = true;
            expect(game.getPlayer('Computer1').hand.length === 1).to.be.equal(true);
            var drawingPlayers = game.uno(game.getPlayer('Computer1'));
            expect(game.getPlayer('Computer1').hand.length === 3).to.be.equal(true);
            expect(drawingPlayers[0] === game.getPlayer('Computer1')).to.be.equal(true);
        });

        it('if the "UNO" yeller is not currentPlayer, he is doubting uno. should make the players with one card but not yelled to draw 2 cards ', function () {
            game.players.forEach(function (p) { return (p.hand = game.drawPile.draw(1)); });
            game.yellers['Player'] = false;
            game.yellers['Computer1'] = true;
            game.yellers['Computer2'] = true;
            game.yellers['Computer3'] = true;
            expect(game.getPlayer('Player').hand.length === 1).to.be.equal(true);
            var drawingPlayers = game.uno(game.getPlayer('Computer1'));
            expect(game.getPlayer('Player').hand.length === 3).to.be.equal(true);
            expect(drawingPlayers[0] === game.getPlayer('Player')).to.be.equal(true);
        });
        
        it('if the "UNO" yeller is currentPlayer, he is yelling uno for himself. if he only has two cards, has at least one card to play and has not yelled uno, he can yell uno successfully', function () {
            game.getPlayer('Player').hand = [game.discardedCard, game.discardedCard];
            expect(game.yellers['Player'] === false).to.be.equal(true);
            var drawingPlayers = game.uno(game.getPlayer('Player'), 1);
            expect(game.yellers['Player'] === true).to.be.equal(true);
            expect(drawingPlayers.length === 0).to.be.equal(true);
        });
        
        it('if the "UNO" yeller is currentPlayer, he is yelling uno for himself. if he does not have two cards or has no card to play or has yelled uno, he cannot yell uno successfully', function () {
            game.getPlayer('Player').hand = [game.discardedCard];
            expect(game.yellers['Player'] === false).to.be.equal(true);
            var drawingPlayers = game.uno(game.getPlayer('Player'), 1);
            expect(game.yellers['Player'] === false).to.be.equal(true);
            expect(drawingPlayers.length === 0).to.be.equal(true);

            const blueZero = new card_1.Card(0, 1);
            const redOne = new card_1.Card(1, 0);
            const yellowTwo = new card_1.Card(2, 3);
            const playerCard = game.discardedCard.matches(blueZero)
              ? game.discardedCard.matches(redOne)
                ? yellowTwo
                : redOne
              : blueZero;
            game.getPlayer('Player').hand = [playerCard, playerCard];
            expect(game.yellers['Player'] === false).to.be.equal(true);
            var drawingPlayers = game.uno(game.getPlayer('Player'), 0);
            expect(game.yellers['Player'] === false).to.be.equal(true);
            expect(drawingPlayers.length === 0).to.be.equal(true);

            game.getPlayer('Player').hand = [game.discardedCard, game.discardedCard];
            game.yellers['Player'] = true;
            expect(game.yellers['Player'] === true).to.be.equal(true);
            var drawingPlayers = game.uno(game.getPlayer('Player'), 1);
            expect(game.yellers['Player'] === true).to.be.equal(true);
            expect(drawingPlayers.length === 0).to.be.equal(true);
        });
    });

  })

 })