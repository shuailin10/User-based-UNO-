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
var handofplayer = game.player['Player'].hand;

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
    var discardedCard = game.discardedCard;
    var cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });
    var hascardtoPlay = 0;
    if (cardtoPlay){
        hascardtoPlay = 1;
    }
   

    console.log("Hello, this is your turn. Your hand are shown below")
    console.log(hand);
    console.log("Please enter the command: draw, play or uno. Good Luck!");
    
    //根据输入的command 判断输入的合法性
    //如果是抽牌命令，合理的抽牌场景应为：!this.drawn && !cardtoPlay 否则就提示输入无效，请再次输入
    //抽牌之后，如果!cardtoPlay，则直接结束回合；如果有牌，则提示继续输入命令；
    //如果是出牌命令，则进一步提示可以出的牌，如果出牌有效，则判断出牌效果：如果是wild or wilddraw4，则再次提示输入选择的颜色。出牌之后直接结束回合
    //如果出牌无效，则提示重新输入命令
    //如果是uno命令，合理的uno场景应为：hand.length === 2 && !yellers['Player'] && hascardtoPlay，否则提示输入无效，请再次输入
    //如果喊UNO成功，则继续输入命令
    rl.setPrompt('Please enter your command:');
    rl.prompt();
    rl.on('line', function(line) {
        if (game._currentPlayer !=='Player'){
            console.log("Sorry, this is not your turn!");
        }
        else{
            switch(line.trim()) {
                case 'draw':
                    if (!game.drawn && !hascardtoPlay){
                        game.draw();
                        cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });
                        hascardtoPlay = cardtoPlay == true;
                        console.log("This is your new hand:");
                        console.log(hand);
                        if (!hascardtoPlay){
                            game.pass();
                            console.log("Your turn is over!");
                        }
                        //如果抽的牌不可以出，那么跳过
                        else{
                            rl.prompt();
                        }
                        //如果抽的牌可以出，那么必须要出牌
                    }
                    //如果没有抽过牌而且无牌可以出，那么可以抽牌
                    else{
                        console.log("The command is not valid, please input your command again!");
                        rl.prompt();
                    }
                    break;
                case 'play':
                    console.log('Please enter the card index you want to play:');
                    rl.prompt();
                    rl.playcard();
                    break;
                    //如果点击的牌可以出，那么出牌；出牌之后判断出牌效果，并且判断下一个玩家
                    //如果点击的牌不可以出，那么出牌无效
                case 'uno':
                    if (hand.length === 2 && !yellers['Player'] && hascardtoPlay){
                        game.uno();
                        console.log("You have yelled uno successfully!");
                    }
                    //如果只剩两张手牌，没有uno，有可以出的牌，那么喊UNO成功
                    else{
                        console.log("The command is not valid, please input your command again!")
                    }
                    //否则点击无效
                    rl.prompt();
                    break;
                default:
                    console.log('请输入draw/play/uno三个命令中的任何一个！');
                    rl.prompt();
                    break;
            }
        }
        
    });
    rl.on('playcard', function(playcommand){
        if (playcommand > hand.length - 1){
            console.log("Please enter the right index!");
            r1.prompt();
            r1.playcard();
        }
        else{
            if (hand[playcommand].matches(discardedCard)){
                game.play(hand[playcommand])
            }
            else{
                console.log("Please enter the right index!");
                r1.prompt();
                r1.line();
            }
        }
    });
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
        player();//从界面的点击信息
        yellunobyAI();
        //玩家忘记喊UNO的话就会立即被AI给抓住～
    }
    count++;
    //console.log(count);
    /*if (count_2 !== 0){
        count_2++;
    }
    */
}

console.log("Game Over");
console.log(game);
