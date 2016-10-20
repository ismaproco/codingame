/*
    Utility methods
*/

var Vehicle = function( x,y, nextAngle ) {
    this.position = new Vec2();
    this.prevPosition = new Vec2();
    this.nextCheckPosition = new Vec2();
    this.thrust = 0;
    this.boost = 1;
    this.finalx = 0;
    this.finaly = 0;
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

Vehicle.prototype.setNextcheck = function( nextCheckPositionVector ) {
    this.nextCheckPosition = nextCheckPositionVector;
    this.finalx = this.nextCheckPosition.x;
    this.finaly = this.nextCheckPosition.y;
};


Vehicle.prototype.calculateSpeedVector = function( ) {
    this.speedX = this.position.x - this.prevPosition.x;
    this.speedY = this.position.y - this.prevPosition.y;
    this.speed = new Vec2(this.speedX, this.speedY);
};


Vehicle.prototype.calculateThrust = function( distance ) {
    if( this.boost > 0 && Math.abs(this.nextAngle < 2) && distance > 4000) {
        this.thrust = 'BOOST';
        this.boost = this.boost - 1;
    } else {
        if( Math.abs(this.nextAngle) > 90 ) {
            this.thrust = 0;
        } else if( Math.abs(this.nextAngle) > 65) {
            this.thrust = 50;   
        } else if( Math.abs(this.nextAngle) > 35) {
            this.thrust = 75;   
        } else if( Math.abs(this.nextAngle) > 5) {
            this.thrust = 85; 
        } else {
            this.thrust = 100;    
        }
    }
};


Vehicle.prototype.calculateCollision = function( vehicle2 ) {
    var distance = this.position.subtract(vehicle2.position).length();
    // var orthoV = this.position.normalize().subtract(vehicle2.position.normalize());
    // var deltaAngle = orthoV.angle(vehicle2.position); 
    // printErr('=U ' + deltaAngle);
    if( distance < 800 && Math.abs(this.nextAngle) < 10 ){
        return true;
    }
    return false;
};