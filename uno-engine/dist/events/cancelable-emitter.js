"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
function createProxyListener(originalListener, context) {
    return function (event) {
        var returnValue = originalListener.call(context, event);
        var shouldContinue = returnValue !== false;
        if (!shouldContinue)
            event.preventDefault();
        // console.log("cancel?", !shouldContinue);
        return !event.canceled;
    };
}
var CancelableEventEmitter = /** @class */ (function (_super) {
    __extends(CancelableEventEmitter, _super);
    function CancelableEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CancelableEventEmitter.prototype.on = function (eventName, listener) {
        return _super.prototype.on.call(this, eventName, createProxyListener(listener, this));
    };
    CancelableEventEmitter.prototype.emit = function (type, data) {
        throw new Error('Event dispatching must be done via #dispatchEvent');
    };
    /**
     * @param {Event} event
     */
    CancelableEventEmitter.prototype.dispatchEvent = function (event) {
        return this.listeners(event.type).every(function (handler) {
            return handler(event);
        });
    };
    return CancelableEventEmitter;
}(events_1.EventEmitter));
//EventEmitter.listeners(event) 返回指定事件的监听器数组。
//只读属性 Event.type 会返回一个字符串, 表示该事件对象的事件类型。
//every() 方法测试数组的所有元素是否都通过了指定函数的测试。
    /*
    function isBelowThreshold(currentValue) {
    return currentValue < 40;
    }

    var array1 = [1, 30, 39, 29, 10, 13];

    console.log(array1.every(isBelowThreshold));
    // expected output: true 
    */
//
exports.CancelableEventEmitter = CancelableEventEmitter;
//# sourceMappingURL=cancelable-emitter.js.map