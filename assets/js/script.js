var Mastermind = {};
Mastermind.cache = {};

Mastermind.colsCount = 4;
Mastermind.maxRows = 12;
/*
Mastermind.colors = [
	"red", "pink", "purple",
	"gray", "blue", "light-blue",
	"cyan", "green", "yellow",
	"orange", "black", "white"
];
*/
Mastermind.colors = [
	"red", "light-blue", "green",
	"yellow", "black", "white"
];

Mastermind.setup = function() {
	Mastermind.cache.currentColumn = 1;
	Mastermind.cache.currentRow = 1;
	Mastermind.cache.answer = [];
	Mastermind.cache.winGame = false;
	
	for (colors in Mastermind.colors) {
		for (var i = 1; i < Mastermind.colsCount + 1; i++) {
			var elem = document.getElementById("answer_" + i);
			if (elem.classList.contains('filled-' + Mastermind.colors[colors])) {
				elem.classList.remove('filled-' + Mastermind.colors[colors]);
			}
		}
	}
	
	// COLUMNS
	var cols = document.getElementById("col-btns");
	cols.innerHTML = "";
	for (var i = 1; i <= Mastermind.colsCount; i++) {
		cols.innerHTML += '\n<button data-col="' + i + '" class="btn btn-outline">Kolom ' + i + '</button>';
		var query = cols.querySelectorAll('[data-col]');
		for (var val in query) {
			if (query.hasOwnProperty(val)) {
				query[val].onclick = function() {
					Mastermind.btnRegelChange(this.dataset.col);
				};
			}
		}
		if (i == 1) {
			Mastermind.btnRegelChange(1);
		}
	}
	
	// COLORS
	var colorChooser = document.getElementById("colorChooser");
	var colorQuery = colorChooser.querySelectorAll('[data-color]');
	for (var val in colorQuery) {
		if (colorQuery.hasOwnProperty(val)) {
			for (color in Mastermind.colors) {
				if (colorQuery[val].dataset.color == Mastermind.colors[color]) {
					colorQuery[val].onclick = function() {
						Mastermind.btnColorChange(this.dataset.color);
					};
				}
			}
		}
	}
	
	// ROWS
	var rows = document.getElementById("rows");
	rows.innerHTML = "";
	for (var i = 1; i <= 12; i++) {
		var leftArrow = "";
		if (i == 1) {
			leftArrow = '<i class="fa fa-chevron-right fa-1x" aria-hidden="true"></i>';
		}
		rows.innerHTML += '	<div class="col-sm-8 col-m-8 bullet-col text-right" data-row="' + i + '">'
						+ '		<ul class="bullets-big">'
						+ '			<li class="left-arrow" data-col="0">' + leftArrow + '</li>'
						+ '			<li data-col="1"></li>'
						+ '			<li data-col="2"></li>'
						+ '			<li data-col="3"></li>'
						+ '			<li data-col="4"></li>'
						+ '		</ul>'
						+ '	</div>'
						+ '	<div class="col-sm-4 col-m-4 bullet-col text-left" data-rowSmall="' + i + '">'
						+ '		<ul class="bullets-small">'
						+ '			<li data-check="1"></li>'
						+ '			<li data-check="2"></li>'
						+ '			<li data-check="3"></li>'
						+ '			<li data-check="4"></li>'
						+ '		</ul>'
						+ '	</div>';
		if (i < 12) {
			rows.innerHTML += '	<div class="col-sm-12 col-m-12 bullet-col">'
							+ '		<hr class="line-xsmall-primary">'
							+ '	</div>';
		}
	}
	
	// ANSWER BULLETS
	
	var answerQuestionMark = '<i class="fa fa-question fa-2x faa-pulse animated" aria-hidden="true"></i>';
	document.getElementById("answer_1").innerHTML = answerQuestionMark;
	document.getElementById("answer_2").innerHTML = answerQuestionMark;
	document.getElementById("answer_3").innerHTML = answerQuestionMark;
	document.getElementById("answer_4").innerHTML = answerQuestionMark;
	
	// ANSWER
	Mastermind.cache.answer = [];
	for (var i = 0; i < 4; i++) {
		var color = Mastermind.colors[Math.floor(Math.random() * Mastermind.colors.length)];
		while (Mastermind.cache.answer.indexOf(color) > -1) {
			color = Mastermind.colors[Math.floor(Math.random() * Mastermind.colors.length)];
		}
		Mastermind.cache.answer[i] = color;
	}
	console.log(Mastermind.cache.answer);
	
	document.getElementById("btn_done").onclick = function() {
		Mastermind.btnDoneClick();
	};
	
	document.getElementById("new_game").onclick = function() {
		Mastermind.messageOverlay("close", "");
		Mastermind.setup();
	};
	document.getElementById("new_game_2").onclick = function() {
		Mastermind.messageOverlay("close", "");
		Mastermind.setup();
	};
}

