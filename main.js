const prevOperandDisplay = document.querySelector('#prevOperand');
const currOperandDisplay = document.querySelector('#currOperand');
const numBtns = document.querySelectorAll('.num');
const operationBtns = document.querySelectorAll('.operation');
const deleteBtns = document.querySelectorAll('.delete');

let prevOperand = '';
let operation = '';
let currOperand = '';

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

function setOperation(str) {
	if(currOperand === '') return;

	if(str === '=') {
		compute();

		setOperation(str);
	}else if(currOperand !== '' && prevOperand !== '') {
		compute();
		setOperation(str);
	}else if(prevOperand === '') {
		prevOperand = currOperand;
		currOperand = '';
		operation = str;
	}
}

function compute() {
	if(+currOperand === 0) return;

	switch(operation) {
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
			currOperand = +((+prevOperand / +currOperand).toFixed(2)).toString();
			break;

		default:
			break;
	}

	prevOperand = '';
	operation = '';
}

function deleteNum(deleteType) {
	switch(deleteType) {
		case 'DEL':
			currOperand = currOperand.slice(0, -1);
			break;

		case 'CE':
			prevOperand = '';
			operation = '';
			currOperand = '';
			break;

		case 'C':
			currOperand = '';
			break;

		default:
			break;
	}
}

function updateDisplay() {
	prevOperandDisplay.textContent = `${prevOperand} ${operation}`;
	currOperandDisplay.textContent = currOperand;
}

for(const numBtn of numBtns) {
	numBtn.addEventListener('click', (e) => {
		appendNum(e.target.textContent);
		updateDisplay();
	});
}

for(const operationBtn of operationBtns) {
	operationBtn.addEventListener('click', (e) => {
		setOperation(e.target.textContent);
		updateDisplay();
	});
}

for(const deleteBtn of deleteBtns) {
	deleteBtn.addEventListener('click', (e) => {
		deleteNum(e.target.textContent);
		updateDisplay();
	});
}
