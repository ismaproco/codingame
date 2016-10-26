var Physics = function() {

};

Physics.prototype.getAceleratedMovement = function( initialSpeed, acceleration, n ) {
    var arr = [];
    arr.push([0, 0])
    for (var i = 1; i < n; i++) {
        arr.push( [i, arr[i-1][1] + acceleration * i]);
    }
    return arr;
}


export { Physics };