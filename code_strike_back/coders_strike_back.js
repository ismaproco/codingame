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
    return new Vec2( Math.round(10000 * (vec.x * cos - vec.y * sin)) / 10000,
                     Math.round(10000 * (vec.x * sin + vec.y * cos)) / 10000);
};


Vec2.prototype.angle = function angle(v2) {
  var dy = v2.y - this.y;
  var dx = v2.x - this.x;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

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
};// global variables

// var vnchk = new Vec2(); // vector next checkpoint
// var v0v1 = new Vec2(); // vector vehicule 1 from origin
// var v0v2 = new Vec2(); // vector vehicule 2 from origin
// var vv1 = new Vec2(); // vector next checkpoint
// var prevD = new Vec2();
// var fv,currentchk = new Vec2(0,0),prevchk = new Vec2(0,0);
// var angles = {};
// var boost = 1, boostedSegment = false;
// var laps = 1, checks = 0, boost = 1;
// var avgSpeed = 0;
// var arrDistances = [];
// var boostedSegment = false, segmentChange = false, prevDistance = 0;

var finalx, finaly;
var vehicle = new Vehicle();
var opponent = new Vehicle();

var nextCheckpointVector = new Vec2();

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

// game loop
while (true) {
    var inputs = readline().split(' ');
    var x = parseInt(inputs[0]);
    var y = parseInt(inputs[1]);
    var nextCheckpointX = parseInt(inputs[2]); // x position of the next check point
    var nextCheckpointY = parseInt(inputs[3]); // y position of the next check point
    var nextCheckpointDist = parseInt(inputs[4]); // distance to the next checkpoint
    var nextCheckpointAngle = parseInt(inputs[5]); // angle between your pod orientation and the direction of the next checkpoint
    var inputs = readline().split(' ');
    var opponentX = parseInt(inputs[0]);
    var opponentY = parseInt(inputs[1]);

    // segmentChange = false;

    //var thrust = 100, finalx = nextCheckpointX,  finaly = nextCheckpointY;

    nextCheckpointVector.x = nextCheckpointX;
    nextCheckpointVector.y = nextCheckpointY;

    vehicle.setPosition(x, y);
    vehicle.setAngle( nextCheckpointAngle );
    vehicle.calculateSpeedVector();
    vehicle.calculateThrust( nextCheckpointDist );

    opponent.setPosition(opponentX, opponentY);
    opponent.calculateSpeedVector( );


    vehicle.setNextcheck(nextCheckpointVector);

    if(vehicle.calculateCollision(opponent)){
        //change vehicle destination vector
        vehicle.finalx = opponent.position.add( opponent.position.subtract(vehicle.position) ).scale(2).x;
        vehicle.finaly = opponent.position.add( opponent.position.subtract(vehicle.position) ).scale(2).y;
    }
    printErr('error: ' + opponent.position.angle( opponent.position.subtract(vehicle.position) )    );

    finalx = Math.round(vehicle.finalx);
    finaly = Math.round(vehicle.finaly);


    // vnchk.init( nextCheckpointX, nextCheckpointY );

    // v0v1.init( x, y );
    // vv1 = vnchk.subtract( v0v1 );

    // v0v2.init( opponentX, opponentY );
    
    // if( !vnchk.equal( currentchk ) && segmentChange === false ) {
    //     //printErr('SegChange: ' + segmentChange + ' ' + prevchk);
    //     segmentChange = true;
    //     if(!angles[currentchk.x +' '+ currentchk.y]) { // add the previous angle to the array
    //         angles[currentchk.x +' '+ currentchk.y] = nextCheckpointAngle;    
    //     }
        
    //     prevchk.x = currentchk.x;
    //     prevchk.y = currentchk.y;

    //     currentchk.x = vnchk.x;
    //     currentchk.y = vnchk.y;
    // }

    // // speed calculation
    // var avgSpeed = vv1.length() - prevD.length();
    // prevD.x = vv1.x;
    // prevD.y = vv1.y;

    // destination vector recalculation
    // var vcalc = recalcDestinationVector( v0v1, prevchk, vnchk, avgSpeed , nextCheckpointAngle);
    // finalx = Math.round( vcalc.x );
    // finaly = Math.round( vcalc.y );


    // section management
    // var section = sectionManager(v0v1, prevchk, vnchk, 1000, 2500);

    // if( section == sections.steer ) {
    //     fv = outSteer( vv1, v0v1.subtract( prevchk ).length(), currentchk.subtract( v0v1 ).length()  ,900, 100, nextCheckpointAngle);
    //     segmentChange = false;    
    // } else if( section == sections.break ){
    //     // if the destination vector change, change the breaking radious
    //     // the destination vector can change because of a hit or because destionation recalc
    //     fv = arrivalBreak(vv1, vv1.length(), 1000, 100, angles[vnchk.x +' '+ vnchk.y]);    
    // } else {
    //     if(Math.abs(nextCheckpointAngle)  > 0) {
    //         fv = vv1.normalize().scale( 99 );    
    //     } else {
    //         fv = vv1.normalize().scale( 100 );
    //     }
    // }

    // fv = vv1.normalize().scale( 100 );

    // // opponent attack calculation
    // if( isOpponentInPositionToPush(v0v1, v0v2, vnchk, nextCheckpointAngle, avgSpeed) ) {
    //     finalx = v0v2.scale(1000).x;
    //     finaly = v0v2.scale(1000).y;
    //     printErr('PUSH ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost);
    // }

    // //printErr('error ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost + ' ' + avgSpeed + ' ' + segmentChange  );
    // //printErr('x,y ' + x +',' + y +  ' opponent:' + opponentX + ',' + opponentY  );

    // //printErr('Vector vnchk 1: ' + vnchk + ' magnitude: ' + parseInt(vnchk.length()) );
    // //printErr('Vector v0v1 1: ' + v0v1 + ' magnitude: ' +  parseInt( v0v1.length() ) );
    // //printErr('Vector vehicle 1: ' + vv1 + ' magnitude: ' +  parseInt( vv1.length() ) );
    // //printErr('===? nangle: ' + nextCheckpointAngle + ' mag: ' +  parseInt( fv.length() ) + ' sec:'+ section + ' ' + angles );
    
    // thrust = parseInt(fv.length());
    // thrust = thrust > 100 ? 99 : thrust;

    // // boost logic
    // if(boost > 0 ) {
    //     if( nextCheckpointDist > 7500 && ( Math.abs( nextCheckpointAngle ) < 5 ) ) {
    //         printErr('burst ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost);
    //         thrust = 'BOOST';
    //         boost -=1;
    //         boostedSegment = true;
    //     } else if( Math.abs( nextCheckpointAngle ) === 0 ) {
    //         printErr('burst ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost);
    //         thrust = 'BOOST';
    //         boost -=1;
    //         boostedSegment = true;
    //     }
    // }
    
    printErr('x,y,thrust' + finalx +',' +finaly + ' ' + vehicle.thrust );
    printErr('sx, sy ' + vehicle.speedX +', ' + vehicle.speedY + ' ' +
                        vehicle.position + ' ' + vehicle.prevPosition);
    printErr('boost, distance, angle ' + vehicle.boost + ' ' +
                         nextCheckpointDist + ' ' + vehicle.nextAngle);
    printErr('collision ' + vehicle.calculateCollision(opponent) + ' sv ' +
                 vehicle.speed.length() +
                 ' angleOp: ' + vehicle.position.angle(opponent.position) );


    print(finalx + ' ' + finaly +' ' + vehicle.thrust );
}