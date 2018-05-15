//Declare global vars
var rooms = ['Ballroom', 'Billiard Room', 'Conservatory', 'Dining Room', 'Kitchen', 'Hall', 'Library', 'Lounge', 'Study'];
var suspects = ['Colonel Mustard', 'Miss Scarlett', 'Mr. Green', 'Mrs. Peacock', 'Mrs. White', 'Professor Plum'];
var weapons = ['Candlestick','Knife','Lead Pipe','Poison','Rope','Wrench'];
var compLoss = "";
if ((isNaN(localStorage.getItem("Losses"))) || (localStorage.getItem("Losses")) == null){
	compLoss = "0";
} else {
	compLoss = localStorage.getItem("Losses");
}
var compWin = ""
if ((isNaN(localStorage.getItem("Wins"))) || (localStorage.getItem("Wins")) == null){
	compWin = "0";
} else {
	compWin = localStorage.getItem("Wins");
}
localStorage.setItem("Losses", compLoss);
localStorage.setItem("Wins", compWin);
var winningRoom;
var winningSuspect;
var winningWeapon;
var compRoomChoices = [];
var compSuspectChoices = [];
var compWeaponChoices = [];
var roomChoices = [];
var suspectChoices = [];
var weaponChoices = [];
var playerLog = "";
var computerLog = "";
if (localStorage.getItem("history")){
	var gameLog = JSON.parse(localStorage.getItem("history"));
} else {
	var gameLog = [];
}
var dateObj = new Date();
var dateOutput = "";
dateOutput+=dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate();

//Print all Cards
function printRooms(){
	roomsString = "Rooms: ";
	for (i=0;i<(rooms.length-1);i++){
		roomsString+=rooms[i]+", ";
	}
	roomsString+=rooms[rooms.length-1];
	document.write(roomsString);
}
	
function printSuspects(){
	suspectsString = "Suspects: ";
	for (i=0;i<(suspects.length-1);i++){
		suspectsString+=suspects[i]+", ";
	}
	suspectsString+=suspects[suspects.length-1];
	document.write(suspectsString);
}

function printWeapons(){
	weaponsString = "Weapons: ";
	for (i=0;i<(weapons.length-1);i++){
		weaponsString+=weapons[i]+", ";
	}
	weaponsString+=weapons[weapons.length-1];
	document.write(weaponsString);
}

//Print the entered name on page and store it in session storage, then call method to deal cards
function shuffle(name) {
	document.getElementById("getName").innerHTML = "Welcome "+name+".";
	sessionStorage.setItem("name", name);
	dealCards();
}


function dealCards(){
//creates copy of arrays for each category so they can be altered without affecting original arrays
	var copyRooms = rooms.slice();
	var copySuspects = suspects.slice();
	var copyWeapons = weapons.slice();
//Pick winners
	winningRoom = setWinner(copyRooms);
	winningSuspect = setWinner(copySuspects);
	winningWeapon = setWinner(copyWeapons);
//Create array to store non winning cards
	var leftOvers = setLeftovers(copyRooms, copySuspects, copyWeapons);
//Give half of remaining cards to human player
	var human = setHuman(leftOvers);
//Create arrays of options for the Human Player Choices during the game 
	Array.prototype.push.apply(roomChoices, (getOptions(rooms, human)));
	Array.prototype.push.apply(suspectChoices, (getOptions(suspects, human)));
	Array.prototype.push.apply(weaponChoices, (getOptions(weapons, human)));
//Create arrays for computer choices
	Array.prototype.push.apply(compRoomChoices, (getOptions(rooms, leftOvers)));
	Array.prototype.push.apply(compSuspectChoices, (getOptions(suspects, leftOvers)));
	Array.prototype.push.apply(compWeaponChoices, (getOptions(weapons, leftOvers)));
//List cards on html page
	document.getElementById("two").innerHTML = "Your cards are: "+human;
//Call function to fill in drop down form for player choices
	playerBox();
}

