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
	if(checkCharLimit(removeSeparator(currOperand) + removeSeparator(afterDecimal))) return;

	if(num === '.') {
		if(currOperand.includes('.')) return;

		if(currOperand === '') {
			currOperand = '0';
		}

		currOperand += '.';
	}else if(num === '0' && currOperand === '') {
		currOperand = '0';
	}else if(currOperand.includes('.')) {
		const noSeparator = removeSeparator(afterDecimal);

		if(noSeparator.length % 3 === 0 && noSeparator.length !== 0) afterDecimal += ',';
		afterDecimal += num;
	}else {
		currOperand = removeSeparator(currOperand) + num;
	}
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
	if(currOperand === '' && prevOperand === '') return;

	if(currOperand !== '' && prevOperand !== '') {
		// if current and previous operand arent empty, then compute and set operation
		compute();
	}

	if(prevOperand !== '' && currOperation !== '') {
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

	if(checkCharLimit(newOperand)) {
		alert('Numbers are too large, please try smaller numbers');
	}else {
		newOperand = newOperand.toFixed(2);

		currOperand = newOperand;
		afterDecimal = '';
		prevOperand = '';
		currOperation = '';
	}
}

// check if string is past character limit (for overflows)
function checkCharLimit(str) {
	return str.toString().length >= charLimit;
}

function removeLastChar(str) {
	return removeSeparator(str).slice(0, -1);
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
					afterDecimal = removeSeparator(removeLastChar(afterDecimal));
				}else {
					let operand = currOperand;

					operand = removeLastChar(currOperand);
					operand = removeSeparator(operand);

					currOperand = operand;
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
	if(prevOperand !== '') {
		prevOperandDisplay.textContent = `${(+prevOperand).toLocaleString()} ${currOperation}`;
	}

	if(currOperand.includes('.')) {
		currOperandDisplay.textContent = `${(+currOperand).toLocaleString()}.${afterDecimal}`;
	}else if(currOperand !== '') {
		currOperandDisplay.textContent = `${(+currOperand).toLocaleString()}${afterDecimal}`;
	}else {
		currOperandDisplay.textContent = '';
	}
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
