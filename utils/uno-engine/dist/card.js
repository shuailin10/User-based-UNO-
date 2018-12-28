"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var Colors;
(function (Colors) {
    Colors[Colors["RED"] = 0] = "RED";
    Colors[Colors["BLUE"] = 1] = "BLUE";
    Colors[Colors["GREEN"] = 2] = "GREEN";
    Colors[Colors["YELLOW"] = 3] = "YELLOW";
})(Colors = exports.Colors || (exports.Colors = {}));
//# sourceMappingURL=colors.js.map

var Values;
(function (Values) {
    // numbers
    Values[Values["ZERO"] = 0] = "ZERO";
    Values[Values["ONE"] = 1] = "ONE";
    Values[Values["TWO"] = 2] = "TWO";
    Values[Values["THREE"] = 3] = "THREE";
    Values[Values["FOUR"] = 4] = "FOUR";
    Values[Values["FIVE"] = 5] = "FIVE";
    Values[Values["SIX"] = 6] = "SIX";
    Values[Values["SEVEN"] = 7] = "SEVEN";
    Values[Values["EIGHT"] = 8] = "EIGHT";
    Values[Values["NINE"] = 9] = "NINE";
    // special cards
    Values[Values["DRAW_TWO"] = 10] = "DRAW_TWO";
    Values[Values["REVERSE"] = 11] = "REVERSE";
    Values[Values["SKIP"] = 12] = "SKIP";
    Values[Values["WILD"] = 13] = "WILD";
    Values[Values["WILD_DRAW_FOUR"] = 14] = "WILD_DRAW_FOUR";
})(Values = exports.Values || (exports.Values = {}));
//# sourceMappingURL=values.js.map

var Card = /** @class */ (function () {
    //属性：value, color, score
    //方法：isWildCard, isSpecialCard, matches//判断这张牌是不是和discarded card的信息匹配, is//判断这张牌的值和颜色是不是某一张牌
    function Card(value, color) {
        this._value = value;
        this._color = color === undefined ? undefined : color;
        //如果没有传入颜色是啥，那么就令它为undefined
        //为什么value不用一个判断呢————因为wild card是没有颜色的
        if (!this.isWildCard() && this.color === undefined) {
            throw Error('Only wild cards can be initialized with no color');
        }
        //只有wild card 才能没有颜色
    }
    //这个其实就相当于一个构造函数

    /*Object.defineProperty方法的介绍
    Object.defineProperty(object, propertyname, descriptor)
    object 必需。 要在其上添加或修改属性的对象。 这可能是一个本机 JavaScript对象（即用户定义的对象或内置对象）或 DOM 对象。
    propertyname 必需。 一个包含属性名称的字符串。
    descriptor 必需。 属性描述符。 它可以针对数据属性或访问器属性。
    */
   //感觉这个defineproperty是在定义Card这个对象的属性，而后面用的Card.prototype....则是在定义这个对象的方法

    Object.defineProperty(Card.prototype, "color", { //给card.prototype加一个color的属性
        get: function () {
            return this._color;
        },
        set: function (color) {
            if (!this.isWildCard())
                throw new Error('Only wild cards can have theirs colors changed.');
            else if (color < 0 || color > 3)
                throw new Error('The color must be a value from Colors enum.');
            this._color = color;
        },
        //如果是wildcard，并且设置的颜色是正常范围内的，那么就把卡牌的颜色设置成用户/AI设置的颜色
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
        //对于牌的值，只能获得，不能设置
    });
    Card.prototype.isWildCard = function () {
        return this.value === Values.WILD || this.value === Values.WILD_DRAW_FOUR;
    };
    //如果是wild or wilddraw4牌，则这张牌是一个wildcard
    Card.prototype.isSpecialCard = function () {
        return (this.isWildCard() ||
            this.value === Values.DRAW_TWO ||
            this.value === Values.REVERSE ||
            this.value === Values.SKIP);
    };
    //判断是不是特殊卡
    Card.prototype.matches = function (other) {
        if (this.isWildCard())
            return true;
        else if (this.color === undefined || other.color === undefined)
            throw new Error('Both cards must have theirs colors set before comparing');
        return other.value === this.value || other.color === this.color;
    };
    //判断是不是和输入的牌的信息匹配
    //如果是wildcard，一定匹配，如果选的这张牌颜色或者值和discardedCard匹配，也匹配
    //所以只是根据上一张牌判断吧
    Object.defineProperty(Card.prototype, "score", {
        get: function () {
            switch (this.value) {
                case Values.DRAW_TWO:
                case Values.SKIP:
                case Values.REVERSE:
                    return 20;
                case Values.WILD:
                case Values.WILD_DRAW_FOUR:
                    return 50;
                default:
                    return this.value;
            }
        },
        /*
        switch(val) {
            case 1:
            case 2:
            case 3:
                result = "1, 2, or 3";
                break;
            case 4:
                result = "4 alone";
        }
        分支1、2、3将会产生相同的输出结果。
        */
        enumerable: true,
        configurable: true
    });
    //给定牌的分数
    Card.prototype.is = function (value, color) {
        var matches = this.value === value;
        if (!!color)
            matches = matches && this.color === color;
        return matches;
    };
    //判断这张牌的值和类型是否匹配
    Card.prototype.toString = function () {
        return (this.color || 'NO_COLOR') + " " + this.value;
    };
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=card.js.map
//如果我们要输出的是一个函数或数组，那么，只能给module.exports赋值：module.exports = function () { return 'foo'; };

