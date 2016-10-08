/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var laps = 1, checks = 0;
var boost = 1;

var avgSpeed = 0;
var arrDistances = [];

function calculateAvgSpeed( arr, points ) {
    if( arr.length > points ) {
        
    }
}

var boostedSegment=false, segmentChange=false, prevDistance = 0;


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
    
    
    if( nextCheckpointAngle > 90 || nextCheckpointAngle < -90) {
        if( nextCheckpointDist > 6000) {
            thrust = 80;
        }else {
            thrust = 10;    
        }
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
    printErr('error ' + nextCheckpointDist + ' ' + nextCheckpointAngle + ' ' + thrust + ' b:'+boost + ' ' + avgSpeed + ' ' + segmentChange  );
    printErr('x,y ' + x +',' + y +  ' opponent:' + opponentX + ',' + opponentY  );
    print(finalx + ' ' + finaly +' ' + thrust );
}