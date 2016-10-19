// global variables

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

    vehicle.setPosition(x, y);
    vehicle.setAngle( nextCheckpointAngle );
    vehicle.calculateSpeedVector();

    vehicle.calculateThrust( nextCheckpointDist );

    finalx = nextCheckpointX;
    finaly = nextCheckpointY;


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
    printErr('sx, sy' + vehicle.speedX +', ' +vehicle.speedY + ' ' + vehicle.position + ' ' + vehicle.prevPosition);
    print(finalx + ' ' + finaly +' ' + vehicle.thrust );
}