/*
    Utility methods
*/

var Vehicle = function( x,y, nextAngle ) {
    this.position = new Vec2();
    this.prevPosition = new Vec2();
    this.thrust = 0;
};

Vehicle.prototype.setPosition = function(x,y) {
    x = x || 0;
    y = y || 0;
    this.prevPosition = this.position.clone();
    this.position = new Vec2(x, y);
};

Vehicle.prototype.setAngle = function( nextAngle ) {
    nextAngle = nextAngle || 0;
    this.nextAngle = nextAngle;
};


Vehicle.prototype.calculateSpeedVector = function( ) {
    this.speedX = this.position.x - this.prevPosition.x;
    this.speedY = this.position.y - this.prevPosition.y;
};


Vehicle.prototype.calculateThrust = function( distance ) {
    if( this.nextAngle < 2 && distance > 4000) {
        this.thrust = 'BOOST';
    } else {
        this.thrust = 100;
    }
};
