System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, input, Input, Vec2, _dec, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, player_sprite;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      input = _cc.input;
      Input = _cc.Input;
      Vec2 = _cc.Vec2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "64484wVWV1HIL6tT+ebXoPh", "player_sprite", undefined);

      __checkObsolete__(['_decorator', 'Component', 'input', 'Input', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("player_sprite", player_sprite = (_dec = ccclass('player_sprite'), _dec(_class = (_class2 = class player_sprite extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "speed", _descriptor, this);

          // 移动速度，可自定义
          _initializerDefineProperty(this, "startAtCenter", _descriptor2, this);

          // 是否在屏幕中央开始
          this._keys = new Set();
        }

        start() {
          // 如果设置了在屏幕中央开始 (1280x720)
          if (this.startAtCenter) {
            this.node.setPosition(640, 360, 0); // 屏幕中央
          } else {
            this.node.setPosition(0, 0, 0); // 屏幕左下角
          } // 监听键盘按下事件


          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this); // 监听键盘释放事件

          input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        }

        onDestroy() {
          // 移除事件监听
          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        }

        onKeyDown(event) {
          this._keys.add(event.keyCode.toString());
        }

        onKeyUp(event) {
          this._keys.delete(event.keyCode.toString());
        }

        update(deltaTime) {
          var moveDir = new Vec2(0, 0); // W键 - 向上

          if (this._keys.has('87')) {
            moveDir.y += 1;
          } // S键 - 向下


          if (this._keys.has('83')) {
            moveDir.y -= 1;
          } // A键 - 向左


          if (this._keys.has('65')) {
            moveDir.x -= 1;
          } // D键 - 向右


          if (this._keys.has('68')) {
            moveDir.x += 1;
          } // 归一化向量，避免斜向移动过快


          if (moveDir.length() > 0) {
            moveDir.normalize(); // 计算新位置

            var currentPos = this.node.position;
            var newX = currentPos.x + moveDir.x * this.speed * deltaTime;
            var newY = currentPos.y + moveDir.y * this.speed * deltaTime;
            this.node.setPosition(newX, newY, currentPos.z);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "startAtCenter", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2c0200be24d46c25d7f1a0a3d83be0dd904f864e.js.map