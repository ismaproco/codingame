/* Vector2 - implementation
*/

// Simple Vector Class
var Vec2 = function(x, y) {
    this.x = x;
    this.y = y;
}

function initVector2Props() {
    
    Vec2.prototype.init = function(x,y) {
        this.x = x;
        this.y = y;
    }

    Vec2.prototype.add = function(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    Vec2.prototype.subtract = function(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    Vec2.prototype.scale = function(v) {
        return new Vec2(this.x * v, this.y * v);
    }

    Vec2.prototype.length = function() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    Vec2.prototype.normalize = function() {
        var iLen = 1 / this.length();
        return new Vec2(this.x * iLen, this.y * iLen);
    }

    Vec2.prototype.toString = function() {
        return "x: " + this.x + " , y: " + this.y;
    }

    Vec2.prototype.equal = function(v) {
        if( v ){
            return this.x === v.x && this.y == v.y;    
        }

        return false;
    }
}

initVector2Props();


/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var laps = 1, checks = 0;
var boost = 1;

var avgSpeed = 0;
var arrDistances = [];


var boostedSegment=false, segmentChange=false, prevDistance = 0;


// arrival break
function arrivalBreak( position, distance, slowingRadius, maxVelocity ){
    var desired_velocity;


    if( distance < slowingRadius ) {
        desired_velocity = position.normalize().scale(  maxVelocity * ( distance / slowingRadius ) );
    } else {
        desired_velocity = position.normalize().scale(  maxVelocity );
    }

    return desired_velocity;
}

// steer

function outSteer( position, prevdistance, steeringRadius, maxVelocity, angle ){
    var desired_velocity;
    
    if( Math.abs( angle ) < 1 ) {
        desired_velocity = position.normalize().scale(  maxVelocity );
    } else {
        printErr('error: ' +prevdistance + ' rad: '+ steeringRadius )
        desired_velocity = position.normalize().scale(  maxVelocity * ( prevdistance / steeringRadius ) );
    }

    return desired_velocity;
}

//

var sections = {
    steer: 0,
    keep: 1,
    break: 2
}

function sectionManager(position, prevCheck, nextCheck, prevMaxDistance, nextMaxDistance ) {
    printErr('manager: ' +prevCheck + ' '+ position.subtract(prevCheck).length() + ' ' + prevMaxDistance );
    if(position.subtract(prevCheck).length() < prevMaxDistance) {
        return sections.steer;
    }else if( nextCheck.subtract( position ).length() < nextMaxDistance ) {
        return sections.break;
    } else {
        return sections.keep;
    }
}


//
var vnchk = new Vec2(); // vector next checkpoint
var v0v1 = new Vec2(); // vector next checkpoint
var vv1 = new Vec2(); // vector next checkpoint

var fv,currentchk = new Vec2(0,0),prevchk = new Vec2(0,0);

var angles = [];
var boost = 1, boostedSegment = false;


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

    segmentChange = false;

    var thrust = 100, finalx = nextCheckpointX,  finaly = nextCheckpointY;
    
    vnchk.init( nextCheckpointX, nextCheckpointY );

    v0v1.init( x, y );
    vv1 = vnchk.subtract( v0v1 );
    
    if( !vnchk.equal( currentchk ) && segmentChange == false ) {
        printErr('SegChange: ' + segmentChange + ' ' + prevchk);
        segmentChange = true;
        angles.push( nextCheckpointAngle );

        prevchk.x = currentchk.x;
        prevchk.y = currentchk.y;

        currentchk.x = vnchk.x;
        currentchk.y = vnchk.y;
    }

    var section = sectionManager(v0v1, prevchk, vnchk, 1000, 2500);


    if( section == sections.steer ) {
        fv = outSteer( vv1, v0v1.subtract( prevchk ).length(), 1000, 100, nextCheckpointAngle);
        segmentChange = false;    
    } else if( section == sections.break ){
        fv = arrivalBreak(vv1, vv1.length(), 2500, 100);
    } else {
        fv = vv1.normalize().scale( 100 );
    }

    //printErr('error ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost + ' ' + avgSpeed + ' ' + segmentChange  );
    //printErr('x,y ' + x +',' + y +  ' opponent:' + opponentX + ',' + opponentY  );



    printErr('Vector vnchk 1: ' + vnchk + ' magnitude: ' + parseInt(vnchk.length()) );
    printErr('Vector v0v1 1: ' + v0v1 + ' magnitude: ' +  parseInt( v0v1.length() ) );
    printErr('Vector vehicle 1: ' + vv1 + ' magnitude: ' +  parseInt( vv1.length() ) );
    printErr('===? nangle: ' + nextCheckpointAngle + ' mag: ' +  parseInt( fv.length() ) + ' sec:'+ section + ' ' + angles );
    
    thrust = parseInt(fv.length());
    thrust = thrust > 100 ? 99 : thrust;

    // boost logic
    if(boost > 0 ) {
        if( nextCheckpointDist > 7500 && ( nextCheckpointAngle == 0 ) ) {
            printErr('burst ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost);
            thrust = 'BOOST';
            boost -=1;
            boostedSegment = true;
        }
    }


    print(finalx + ' ' + finaly +' ' + thrust );
}



/*


// Write an action using print()
    // To debug: printErr('Debug messages...');

    
    // You have to output the target position
    // followed by the power (0 <= thrust <= 100)
    // i.e.: "x y thrust"
    var thrust = 100;
    // if( nextCheckpointDist < 4000 ) {
    //     thrust = 80;
    // } else if( nextCheckpointDist < 2000 ) {
    //     thrust = 50;
    // } else if( nextCheckpointDist < 1000 ) {
    //     thrust = 30;
    // } else {
    //     if(segmentChange) {
    //         thrust = 50;
    //     }else {
    //         thrust = 100;
    //     }
        
    // }

    if( nextCheckpointDist < 1000 ) {
        thrust = 20;
    }
    
    
    if( nextCheckpointAngle > 90 || nextCheckpointAngle < -90 ) {
        if( nextCheckpointDist > 6000) {
            thrust = incrementWithLimit( thrust , 0.4 , 80 );
        }else {
            thrust = 10;    
        }
    } else if( nextCheckpointAngle > 10 || nextCheckpointAngle < -10 ){

        if( Math.abs( avgSpeed ) > 500 ) {
            thrust = 60;
        }
        thrust = incrementWithLimit( thrust , 0.3 , 80 );
    }
    
    // // booster correction
    if( nextCheckpointDist < 4000 && avgSpeed > 600 && ( nextCheckpointAngle < -5 || nextCheckpointAngle > 5 ) ) {
        printErr('-- fixed ');
        if(thrust > 40) {
            thrust = 10;
        }
    }
    
    
    // distances cache
    
    if( segmentChange ) {
        segmentChange = false;
    }
    
    if( avgSpeed < -1){
        arrDistances.push( nextCheckpointDist );
        segmentChange = true;
    }
    
    avgSpeed  = prevDistance - nextCheckpointDist;
    prevDistance = nextCheckpointDist;
    
    
    //
    var finalx = nextCheckpointX;
    var finaly = nextCheckpointY;
    // boost logic
    if(boost >= 1) {
        if( nextCheckpointDist > 7500 && ( nextCheckpointAngle == 0 ) ) {
            printErr('burst ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost);
            thrust = 'BOOST';
            boost -=1;
            boostedSegment = true;
        }
    }


*/