window.onload = function() {
	// Seeing if app.js is ready
	document.getElementById('ready').style.backgroundColor = "#0F0";
	// show time
	function myTimer() {
	    var d = new Date();
	    document.getElementById("time").innerHTML = d.toLocaleTimeString();
	}
	myTimer();
	setInterval(myTimer, 1000);
}