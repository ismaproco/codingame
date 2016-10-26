/*
 * Simple Plotter Library
 * Ismael Jimenez - 24/10/2016
 */
var Plotter = function( ctx, x, y, width, height, separation ) {
  this.ctx = ctx;
  this.x = x || 0;
  this.y = y || 0;
  this.width = width;
  this.height = height;
  this.separation = separation || 10; // unit of separation
}

Plotter.prototype.drawLine = function(ix, iy, fx, fy) {
  if(this.ctx){
   this.ctx.beginPath();
   this.ctx.moveTo(ix,iy);
   this.ctx.lineTo(fx,fy);
   this.ctx.closePath();
   this.ctx.stroke();
  }
}

Plotter.prototype.render = function( ) {
  if(this.ctx){
    
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.strokeStyle = "gray";
    this.ctx.lineWidth = 0.5;

    var x=0, y=0;

    for(var i = x; i <= x + this.width; i+= this.separation){
      this.drawLine(i, y, i, y + this.height);
    }

    for(var j = y; j <= y + this.height; j+= this.separation){
      this.drawLine(x, j, x + this.width, j);
    }

    var globalArr = arguments[0].concat( arguments[1] );

    var biggestY = Math.max.apply(null, 
        globalArr.map(function(item){
        return Math.abs(item[1]);
      })
    );

    var biggestX = Math.max.apply(null, 
        globalArr.map(function(item){
        return  Math.abs(item[0]);
      })
    );


    if(arguments.length > 0){
      for (var i = 0; i < arguments.length; i++) {
        console.log( arguments[i], typeof(arguments[i]), Array.isArray(arguments[i]) );
        this.plotArr( arguments[i] , biggestX, biggestY );
      }
    }

    this.ctx.restore();
  }
}


Plotter.prototype.plotArr = function(arr, globalMaxX, globalMaxY) {
  if(Array.isArray( arr )) {
    var point, prepoint;

    for(var p = 0; p < arr.length; p++){
      point = arr[p];
      prepoint = arr[p - 1] ? arr[p-1] : [0,0];
      
      this.ctx.strokeStyle = "black";
      this.drawLine( 
        this.width * prepoint[0] / globalMaxX, 
        (this.height*prepoint[1] / globalMaxY), 
        this.width * point[0] / globalMaxX, 
        (this.height*point[1] / globalMaxY));
    }

    var rgb = {
      r: getRandomIntInclusive(10,255),
      g: getRandomIntInclusive(10,255),
      b: getRandomIntInclusive(10,255)
    };

    for(var p = 0; p < arr.length; p++){
      point = arr[p];
      prepoint = arr[p - 1] ? arr[p-1] : [0,0];

      console.log( 'aadsfa ', "rgba("+ rgb.r +", "+rgb.g+", "+rgb.b+", 1)" );

      this.ctx.fillStyle = "rgba("+ rgb.r +", "+rgb.g+", "+rgb.b+", 1)";
      this.ctx.beginPath();
      this.ctx.arc(this.width * point[0]/globalMaxX, 
        (this.height*point[1] / globalMaxY), 2, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export { Plotter };