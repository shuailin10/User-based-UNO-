var game_1 = require("../../utils/uno-engine/dist/game.js");
//导入game.js里的Game类
var app = getApp();
var playerNames = ['Player', 'Computer1', 'Computer2', 'Computer3'];
//所有玩家的名字，会被输入到game_1里的Game方法创造一个新的游戏
var computerNames = ['Computer1', 'Computer2', 'Computer3'];
//用来记录AI的名字，可以被yellunobyAI函数来用于选择让哪个AI质疑玩家
var game = new game_1.Game(playerNames);
//创建一个新的Game类的实例
var cardtoPlay = {};
//记录所有玩家要出的牌
var discardedCard = game.discardedCard;
//记录刚出的牌
var isPlayer = 1;
//记录现在的玩家是不是用户
var questionUNO = 0;
//记录是否有人质疑过UNO，如果有人质疑，则展示质疑结果，并重新将该变量置为0
var yellerAI;
//记录质疑UNO的AI
var position = function (num) {
  var card_pos_temp = [];
  if (num % 2 === 1) {
    card_pos_temp.push(300)
    if (num > 1) {
      for (var i = 1; i <= (num - 1) / 2; i++) {
        card_pos_temp.unshift(300 - i * 40)
        card_pos_temp.push(300 + i * 40)
      }
    }
  }
  else {
    if (num === 2) {
      card_pos_temp.unshift(280)
      card_pos_temp.push(320)
    }
    if (num > 2) {
      for (var i = 0; i < num / 2; i++) {
        card_pos_temp.unshift(280 - i * 40)
        card_pos_temp.push(320 + i * 40)
      }
    }
  }
  return card_pos_temp;
}
//用于确定玩家卡牌的摆放位置

var previousPlayer = game.currentPlayer;
//用来确定刚操作完的玩家，便于展示出牌结果

