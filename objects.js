function Pawn() {
	this.x=-30;	//posX
	this.y=30;	//posY
	this.r=30;	//radius
	this.gridW = this.r * 2; 	//grid width/height is twice the size of radius
	this.gridX = (Math.ceil(this.x/this.gridW)*this.gridW)-this.r;	//middle of each grid
	this.gridN = Math.floor(this.x/this.gridW); //grid number starting at 0, for grid array
	this.colorFlag=0;	//0=red, 1=blue
	this.dropspeed=20;	//pixels dropped each frame
	this.droppedFlag=0;	//if the pawn should be dropped
	this.dropH = canvas.height-this.r;	//how far should the pawn drop

	this.color = function() {
		if (!this.colorFlag) {
			return "red";
		} else {
			return "blue"
		}
	}
	this.show = function() {
		if(!arguments.length) ctx.circle(this.gridX,this.y,this.r,this.color());
	}
	this.update = function() {
		this.gridX = (Math.ceil(this.x/this.gridW)*this.gridW)-this.r;
		this.gridN = Math.floor(this.x/this.gridW);
		if(this.droppedFlag){
			if(this.y<this.dropH && this.y+this.dropspeed<=this.dropH) {
				this.y+=this.dropspeed;
			} else if(this.y<this.dropH && this.y+this.dropspeed>this.dropH) {
				this.y = this.dropH;
			}
		}
	}
	this.drop = function() {
		this.droppedFlag=1;
	}
}

var ctx = {
	background() {
		c.strokeStyle = "white";
		c.lineWidth=1;
		var my_gradient = c.createLinearGradient(0,0,0,170);
		my_gradient.addColorStop(0,"white");
		my_gradient.addColorStop(0.5,"#B5EDFF");
		my_gradient.addColorStop(1,"#B5EDFF");
		c.fillStyle=my_gradient;
		c.fillRect(0,0,canvas.width, canvas.height);

		c.fillStyle = "white";
		for (var i = 1; i <= 7; i++) {
		c.strokeStyle = "white";
			//horizontal
			c.moveTo(i*currentPawn.gridW, currentPawn.gridW);
			c.lineTo(i*currentPawn.gridW, canvas.height);
			c.stroke();
			//vertical
			c.moveTo(0,i*currentPawn.gridW);
			c.lineTo(canvas.width,i*currentPawn.gridW);
			c.stroke();
			//text
				// for (var j = 0; j <= 6; j++) {
				// 	c.font = "15px Halvetica";
				// 	c.fillText("["+j+','+(i-1)+']',j*currentPawn.gridW+1,(i+1)*currentPawn.gridW-5);
				// }
		}
		c.font =  "50px Calibri Light";
		c.fillText("Connect4",2*currentPawn.gridW-7,currentPawn.gridW-10);
	},
	circle(w,h,r,color) {
		c.lineWidth = 1;
		c.strokeStyle = color;
		c.fillStyle = color;
		c.beginPath();
		c.arc(w,h,r,0,Math.PI*2,false);
		c.closePath();
		c.fill();
	},
	won(x,y,d) {
		c.lineWidth=5;
		c.strokeStyle = "green";
		switch(d){
			case 1: {
				c.beginPath();
				c.moveTo(x*currentPawn.gridW+currentPawn.r,(y+1)*currentPawn.gridW);
				c.lineTo(x*currentPawn.gridW+currentPawn.r,(y+5)*currentPawn.gridW);
				c.closePath();
				c.stroke();
				c.lineWidth=1;
				c.strokeStyle = "white";
				break;
			}
			case 2: {
				c.beginPath();
				c.moveTo(x*currentPawn.gridW,(y+1)*currentPawn.gridW+currentPawn.r);
				c.lineTo((x+4)*currentPawn.gridW,(y+1)*currentPawn.gridW+currentPawn.r);
				c.closePath();
				c.stroke();
				c.lineWidth=1;
				c.strokeStyle = "white";
				break;
			}
			case 3: {
				c.beginPath();
				c.moveTo(x*currentPawn.gridW,(y+1)*currentPawn.gridW);
				c.lineTo((x+4)*currentPawn.gridW,(y+5)*currentPawn.gridW);
				c.closePath();
				c.stroke();
				c.lineWidth=1;
				c.strokeStyle = "white";
				break;
			}
			case 4: {
				c.beginPath();
				c.moveTo(x*currentPawn.gridW,(y+2)*currentPawn.gridW);
				c.lineTo((x+4)*currentPawn.gridW,(y-2)*currentPawn.gridW);
				c.closePath();
				c.stroke();
				c.lineWidth=1;
				c.strokeStyle = "white";
				break;
			}
		}
	}
}

var f = {
	newPawn(){
		var newpawn = new Pawn();
		pawns.push(newpawn);
		return pawns[pawns.length-1];
	},
	newGrid(){
		var grid = [[],[],[],[],[],[],[]];
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 6; j++) {
				grid[i][j] = 2;
			}
		}
		return grid;
	},
	msg(info) {
		if(document.getElementById('info').innerHTML != "<center>"+info+"</center>") {
			document.getElementById('info').innerHTML = "<center>"+info+"</center>"
		}
	},
	win(p) {
		switch(p) {
			case 0:
				this.msg('<button onclick="location.reload()"><span style="color:darkred;">Red won!</span><br> Play again!</button>');
				break;
			case 1:
				this.msg('<button class="blue" onclick="location.reload()"><span style="color:darkblue;">Blue won!</span><br> Play again!</button>');
				break;
			case 3:
				this.msg('<button onclick="location.reload()">Nobody won!<br> Play again!</button>');
				break;
		}
	}
}
function chkDraw(bd){
	emptyAmount=0;
	for (row = 0; row < 6; row++) {
		for (col = 0; col < 7; col++) {
			if(bd[col][row]==2){
				emptyAmount++;
			}
		}
	}
	return emptyAmount;
}

function chkLine(a,b,c,d) {
	// Check first cell non-empty and all cells match
	return ((a != 2) && (a == b) && (a == c) && (a == d));
}

function chkWinner(bd) {
	// Check down
	for (row = 0; row < 3; row++) {
		for (col = 0; col < 7; col++) {
			if (chkLine(bd[col][row], bd[col][row+1], bd[col][row+2], bd[col][row+3])) {
				ctx.won(col,row,1);
				return bd[col][row];
			}
		}
	}

	// Check right
	for (row = 0; row < 6; row++) {
		for (col = 0; col < 4; col++) {
			if (chkLine(bd[col][row], bd[col+1][row], bd[col+2][row], bd[col+3][row])) {
				ctx.won(col,row,2);
				return bd[col][row];
			}
		}
	}

	// Check down-right
	for (row = 0; row < 3; row++) {
		for (col = 0; col < 4; col++) {
			if (chkLine(bd[col][row], bd[col+1][row+1], bd[col+2][row+2], bd[col+3][row+3])) {
				ctx.won(col,row,3);
				return bd[col][row];
			}
		}
	}

	// Check up-right
	for (row = 3; row < 6; row++) {
		for (col = 0; col < 4; col++) {
			if (chkLine(bd[col][row], bd[col+1][row-1], bd[col+2][row-2], bd[col+3][row-3])) {
				ctx.won(col,row,4);
				return bd[col][row];
			}
		}
	}
	if(!chkDraw(bd)) return 3;
	return 2;
}