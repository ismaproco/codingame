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

Vec2.prototype.rotatei = function (ang) {
    ang = -ang * (Math.PI / 180);
    var cos = Math.cos(ang),
        sin = Math.sin(ang),
        vec = this;
    return new Vec2( Math.round(10000 * (vec.x * cos - ((-1)*vec.y) * sin)) / 10000,
                     Math.round(10000 * (vec.x * sin + ((-1)*vec.y) * cos)) / 10000);
};


Vec2.prototype.angle = function angle(v2) {
  var dy = v2.y - this.y;
  var dx = v2.x - this.x;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}



function findOptimalAngle(thorv, vb, dirv, angle) {
    
    var res = new Vec2();
    var calcLimit = thorv.add(dirv.normalize());
    var upperLimit = thorv.add(dirv.normalize());
    var lowerLimit = thorv.add(dirv.normalize());
    var bangle = 45;
    var direction;

    if( angle <= 0  ) {
        var cangle = Math.abs(angle);
        if( bangle * 2 === cangle ) { // north
           direction = 'N';
           calcLimit.x = thorv.x;
           calcLimit.y = thorv.y - 1;

           upperLimit.x = thorv.x + 1;
           upperLimit.y = thorv.y - 1;

           lowerLimit.x = thorv.x -1;
           lowerLimit.y = thorv.y -1;

        } else if( cangle > bangle * 2 && cangle < bangle * 4  ) { // north east
            direction = 'NW';

            calcLimit.x = thorv.x + 1;
            calcLimit.y = thorv.y - 1;

            upperLimit.x = thorv.x;
            upperLimit.y = thorv.y - 1;

            lowerLimit.x = thorv.x +1;
            lowerLimit.y = thorv.y;
        } else if( cangle === bangle * 4 ) { // east
            direction = 'W';
            calcLimit.x = thorv.x + 1;
            calcLimit.y = thorv.y ;

            upperLimit.x = thorv.x + 1;
            upperLimit.y = thorv.y - 1;

            lowerLimit.x = thorv.x + 1;
            lowerLimit.y = thorv.y + 1;
        } else if( cangle < bangle * 2 && cangle > 0 ) {
            direction = 'NE';
            calcLimit.x = thorv.x - 1;
            calcLimit.y = thorv.y - 1;

            upperLimit.x = thorv.x;
            upperLimit.y = thorv.y - 1;

            lowerLimit.x = thorv.x - 1;
            lowerLimit.y = thorv.y;
        } else {
            direction = 'E';

            calcLimit.x = thorv.x - 1;
            calcLimit.y = thorv.y;

            upperLimit.x = thorv.x -1;
            upperLimit.y = thorv.y - 1;

            lowerLimit.x = thorv.x - 1;
            lowerLimit.y = thorv.y + 1;
        }   
    } else {
        var cangle = Math.abs(angle);
        if( cangle > bangle * 2  && cangle < bangle * 4  ) { // south east
            direction = 'SW';
            
            calcLimit.x = thorv.x -1;
            calcLimit.y = thorv.y +1;

            upperLimit.x = thorv.x -1;
            upperLimit.y = thorv.y ;

            lowerLimit.x = thorv.x;
            lowerLimit.y = thorv.y + 1;


        } else if( cangle === bangle * 2)   { // south
            direction = 'S';
            calcLimit.x = thorv.x;
            calcLimit.y = thorv.y +1;

            upperLimit.x = thorv.x +1;
            upperLimit.y = thorv.y + 1;

            lowerLimit.x = thorv.x -1;
            lowerLimit.y = thorv.y + 1;
        } else if( cangle < bangle * 2 ) {
            direction = 'SE';
            
            calcLimit.x = thorv.x + 1;
            calcLimit.y = thorv.y +1;

            upperLimit.x = thorv.x +1;
            upperLimit.y = thorv.y;

            lowerLimit.x = thorv.x ;
            lowerLimit.y = thorv.y + 1;

        }
    }

    //angle = angle - (angle % bangle);
    printErr('direction ' + direction + ' ' + angle);

    var cal = lightv.subtract(calcLimit).length();
    var uli = lightv.subtract(upperLimit).length();
    var lol = lightv.subtract(lowerLimit).length();

    printErr('cal ' + cal + ' ' + calcLimit+ ' ' + angle);
    printErr('uli ' + uli + ' ' + upperLimit+ ' ' );
    printErr('lol ' + lol + ' ' + lowerLimit+ ' ' );

    if(cal <= uli && cal <= lol ) {
        res = calcLimit.clone();
    } else {
        if( uli <= lol) {
            res = upperLimit.clone();
            angle = angle + 45;
        } else {
            res = lowerLimit.clone();
            angle = angle - 45;
        }
    }

    return res;
}


/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 * ---
 * Hint: You can use the debug stream to print initialTX and initialTY, if Thor seems not follow your orders.
 **/

var inputs = readline().split(' ');
var lightX = parseInt(inputs[0]); // the X position of the light of power
var lightY = parseInt(inputs[1]); // the Y position of the light of power
var initialTX = parseInt(inputs[2]); // Thor's starting X position
var initialTY = parseInt(inputs[3]); // Thor's starting Y position
var counter = 0;
var thorv;


// game loop
while (true) {
    var vb = new Vec2(-1,0);
    var remainingTurns = parseInt(readline()); // The remaining amount of turns Thor can move. Do not remove this line.

    // Write an action using print()
    // To debug: printErr('Debug messages...');
    var iniv = new Vec2( initialTX, initialTY );
    var lightv = new Vec2( lightX, lightY );

    if(counter === 0) {
        thorv = iniv.clone();
    }

    var dirv = thorv.add(lightv.subtract( thorv ));
    var angle = thorv.angle( dirv );
    var bangle = 45;
    var direction = '';
    var infAngle =angle, supAngle;
    // adjust to the nearest base angle 45 degrees

    if(angle % bangle !== 0){
        thorv = findOptimalAngle(thorv, vb, dirv, angle )
    } else {
        thorv = thorv.add( vb.rotate( angle ) );
    }

    // set thor position
    
    thorv.x = Math.round(thorv.x);
    thorv.y = Math.round(thorv.y);

    if( angle <= 0  ) {
        var cangle = Math.abs(angle);
        if( bangle * 2 === cangle ) { // north
           direction = 'N';
        } else if( cangle > bangle * 2 && cangle < bangle * 4  ) { // north east
            direction = 'NW';
        } else if( cangle === bangle * 4 ) { // east
            direction = 'W';
        } else if( cangle < bangle * 2 && cangle > 0 ) {
            direction = 'NE';
        } else {
            direction = 'E';
        }   
    } else {
        var cangle = Math.abs(angle);
        if( cangle > bangle * 2  && cangle < bangle * 4  ) { // south east
            direction = 'SW';
        } else if( cangle === bangle * 2)   { // south
            direction = 'S';
        } else if( cangle < bangle * 2 ) {
            direction = 'SE';
        } else if( cangle === bangle * 4 ) { // east
            direction = 'W';
        }
    }
    // thorv.angle( thorv.add( thorv.subtract( lightv ) ) )

    printErr('ca ' +   thorv.angle( dirv ) +' ' +direction + ' an ' + angle);
    printErr('thorv ' +  thorv + ' lightv ' + lightv + ' dirv ' + dirv +' ' + remainingTurns);

    counter++;

    // A single line providing the move to be made: N NE E SE S SW W or NW
    print(direction);
}