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

    Vec2.prototype.clone = function() {
        return new Vec2(this.x, this.y);
    }

    Vec2.prototype.rotate = function(ang)
    {
        var vec = this;
        ang = -ang * (Math.PI/180);
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        return new Vec2(Math.round(10000*(vec.x * cos - vec.y * sin))/10000, Math.round(10000*(vec.x * sin + vec.y * cos))/10000);
    };

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
function arrivalBreak( position, distance, slowingRadius, maxVelocity, nextAngle ){
    var desired_velocity;
    
    nextAngle = Math.abs(nextAngle);

    if(nextAngle ) {
        if( nextAngle > 110 && distance < slowingRadius * 1.5 ) {
            maxVelocity = maxVelocity /4;
            desired_velocity = position.normalize().scale(  maxVelocity * ( distance / (slowingRadius * 1.5 ) ) );
        }else if( nextAngle > 90 && distance < slowingRadius * 1.3 ) {
            maxVelocity = maxVelocity /3;
            desired_velocity = position.normalize().scale(  maxVelocity * ( distance / (slowingRadius * 1.3 ) ) );
        } else if( nextAngle > 50 && distance < slowingRadius *(1.2)) {
            maxVelocity = maxVelocity /2;
            desired_velocity = position.normalize().scale(  maxVelocity * ( distance / slowingRadius * (1.2) ) );
        } else if( nextAngle > 20 && distance < slowingRadius *(1.2)) {

            desired_velocity = position.normalize().scale(  maxVelocity * ( distance / slowingRadius * (1.2) ) );
        } else {
            desired_velocity = position.normalize().scale(  maxVelocity );
        }
    } else {
        if( distance < slowingRadius ) {
            desired_velocity = position.normalize().scale(  (maxVelocity / 2) * ( distance / slowingRadius ) );
        } else {
            desired_velocity = position.normalize().scale(  maxVelocity );
        }
    }

    return desired_velocity;
}

// steer

function outSteer( position, prevdistance, nextdistance,steeringRadius, maxVelocity, angle ){
    var desired_velocity;
    if(nextdistance > 2500) {
        if( Math.abs( angle ) < 1 ) {
            desired_velocity = position.normalize().scale(  maxVelocity );
        } else if( Math.abs( angle ) > 90 ) {
            printErr('error: ' +prevdistance + ' rad: '+ steeringRadius )
            desired_velocity = position.normalize().scale(  ( maxVelocity * 0.90 ) * ( prevdistance / (steeringRadius ) ) );        
        // } else if( Math.abs( angle ) > 70 ) {
        //     printErr('error: ' +prevdistance + ' rad: '+ steeringRadius )
        //     desired_velocity = position.normalize().scale(  ( maxVelocity * 0.92 ) * ( prevdistance / (steeringRadius ) ) );        
        // } else if( Math.abs( angle ) > 50 ) {
        //     printErr('error: ' +prevdistance + ' rad: '+ steeringRadius )
        //     desired_velocity = position.normalize().scale(  ( maxVelocity * 0.95 ) * ( prevdistance / steeringRadius ) );        
        } else {
            printErr('error: ' +prevdistance + ' rad: '+ steeringRadius )
            desired_velocity = position.normalize().scale(  maxVelocity * ( prevdistance / steeringRadius ) );
        }    
    } else {
        if( Math.abs( angle ) > 60 ) {
            printErr('error: ' +prevdistance + ' rad: '+ steeringRadius )
            desired_velocity = position.normalize().scale(  ( maxVelocity * 0.1 ) * ( prevdistance / (steeringRadius ) ) );        
        } else {
            desired_velocity = position.normalize().scale(  maxVelocity * ( prevdistance / steeringRadius ) );
        }
    }
    

    return desired_velocity;
}

// check if opponent is close to push
function isOpponentInPositionToPush( vh1, vh2, nextCheck, nextCheckpointAngle, avgSpeed ){

    var v1 = nextCheck.subtract(vh1).length();
    var v2 = vh2.subtract(vh1).length();
    var v3 = nextCheck.subtract(vh2).length();

    var angleRad = Math.acos( ( v1 * v1 + v2*v2 - (v3*v3) ) / ( 2 * v1 * v2) );
    var angleDeg = angleRad * 180 / Math.PI;

    printErr('?=== angle: ' + Math.round(angleDeg) 
        + ' mag-v1: ' + Math.round(v1,2) 
        + ' mag-v3:'  + Math.round(v3 )
        + ' mag-v2: ' + Math.round(v2,2) 
        + ' mag-v3:'  + Math.round(v3 )
        + ' nangle: ' + nextCheckpointAngle 
        + ' avg:' + avgSpeed);

    if(v2 < 1000 && v3 > 2500 && Math.abs(avgSpeed > 200) && Math.abs(nextCheckpointAngle) < 86 ) { // && Math.abs(nextCheckpointAngle) < 20  && angleDeg < 120
        return true;
    } else {
        return false;
    }
}

var sections = {
    steer: 0,
    keep: 1,
    break: 2
}

function sectionManager(position, prevCheck, nextCheck, prevMaxDistance, nextMaxDistance ) {
    //printErr('manager: ' +prevCheck + ' '+ position.subtract(prevCheck).length() + ' ' + prevMaxDistance );
    if(position.subtract(prevCheck).length() < prevMaxDistance) {
        return sections.steer;
    }else if( nextCheck.subtract( position ).length() < nextMaxDistance ) {
        return sections.break;
    } else {
        return sections.keep;
    }
}


