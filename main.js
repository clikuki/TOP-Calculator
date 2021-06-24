const prevOperandDisplay = document.querySelector('#prevOperand');
const currOperandDisplay = document.querySelector('#currOperand');
const numBtns = document.querySelectorAll('.num');
const operationBtns = document.querySelectorAll('.operation');
const deleteBtns = document.querySelectorAll('.delete');

const charLimit = 15; // If the numbers are larger than this, then it will overflow

let prevOperand = '';
let currOperation = '';
let currOperand = '';
let afterDecimal = '';

// append a number to the current operand
function appendNum(num) {
	if((removeSeparator(currOperand) + removeSeparator(afterDecimal)).length >= charLimit) return;

	if(num === '.') {
		if(currOperand.includes('.')) return;

		if(currOperand === '') {
			currOperand = '0';
		}

		currOperand += '.';
	}else if(num === '0' && currOperand === '') {
		currOperand = '0';
	}else if(currOperand.includes('.')) {
		afterDecimal = (+(removeSeparator(afterDecimal) + num)).toLocaleString();
	}else {
		currOperand = (+(removeSeparator(currOperand) + num)).toLocaleString();
	}
}

// set the operation
function setOperation(operation) {
	// if current operand is empty and operation is -, then set as negative
	if(operation === '-' && (currOperand === '' || currOperand === '-')) {
		currOperand = '-';
		return;
	}

	// don't set operation if current and previous operand is empty
	if(currOperand === '' && prevOperand === '') return;

	if(currOperand !== '' && prevOperand !== '') {
		// if current and previous operand arent empty, then compute and set operation
		compute();
	}

	if(operation === '=') return;

	if(prevOperand !== ''
	&& currOperation !== '') {
		currOperation = operation;
	}else {
		prevOperand = currOperand + afterDecimal;
		afterDecimal = '';
		currOperand = '';
		currOperation = operation;
	}
}

function compute() {
	const a = +removeSeparator(prevOperand);
	const b = parseFloat(removeSeparator(currOperand) + removeSeparator(afterDecimal));

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
				return;
			}
			newOperand = a / b;
			break;

		default:
			return;
	}

	if(newOperand.toString().length >= charLimit) {
		alert('Numbers are too large, please try smaller numbers');
		return;
	}

	currOperand = (+(newOperand.toFixed(2))).toLocaleString();
	afterDecimal = '';
	prevOperand = '';
	currOperation = '';
}

// does all the delete functions
function deleteNum(deleteType) {
	// if current operand is empty, move prevOperand to currOperand and
	// set current operation and previous operand as empty
	if(currOperand === '') {
		currOperation = '';
		currOperand = prevOperand;
		prevOperand = '';
	}else {
		switch(deleteType) {
			// DEL removes the last number inputed from the current operand
			case 'DEL':
				if(afterDecimal !== '') {
					afterDecimal = (+(removeSeparator(afterDecimal).slice(0, -1))).toLocaleString();
				}else {
					currOperand = (+(removeSeparator(currOperand).slice(0, -1))).toLocaleString();
				}

				if(afterDecimal === '0') afterDecimal = '';
				if(currOperand === '0') currOperand = '';
				break;

				// CE resets all of the operands and the operation
			case 'CE':
				afterDecimal = '';
				prevOperand = '';
				currOperation = '';
				currOperand = '';
				break;

				// C clears the current operand
			case 'C':
				afterDecimal = '';
				currOperand = '';
				break;

			default:
				break;
		}
	}
}

// removes comma separators
function removeSeparator(str) {
	return str.replace(/,/g, '');
}

function updateDisplay() {
	prevOperandDisplay.textContent = `${prevOperand} ${currOperation}`;
	currOperandDisplay.textContent = `${currOperand}${afterDecimal}`;
}

// set focus to the last element of operationBtns, or the equals button
function setFocusToEqualsBtn() {
	operationBtns[operationBtns.length - 1].focus();
}

// Handle all keyboard input
function handleKeyboard(e) {
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
			if(prevOperand !== '' && currOperand !== '') {
				compute();
			}
			break;

		case '.':
			appendNum('.');
			break;

		case 'Backspace':
			if(e.ctrlKey) deleteNum('C');
			else deleteNum('DEL');
			break;

		case 'Enter':
			compute();
			break;

		default: // Check for num keys
			if(key.match(/[0-9]/)) appendNum(key);
			break;
	}

	// console.log(e);
}

function afterBtnPress() {
	updateDisplay();
	setFocusToEqualsBtn();
}

function setEventListeners() {
	window.addEventListener('keydown', (e) => {
		// return if ctrl+shift+I for debugging purposes
		if(e.ctrlKey && e.shiftKey && e.key === 'I') return;
		if(e.ctrlKey && e.key === 'r') return;
		e.preventDefault();
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
			setOperation(e.target.textContent);
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
