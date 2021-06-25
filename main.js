const prevOperandDisplay = document.querySelector('#prevOperand');
const currOperandDisplay = document.querySelector('#currOperand');
const numBtns = document.querySelectorAll('.num');
const operationBtns = document.querySelectorAll('.operation');
const deleteBtns = document.querySelectorAll('.delete');

const charLimit = 15; // If the numbers are larger than this, then it will overflow

let hasDecimal = false;
let prevOperand = '';
let currOperation = '';
// whole number part of current operand
let currOperand = '';
// decimal part of current operand
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
		// if index is divisible by 3 and is not 0, then
		// go to the element on index down and add a comma
		if(i % 3 === 0 && i !== 0) {
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
	const b = +`${currOperand}.${afterDecimal}`;

	// variable to hold answer
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

	newOperand = (+(newOperand.toFixed(3))).toString();

	if(checkCharLimit(newOperand)) {
		alert('Numbers are too large, please try smaller numbers');
	}else {
		if(newOperand.includes('.')) {
			hasDecimal = true;
			[currOperand, afterDecimal] = newOperand.split('.');
		}else {
			hasDecimal = false;
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

function removeLastChars(str) {
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
					case afterDecimal !== '':
						afterDecimal = removeLastChars(afterDecimal);
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
						currOperand = removeLastChars(currOperand);
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

	// modify prevOperandDisplayText if true;
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

		case 'Enter':
		case '=':
			if(prevOperand !== ''
			&& currOperand !== '') compute();
			break;

		case 'Backspace': {
			// default - Delete
			let delString = 'DEL';

			// if ctrl is down, then set as C / Clear
			if(e.ctrlKey) {
				delString = 'C';

				// If shift is also pressed, then add E to set as CE / Clear entries
				if(e.ctrlKey && e.shiftKey) {
					delString += 'E';
				}
			}

			deleteNum(delString); }
			break;

		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
		case '.':
			appendNum(key);
			break;

		default:
			break;
	}
}

// do after pressing key or button
function afterBtnPress() {
	updateDisplay();
	setFocusToEqualsBtn();
}

// sets the required event listeners
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
