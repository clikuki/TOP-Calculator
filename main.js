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
	if(num === '.') {
		if(currOperand.includes('.')) return;

		if(currOperand === '') {
			currOperand = '0';
		}

		currOperand += '.';
	}else {
		currOperand = (+(currOperand + num)).toString();
	}
}

// set the operation
function setOperation(operation) {
	// don't set operation if current operand is empty
	if(currOperand === '') return;

	if(currOperand !== ''
	&& prevOperand !== '') {
		// if current and previous operand arent empty, then compute and set operation
		compute();
	}

	if(operation === '=') return;

	// else, move the current operand to previous operand and set operation
	prevOperand = currOperand;
	currOperand = '';
	currOperation = operation;
}

function compute() {
	switch(currOperation) {
		case '+':
			currOperand = +prevOperand + +currOperand;
			break;

		case '-':
			currOperand = +prevOperand - +currOperand;
			break;

		case '×':
			currOperand = +prevOperand * +currOperand;
			break;

		case '÷':
			if(+currOperand === 0) return;
			currOperand = +((+prevOperand / +currOperand).toFixed(2)).toString();
			break;

		default:
			break;
	}

	prevOperand = '';
	currOperation = '';
}

// does all the delete functions
function deleteNum(deleteType) {
	switch(deleteType) {
		// DEL removes the last number inputed from the current operand
		case 'DEL':
			currOperand = currOperand.slice(0, -1);
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

function updateDisplay() {
	prevOperandDisplay.textContent = `${prevOperand} ${currOperation}`;
	currOperandDisplay.textContent = currOperand;
}

function setEventListeners() {
	for(const btn of numBtns) {
		btn.addEventListener('click', (e) => {
			appendNum(e.target.textContent);
			updateDisplay();
		});
	}

	for(const btn of operationBtns) {
		btn.addEventListener('click', (e) => {
			setOperation(e.target.textContent);
			updateDisplay();
		});
	}

	for(const btn of deleteBtns) {
		btn.addEventListener('click', (e) => {
			deleteNum(e.target.textContent);
			updateDisplay();
		});
	}
}

setEventListeners();