Page({
  
 
  /**
   * 
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: "",
      //用户头像
    },
    
    title: "",
    //游戏结果提示框的标题

    message: "",
    //游戏结果提示框的展示的信息
    
    card_num: [{ num: 7, top: 530, left: 80 }, { num: 7, top: 230, left: 360 }, { num: 7, top: 530, left: 630 }],
    //AI的剩余手牌数及其展示位置

    cards: [],
    //用户具体手牌

    clicked: -1, 
    //用户是否点击了任何一张牌
    
    discardedCardurl: "",
    //被丢弃卡的位置

    arrow_top: 0,
    arrow_left: 0,
    //指向当前玩家的箭头的位置

    forbidden: [{ toppos: -100, leftpos: -100 }],
    //禁止出牌标志位置   

    plus_two: [{ toppos: -100, leftpos: -100 }],
    //+2标志位置 

    plus_four: [{ toppos: -100, leftpos: -100 }],
    //+4标志位置 

    unopos: { toppos: -300, leftpos: -300 },
    //uno标志位置 

    saywords: [{ words: "", toppos: -300, leftpos: -300 }], 
    //对话框位置，用于展示质疑UNO，喊UNO，设置颜色的结果

    reverse: '../images/clockwise.png', 
    //指示当前游戏方向的箭头

    reverse_state: 'clockwise',
    //当前游戏方向
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
        })
      }
    })
    var that = this;
    console.log(app.globalData.level);
    this.setData({
      clikced: -1
    })
    game = new game_1.Game(playerNames);
    cardtoPlay = {};
    discardedCard = game.discardedCard;
    isPlayer = 1;
    questionUNO = 0;
    this.newGame();
    //获取用户头像
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },


  newGame: function(){
    this.setCard(); //更新玩家的手牌信息：手牌对应的图像+位置 
    this.setHandnumofAI();
    this.setDiscardedCard();
    this.setArrow();
  },
  //初始化游戏：展示玩家的手牌数目、AI的剩余手牌数目，桌面上的牌、指向当前玩家的箭头

  setCard: function () {
    var handofPlayer = game.getPlayer('Player').hand;
    var cards_temp = [];
    var card_pos_temp = position(handofPlayer.length);
    for (var i in handofPlayer) {
      if (handofPlayer[i].value === 13) {
        var c_temp = { img: '../images/cards/53.png', left_pos: card_pos_temp[i], top_pos: 750 }
        cards_temp.push(c_temp);
      }
      else if (handofPlayer[i].value === 14) {
        var c_temp = { img: '../images/cards/52.png', left_pos: card_pos_temp[i], top_pos: 750 }
        cards_temp.push(c_temp);
      }
      else {
        var card_index = handofPlayer[i].color * 13 + handofPlayer[i].value;
        var c_temp = { img: '../images/cards/' + card_index + '.png', left_pos: card_pos_temp[i], top_pos: 750 }
        cards_temp.push(c_temp);
      }
    }
    this.setData({
      cards: cards_temp
    })
    console.log(this.data.cards)
  },
  //更新玩家的手牌信息：手牌对应的图像+位置 

  setHandnumofAI: function () {
    /*var handnumofAI_temp = [game.getPlayer('Computer1').hand.length, game.getPlayer('Computer2').hand.length, game.getPlayer('Computer3').hand.length]*/
    var com1 = "card_num[0].num";
    var com2 = "card_num[1].num";
    var com3 = "card_num[2].num";
    var com1_num = game.getPlayer('Computer1').hand.length;
    var com2_num = game.getPlayer('Computer2').hand.length;
    var com3_num = game.getPlayer('Computer3').hand.length;
    this.setData({
      //handnumofAI: handnumofAI_temp,
      [com1]: com1_num,
      [com2]: com2_num,
      [com3]: com3_num
    })
  },
  //更新AI的剩余手牌数目
  
  setDiscardedCard: function(){
    discardedCard = game.discardedCard;
    if (discardedCard.value === 13){
      var discardedCard_temp = '../images/cards/53.png';
    }
    else if (discardedCard.value === 14){
      var discardedCard_temp = '../images/cards/52.png';
    }
    else{
      var card_index = discardedCard.color * 13 + discardedCard.value;
      var discardedCard_temp = '../images/cards/' + card_index + '.png'
    }
    this.setData({
      discardedCardurl: discardedCard_temp
    })
  },
  //更新桌面上刚出的牌

  card_click: function (event) {
    if (!isPlayer){
      return;
    }
    console.log(event);
    previousPlayer = game.currentPlayer;
    var handofPlayer = game.getPlayer('Player').hand;
    if (game.currentPlayer.name !== 'Player')
      return;
    var that = this;
    var click = this.data.clicked;
    var clicktemp = -1;
    if (click === -1) {
      click = event.currentTarget.dataset.id;
    }
    else if (click === event.currentTarget.dataset.id) {
      var indexofclickedCard_1 = this.data.cards.findIndex(function (c) { return c.left_pos === that.data.clicked; });
      clicktemp = indexofclickedCard_1;
      click = -1;
    }
    this.setData({
      clicked: click,
    })
    //如果这张卡没有点击过，那么标记成已点击
    //如果点击过了，那么就标记成没点击

    if (this.data.clicked === event.currentTarget.dataset.id){
      var indexofclickedCard = this.data.cards.findIndex(function (c) { return c.left_pos === that.data.clicked; });
      cardtoPlay = handofPlayer[indexofclickedCard];
      var top_position = "cards[" + indexofclickedCard + "].top_pos";
      this.setData({
        [top_position]: 730
      })
    }
    //如果卡被成功推出，那么就推出
    else if (this.data.clicked === -1){
      cardtoPlay = {};
      var top_position = "cards[" + clicktemp + "].top_pos";
      this.setData({
        [top_position]: 750
      })
      clicktemp = -1;
    }
    //如果卡被成功弹回，那么就弹回
    this.setData({
      clicked: click,
    })
    console.log(this.data.clicked);
    console.log(cardtoPlay);
  },
  //获取点击的牌的信息

  playCard: function(event){
    if (!isPlayer) {
      return;
    }
    previousPlayer = game.currentPlayer;
    var iscardtoPlayempty = true;
    if (game.currentPlayer.name !== 'Player')
      return;
    for (var i in cardtoPlay) { // 如果不为空，则会执行到这一步，返回true
      iscardtoPlayempty = false;
    }
    if(discardedCard.value!==13 && discardedCard.value!==14){
        game.alldiscarded[discardedCard.color]+=1;
        game.alldiscarded[discardedCard.value+4]+=1;
    }          //更新game里记录discarded的数组       马文峻
    if (!iscardtoPlayempty){
      if (cardtoPlay.matches(discardedCard)){
        this.setData({
          clicked: -1
        })
        game.play(cardtoPlay);
        if (game._over_flag === 1){
          this.gameOver();
        }
        else{
          this.yellunobyAI();//AI判定是否喊UNO
          this.showplayResults();
          if (questionUNO){
            this.showquestionuno();
            if (!cardtoPlay.isWildCard()) {
              setTimeout((function callback() {
                this.setArrow();
              }).bind(this), 5000);
              setTimeout((function callback() {
                this.computer();
              }).bind(this), 5200);
            }
            else if (!cardtoPlay.isSpecialCard()) {
              setTimeout((function callback() {
                this.setArrow();
              }).bind(this), 5000);
              setTimeout((function callback() {
                this.computer();
              }).bind(this), 5200);
            }
          }
          else{
            if (!cardtoPlay.isWildCard()) {
              setTimeout((function callback() {
                this.setArrow();
              }).bind(this), 3000);
              setTimeout((function callback() {
                this.computer();
              }).bind(this), 3200);
            }
            else if (!cardtoPlay.isSpecialCard()) {
              setTimeout((function callback() {
                this.setArrow();
              }).bind(this), 1000);
              setTimeout((function callback() {
                this.computer();
              }).bind(this), 1200);
            }
          }
          
          
        //轮到AI来玩了诶
        }
      }
    }//如果选择了牌，点击了出牌按钮（绑定到playCard上），而且选择的牌是匹配的，那么就出牌
  },
  //玩家出牌

  setColor: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['红色', '蓝色', '绿色', '黄色'],
      success: function (res) {
        cardtoPlay.color = res.tapIndex;
        that.saywords(res.tapIndex);
        if (cardtoPlay.value === 14){
          that.drawfourCards();
        }
        setTimeout((function callback() {
          that.setArrow();
        }).bind(that), 2000);
        setTimeout((function callback() {
            that.computer();
        }).bind(that), 2200);
      }
    })
  },
  //提示玩家设置颜色
  //如果是+4牌，则调用drawfourCards函数

  drawCard: function (event) {
    if (!isPlayer) {
      return;
    }
    previousPlayer = game.currentPlayer;
    var that = this;
    var hand = game.getPlayer('Player').hand;
    if (game.currentPlayer.name !== 'Player')
      return;
    var cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });
    var hascardtoPlay = 0;
    if (cardtoPlay) {
      hascardtoPlay = 1;
    }
    if (!game.drawn && !hascardtoPlay) {
      game.draw();
      this.setData({
        clicked: -1
      })
      if (discardedCard.value != 13 && discardedCard.value != 14) {
          game.playercard[discardedCard.color]=1;
      }          //更新game里记录playercard的数组     马文峻

      this.setCard();//更新玩家手牌信息
      hand = game.getPlayer('Player').hand;
      cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });
      if (cardtoPlay) {
        hascardtoPlay = 1;
      }
      if (!hascardtoPlay) {
        game.pass();
        setTimeout((function callback() {
          this.setArrow();
        }).bind(this), 2000);
        setTimeout((function callback() {
          this.computer();//轮到AI来玩了诶
        }).bind(this), 2200);
      }
    }
    //如果没有抽过牌而且无牌可以出，那么可以抽牌
  },
  //玩家抽牌

  uno: function(){
    if (!isPlayer) {
      return;
    }
    var that = this;
    previousPlayer = game.currentPlayer;
    var hand = game.getPlayer('Player').hand;
    if (game.currentPlayer.name !== 'Player')
      return;
    var cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });
    var hascardtoPlay = 0;
    if (cardtoPlay){
      hascardtoPlay = 1;
    }
    console.log("yes1!");
    console.log(game.currentPlayer.hand.length)
    console.log(game.yellers[game.currentPlayer.name])
    console.log(hascardtoPlay)
    if (game.currentPlayer.hand.length <= 2 && !game.yellers[game.currentPlayer.name] && hascardtoPlay){
      game.uno(game.currentPlayer, hascardtoPlay);
      this.saywords(4);
      console.log("yes2!")
    }
  },
  //玩家喊UNO

  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  //随机生成[min,max]之间的整数

  computer: function () {
    isPlayer = 0;
    previousPlayer = game.currentPlayer;
    var hand = game.currentPlayer.hand;
    var hascardtoPlay = 0;
    switch (app.globalData.level) {
      case 1:
        var cardtoPlay = this.chosenbyAI_easy();
        break;
      case 2:
        var cardtoPlay = this.chosenbyAI_medium();
        break;
      case 3:
        var cardtoPlay = this.chosenbyAI_difficult();
        break;
      default:
        var cardtoPlay = this.chosenbyAI_easy();
        break;
    }
    console.log("********")
    console.log(cardtoPlay);
    if (cardtoPlay) {
      hascardtoPlay = 1;
      if (hand.length === 2) {
        game.uno(game.currentPlayer, hascardtoPlay);
        this.saywords(4);
        console.log("yes2!")
        /******************
         这之后就需要向界面输入喊UNO的玩家信息+喊UNO成功的信息
         ******************/
      }
      //如果手上只有2张牌了，并且有可以出的牌，那么就喊uno；
      game.play(cardtoPlay);      
      if (game._over_flag === 1) {
        this.gameOver();
      }
      else{
        this.showplayResults();
        if (cardtoPlay.isSpecialCard()) {
          setTimeout((function callback() {
            this.setArrow();
          }).bind(this), 3000);
          setTimeout((function callback() {
            this.setPlayer();
          }).bind(this), 3200);
        }
        else{
          setTimeout((function callback() {
            this.setArrow();
          }).bind(this), 1000);
          setTimeout((function callback() {
            this.setPlayer();
          }).bind(this), 1200);
        }
      }
      //如果有牌可以出，那么就一定出牌；
    }
    //如果有牌可以出，那就一定要出牌
    else {
      game.draw();
      hand = game.currentPlayer.hand;
      this.setHandnumofAI();
      //如果没牌可以出，那就抽牌
      //一旦抽牌了，那么无论如何都会被标记成没有喊UNO
      switch (app.globalData.level) {
        case 1:
          var cardtoPlay = this.chosenbyAI_easy();
          break;
        case 2:
          var cardtoPlay = this.chosenbyAI_medium();
          break;
        case 3:
          var cardtoPlay = this.chosenbyAI_difficult();
          break;
        default:
          var cardtoPlay = this.chosenbyAI_easy();
          break;
      }
      if (cardtoPlay) {
        hascardtoPlay = 1;
        if (hand.length === 2) {
          game.uno(game.currentPlayer, hascardtoPlay);
          this.saywords(4);
          console.log("yes2!")
        }
        setTimeout((function callback() {
          game.play(cardtoPlay);
        }).bind(this), 1000);
        //等更新完AI的手牌数目之后再玩耍
        setTimeout((function callback() {
          this.showplayResults();
        }).bind(this), 1000);
        if (cardtoPlay.isSpecialCard()) {
          setTimeout((function callback() {
            this.setArrow();
          }).bind(this), 4000);
          setTimeout((function callback() {
            this.setPlayer();
          }).bind(this), 4200);
        }
        else{
          setTimeout((function callback() {
            this.setArrow();
          }).bind(this), 2000);
          setTimeout((function callback() {
            this.setPlayer();
          }).bind(this), 2200);
        }
      }
      else {
        game.pass();
        setTimeout((function callback() {
          this.setArrow();
        }).bind(this), 1000);
        setTimeout((function callback() {
          this.setPlayer();
        }).bind(this), 1200);
      }
      //抽牌之后有可以出的牌就出，没有就跳过
    }
  },
  //AI的进行操作

  yellunobyAI: function () {
    yellerAI = computerNames.find(function (c) { return c !== game.currentPlayer.name; })
    //确定一下当前不出牌的AI，由他来质疑玩家哈哈哈
    if (!game.yellers['Player'] && game.getPlayer('Player').hand.length === 1) {
      game.uno(game.getPlayer(yellerAI), undefined);
      questionUNO = 1;
    }
  },
  //AI质疑UNO

  showquestionuno: function() {
    this.saywords(5);
    this.setCard();
  },
  //AI喊UNO

  setArrow: function(){
    if (game.currentPlayer.name === 'Player'){
      this.setData({
        arrow_top: 975,
        arrow_left: 200
      })
    }
    else if (game.currentPlayer.name === 'Computer1') {
      this.setData({
        arrow_top: 325,
        arrow_left: 200
      })
    }
    else if (game.currentPlayer.name === 'Computer2') {
      this.setData({
        arrow_top: 75,
        arrow_left: 225
      })
    }
    else if (game.currentPlayer.name === 'Computer3') {
      this.setData({
        arrow_top: 325,
        arrow_left: 485
      })
    }
  },
  //更新指向当前玩家的箭头

  setPlayer: function(){
    if (game.currentPlayer.name !== 'Player'){
      this.computer();
    }
    else{
      isPlayer = 1;
      cardtoPlay = {};
    }
    //只要不是轮到了用户出牌就一直由AI来出
  },
  //跳转至下一个玩家的回合

  showplayResults: function(){
    if (previousPlayer.name === 'Player') {
      this.setCard();//如果是玩家出的牌，那么更新玩家手牌信息
    }
    else{
      this.setHandnumofAI();//如果是AI出的牌，那么更新AI的剩余手牌信息
    }
    this.setDiscardedCard();//更新桌面上的牌
    switch (discardedCard.value) {
      case 10:
        setTimeout((function callback() {
          this.drawtwoCards();
        }).bind(this), 1000);
        break;
      case 11:
        setTimeout((function callback() {
          this.reverseDirection();
        }).bind(this), 1000);
        break;
      case 12:
        setTimeout((function callback() {
          this.skipPlayer();
        }).bind(this), 1000);
        break;
      case 13:
        setTimeout((function callback() {
          this.wildCard();
        }).bind(this), 1000);
        break;
      case 14:
        setTimeout((function callback() {
          this.wilddrawfourCard();
        }).bind(this), 1000);
        break;
      default:
        setTimeout((function callback() {
          this.delay();
        }).bind(this), 1000);
    }
  },
  //展示出牌结果，如果是玩家出的牌，那么更新玩家手牌信息；如果是AI出的牌，那么更新AI的剩余手牌信息。更新刚出的牌的信息。根据出的牌来展示调用相应的函数展示出牌结果

  delay: function(){

  },

  drawtwoCards: function(){
    var name = previousPlayer.name;
    var toppos = "plus_two[0].toppos";
    var leftpos = "plus_two[0].leftpos";
    var direction = game.direction;
    if (direction === 1) {
      switch (name) {
        case 'Player':
          this.setData({
            [toppos]: 270,
            [leftpos]: 100
          });
          this.setHandnumofAI();
          console.log("你+2了嘛");
          break;
        case 'Computer1':
          this.setData({
            [toppos]: 20,
            [leftpos]: 360
          });
          this.setHandnumofAI();
          break;
        case 'Computer2':
          this.setData({
            [toppos]: 270,
            [leftpos]: 610
          });
          this.setHandnumofAI();
          break;
        case 'Computer3':
          this.setData({
            [toppos]: 920,
            [leftpos]: 360
          })
          this.setCard();
          break;
      }
    }
    else {
      switch (name) {
        case 'Computer2':
          this.setData({
            [toppos]: 270,
            [leftpos]: 100
          });
          this.setHandnumofAI();
          break;
        case 'Computer3':
          this.setData({
            [toppos]: 20,
            [leftpos]: 360
          });
          this.setHandnumofAI();
          break;
        case 'Player':
          this.setData({
            [toppos]: 270,
            [leftpos]: 610
          });
          this.setHandnumofAI();
          console.log("你+2了嘛");
          break;
        case 'Computer1':
          this.setData({
            [toppos]: 920,
            [leftpos]: 360
          })
          this.setCard();
          break;
      }
    }
    setTimeout((function callback() {
      var toppos = "plus_two[0].toppos";
      var leftpos = "plus_two[0].leftpos";
      this.setData({
        [toppos]: -100,
        [leftpos]: -100
      })
    }).bind(this), 2000);
    //跳出一个+2的图片到某个玩家上，然后两秒钟后消失～～
  },
  //展示+2牌的出牌结果：1.跳出+2的提示信息。2.如果是玩家抽牌，则更新玩家手牌；如果是AI抽牌，则更新AI的剩余手牌数目

  drawfourCards: function () {
    var name = previousPlayer.name;
    var toppos = "plus_four[0].toppos";
    var leftpos = "plus_four[0].leftpos";
    var direction = game.direction;
    if (direction === 1) {
      switch (name) {
        case 'Player':
          this.setData({
            [toppos]: 270,
            [leftpos]: 100
          });
          this.setHandnumofAI();
          console.log("你+4了嘛");
          break;
        case 'Computer1':
          this.setData({
            [toppos]: 20,
            [leftpos]: 360
          });
          this.setHandnumofAI();
          break;
        case 'Computer2':
          this.setData({
            [toppos]: 270,
            [leftpos]: 610
          });
          this.setHandnumofAI();
          break;
        case 'Computer3':
          this.setData({
            [toppos]: 920,
            [leftpos]: 360
          })
          this.setCard();
          break;
      }
    }
    else {
      switch (name) {
        case 'Computer2':
          this.setData({
            [toppos]: 270,
            [leftpos]: 100
          });
          this.setHandnumofAI();
          break;
        case 'Computer3':
          this.setData({
            [toppos]: 20,
            [leftpos]: 360
          });
          this.setHandnumofAI();
          break;
        case 'Player':
          this.setData({
            [toppos]: 270,
            [leftpos]: 610
          });
          this.setHandnumofAI();
          console.log("你+4了嘛");
          break;
        case 'Computer1':
          this.setData({
            [toppos]: 920,
            [leftpos]: 360
          })
          this.setCard();
          break;
      }
    }
    setTimeout((function callback() {
      var toppos = "plus_four[0].toppos";
      var leftpos = "plus_four[0].leftpos";
      this.setData({
        [toppos]: -100,
        [leftpos]: -100
      })
    }).bind(this), 2000);
    //跳出一个+4的图片到某个玩家上，然后两秒钟后消失～～
  },
  //展示+4牌的出牌结果：1.跳出+4的提示信息。2.如果是玩家抽牌，则更新玩家手牌；如果是AI抽牌，则更新AI的剩余手牌数目

  reverseDirection: function () {
    //跳出一个reverse的图片在某个位置
    if (this.data.reverse_state === 'clockwise') {
      console.log("counterclockwise");
      this.setData({
        reverse: "../images/counterclockwise.png",
        reverse_state: "counterclockwise"
      })
    }
    else if (this.data.reverse_state === 'counterclockwise') {
      console.log("counterclockwise");
      this.setData({
        reverse: "../images/clockwise.png",
        reverse_state: "clockwise"
      })
    }
  },
  //展示反向牌的出牌结果：更新当前游戏方向

  skipPlayer: function () {
    var name = previousPlayer.name;
    var toppos = "forbidden[0].toppos";
    var leftpos = "forbidden[0].leftpos";
    var direction = game.direction;
    if (direction === 1) {
      switch (name) {
        case 'Player':
          this.setData({
            [toppos]: 270,
            [leftpos]: 80
          });
          break;
        case 'Computer1':
          this.setData({
            [toppos]: 20,
            [leftpos]: 335
          });
          break;
        case 'Computer2':
          this.setData({
            [toppos]: 270,
            [leftpos]: 590
          });
          break;
        case 'Computer3':
          this.setData({
            [toppos]: 920,
            [leftpos]: 335
          })
          break;
      }
    }
    else {
      switch (name) {
        case 'Computer2':
          this.setData({
            [toppos]: 270,
            [leftpos]: 80
          });
          break;
        case 'Computer3':
          this.setData({
            [toppos]: 20,
            [leftpos]: 335
          });
          break;
        case 'Player':
          this.setData({
            [toppos]: 270,
            [leftpos]: 630
          });
          break;
        case 'Computer1':
          this.setData({
            [toppos]: 920,
            [leftpos]: 335
          })
          break;
      }
    }
    setTimeout((function callback() {
      var toppos = "forbidden[0].toppos";
      var leftpos = "forbidden[0].leftpos";
      this.setData({
        [toppos]: -100,
        [leftpos]: -100
      })
    }).bind(this), 2000);
    //跳出一个禁止的图片到某个玩家的头像上，然后两秒钟之后消失～～
  },
  //展示禁止牌的出牌结果：跳出禁止牌的信息

  wildCard: function () {
    var name = previousPlayer.name;
    if (name === 'Player') {
      this.setColor()
    }
    else {
      this.saywords(cardtoPlay.color);
    }
    //弹出一个框让玩家选择颜色，并且更新cardtoPlay的信息
  },
  //展示万用牌的出牌结果：如果是玩家出牌，则调用setColor函数提示用户设置牌的颜色；如果是AI出牌，则调用saywords函数展示设置牌的颜色

  wilddrawfourCard: function () {
    var name = previousPlayer.name;
    if (name === 'Player') {
      this.setColor();
    }
    else{
      this.saywords(cardtoPlay.color);
    }
    //弹出一个框让玩家选择颜色，并且更新cardtoPlay的信息
    //抽牌在设置完颜色之后再抽吧:(
  }, 
  //展示+4牌的出牌结果：如果是用户出牌，则调用setColor函数提示用户设置牌的颜色；如果是AI出牌，则调用saywords函数展示设置牌的颜色

  
  modalcnt: function () {
    wx.showModal({
      title: this.data.title,
      cancelText: '返回',
      confirmText: '再来一局',
      content: this.data.message,
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url:"../game/game"
          })
        } 
        else if (res.cancel) {
          wx.redirectTo({
            url: "../first/first"
          })
        }
      }
    })
  },
  //游戏结束窗口

  gameOver: function(){
    if (previousPlayer.name === 'Player') {
      this.setData({
        title: "恭喜",
        message: "你获胜了，真棒"
      })
      this.modalcnt();
    }
    else {
      this.setData({
        title: "哎呀",
        message: "你失败了，继续加油哟"
      })
      this.modalcnt();
    }
  },
  //结束游戏

  saywords: function (newcolor) {
    var name = previousPlayer.name;
    if (questionUNO){
      name = yellerAI;
      questionUNO = 0;
    }
    var toppos = "saywords[0].toppos";
    var leftpos = "saywords[0].leftpos";
    var words = "saywords[0].words";
    var sayred = "../images/sayred.png";
    var sayblue = "../images/sayblue.png";
    var saygreen = "../images/saygreen.png";
    var sayyellow = "../images/sayyellow.png";
    var sayuno = "../images/sayuno.png";
    var sayquestionuno = "../images/sayquestionuno.png"
    switch (newcolor) {
      case 0:
        this.setData({
          [words]: sayred
        });
        console.log('sayred');
        break;
      case 1:
        this.setData({
          [words]: sayblue
        });
        console.log('sayblue');
        break;
      case 2:
        this.setData({
          [words]: saygreen
        });
        console.log('saygreen');
        break;
      case 3:
        this.setData({
          [words]: sayyellow
        });
        console.log('sayyellow');
        break;
      case 4:
        this.setData({
          [words]: sayuno
        });
        console.log('sayuno');
        break;
      case 5:
        this.setData({
          [words]: sayquestionuno
        });
        console.log('sayquestionuno');
        break;
    }
    switch (name) {
      case 'Computer1':
        this.setData({
          [toppos]: 230,
          [leftpos]: 100,
        });
        break;
      case 'Computer2':
        this.setData({
          [toppos]: 0,
          [leftpos]: 360,
        });
        break;
      case 'Computer3':
        this.setData({
          [toppos]: 230,
          [leftpos]: 580,
        });
        break;
      case 'Player':
        this.setData({
          [toppos]: 850,
          [leftpos]: 360,
        })
        break;
    }
    setTimeout((function callback() {
      this.setData({
        [toppos]: -300,
        [leftpos]: -300,
        [words]: ""
      })
    }).bind(this), 2000);
    if (name !== 'Player' && cardtoPlay.value === 14){
      this.drawfourCards(); 
    }
  },
  //提示喊UNO的信息；质疑UNO；设置牌的颜色的结果；如果是+4牌，则调用drawfourCards函数

  chosenbyAI_easy: function () {      
    var that = this;
    var hand = game.currentPlayer.hand;
    var cardcanplay = [];
    var cardsvalue = [0, 0, 0, 0]; //记录AI手中每种颜色的牌的数量
    if (discardedCard.value !== 13 && discardedCard.value !== 14) {
      game.alldiscarded[discardedCard.color] += 1;
      game.alldiscarded[discardedCard.value + 4] += 1;
    }          //更新game里记录discarded的数组
    for (var i in hand) {
      if (hand[i].matches(discardedCard)) {
        cardcanplay.push(hand[i]);       //cardcanplay中是可以出的牌
      }
      if (hand[i].value !== 13 && hand[i].value !== 14) {
        cardsvalue[hand[i].color] += 1;     //更新颜色数量信息
      }
    }
    cardtoPlay = {};
    if (cardcanplay.length === 0) {
      return;
    }
    var score = [];           //为可以出的每张牌赋值
    for (var i in cardcanplay) {
      score.push(0);          //初始值
      if (cardcanplay[i].value !== 13 && cardcanplay[i].value !== 14) {
        score[i] += game.alldiscarded[cardcanplay[i].color];
        score[i] += game.alldiscarded[cardcanplay[i].value + 4];
        score[i] += cardsvalue[cardcanplay[i].color];
        //自己手里的牌越多，值越高，已经被出的该色或该值的牌越多，值越高
        if (game.playercard[cardcanplay[i].color] === 1) {
          score[i] += 50;
          //如果玩家之前就没有这种颜色的牌，就很推荐出这个
        }
      }
      if (cardcanplay[i].value === 10 || cardcanplay[i].value === 12 || cardcanplay[i].value === 14) {
        if (game.getNextPlayer().name === 'Player') {
          score[i] += 10;
        }
        //如果是给下家加牌的，下家是玩家就高赋值，否则减赋值
        else {
          score[i] -= 5;
        }
      }
      if (cardcanplay[i].value === 13 || cardcanplay[i].value === 14) {
        if (hand.length < 4) {
          score[i] -= 100;
          //如果这张牌是万能牌，而且自己牌很少，那就最好留着
        }
      }
    }
    var min = 0;
    var max = 0;
    for (var i in cardcanplay) {
      if (score[i] > score[max]) {
        max = i;
      }
      if (score[i] < score[min]) {
        min = i;
      }
    }         //找到可以出的牌里面，赋值最低和最高的两张

    if (cardcanplay.length !== 0) {
      cardtoPlay = cardcanplay[min];//最简单的AI，随机选择
    }
    if (cardtoPlay) {
      if (cardtoPlay.value === 13 || cardtoPlay.value === 14) {
        var newcolor = this.getRandomInt(0, 3);
        cardtoPlay.color = newcolor;
      }
      //如果要出的牌是wild or wilddraw4，那么就先赋予颜色性质
    }
    return cardtoPlay;
  },
  //简单难度的AI

  chosenbyAI_medium: function () {
    var that = this;
    var hand = game.currentPlayer.hand;
    cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });//最简单的AI，随机选择
    if (cardtoPlay) {
      if (cardtoPlay.value === 13 || cardtoPlay.value === 14) {
        var newcolor = this.getRandomInt(0, 3);
        cardtoPlay.color = newcolor;
      }
      //如果要出的牌是wild or wilddraw4，那么就先赋予颜色性质
    }
    return cardtoPlay;
  },
  //中等难度的AI

  chosenbyAI_difficult: function () {    
    var that = this;
    var hand = game.currentPlayer.hand;
    var cardcanplay = [];
    var cardsvalue = [0, 0, 0, 0]; //记录AI手中每种颜色的牌的数量
    if (discardedCard.value !== 13 && discardedCard.value !== 14) {
      game.alldiscarded[discardedCard.color] += 1;
      game.alldiscarded[discardedCard.value + 4] += 1;
    }          //更新game里记录discarded的数组
    for (var i in hand) {
      if (hand[i].matches(discardedCard)) {
        cardcanplay.push(hand[i]);       //cardcanplay中是可以出的牌
      }
      if (hand[i].value !== 13 && hand[i].value !== 14) {
        cardsvalue[hand[i].color] += 1;     //更新颜色数量信息
      }
    }
    cardtoPlay = [];
    if (cardcanplay.length === 0) {
      return;
    }
    var score = new Array();           //为可以出的每张牌赋值
    for (var i in cardcanplay) {
      score.push(0);          //初试值为0
      if (cardcanplay[i].value !== 13 && cardcanplay[i].value !== 14) {
        score[i] += game.alldiscarded[cardcanplay[i].color];
        score[i] += game.alldiscarded[cardcanplay[i].value + 4];
        score[i] += cardsvalue[cardcanplay[i].color];
        //自己手里的牌越多，值越高，已经被出的该色或该值的牌越多，值越高
        if (game.playercard[cardcanplay[i].color] === 1) {
          score[i] += 50;
          //如果玩家之前就没有这种颜色的牌，就很推荐出这个
        }
      }
      if (cardcanplay[i].value === 10 || cardcanplay[i].value === 12 || cardcanplay[i].value === 14) {
        if (game.getNextPlayer().name === 'Player') {
          score[i] += 10;
        }
        //如果是给下家加牌的，下家是玩家就高赋值，否则减赋值
        else {
          score[i] -= 5;
        }
      }
      if (cardcanplay[i].value === 13 || cardcanplay[i].value === 14) {
        if (hand.length < 4) {
          score[i] -= 100;
          //如果这张牌是万能牌，而且自己牌很少，那就最好留着
        }
      }
    }
    var min = 0;
    var max = 0;
    for (var i in cardcanplay) {
      if (score[i] > score[max]) {
        max = i;
      }
      if (score[i] < score[min]) {
        min = i;
      }
    }         //找到可以出的牌里面，赋值最低和最高的两张

    if (cardcanplay.length !== 0) {
      cardtoPlay = cardcanplay[max];//最简单的AI，随机选择
    }
    if (cardtoPlay) {
      if (cardtoPlay.value === 13 || cardtoPlay.value === 14) {
        var newcolor = this.getRandomInt(0, 3);
        cardtoPlay.color = newcolor;
      }
      //如果要出的牌是wild or wilddraw4，那么就先赋予颜色性质
    }
    return cardtoPlay;
  },
  //困难难度的AI

})