Mastermind.btnRegelChange = function(col) {
	var cols = document.getElementById("col-btns").querySelectorAll('[data-col]');
	var arrows = document.getElementById("arrows").querySelectorAll('[data-col]');
	for (var val in cols) {
		if (cols.hasOwnProperty(val)) {
			if (cols[val].dataset.col == col) {
				if (!cols[val].classList.contains('active')) {
					cols[val].classList.add('active');
				}
			} else {
				cols[val].classList.remove('active');
			}
		}
	}
	for (var val in arrows) {
		if (arrows.hasOwnProperty(val)) {
			if (arrows[val].dataset.col == col) {
				arrows[val].innerHTML = '<i class="fa fa-arrow-down fa-2x faa-float animated" aria-hidden="true"></i>';
			} else {
				arrows[val].innerHTML = '';
			}
		}
	}
	Mastermind.cache.currentColumn = col;
}

Mastermind.btnColorChange = function(color) {
	var rows = document.getElementById("rows").querySelectorAll('[data-row]');
	for (var val in rows) {
		if (rows.hasOwnProperty(val)) {
			if (rows[val].dataset.row == Mastermind.cache.currentRow) {
				var columns = rows[val].querySelectorAll('[data-col]');
				
				for (var col in columns) {
					if (columns.hasOwnProperty(col)) {
						if (columns[col].dataset.col == Mastermind.cache.currentColumn) {
							for (colors in Mastermind.colors) {
								if (columns[col].classList.contains('filled-' + Mastermind.colors[colors])) {
									columns[col].classList.remove('filled-' + Mastermind.colors[colors]);
								}
							}
							
							if (!columns[col].classList.contains('filled-' + color)) {
								columns[col].classList.add('filled-' + color);
							}
						}
					}
				}
			}
		}
	}
}

