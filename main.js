const prevOperandDisplay = document.querySelector('#prevOperand');
const currOperandDisplay = document.querySelector('#currOperand');
const numBtns = document.querySelectorAll('.num');
const operationBtns = document.querySelectorAll('.operation');
const deleteBtns = document.querySelectorAll('.delete');

let prevOperand = '';
let currOperation = '';
let currOperand = '';

// append a number to the current operand
function appendNum(num) {
	if(removeSeparator(currOperand).length >= 15) return;

	if(num === '.') {
		if(currOperand.includes('.')) return;

		if(currOperand === '') {
			currOperand = '0';
		}

		currOperand += '.';
	}else {
		currOperand = (+(removeSeparator(currOperand) + num)).toLocaleString();
	}
}

// set the operation
function setOperation(operation) {
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
		prevOperand = currOperand;
		currOperand = '';
		currOperation = operation;
	}
}

function compute() {
	let newOperand;

	switch(currOperation) {
		case '+':
			newOperand = +removeSeparator(prevOperand) + +removeSeparator(currOperand);
			break;

		case '-':
			newOperand = +removeSeparator(prevOperand) - +removeSeparator(currOperand);
			break;

		case '×':
			newOperand = +removeSeparator(prevOperand) * +removeSeparator(currOperand);
			break;

		case '÷':
			if(+currOperand === 0) return;
			newOperand = +removeSeparator(prevOperand) / +removeSeparator(currOperand);
			break;

		default:
			return;
	}

	currOperand = (+(newOperand.toFixed(2))).toLocaleString();
	prevOperand = '';
	currOperation = '';
}

// does all the delete functions
function deleteNum(deleteType) {
	// if current operand is empty, move prevOperand to currOperand and set current operation
	// and previous operand as empty
	if(currOperand === '') {
		currOperation = '';
		currOperand = prevOperand;
		prevOperand = '';
	}else {
		switch(deleteType) {
			// DEL removes the last number inputed from the current operand
			case 'DEL':
				if(currOperand[currOperand.length - 2] === '.') {
					currOperand = currOperand.slice(0, -1);
				}else {
					currOperand = (+(removeSeparator(currOperand).slice(0, -1))).toLocaleString();
				}
				if(currOperand === '0') currOperand = '';
				break;

				// CE resets all of the operands and the operation
			case 'CE':
				prevOperand = '';
				currOperation = '';
				currOperand = '';
				break;

				// C clears the current operand
			case 'C':
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
	currOperandDisplay.textContent = currOperand;
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
			setOperation(key);
			break;

		case '/':
			setOperation('÷');
			break;

		case '*':
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

function setEventListeners() {
	window.addEventListener('keydown', (e) => {
		// return if ctrl+shift+I for debugging purposes
		if(e.ctrlKey && e.shiftKey && e.key === 'I') return;
		e.preventDefault();
		handleKeyboard(e);
		updateDisplay();
	});

	for(const btn of numBtns) {
		btn.addEventListener('click', (e) => {
			appendNum(e.target.textContent);
			updateDisplay();
			setFocusToEqualsBtn();
		});
	}

	for(const btn of operationBtns) {
		btn.addEventListener('click', (e) => {
			setOperation(e.target.textContent);
			updateDisplay();
			setFocusToEqualsBtn();
		});
	}

	for(const btn of deleteBtns) {
		btn.addEventListener('click', (e) => {
			deleteNum(e.target.textContent);
			updateDisplay();
			setFocusToEqualsBtn();
		});
	}
}

setEventListeners();
