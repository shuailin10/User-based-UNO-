"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    //属性：name, hand
    //方法：getCardByValue, hasCard, removeCard
    function Player(name) {
        this.hand = [];//对手牌进行初始化
        name = !!name ? name.trim() : name; //如果输入了名字，也就是说name!==undefined，那么就把name边上的空格去掉(by name.trim())
        //如果没有输入名字，即name===undefined，那么继续把这个name传下去，则会在下一步丢出error
        if (!name)
            throw new Error('Player must have a name');
        this.name = name;
    }
    Player.prototype.getCardByValue = function (value) {
        if (!value)//!value ===true即意味着value === undefined
            return undefined;
        return this.hand.find(function (c) { return c.value === value; });
        /* hand是一个数组，可以用find这个函数进行操作，find要的参数值是一个boolean，
        find起的作用就是找到数组里第一个和输入的value有相同value的牌，并把该牌作为一个对象返回
        */ 
    };
    //返回牌组中第一个有输入值的牌
    Player.prototype.hasCard = function (card) {
        if (!card)
            return false;
        if (card.value === 13 || card.value === 14){
            return this.hand.some(function (c) { return c.value === card.value;});
        }
        else{
            return this.hand.some(function (c) { return c.value === card.value && c.color === card.color; });
        }
        //如果是wild or wilddraw4，那么只要值匹配就行了
        /*array.some: 遍历数组中每个元素，判断其是否满足指定函数的指定条件,返回true或者false:c就用来遍历数组中的元素
        如果一个元素满足条件,返回true,且后面的元素不再被检测
        所有元素都不满足条件，则返回false
        不会改变原始数组
        不会对空数组进行检测;数组为空的话，直接返回false*/
    };
    //判断有没有这张牌
    Player.prototype.removeCard = function (card) {
        if (!this.hasCard(card))
            return;//如果没有这张牌，就不进行任何操作
        if (card.value === 13 || card.value === 14){
            var i = this.hand.findIndex(function (c) { return c.value === card.value;});
        }
        else{
            var i = this.hand.findIndex(function (c) { return c.value === card.value && c.color === card.color; });
        }
        //如果是wild or wilddraw4，那么只要值匹配就行了
        /*对于数组中的每个元素，findIndex 方法都会调用一次回调函数（采用升序索引顺序），直到有元素返回 true。只要有一个元素返回 true，
        findIndex 立即返回该返回 true 的元素的索引值。如果数组中没有任何元素返回 true，则 findIndex 返回 -1。 */
        this.hand.splice(i, 1);
        //从指定的索引开始删除若干元素，然后再从该位置添加若干元素：
    };
    //对数组进行更改，直接把某张牌移除掉
    Player.prototype.valueOf = function () {
        return this.name;
    };
    //不知道这两个有什么区别...但是这个valueof似乎只在这个程序里出现过...
    Player.prototype.toString = function () {
        return this.name;
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map