Mastermind.btnDoneClick = function () {
	var doneSuccess = true;
	var colorsFound = [];
	var rows = document.getElementById("rows").querySelectorAll('[data-row]');
	var rowsS = document.getElementById("rows").querySelectorAll('[data-rowsmall]');
	for (var val in rows) {
		if (rows.hasOwnProperty(val)) {
			if (rows[val].dataset.row == Mastermind.cache.currentRow) {
				var columns = rows[val].querySelectorAll('[data-col]');
				
				for (var col in columns) {
					if (columns.hasOwnProperty(col)) {
						if (columns[col].dataset.col > 0) {
							var found = false;
							for (colors in Mastermind.colors) {
								if (columns[col].classList.contains('filled-' + Mastermind.colors[colors])) {
									found = true;
									colorsFound[columns[col].dataset.col - 1] = Mastermind.colors[colors];
								}
							}
							if (!found) {
								doneSuccess = false;
							}
						}
					}
				}
			}
		}
	}
	if (doneSuccess) {
		console.log(colorsFound);
		var redB = 0;
		var whiteB = 0;
		for (var cf in colorsFound) {
			if (colorsFound[cf] == Mastermind.cache.answer[cf]) {
				redB++;
			} else if (Mastermind.cache.answer.indexOf(colorsFound[cf]) > -1) {
				whiteB++;
			}
		}
		if (Mastermind.cache.answer.toString() === colorsFound.toString()) {
			Mastermind.cache.winGame = true;
		}
		for (var val in rowsS) {
			if (rowsS.hasOwnProperty(val)) {
				if (rowsS[val].dataset.rowsmall == Mastermind.cache.currentRow) {
					var checks = rowsS[val].querySelectorAll('[data-check]');
					for (var check in checks) {
						if (checks.hasOwnProperty(check)) {
							if (redB > 0) {
								if (!checks[check].classList.contains('filled-red')) {
									checks[check].classList.add('filled-red');
								}
								redB--;
							} else if (whiteB > 0) {
								if (!checks[check].classList.contains('filled-white')) {
									checks[check].classList.add('filled-white');
								}
								whiteB--;
							}
						}
					}
				}
			}
		}
		if (Mastermind.cache.winGame || Mastermind.cache.currentRow >= Mastermind.maxRows) {
			for (var val in rows) {
				if (rows.hasOwnProperty(val)) {
					if (rows[val].dataset.row > Mastermind.cache.currentRow) {
						if (!rows[val].classList.contains('transparent')) {
							rows[val].classList.add('transparent');
						}
					}
				}
			}
			for (var val in rowsS) {
				if (rowsS.hasOwnProperty(val)) {
					if (rowsS[val].dataset.rowsmall > Mastermind.cache.currentRow) {
						if (!rowsS[val].classList.contains('transparent')) {
							rowsS[val].classList.add('transparent');
						}
					}
				}
			}
			
			for (answer in Mastermind.cache.answer) {
				var elem = document.getElementById("answer_" + (parseInt(answer.toString()) + 1));
				elem.innerHTML = "";
				if (!elem.classList.contains('filled-' + Mastermind.cache.answer[answer])) {
					elem.classList.add('filled-' + Mastermind.cache.answer[answer]);
				}
				if (colorsFound[answer] == Mastermind.cache.answer[answer]) {
					elem.innerHTML = '<i class="fa fa-check fa-2x" aria-hidden="true"></i>';
				} else {
					elem.innerHTML = '<i class="fa fa-times fa-2x" aria-hidden="true"></i>';
				}
			}
			
			if (Mastermind.cache.winGame) {
				Mastermind.messageOverlay("open", "Je hebt het spel gewonnen!");
			} else {
				Mastermind.messageOverlay("open", "Je hebt het spel verloren.");
			}
		} else {
			Mastermind.cache.currentRow ++;
			for (var val in rows) {
				if (rows.hasOwnProperty(val)) {
					var columns = rows[val].querySelectorAll('[data-col]');
					if (rows[val].dataset.row == Mastermind.cache.currentRow) {
						for (var col in columns) {
							if (columns.hasOwnProperty(col)) {
								if (columns[col].dataset.col == 0) {
									columns[col].innerHTML = '<i class="fa fa-chevron-right fa-1x" aria-hidden="true"></i>';
									
								}
							}
						}
					} else {
						for (var col in columns) {
							if (columns.hasOwnProperty(col)) {
								if (columns[col].dataset.col == 0) {
									columns[col].innerHTML = '';
									
								}
							}
						}
					}
				}
			}
		}
	}
}

Mastermind.messageOverlay = function(transition, message) {
	var overlay 	= document.getElementById('message');
	var overlayBG 	= document.getElementById('messageBG');
	var msg 		= document.getElementById('message_msg');
	
	switch (transition) {
		case "open":
			overlay.style.display = "block";
			overlayBG.style.display = "block";
			msg.innerHTML = message;
			break;
		case "close":
		default:
			overlay.style.display = "none";
			overlayBG.style.display = "none";
			break;
	}
}

Mastermind.setup();