//Function takes array input, selects a random number between 0 and array length -1 to server as index
//Winner is the value in index=random number of the array.  Remove the index of the winner from the array so it won't be in player cards
function setWinner(array){
	var randomNum = Math.floor(Math.random()*array.length);
	winner = array[randomNum];
	array.splice(randomNum, 1);
	console.log("Winner:"+winner);
	return winner;
}
	
//Creates single array that contains all non winning cards
function setLeftovers(array1, array2, array3){
	var leftoverArray = [];
	for (i=0; i < array1.length; i++)
		leftoverArray.push(array1[i]);
	for (i=0; i < array2.length; i++)
		leftoverArray.push(array2[i]);
	for (i=0; i < array3.length; i++)
		leftoverArray.push(array3[i]);
	console.log("Leftover:"+leftoverArray+" Length:"+leftoverArray.length);
	return leftoverArray;
}

/*
/Creates single array for human cards from the leftover array of cards(non winners).  
/Uses a loop and generates Random number for index of leftovers.  That value is added to human 
/and removed from leftover array.  Loop runs while leftover array length is greater than half
/of original length of leftovers so that only half of the cards are dealt to user.
*/
function setHuman(leftovers){
	var human = [];
	var length = leftovers.length;
	while (leftovers.length > (length/2)){
		var playerRand = Math.floor(Math.random()*leftovers.length);
		human.push(leftovers[playerRand]);
		leftovers.splice(playerRand, 1);
	}
	return human;
}
/*
/ Function takes two arrays as an argument.  One acts as feeder and the other as restrictor.
/ Create new array, copy contents of base array to new array, unless element is also in the restrictor array.
/ This was used to make a list of player and computer choices from the original room, suspect, and weapon arrays.
/ However, if they were also in the player cards they would not be added to player choices.  
/ Since the leftover array was now just all cards that weren't winners or player cards, it because the default computer cards.
/ Therefore the computer choices were restricted by the leftover array.
*/
function getOptions(base, restrictor){
	var choice = [];
	base.forEach(function(item, array){
		if (!restrictor.includes(item)){
			choice.push(item);
		}
	})
	//console.log("Options:"+choice);
	return choice;
}

/*function that takes the element id and the array to fill the drop down boxes in the form
/ Create variable that is element id, then create a loop to add all elements of given array
/ as an option and add it to the drop down, then add the list to the section of html
*/
function fillDropDown(elemId, array){
	var select = document.getElementById(elemId);
	for(var i = 0; i < array.length; i++) {
		var choice = array[i];
		var elem = document.createElement("option");
		elem.textContent = choice;
		elem.value = choice;
		select.appendChild(elem);
	}
}

/* Step 1 in game game play
/ Takes arguments from HTML form and logs the guess for history
/ Calls function to compare results and print it on HTML page.
/ if result string contains win, call function to begin new game
/ else call function that will have computer guess.
*/
function playGame(room, suspect, weapon){
	playerLog+="Guess:("+room+", "+suspect+", "+weapon+") ";
	sessionStorage.setItem("playerLog", playerLog);
	var result = playerGuess(room, suspect, weapon);
	document.getElementById("four").innerHTML = result;
	if (result.includes("win")){
		contNewGame();
	} else {
		contCurrGame();
	}
}

