/*jshint smarttabs:true */
/* Vector2 - implementation
*/

// Simple Vector Class
var Vec2 = function (x, y) {
    this.x = x;
    this.y = y;
};

Vec2.prototype.init = function (x, y) {
    this.x = x;
    this.y = y;
};

Vec2.prototype.add = function (v) {
    return new Vec2(this.x + v.x, this.y + v.y);
};

Vec2.prototype.subtract = function (v) {
    return new Vec2(this.x - v.x, this.y - v.y);
};

Vec2.prototype.scale = function (v) {
    return new Vec2(this.x * v, this.y * v);
};

Vec2.prototype.length = function () {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

Vec2.prototype.normalize = function () {
    var iLen = 1 / this.length();
    return new Vec2(this.x * iLen, this.y * iLen);
};

Vec2.prototype.toString = function () {
    return "x: " + this.x + " , y: " + this.y;
};

Vec2.prototype.equal = function (v) {
    if (v) {
        return this.x === v.x && this.y === v.y;
    }

    return false;
};

Vec2.prototype.clone = function () {
    return new Vec2(this.x, this.y);
};

Vec2.prototype.rotate = function (ang) {
    ang = -ang * (Math.PI / 180);
    var cos = Math.cos(ang),
        sin = Math.sin(ang),
        vec = this;
    return new Vec2(Math.round(10000 * (vec.x * cos - vec.y * sin)) / 10000,
                        Math.round(10000 * (vec.x * sin + vec.y * cos)) / 10000);
};

