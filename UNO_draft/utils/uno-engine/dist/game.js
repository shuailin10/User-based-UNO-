"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("./card.js");
var deck_1 = require("./deck.js");
var game_directions_1 = require("./game-directions.js");
var player_1 = require("./player.js");
var CARDS_PER_PLAYER = 7;
var Game = /** @class */ (function () {
    //属性：currentPlayer, nextPlayer, discardedCard, players, deck, playingDirection
    //方法：newGame, getPlayer, draw, pass, play, uno, fixPlayers, getNextPlayer, getPlayerIndex, gotoNextplayer 
    //reverseGame, calculateScore, privateDraw
    //变量：this._player, drawn, yellers, drawPile, direction, discardedCard, currentPlayer
    function Game(playerNames, houseRules) {
        if (houseRules === void 0) { houseRules = []; }
        // void 是 JavaScript 中非常重要的关键字，该操作符指定要计算一个表达式但是不返回值
        // 有时候需要undefined值时会用void 0来表示。
        //因为 undefined 在 JS 中并不是保留字，所以在局部作用域中完全可以定义一个变量名为 undefined 的局部变量。
        var _this = this;
        _this._players = [];
        // control vars
        /**
         * The player have draw in his turn?
         */
        _this.drawn = false;
        /**
         * Who yelled uno?
         *
         * key: player name
         * value: true/false
         */
        _this.yellers = {};
        
        _this._players = _this.fixPlayers(playerNames);//_this._players现在是一个数组，元素是Player类型的
        houseRules.forEach(function (rule) { return rule.setup(_this); });
        //forEach() 对于空数组是不会执行回调函数的。先忽略这个吧，看起来根本没有别的地方用到了houseRules，所以这里houserule的值很有可能是[]
        _this.newGame();
        for (var i = 0; i < _this._players.length; i++){
            _this.yellers[_this._players[i].name] = false;
        }
        _this.alldiscarded=[0,0,0,0,0,0,0,0,0,0,0,0,0];
        _this.playercard=[0,0,0,0];
        //马文峻

        //初始化yellers的状态
        return _this;
        //如果改变this的属性，那么_this的属性似乎也会相应更改？
    }
    //这个看起来就是一个构造函数:)   但是这个构造函数会返回值诶

    Game.prototype.newGame = function () {
        var _this = this;
        //在函数内部定义的函数，this又指向undefined了！（在非strict模式下，它重新指向全局对象window！）
        //感觉这里都是先把this读出来，防止发生啥意外情况，this应该继承了this的所有属性和方法，在后面函数中用到的话就_this，防止this指向更改
        this.drawPile = new deck_1.Deck();//应该是一个数组，元素是Card
        this.direction = game_directions_1.GameDirections.CLOCKWISE;
        this._players.forEach(function (p) { return (p.hand = _this.drawPile.draw(CARDS_PER_PLAYER)); });
        //**表明对this._players里的每个Player元素的hand属性都进行了更改？不太确定有没有更改诶
        //forEach 方法不直接修改原始数组，但回调函数可能会修改它
        // do not start with special cards (REVERSE, DRAW, etc)
        this._over_flag = 0;
        //我加的
        do {
            this._discardedCard = this.drawPile.draw()[0];//draw方法返回的是一个数组
        } while (this._discardedCard.isSpecialCard());
        //保证第一张discardedCard不是specialCard
        // select starting player
        this._currentPlayer = this.getPlayer('Player');
        /******************
        这之后就需要对界面进行初始化，展示用户手牌，现在的玩家，初始的玩家默认为用户～每个玩家的手牌数目这些信息
        ******************/
    };

    Game.prototype.getPlayer = function (name) {
        var player = this._players[this.getPlayerIndex(name)];
        if (!player)
            return undefined;
        return player;
    };
    //通过输入player的名字信息获取player的信息
    Object.defineProperty(Game.prototype, "currentPlayer", {
        get: function () {
            return this._currentPlayer;
        },
        set: function (player) {
            player = this.getPlayer(player.name);
            if (!player)
                throw new Error('The given player does not exist');
            this._currentPlayer = player;
        },
        enumerable: true,
        configurable: true
    });
    //
    Object.defineProperty(Game.prototype, "nextPlayer", {
        get: function () {
            return this.getNextPlayer();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "discardedCard", {
        get: function () {
            return this._discardedCard;
        },
        set: function (card) {
            if (!card)
                return;
            if (card.color === undefined || card.color === null)
                throw new Error('Discarded cards cannot have theirs colors as null');
            this._discardedCard = card;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "players", {
        get: function () {
            return this._players;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "deck", {
        get: function () {
            return this.drawPile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "playingDirection", {
        get: function () {
            return this.direction;
        },
        set: function (dir) {
            if (dir !== game_directions_1.GameDirections.CLOCKWISE &&
                dir != game_directions_1.GameDirections.COUNTER_CLOCKWISE)
                throw new Error('Invalid direction');
            if (dir !== this.direction)
                this.reverseGame();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @fires Game#beforedraw
     * @fires Game#draw
     */
    Game.prototype.draw = function (player, qty, _a) {
        var silent = (_a === void 0 ? { silent: false } : _a).silent;
        //如果没有传入silent的信息的话，那么silent = false，即不silent，如果传入了{silent: true}的话，那么就silent = true
        if (arguments.length == 0)
            player = this._currentPlayer;
        //没有传入参数，就默认是现在的玩家抽牌
        qty = qty || 1;
        //没有传入qty的参数，就默认是抽牌数是1
        
        //如果没有silent但是状态不是在beforedrawevent，那么就结束
        var drawnCards = this.privateDraw(player, qty);
        //可以将抽的牌的信息返回到界面上
        
        //如果没有silent但是抽牌后状态却没有更新，那么就结束
        this.drawn = true;
        // reset UNO! yell state
        this.yellers[player.name] = false;
        //如果currentplayer.name === 'Player'，那么就此时抽完牌之后就使抽牌按钮失
    };
    //抽牌，标记现在的玩家抽牌完成，没有喊UNO，
    /**
     * @fires Game#beforepass
     * @fires Game#nextplayer
     */
    Game.prototype.pass = function () {
        if (!this.drawn)
            throw new Error(this._currentPlayer + " must draw at least one card before passing");
        //如果没有抽牌，那么必须至少抽一张牌才能够pass
        
        this.goToNextPlayer();
        //我们设计成玩家出牌成功后就一定要pass，抽牌之后如果没有可以出的牌就直接pass，如果有，则出完抓完的牌之后pass
    };
    /**
     * @fires Game#beforecardplay
     * @fires Game#cardplay
     * @fires Game#nextplayer
     * @fires Game#end
     */


    Game.prototype.play = function (card, _a) {
        var silent = (_a === void 0 ? { silent: false } : _a).silent;
        //如果没有传入silent的信息的话，那么silent = false，即不silent，如果传入了{silent: true}的话，那么就silent = true
        var currentPlayer = this._currentPlayer;
        if (!card)
            return;
        // check if player has the card at hand...一般不会发生吧
        if (!currentPlayer.hasCard(card))
            throw new Error(currentPlayer + " does not have card " + card + " at hand");
        //一般也不会发生
        
        // check if the played card matches the card from the discard pile...
        if (!card.matches(this._discardedCard))
            throw new Error(this._discardedCard + ", from discard pile, does not match " + card);
        //有可能发生
        //如果不match，那么就使这次点击无效
        currentPlayer.removeCard(card);
        //如果currentplayer.name === 'Player'，那么就使所有牌的按钮失活——触碰之后不能弹起来哦
        /******************
        这之后就需要向界面展示移除的牌和出牌的玩家
        card, currentPlayer
        ******************/
        this._discardedCard = card;
        //如果这个牌和discardedCard匹配，那么把玩家牌上的这张手牌移除掉，然后把discardedCard也更新一下
        //可以把出牌的信息反馈到界面
        
        if (currentPlayer.hand.length == 0) {
            var score = this.calculateScore();
            this._over_flag = 1;
            //我加的
            // game is over, we have a winner!
            // TODO: how to stop game after it's finished? Finished variable? >.<
            return;
        }
        //先判断游戏是否结束，如果结束，则计算分，并且触发游戏结束的事件
        switch (this._discardedCard.value) {
            case card_1.Values.WILD_DRAW_FOUR:
                //应该加一个返回让当前玩家重置discardedCard的选项
                this.privateDraw(this.getNextPlayer(), 4);

                if(this.getNextPlayer().name==='Player'){
                    this.playercard=[0,0,0,0];
                }           //马文峻

                this.goToNextPlayer(true);
                //下一个玩家抽4张牌，下一个玩家被silent了
                break;
            case card_1.Values.DRAW_TWO:
                //应该加一个返回让当前玩家重置discardedCard的选项
                this.privateDraw(this.getNextPlayer(), 2);

                if (this.getNextPlayer().name === 'Player') {
                    this.playercard = [0, 0, 0, 0];
                }           //马文峻

                this.goToNextPlayer(true);
                //下一个玩家抽2张牌，下一个玩家被silent了
                break;
            case card_1.Values.SKIP:
                this.goToNextPlayer(true);
                //下一个玩家被silent了
                break;
            case card_1.Values.REVERSE:
                this.reverseGame();
                //改变了游戏顺序
                if (this._players.length == 2)
                    // Reverse works like Skip
                    this.goToNextPlayer(true);
                break;
        }
        //如果没有结束，则根据出牌是不是特殊牌进行操作。
        this.goToNextPlayer();
        //如果是普通牌或者reverse，那么跳到下一个玩家；
        //如果是非reverse特殊牌，那么上面已经跳到下一个玩家了，再执行这一条命令就相当于跳到再下一个玩家了～
        //出牌结束后感觉是自动跳转到下一个玩家诶，不需要玩家输入结束回合的信息
    };
    Game.prototype.uno = function (yellingPlayer, hascardtoPlay) {
        var _this = this;
        yellingPlayer = yellingPlayer || this._currentPlayer;
        //表示可选参数，如果没有传玩家，则默认喊的是现在的玩家，要避免出现这样的情况:)
        // the users that will draw;
        var drawingPlayers = [];
        //表示会被罚抽牌的玩家
        // if player is the one who has 1 card, just mark as yelled
        // (he may yell UNO! before throwing his card, so he may have
        // 2 cards at hand when yelling uno)
        if (yellingPlayer === this._currentPlayer){
            if (yellingPlayer.hand.length <= 2 && !this.yellers[yellingPlayer.name] && hascardtoPlay) {
                this.yellers[yellingPlayer.name] = true;
                /****************
                如果喊成功的话，就显示喊UNO的结果，否则就没有返回动作
                ****************/
                return [];
            }
        }
        
        //如果喊UNO的玩家是现在的玩家，那么就是喊UNO，而不是质疑UNO
        //如果玩家手牌数目<=2，并且没有喊过UNO，而且手上有可以出的牌，那么喊UNO成功了，进行一下标记
        else {
            /****************
            如果质疑UNO的话，就显示质疑UNO，再任后面展示出牌结果
            ****************/
            // else if the user has already yelled or if he has more than 2 cards...
            // is there anyone with 1 card at hand that did not yell uno?
            console.log(this._players);
            drawingPlayers = this._players.filter(function (p) { return p.hand.length == 1 && !_this.yellers[p.name]; });
            // if there isn't anyone...
            if (drawingPlayers.length == 0) {
                // the player was lying, so he will draw
                drawingPlayers = [yellingPlayer];
            }
        }
        
        //如果喊UNO的玩家不是现在的玩家，那么就是在质疑UNO
        //如果喊的是喊过UNO的玩家或者牌数大于2，则这个玩家就被认为是在质疑UNO，那么就找出该抽牌的玩家（牌数==1而且没有喊过UNO）
        //这也意味着没有喊过UNO的玩家随时都可能被抓哈哈
        //如果没有玩家该抽牌，那么质疑就失效，然后就质疑的玩家抽牌
        drawingPlayers.forEach(function (p) { return _this.privateDraw(p, 2); });
        // return who drawn
        return drawingPlayers;//可以反馈得到被抽的玩家诶，而且要是玩家被罚的话，也需要把抽到的牌的信息展示到桌面上（这里少了这一步哦）
    };
    Game.prototype.fixPlayers = function (playerNames) {
        if (!playerNames ||
            !playerNames.length ||
            playerNames.length < 2 ||
            playerNames.length > 10)
            throw new Error('There must be 2 to 10 players in the game');
            //playerNames应该是一个数组,如果playerName===undefined or 长度为undifined or 长度小于2 or 长度大于10，则throw error
        else if (findDuplicates(playerNames).length)
            throw new Error('Player names must be different');
            //如果有重复的名字，也会报错
        return playerNames.map(function (player) {
            return new player_1.Player(player);
        });
        /*这里如果输入的playerNames是合法的：即不重复，长度也合法，那么就创造一个新的player的数组，
        每一个playerNames的名字被替换成了名字以及手牌的组合（当然喽这里还没有抽牌嘛）
        */
        /*array.map的用法：
        function pow(x) {
           return x * x;
        }
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var results = arr.map(pow); // [1, 4, 9, 16, 25, 36, 49, 64, 81]
        */
    };
    
    Game.prototype.getNextPlayer = function () {
        var idx = this.getPlayerIndex(this._currentPlayer);
        idx++;
        if (idx == this._players.length)
            idx = 0;
        return this._players[idx];
        
        //先对idx加一，再操作，如果过了总人数，则令idx=0
    };
    //返回下一个玩家
    Game.prototype.getPlayerIndex = function (playerName) {
        if (typeof playerName !== 'string')
            playerName = playerName.name;
        return this._players.map(function (p) { return p.name; }).indexOf(playerName);
        //先通过map的方法生成一个由playerName构成的数组，然后找出在这个数组中输入的名字的索引，就是所要得到的索引
    };
    //根据名字获取Player的名字获取其索引
    /**
     * Set current player to the next in the line,
     * with no validations, reseting all per-turn controllers
     * (`draw`, ...)
     *
     * @fires Game#nextplayer
     */
    Game.prototype.goToNextPlayer = function (silent) {
        this.drawn = false;
        //进入下一个玩家之后标记为没有出过牌
        this._currentPlayer = this.getNextPlayer();
        /******************
        if(silent === True)这之后就需要向界面输入被禁的玩家的信息 currentPlayer
        if (!silent) 这之后就要向界面输入下一个玩家的信息 currentPlayer，如果这个玩家不是Player，那么玩家的抽牌按钮和所有牌的按钮就都失活
        ******************/
        if (this._currentPlayer.hand === 1 && this.yellers[this._currentPlayer.name] === true){
            this.yellers[this._currentPlayer.name] = true;
        }
        else{
            this.yellers[this._currentPlayer.name] = false;
        }
        //轮到这个玩家的回合之后，如果他只剩一张牌了，就要看他之前有没有喊过UNO，如果喊过，那就不改标记，这样的话别人质疑无效
        //如果他没有喊过UNO或者不只剩一张牌，那么就改成没有喊过UNO
        //this.drawn用于记录当前玩家有没有抽过牌
        //把当前玩家切换成下一个玩家
        //如果下一个玩家没有被跳过的话，那么触发进入下一个玩家的事件（NextPlayerEvent）
        //如果被跳过了的话？
    };
    
    Game.prototype.reverseGame = function () {
        this._players.reverse();
        //把玩家的数组反向
        this.direction =
            this.direction == game_directions_1.GameDirections.CLOCKWISE
                ? game_directions_1.GameDirections.COUNTER_CLOCKWISE
                : game_directions_1.GameDirections.CLOCKWISE;
        //如果现在的顺序是顺时针，那就转成逆时针，如果是逆时针，就转成顺时针
        /******************
        这之后就需要向界面输入新的游戏方向
        direction
        ******************/
    };
    
    /**
     * Add the given amount of cards to the given player's hand
     * from the draw pile.
     *
     * @param player the player to deliver the cards
     * @param amount the amount that must be drawn
     * @returns the drawn cards
     */
    Game.prototype.privateDraw = function (player, amount) {
        if (!player)
            throw new Error('Player is mandatory');
        // console.log(`draw ${amount} to ${player}`);
        var cards = this.drawPile.draw(amount);
        player.hand = player.hand.concat(cards);
        //concat()方法并没有修改当前Array，而是返回了一个新的Array，但是这里重新赋值给了玩家手牌，所以就直接改变了手牌信息
        return cards;
        //返回抽过的牌，但感觉这个返回没有啥太大意义啊
        /******************
        这之后就需要向界面输入抽牌的玩家的信息+抽的牌的信息
        返回值：player, cards, amount
        ******************/
    };
    //给某个玩家的手牌添加指定数量的牌
    Game.prototype.calculateScore = function () {
        return this._players.map(function (player) { return player.hand; }).reduce(function (amount, cards) {
            amount += cards.reduce(function (s, c) { return (s += c.score); }, 0);
            return amount;
        }, 0);
        //先通过map的方法得到玩家剩余的手牌构成的数组，然后用reduce方法把手牌中的值都加起来：
        /*arr.reduce(callback,[initialValue])
            callback （执行数组中每个值的函数，包含四个参数）
                previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
                currentValue （数组中当前被处理的元素）
                index （当前元素在数组中的索引）
                array （调用 reduce 的数组）
                initialValue （作为第一次调用 callback 的第一个参数。）
        */
       //第一个amount代表每个玩家的手牌分数，第二个amount代表一个玩家中每张牌的分数
    };
    //得到游戏的分数
    return Game;
}());
exports.Game = Game;
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// https://stackoverflow.com/a/24968449/1574059
function findDuplicates(array) {
    // expects an string array
    var uniq = array
        .map(function (name, idx) {
        return { count: 1, name: name };
    })
    //数组本身就带有idx属性，相当于这里吧playerNames这个字符串数组的字符串替换成一个对象，注意map不会对array进行更改
        .reduce(function (a, b) {
        a[b.name] = (a[b.name] || 0) + b.count;
        return a;
    }, {});
    //[x1, x2, x3, x4].reduce(f) = f(f(f(x1, x2), x3), x4)返回都是一个值
    //
    var duplicates = Object.keys(uniq).filter(function (a) { return uniq[a] > 1; });
    return duplicates;
}
//这个函数返回的是一个数组，大概表示重复的那些player吧。接收的是playerNames这个字符串数组

function isObject(val) {
    return val !== null && typeof val === 'object';
}
//# sourceMappingURL=game.js.map