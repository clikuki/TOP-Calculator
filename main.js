const prevOperandDisplay = document.querySelector('#prevOperand');
const currOperandDisplay = document.querySelector('#currOperand');
const numBtns = document.querySelectorAll('.num');
const operationBtns = document.querySelectorAll('.operation');
const deleteBtns = document.querySelectorAll('.delete');

const charLimit = 15; // If the numbers are larger than this, then it will overflow

let hasDecimal = false;
let prevOperand = '';
let currOperation = '';
let currOperand = '';
let afterDecimal = '';

// append a number to the current operand
function appendNum(num) {
	if(checkCharLimit(currOperand + afterDecimal)) return;

	switch(true) {
		case num === '.':
			if(currOperand === '') currOperand = '0';

			hasDecimal = true;
			break;

		case num === '0' && currOperand === '':
			currOperand = '0';
			break;

		case hasDecimal:
			afterDecimal += num;
			break;

		default:
			currOperand += num;
			break;
	}
}

// add commas every 3 characters(for decimals)
function commaEvery3Chars(str) {
	const strArray = str.split('');

	for(let i = 0; i < strArray.length; i++) {
		if(i % 3 === 0 && i !== 0) {
			// commaIndices.unshift(i);
			strArray[i - 1] += ',';
		}
	}

	return strArray.join('');
}

// if operation is =, then do compute instead of setOperation
function checkOperationType(operation) {
	if(operation === '=') {
		compute();
	}else {
		setOperation(operation);
	}
}

// set the operation
function setOperation(operation) {
	// if current operand is empty or - and operation is -, then set as negative
	if(operation === '-' && (currOperand === '' || currOperand === '-')) {
		currOperand = '-';
		return;
	}

	// don't set operation if current and previous operand is empty
	if(currOperand === '' && afterDecimal === ''
	&& prevOperand === '' && !hasDecimal) return;

	if(currOperand !== '' && prevOperand !== '') {
		// if current and previous operand arent empty, then compute and set operation
		compute();
	}

	if(prevOperand !== '' && currOperation !== '') {
		currOperation = operation;
	}else {
		prevOperand = currOperand;

		if(hasDecimal) {
			hasDecimal = false;
			prevOperand += `.${afterDecimal}`;
			afterDecimal = '';
		}

		currOperand = '';
		currOperation = operation;
	}
}

function compute() {
	const a = +prevOperand;
	const b = parseFloat(currOperand + afterDecimal);

	let newOperand;

	switch(currOperation) {
		case '+':
			newOperand = a + b;
			break;

		case '-':
			newOperand = a - b;
			break;

		case '×':
			newOperand = a * b;
			break;

		case '÷':
			if(b === 0) {
				alert('No dividing by 0!');
			}else {
				newOperand = a / b;
			}
			break;

		default:
			return;
	}

	newOperand = newOperand.toFixed(3);

	if(checkCharLimit(newOperand)) {
		alert('Numbers are too large, please try smaller numbers');
	}else {
		if(newOperand.includes('.')) {
			hasDecimal = true;
			[currOperand, afterDecimal] = newOperand.split('.');
		}else {
			currOperand = newOperand;
			afterDecimal = '';
		}

		prevOperand = '';
		currOperation = '';
	}
}

// check if string is past character limit (for overflows)
function checkCharLimit(str) {
	return str.toString().length >= charLimit;
}

function removeLastChar(str) {
	return str.slice(0, -1);
}