/* function takes arguments from HTML form and creates a blank message
// if room isn't correct, supply message stating the specific guess was wrong, and return message to playGame function
// If guess is right it will compare the other categories and do the same thing.
// If all three are correct, message stating win is returned
*/
function playerGuess(room, suspect, weapon){
	var message = "";
	if (room != winningRoom){
		message = "Sorry, "+room+" is not correct.";
		return message;
	} else if (suspect != winningSuspect){
		message = "Sorry, "+suspect+" is not correct.";
		return message;
	} else if (weapon != winningWeapon){
		message += "Sorry, "+weapon+" is not correct.";
		return message;
	} else {
		message += "That is correct.  You win!";
		var cLoss = parseInt(compLoss);
		cLoss+=1;
		compLoss = cLoss.toString();
		localStorage.setItem("Losses", compLoss);
		gameLog.push(sessionStorage.getItem("name")+", "+dateOutput+", "+"Computer Lost.");
		localStorage.setItem("history", JSON.stringify(gameLog));
		return message;
	}
	return message;
}
/* Game Play Step2b (if Winner is guessed)
/ Create button to continue after winning message is displayed during playGame or compTurn functions
/ On click button clears arrays, lists, and move logs generated from previous game, then deletes the button it created
/ To let user know a new game started.
*/
function contNewGame(){
	var btn = document.createElement("BUTTON");
    var t = document.createTextNode("Continue");
    btn.appendChild(t);
	btn.id = "newGame";
    var foo = document.getElementById("four");
    foo.appendChild(btn);
	
    btn.onclick = function(){
    	winningRoom = "";
		winningSuspect = "";
		winningWeapon = "";
		compRoomChoices = [];
		compSuspectChoices = [];
		compWeaponChoices = [];
		document.getElementById('selectRoom').options.length = 0;
		document.getElementById('selectSuspect').options.length = 0;
		document.getElementById('selectWeapon').options.length = 0;
		roomChoices = [];
		suspectChoices = [];
		weaponChoices = [];
		playerLog = "";
		computerLog = "";
		removeElement("newGame");
		sessionStorage.removeItem("computerLog");
		sessionStorage.removeItem("playerLog");
		document.getElementById("four").innerHTML = "New Game";
		dealCards();
    }
}
//Game Play Step 2a (If user guess was incorrect)
//Creates button to continue, which calls a function for the computer to guess.
function contCurrGame(){
	var btn = document.createElement("BUTTON");
    var t = document.createTextNode("Continue");
    btn.appendChild(t);
    var foo = document.getElementById("four");
    foo.appendChild(btn);
    btn.onclick = function(){
		compTurn();
	}
}

/* Game Playe Step3
/ Calls function to have computer generate guess and return message summarizing results
/ If result was computer win, call function to start a new game
/ else call function to create continue button for next human player move
*/
function compTurn(){
	var result = computerGuess();
	document.getElementById("four").innerHTML = result;
	if (result.includes("win")){
		contNewGame();
	} else {
		linkPlayerBox();
	}
}

/* Create message string that will be returned to compTurn function
/ Guess for each category will be the last value in the each array
/ Log guess in computer log.
/ First look compare room guess to winning room.  If room guess isn't equal to winning room, pop that value and return message stating that guess was incorrect
/ If guess is correct, move to next category to compare and repeat process.
/ If all guesses are correct, return message that computer wins
*/
function computerGuess(){
	var message = "";
	compRoomGuess = compRoomChoices[compRoomChoices.length-1];
	compSuspectGuess = compSuspectChoices[compSuspectChoices.length-1];
	compWeaponGuess = compWeaponChoices[compWeaponChoices.length-1];
	computerLog+="Guess:("+compRoomGuess+", "+compSuspectGuess+", "+compWeaponGuess+") ";
	sessionStorage.setItem("computerLog", computerLog);
	if (compRoomGuess != winningRoom) {
		compRoomChoices.pop();
		message = "The computer's guess of "+compRoomGuess+" was incorrect.";
		return message;
	} else if (compSuspectGuess != winningSuspect) {
		compSuspectChoices.pop();
		message = "The computer's guess of "+compSuspectGuess+" was incorrect.";
		return message;
	} else if (compWeaponGuess != winningWeapon) {
		compWeaponChoices.pop();
		message = "The computer's guess of "+compWeaponGuess+" was incorrect.";
		return message;
	} else {
		message = "The computer wins.  The correct answers were "+winningRoom+", "+winningSuspect+", and "+winningWeapon;
		var cWin = parseInt(compWin);
		cWin+=1;
		compWin = cWin.toString();
		localStorage.setItem("Wins", compWin);
		gameLog.push(sessionStorage.getItem("name")+", "+dateOutput+", "+"Computer won.");
		localStorage.setItem("history", JSON.stringify(gameLog));
		return message;
	}
	return message;
}

