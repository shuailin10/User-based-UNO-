var game_1 = require("./game");

var playerNames = ['Player', 'Computer1', 'Computer2', 'Computer3'];
var computerNames = ['Computer1', 'Computer2', 'Computer3']
var game = new game_1.Game(playerNames);


    //根据现在的玩家是谁判断让哪个AI进行操作
    /*switch(game.currentPlayer()){
        case "Player":
            player(game);
            break;
        case "AI_1":
            player(game);
            break;
        case "AI_2":
            player(game);
            break;
        case "AI_3":
            player(game);
            break;
    }
    */
var count = 0;
//var count_2 = 0;
var handofPlayer = game.getPlayer('Player').hand;
var discardedCard = game.discardedCard;
console.log(handofPlayer);
var cards=[];
for (var i in handofPlayer){
    if (handofPlayer[i].value === 13)
        cards.push('48' + '.png')
    else if (handofPlayer[i].value === 14)
        cards.push('49' + '.png')
    else
        cards.push(handofPlayer[i].color * 13 + handofPlayer[i].value + '.png')
}
console.log(cards);

//获得玩家的手牌

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var chosenbyAI = function(){
    /**************
     需要传什么变量进来要看AI的设计！
    ***************/
    var hand = game.currentPlayer.hand;
    var discardedCard = game.discardedCard;
    var cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });//最简单的AI，随机选择
    if (cardtoPlay){
        if (cardtoPlay.value === 13 || cardtoPlay.value === 14){
            var newcolor = getRandomInt(0, 3);
            cardtoPlay.color = newcolor;
        }
        //如果要出的牌是wild or wilddraw4，那么就先赋予颜色性质
    }
    return cardtoPlay;
}

var computer = function(){
    var hand = game.currentPlayer.hand;
    var hascardtoPlay = 0;
    //console.log(hand);
    //console.log(discardedCard);
    //console.log(discardedCard.matches(hand[0]));
    var cardtoPlay = chosenbyAI();
    if (cardtoPlay){
        hascardtoPlay = 1;
        if (hand.length === 2){
            game.uno(game._currentPlayer, hascardtoPlay);
            /******************
             这之后就需要向界面输入喊UNO的玩家信息+喊UNO成功的信息
             ******************/
        }
        //如果手上只有2张牌了，并且有可以出的牌，那么就喊uno；
        game.play(cardtoPlay);
        /******************
             这之后就需要向界面输入现在出牌的玩家的信息+出牌的信息
        ******************/
        //然后出牌
        //这样一个回合就结束了，就应该传一个信号给其他AI，让他们判断是不是有人没喊UNO，如果没有，那么就赶快抓一下哈哈哈
        //如果有牌可以出，那么就一定出牌；
    }
    //如果有牌可以出，那就一定要出牌
    //console.log(cardtoPlay);  
    else{
        game.draw();
        //如果没牌可以出，那就抽牌
        //一旦抽牌了，那么无论如何都会被标记成没有喊UNO
        cardtoPlay = chosenbyAI();
        if (cardtoPlay){
            hascardtoPlay = 1;
            if (hand.length === 2){
                game.uno(game._currentPlayer, hascardtoPlay);
            }
            game.play(cardtoPlay);
        }
        else{
            game.pass();
        }
        //抽牌之后有可以出的牌就出，没有就跳过
    }
    /*if (hand.length === 1){
        count_2++;
    }
    */
}

var player = function(){
    var hand = game.currentPlayer.hand;
    var hascardtoPlay = 0;
    //console.log(hand);
    //console.log(discardedCard);
    //console.log(discardedCard.matches(hand[0]));
    var cardtoPlay = chosenbyAI();
    if (cardtoPlay){
        hascardtoPlay = 1;
        if (hand.length === 2){
            game.uno(game._currentPlayer, hascardtoPlay);
            /******************
             这之后就需要向界面输入喊UNO的玩家信息+喊UNO成功的信息
             ******************/
        }
        //如果手上只有2张牌了，并且有可以出的牌，那么就喊uno；
        game.play(cardtoPlay);
        /******************
             这之后就需要向界面输入现在出牌的玩家的信息+出牌的信息
        ******************/
        //然后出牌
        //这样一个回合就结束了，就应该传一个信号给其他AI，让他们判断是不是有人没喊UNO，如果没有，那么就赶快抓一下哈哈哈
        //如果有牌可以出，那么就一定出牌；
    }
    //如果有牌可以出，那就一定要出牌
    //console.log(cardtoPlay);  
    else{
        game.draw();
        //如果没牌可以出，那就抽牌
        //一旦抽牌了，那么无论如何都会被标记成没有喊UNO
        cardtoPlay = chosenbyAI();
        if (cardtoPlay){
            hascardtoPlay = 1;
            if (hand.length === 2){
                game.uno(game._currentPlayer, hascardtoPlay);
            }
            game.play(cardtoPlay);
        }
        else{
            game.pass();
        }
        //抽牌之后有可以出的牌就出，没有就跳过
    }
    /*if (hand.length === 1){
        count_2++;
    }
    */
}

var yellunobyAI = function(){
    var yellerAI = computerNames.find(function (c) { return c !== game._currentPlayer.name; })
    //确定一下当前不出牌的AI，由他来质疑玩家哈哈哈
    if (!game.yellers['Player'] && game.getPlayer('Player').hand.length === 1){
        game.uno(game.getPlayer[yellerAI], undefined);
    }
}

//需要写一个函数从界面中随时读取玩家喊UNO的信息，但是考虑到AI一定会喊UNO，所以可以假装没有这个功能哈哈哈


while(game._over_flag === 0){
    if (game._currentPlayer.name !== 'Player'){
        computer();
    }
    else{
        player();
        yellunobyAI();
        //玩家忘记喊UNO的话就会立即被AI给抓住～
    }
    count++;
    console.log(count);
    console.log(game._over_flag);
    /*if (count_2 !== 0){
        count_2++;
    }
    */
}

//console.log("Game Over");
//console.log(game);


