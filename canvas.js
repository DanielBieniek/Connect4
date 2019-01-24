// creating canvas
var canvas = document.getElementById('paper');
var c = canvas.getContext("2d");
var end = 2; //0-red won, 1-blue won, 2-not ended, 3-draw
// array of pawns
var pawns = [];
currentPawn = f.newPawn();
var grid = f.newGrid();
// getting position X of mouse
canvas.addEventListener('mousemove', function(event){
	var rect = canvas.getBoundingClientRect();
	currentPawn.x = event.clientX - rect.left;
});
// refreshing canvas
setInterval(function() {
	ctx.background();
	pawns.forEach(function(item,index) {
		if(end!=2 && index==pawns.length-1){
			item.show(1);
			item.update();
			f.win(end);
		} else {
			item.show();
			item.update();
		}
	});
	end = chkWinner(grid);
},30);
// listening to click event
canvas.addEventListener('mouseup', function(){
	if(end == 2) {
		var i = 5;
		while(grid[currentPawn.gridN][i] != 2 && i>=0) {
			currentPawn.dropH -= currentPawn.gridW;
			i--;
		}
		if(currentPawn.dropH>30) {
			grid[currentPawn.gridN][i] = currentPawn.colorFlag;
			currentPawn.drop();
			f.msg('');
			if (!currentPawn.colorFlag) {
				currentPawn = f.newPawn();
				currentPawn.colorFlag = 1;
			} else {
				currentPawn = f.newPawn();
				currentPawn.colorFlag = 0;
			}
		} else {
			f.msg('That row is full');
			currentPawn.dropH += currentPawn.gridW*6;
		}
	}
})