// Function just calls function to fill all 3 drop downs
function playerBox(){
	fillDropDown("selectRoom", roomChoices);
	fillDropDown("selectSuspect", suspectChoices);
	fillDropDown("selectWeapon", weaponChoices);
}

//Creates a function to create button after compTurn function is ended
//This button will replace button with Message stating Player Turn in clearBox function
function linkPlayerBox(){
	var btn = document.createElement("BUTTON");
    var t = document.createTextNode("Continue");
    btn.appendChild(t);
    var foo = document.getElementById("four");
    foo.appendChild(btn);
    btn.onclick = function(){
    	clearBox();
	}
}
function clearBox(){
	document.getElementById("four").innerHTML = "Player Turn";
}

function emptyBox(section){
	var dd = document.getElementById(section);
	for (i=0; i<dd.options.length;i++){
		dd.options[i]=null;
		document.write("Number:"+i+" Value:"+dd.options[i]);
	}
}

// function to remove elements, used mostly for buttons in this page
function removeElement(item){
	var element = document.getElementById(item);
	if (element.parentNode){
		element.parentNode.removeChild(element);
	}
}

/* Button that essentially clears section with Show Moves button, then adds Guess Logs in sections below
/ Then creates new button to add to previous section that was just cleared
/ Button on Click clears data and creates a new button that when clicked, will call this functino again.
/ This acts as toggle between showing and hiding guess logs
*/
function showMoves(){
	document.getElementById("five").innerHTML = "";
	document.getElementById("six").innerHTML = "Human Guesses: "+sessionStorage.getItem("playerLog");
	document.getElementById("seven").innerHTML = "Computer Guesses: "+sessionStorage.getItem("computerLog");
	var btn = document.createElement("BUTTON");
    var t = document.createTextNode("Hide Moves");
    btn.appendChild(t);
    btn.id = "hideMoves";
	var foo = document.getElementById("five");
    foo.appendChild(btn);
    btn.onclick = function(){
    	document.getElementById("six").innerHTML = "";
		document.getElementById("seven").innerHTML = "";
		removeElement("hideMoves");
		var but = document.createElement("BUTTON");
		var text = document.createTextNode("Show Moves");
		but.appendChild(text);
		but.id = "showMoves";
		var space = document.getElementById("five");
		space.appendChild(but);
		but.onclick = function() {
			showMoves();
		}
	}
}
/*Essentially acts the same as show history, but shows scores.
/ Record and results are stored in local storage. 
*/
function showScore(){
	document.getElementById("eight").innerHTML = "";
	document.getElementById("nine").innerHTML = "Computer Wins: "+localStorage.getItem("Wins")+" Computer Losses: "+localStorage.getItem("Losses");
	document.getElementById("ten").innerHTML = "Previous Results: "+localStorage.getItem("history");
	var btn = document.createElement("BUTTON");
    var t = document.createTextNode("Hide Score");
    btn.appendChild(t);
    btn.id = "hideScore";
	var foo = document.getElementById("eight");
    foo.appendChild(btn);
    btn.onclick = function(){
    	document.getElementById("nine").innerHTML = "";
		document.getElementById("ten").innerHTML = "";
		removeElement("hideScore");
		var but = document.createElement("BUTTON");
		var text = document.createTextNode("Show Score");
		but.appendChild(text);
		but.id = "showScores";
		var space = document.getElementById("eight");
		space.appendChild(but);
		but.onclick = function() {
			showScore();
		}
	}
}

function clearLocalStorage(){
	gameLog = [];
	compLoss = "0";
	compWin = "0";
	localStorage.clear();
	localStorage.setItem("Wins", compWin);
	localStorage.setItem("Losses", compLoss);
}
