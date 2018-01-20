﻿// Global Variables
var loops;
var doesCircleExist;
var secondsBeforeClicked;
var reactionAverage;
var theTarget;
var gameRunning;

// Event Listener
var instructionsOnClick = new Event("instructionsOnClick"); // Derived from https://stackoverflow.com/a/31222710/9091276

// Button Variables
var startButton;
var instructionButton;
var retryButton;

// Gets the width and height of canvas, then find the center.
var screenTypes = [getWidth(), getHeight(), getWidth() / 2, getHeight() / 2];
var fontConst = " sans-serif";

/// Main entry point for javascript
function start() {
	// Assign values to variables
	doesCircleExist = false;
	secondsBeforeClicked = 0;
	reactionAverage = []; // Array for reaction times
	// Empty arrays for pButton
	startButton = [];
	instructionButton = [];
	retryButton = [];

	// Render the main menu
	drawMenu();
}

/// Main function to draw the main Menu
function drawMenu() {
	createText("Reaction Test!", "30pt" + fontConst, screenTypes[2], 0, null);
	createButton("Start", "24pt" + fontConst, 100, 50, screenTypes[2] - screenTypes[0] / 4, screenTypes[3] + screenTypes[1] / 4, startButton);
	createButton("Instructions", "16pt" + fontConst, 80, 50, screenTypes[2] + screenTypes[0] / 4, screenTypes[3] + screenTypes[1] / 4, instructionButton);

	mouseClickMethod(performAction_Click);
}

/// Main function to get time
function getTime() {
	return new Date().getTime(); // Get seconds since Epoch Time (1/1/1970)
}

/// Main function to control game, treat as the true start function
function startGame() {
	gameRunning = true;
	loops = 0; // This is defined here rather than start(), since the restart button calls here, and code will operate improperly if loops isn't defaulted.
	removeAll(); // Remove all active elements from the canvas.
	randomize(); // This function was needed to randomize the calling of step
}

// Helper function to randomize spawn rate
function randomize() {
	stopTimer(step);
	setTimer(step, Randomizer.nextInt(2000, 10000));
}

function step() {
	beginDrawingCircles();
	randomize();
}

// Main function to control circle generation
function beginDrawingCircles() {
	theTarget = drawCircle();
	if (doesCircleExist === false) {
		add(theTarget);
		secondsBeforeClicked = getTime();
		doesCircleExist = true;
	}
}

// Main function to set internal reaction time, and allow for circle generation.
function setReaction() {
	remove(theTarget);
	var reactionTime = getTime() - secondsBeforeClicked;
	reactionAverage.push(reactionTime);
	loops++;
	doesCircleExist = false;
	if (loops == 5) { // This is done to show the reaction time instantly, when loops are 5.
		endGame();
	}
}

/// Helper Functions, mostly reusable/modular
function drawCircle() {
	var c = new Circle(100);
	c.setPosition(screenTypes[2], screenTypes[3]);
	c.setColor(Color.green);
	return c;
}

/// Main function to end game
function endGame() {
	gameRunning = false;
	stopTimer(step);
	createText("Reaction Time: " + calculateAverage() + "ms", "22pt" + fontConst, screenTypes[2], 200, null);
	createButton("Retry", "22pt" + fontConst, 100, 50, screenTypes[2], screenTypes[3] + screenTypes[1] / 4, retryButton);
}

function calculateAverage() {
	var arrAverage = 0;
	var arrLength = reactionAverage.length; // Array length should be 5, since only 5 loops occured
	for (var i = 0; i < arrLength; i++) { // Loop five times
		arrAverage += reactionAverage[i]; // Add the reaction times together, this is a simple mean calculation
	}
	return Math.round(arrAverage / arrLength); // Actual mean calculation
}

function performAction_Click(e) {
	var element = getElementAt(e.getX(), e.getY());
	if (element !== null) { // This is to prevent any undefined element errors
		if (gameRunning == true) { // Reduce the amount of checks if game is running, since menu elements are no longer displayed
			if (element == theTarget) {
				setReaction();
			}
		}
		else {
			if (buttonIndex(instructionButton[0], element) > -1) {
				document.dispatchEvent(instructionsOnClick);
			}
			else if (buttonIndex(startButton[0], element) > -1 || buttonIndex(retryButton[0], element) > -1) {
				startGame();
			}
		}
	}
}

function buttonIndex(array, compare) {
	// Derived from https://stackoverflow.com/a/13737101
	try {
		return ([array.t, array.c, array.c1, array.c2].indexOf(compare));
	}
	catch (err) { console.log(err); } // This is done if you press something that isn't within an array (pText).
}

if (typeof start === 'function') {
	start();
}