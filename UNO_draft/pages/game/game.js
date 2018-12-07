var game_1 = require("../../utils/uno-engine/dist/game.js");
var app = getApp();
/** 
 * 确定几张牌在界面上的位置
 */
var playerNames = ['Player', 'Computer1', 'Computer2', 'Computer3'];
var computerNames = ['Computer1', 'Computer2', 'Computer3'];
var game = new game_1.Game(playerNames);
var cardtoPlay = {};
var playedAI = 0;
var discardedCard = game.discardedCard;
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
//用来确定玩家卡牌的摆放位置

Page({
  
 
  /**
   * 
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: "",//用户头像
    },
    
    
    cards: [],//用户具体手牌

    clicked: -1, //是否点击了牌

    handnumofAI: [],
    
    discardedCardurl: "",

    arrow_top: 0,

    arrow_left: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.level);
      
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
        })
      }
    })
    game = new game_1.Game(playerNames);
    cardtoPlay = {};
    playedAI = 0;
    discardedCard = game.discardedCard;
    this.newGame();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  newGame: function(){
    this.setCard(); //更新玩家的手牌信息：手牌对应的图像+位置 宛霖要用的
    this.setHandnumofAI();
    this.setDiscardedCard();
    this.setArrow();
  },

  setCard: function () {
    var handofPlayer = game.getPlayer('Player').hand;
    var cards_temp = [];
    var card_pos_temp = position(handofPlayer.length);
    for (var i in handofPlayer) {
      if (handofPlayer[i].value === 13) {
        var c_temp = { img: 'https://github.com/shuailin10/UserBasedUNO/blob/master/images/cards/53.png?raw=true', left_pos: card_pos_temp[i], top_pos: 750 }
        cards_temp.push(c_temp);
      }
      else if (handofPlayer[i].value === 14) {
        var c_temp = { img: 'https://github.com/shuailin10/UserBasedUNO/blob/master/images/cards/52.png?raw=true', left_pos: card_pos_temp[i], top_pos: 750 }
        cards_temp.push(c_temp);
      }
      else {
        var card_index = handofPlayer[i].color * 13 + handofPlayer[i].value;
        var c_temp = { img: 'https://github.com/shuailin10/UserBasedUNO/blob/master/images/cards/' + card_index + '.png?raw=true', left_pos: card_pos_temp[i], top_pos: 750 }
        cards_temp.push(c_temp);
      }
    }
    this.setData({
      cards: cards_temp
    })
    console.log(this.data.cards)
  },
  //更新玩家的手牌信息：手牌对应的图像+位置 宛霖要用的

  setHandnumofAI: function () {
    var handnumofAI_temp = [game.getPlayer('Computer1').hand.length, game.getPlayer('Computer2').hand.length, game.getPlayer('Computer3').hand.length]
    this.setData({
      handnumofAI: handnumofAI_temp
    })
  },
  //更新AI的剩余手牌
  
  setDiscardedCard: function(){
    discardedCard = game.discardedCard;
    if (discardedCard.value === 13){
      var discardedCard_temp = 'https://github.com/shuailin10/UserBasedUNO/blob/master/images/cards/53.png?raw=true';
    }
    else if (discardedCard.value === 14){
      var discardedCard_temp = 'https://github.com/shuailin10/UserBasedUNO/blob/master/images/cards/52.png?raw=true';
    }
    else{
      var card_index = discardedCard.color * 13 + discardedCard.value;
      var discardedCard_temp = 'https://github.com/shuailin10/UserBasedUNO/blob/master/images/cards/' + card_index + '.png?raw=true'
    }
    this.setData({
      discardedCardurl: discardedCard_temp
    })
  },
  //更新桌面上刚出的牌
  card_click: function (event) {
    var handofPlayer = game.getPlayer('Player').hand;
    if (game.currentPlayer.name !== 'Player')
      return;
    var that = this;
    var click = this.data.clicked;
    var clicktemp = -1;
    if (click === -1) {
      click = event.currentTarget.dataset.id;
      //this.animation.translate(100, 0).step({ duration: 1000 })
    }
    else if (click === event.currentTarget.dataset.id) {
      var indexofclickedCard_1 = this.data.cards.findIndex(function (c) { return c.left_pos === that.data.clicked; });
      clicktemp = indexofclickedCard_1;
      click = -1;
      //点击退回，那么
      //this.animation.translate(-100, 0).step({ duration: 1000 })
    }

    this.setData({
      clicked: click,
    })
    if (this.data.clicked === event.currentTarget.dataset.id){
      var indexofclickedCard = this.data.cards.findIndex(function (c) { return c.left_pos === that.data.clicked; });
      console.log("hhh"+indexofclickedCard);
      cardtoPlay = handofPlayer[indexofclickedCard];
      var string = "cards[" + indexofclickedCard + "].top_pos";
      this.setData({
        [string]: 730
      })
    }
    else if (this.data.clicked === -1){
      cardtoPlay = {};
      var string = "cards[" + clicktemp + "].top_pos";
      this.setData({
        [string]: 750
      })
      clicktemp = -1;
    }
    this.setData({
      clicked: click,
    })
    console.log(this.data.clicked);
    console.log(cardtoPlay);
    //  if (clickednum ==== 0)
    //    this.animation.translate(100,0)
    //    this.setData({
    //    animationData: this.animation.export()
    //获取点击的牌的信息，生成要出的牌，然后由出牌的函数读取这个信息，之后出牌的函数就可以进行出牌啦～
  },
  //玩家选择牌，宛霖可能要用的
  //这个之后宛霖都暂时不要用
  playCard: function(event){
    var iscardtoPlayempty = true;
    if (game.currentPlayer.name !== 'Player')
      return;
    for (var i in cardtoPlay) { // 如果不为空，则会执行到这一步，返回true
      iscardtoPlayempty = false;
    }
    if (!iscardtoPlayempty){
      if (cardtoPlay.matches(discardedCard)){
        this.setData({
          clicked: -1
        })
        if (cardtoPlay.value === 13 || cardtoPlay.value === 14) {
          //cardtoPlay.color = this.setColor();
          var newcolor = this.getRandomInt(0, 3);
          cardtoPlay.color = newcolor;
          //现在先随机设置一下～
          //如果是wild or wilddraw4，弹出界面提示选择牌的颜色，并且把颜色返回过来，赋予至cardtoPlay的颜色属性
        }
        game.play(cardtoPlay);
        this.yellunobyAI();//AI判定是否喊UNO
        this.setCard();//更新玩家手牌信息
        setTimeout((function callback() {
          this.setDiscardedCard();//更新桌面上的牌
        }).bind(this), 1000);
        setTimeout((function callback() {
          this.setArrow();
        }).bind(this), 2000);
        setTimeout((function callback() {
          this.computer();
        }).bind(this), 3000);
        //轮到AI来玩了诶
      }
    }//如果选择了牌，点击了出牌按钮（绑定到playCard上），而且选择的牌是匹配的，那么就出牌
  },
  //玩家出牌

  setColor: function(){

  },

  drawCard: function (event) {
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
      this.setCard();//更新玩家手牌信息
      cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });
      if (cardtoPlay) {
        hascardtoPlay = 1;
      }
      if (!hascardtoPlay) {
        game.pass();
        setTimeout((function callback() {
          this.setArrow();
        }).bind(this), 1000);
        setTimeout((function callback() {
          this.computer();//轮到AI来玩了诶
        }).bind(this), 2000);
      }
    }
    //如果没有抽过牌而且无牌可以出，那么可以抽牌
  },
  //玩家抽牌

  uno: function(){
    var that = this;
    var hand = game.getPlayer('Player').hand;
    if (game.currentPlayer.name !== 'Player')
      return;
    var cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });
    var hascardtoPlay = cardtoPlay == true;
    game.uno(game.currentPlayer, hascardtoPlay);
  },

  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  //随机生成[min,max]之间的整数
  

  chosenbyAI: function () {
    /**************
     需要传什么变量进来要看AI的设计！
    ***************/
    var that = this;
    var hand = game.currentPlayer.hand;
    var cardtoPlay = hand.find(function (c) { return c.matches(discardedCard); });//最简单的AI，随机选择
    if (cardtoPlay) {
      if (cardtoPlay.value === 13 || cardtoPlay.value === 14) {
        var newcolor = this.getRandomInt(0, 3);
        cardtoPlay.color = newcolor;
      }
      //如果要出的牌是wild or wilddraw4，那么就先赋予颜色性质
    }
    return cardtoPlay;
  },
  //AI选择出哪张牌

  computer: function () {
    var hand = game.currentPlayer.hand;
    var hascardtoPlay = 0;
    var cardtoPlay = this.chosenbyAI();
    if (cardtoPlay) {
      hascardtoPlay = 1;
      if (hand.length === 2) {
        game.uno(game.currentPlayer, hascardtoPlay);
        /******************
         这之后就需要向界面输入喊UNO的玩家信息+喊UNO成功的信息
         ******************/
      }
      //如果手上只有2张牌了，并且有可以出的牌，那么就喊uno；
      game.play(cardtoPlay);
      this.setHandnumofAI();
      setTimeout((function callback() {
          this.setDiscardedCard();//更新桌面上的牌
        }).bind(this), 1000);
      setTimeout((function callback() {
          this.setCard();
        }).bind(this), 2000);
      setTimeout((function callback() {
        this.setArrow();
        }).bind(this), 3000);
      setTimeout((function callback() {
        this.setPlayer();
        }).bind(this), 4000);
      /******************
           这之后就需要向界面输入现在出牌的玩家的信息+出牌的信息
      ******************/
      //然后出牌
      //这样一个回合就结束了，就应该传一个信号给其他AI，让他们判断是不是有人没喊UNO，如果没有，那么就赶快抓一下哈哈哈
      //如果有牌可以出，那么就一定出牌；
    }
    //如果有牌可以出，那就一定要出牌
    //console.log(cardtoPlay);  
    else {
      game.draw();
      this.setHandnumofAI();
      //如果没牌可以出，那就抽牌
      //一旦抽牌了，那么无论如何都会被标记成没有喊UNO
      cardtoPlay = this.chosenbyAI();
      if (cardtoPlay) {
        hascardtoPlay = 1;
        if (hand.length === 2) {
          game.uno(game.currentPlayer, hascardtoPlay);
        }
        setTimeout((function callback() {
          game.play(cardtoPlay);
        }).bind(this), 1000);
        this.setHandnumofAI();
        setTimeout((function callback() {
          this.setDiscardedCard();//更新桌面上的牌
          }).bind(this), 2000);
        setTimeout((function callback() {
          this.setCard();
          }).bind(this), 3000);
        setTimeout((function callback() {
          this.setArrow();
        }).bind(this), 4000);
        setTimeout((function callback() {
          this.setPlayer();
        }).bind(this), 5000);
      }
      else {
        game.pass();
        setTimeout((function callback() {
          this.setArrow();
        }).bind(this), 1000);
        setTimeout((function callback() {
          this.setPlayer();
        }).bind(this), 2000);
      }
      //抽牌之后有可以出的牌就出，没有就跳过
    }
  },
  //AI的操作

  yellunobyAI: function () {
    var yellerAI = computerNames.find(function (c) { return c !== game.currentPlayer.name; })
    //确定一下当前不出牌的AI，由他来质疑玩家哈哈哈
    if (!game.yellers['Player'] && game.getPlayer('Player').hand.length === 1) {
      game.uno(game.getPlayer[yellerAI], undefined);
      this.setCard();//更新玩家手牌信息
    }
  },
  //AI喊UNO

  setArrow: function(){
    if (game.currentPlayer.name === 'Player'){
      this.setData({
        arrow_top: 900,
        arrow_left: 200
      })
    }
    else if (game.currentPlayer.name === 'Computer1') {
      this.setData({
        arrow_top: 350,
        arrow_left: 200
      })
    }
    else if (game.currentPlayer.name === 'Computer2') {
      this.setData({
        arrow_top: 50,
        arrow_left: 225
      })
    }
    else if (game.currentPlayer.name === 'Computer3') {
      this.setData({
        arrow_top: 350,
        arrow_left: 485
      })
    }
  },
  //更新箭头

  setPlayer: function(){
    if (game.currentPlayer.name !== 'Player'){
      this.computer();
    }
    //只要不是轮到了用户出牌就一直由AI来出
  }

  //原则：每个更新之后都应该留一定时间再进行下一步操作
})