function recalcDestinationVector(vh, pvc, nc, avgSpeed, angle) {
    var maxSpeed = 200;
    var dv = new Vec2();

    var px = pvc.x;
    var py = pvc.y;
    var dx = nc.x;
    var dy = nc.y;

    var tp = nc.subtract(pvc);
    var dvh= vh.subtract(pvc);
    var dnc = nc.subtract(vh);

    if(tp.length() < 4500 && angle > 20) {
        dv = vh.add(dnc.scale(0.5));
        printErr( '=== vchange-low ' + dv +' ' + Math.round(dvh.length()) + ' ' + Math.round(tp.length()) );
    } else if(tp.length() > 4500 && Math.abs(angle) > 4 && dvh.length() < tp.length()*0.5){
        dv = pvc.add(tp.scale(0.6));
        printErr( '=== vchange-high ' + dv +' ' + dvh.length() + ' ' + tp.length());
    } else {
        dv.init(dx, dy);
    }

    
    printErr(' v ' + dv.x + ' ' + dv.y + ' pv ' + px + ' ' + py + ' nv ' + dx + ' ' + dy+ ' a:' + angle + ' nd:' + Math.round(dnc.length()));

    return dv;
}




//
var vnchk = new Vec2(); // vector next checkpoint
var v0v1 = new Vec2(); // vector vehicule 1 from origin
var v0v2 = new Vec2(); // vector vehicule 2 from origin
var vv1 = new Vec2(); // vector next checkpoint
var prevD = new Vec2();
var fv,currentchk = new Vec2(0,0),prevchk = new Vec2(0,0);

var angles = {};
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

    v0v2.init( opponentX, opponentY );
    
    if( !vnchk.equal( currentchk ) && segmentChange == false ) {
        //printErr('SegChange: ' + segmentChange + ' ' + prevchk);
        segmentChange = true;
        if(!angles[currentchk.x +' '+ currentchk.y]) { // add the previous angle to the array
            angles[currentchk.x +' '+ currentchk.y] = nextCheckpointAngle;    
        }
        
        prevchk.x = currentchk.x;
        prevchk.y = currentchk.y;

        currentchk.x = vnchk.x;
        currentchk.y = vnchk.y;
    }

    // speed calculation
    var avgSpeed = vv1.length() - prevD.length();
    prevD.x = vv1.x;
    prevD.y = vv1.y;

    // destination vector recalculation
    // var vcalc = recalcDestinationVector( v0v1, prevchk, vnchk, avgSpeed , nextCheckpointAngle);
    // finalx = Math.round( vcalc.x );
    // finaly = Math.round( vcalc.y );


    // section management
    var section = sectionManager(v0v1, prevchk, vnchk, 1000, 2500);

    if( section == sections.steer ) {
        fv = outSteer( vv1, v0v1.subtract( prevchk ).length(), currentchk.subtract( v0v1 ).length()  ,900, 100, nextCheckpointAngle);
        segmentChange = false;    
    } else if( section == sections.break ){
        // if the destination vector change, change the breaking radious
        // the destination vector can change because of a hit or because destionation recalc
        fv = arrivalBreak(vv1, vv1.length(), 1000, 100, angles[vnchk.x +' '+ vnchk.y]);    
    } else {
        if(Math.abs(nextCheckpointAngle)  > 0) {
            fv = vv1.normalize().scale( 99 );    
        } else {
            fv = vv1.normalize().scale( 100 );
        }
    }

    fv = vv1.normalize().scale( 100 );

    // opponent attack calculation
    if( isOpponentInPositionToPush(v0v1, v0v2, vnchk, nextCheckpointAngle, avgSpeed) ) {
        finalx = v0v2.scale(1000).x;
        finaly = v0v2.scale(1000).y;
        printErr('PUSH ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost);
    }

    //printErr('error ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost + ' ' + avgSpeed + ' ' + segmentChange  );
    //printErr('x,y ' + x +',' + y +  ' opponent:' + opponentX + ',' + opponentY  );

    //printErr('Vector vnchk 1: ' + vnchk + ' magnitude: ' + parseInt(vnchk.length()) );
    //printErr('Vector v0v1 1: ' + v0v1 + ' magnitude: ' +  parseInt( v0v1.length() ) );
    //printErr('Vector vehicle 1: ' + vv1 + ' magnitude: ' +  parseInt( vv1.length() ) );
    //printErr('===? nangle: ' + nextCheckpointAngle + ' mag: ' +  parseInt( fv.length() ) + ' sec:'+ section + ' ' + angles );
    
    thrust = parseInt(fv.length());
    thrust = thrust > 100 ? 99 : thrust;

    // boost logic
    if(boost > 0 ) {
        if( nextCheckpointDist > 7500 && ( Math.abs( nextCheckpointAngle ) < 5 ) ) {
            printErr('burst ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost);
            thrust = 'BOOST';
            boost -=1;
            boostedSegment = true;
        } else if( Math.abs( nextCheckpointAngle ) == 0 ) {
            printErr('burst ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost);
            thrust = 'BOOST';
            boost -=1;
            boostedSegment = true;
        }
    }
    printErr('x,y' + finalx +',' +finaly + ' ' + thrust + ' a ' + angles[vnchk.x +' '+ vnchk.y]);
    print(finalx + ' ' + finaly +' ' + thrust );
}