// does all the delete functions
function deleteNum(deleteType) {
	// if current operand is empty, move prevOperand to currOperand and
	// set current operation and previous operand as empty
	if(currOperand === ''
	&& afterDecimal === ''
	&& !hasDecimal) {
		currOperation = '';
		if(prevOperand.includes('.')) {
			hasDecimal = true;
			[currOperand, afterDecimal] = prevOperand.split('.');
		}else {
			currOperand = prevOperand;
		}
		prevOperand = '';
	}else {
		switch(deleteType) {
			case 'DEL': // DEL removes the last number inputed from the current operand
				switch(true) {
					// if the second lsat character is a comma, then remove last char twice
					case afterDecimal[afterDecimal.length - 2] === ',':
						afterDecimal = removeLastChar(afterDecimal);
						// fallthrough!

					case afterDecimal !== '':
						afterDecimal = removeLastChar(afterDecimal);
						break;

					case hasDecimal:
						hasDecimal = false;
						break;

					case afterDecimal === '0':
						afterDecimal = '';
						break;

					case currOperand === '0':
						currOperand = '';
						break;

					default:
						currOperand = removeLastChar(currOperand);
						break;
				}
				break;

			case 'CE': // CE resets all of the operands and the operation
				prevOperand = '';
				currOperation = '';
				// fallthrough!

			case 'C': // C clears the current operand
				hasDecimal = false;
				afterDecimal = '';
				currOperand = '';
				break;

			default:
				break;
		}
	}
}

function updateDisplay() {
	let prevOperandDisplayText = `${(+prevOperand).toLocaleString()} ${currOperation}`;
	let currOperandDisplayText = `${(+currOperand).toLocaleString()}`;

	// modift prevOperandDisplayText if true;
	switch(true) {
		case prevOperand === '':
			prevOperandDisplayText = '';
			break;

		case prevOperand.includes('.'): {
			let [wholeNumber, decimal] = prevOperand.split('.');

			decimal = commaEvery3Chars(decimal);

			prevOperandDisplayText = `${wholeNumber}.${decimal} ${currOperation}`; }
			break;

		default:
			break;
	}

	// modify currOperandDisplayText if true
	switch(true) {
		case hasDecimal:
			currOperandDisplayText += '.';
			// fallthrough!

		case afterDecimal !== '':
			currOperandDisplayText += `${commaEvery3Chars(afterDecimal)}`;
			break;

		case currOperandDisplayText === '0' && currOperand !== '0':
			currOperandDisplayText = '';
			break;

		case currOperand === '-':
			currOperandDisplayText = '-';
			break;

		default:
			break;
	}

	prevOperandDisplay.textContent = prevOperandDisplayText;
	currOperandDisplay.textContent = currOperandDisplayText;
}

// set focus to the last element of operationBtns, or the equals button
function setFocusToEqualsBtn() {
	operationBtns[operationBtns.length - 1].focus();
}

// Handle all keyboard input
function handleKeyboard(e) {
	// return if ctrl+shift+I for debugging purposes
	if(e.ctrlKey && e.shiftKey && e.key === 'I') return;

	// Allow for user to reload with ctrl + r
	if(e.ctrlKey && e.key === 'r') return;

	// prevent default key event
	e.preventDefault();

	const key = e.key;

	switch(key) {
		case '+':
		case '-':
			if(e.ctrlKey) {
				currOperand = `-${currOperand}`;
			}else {
				setOperation(key);
			}
			break;

		case '/':
			setOperation('÷');
			break;

		case '*':
		case 'x':
			setOperation('×');
			break;

		case '=':
			if(prevOperand !== ''
			&& currOperand !== '') compute();
			break;

		case '.':
			appendNum('.');
			break;

		case 'Backspace': {
			let delString = 'DEL';
			if(e.ctrlKey) delString = 'C';

			deleteNum(delString); }
			break;

		case 'Enter':
			compute();
			break;

		default:
			break;
	}

	// Check for num keys
	if(key.match(/[0-9]/)) {
		appendNum(key);
	}
}

function afterBtnPress() {
	updateDisplay();
	setFocusToEqualsBtn();
}

function setEventListeners() {
	window.addEventListener('keydown', (e) => {
		handleKeyboard(e);
		afterBtnPress();
	});

	for(const btn of numBtns) {
		btn.addEventListener('click', (e) => {
			appendNum(e.target.textContent);
			afterBtnPress();
		});
	}

	for(const btn of operationBtns) {
		btn.addEventListener('click', (e) => {
			checkOperationType(e.target.textContent);
			afterBtnPress();
		});
	}

	for(const btn of deleteBtns) {
		btn.addEventListener('click', (e) => {
			deleteNum(e.target.textContent);
			afterBtnPress();
		});
	}
}

setEventListeners();
