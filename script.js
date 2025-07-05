const calculator = document.querySelector('.calculator');
const calculatorScreen = document.querySelector('.calculator-screen');
const keys = calculator.querySelector('.calculator-keys');

let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    calculatorScreen.value = displayValue;
}

function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

function inputDecimal(dot) {
    if (waitingForSecondOperand === true) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        return;
    }
    if (!displayValue.includes(dot)) {
        displayValue += dot;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        displayValue = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    // เพิ่มฟังก์ชันยกกำลัง 2
    '^2': (operand) => {
        const result = operand * operand;
        displayValue = String(result);
        firstOperand = result;
        return result;
    },
    // เพิ่มฟังก์ชันยกกำลัง 3
    '^3': (operand) => {
        const result = operand * operand * operand;
        displayValue = String(result);
        firstOperand = result;
        return result;
    },
    // เพิ่มฟังก์ชันรากที่สอง (square root)
    'sqrt': (operand) => {
        if (operand < 0) {
            return 'Error'; // ไม่สามารถหารากที่สองของจำนวนลบได้
        }
        const result = Math.sqrt(operand);
        displayValue = String(result);
        firstOperand = result;
        return result;
    },
    '=': (firstOperand, secondOperand) => secondOperand // สำหรับการกดเท่ากับครั้งแรกหลังจากการคำนวณ
};

function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        // ตรวจสอบว่าเป็นปุ่มยกกำลัง 2, ยกกำลัง 3 หรือรากที่สอง
        if (target.value === '^2' || target.value === '^3' || target.value === 'sqrt') {
            const inputValue = parseFloat(displayValue);
            if (!isNaN(inputValue)) {
                performCalculation[target.value](inputValue);
                operator = null; // รีเซ็ต operator หลังจากการคำนวณแบบ Unary
                waitingForSecondOperand = true; // ตั้งค่าให้พร้อมรับตัวเลขใหม่
            }
        } else {
            handleOperator(target.value);
        }
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        return;
    }

    inputDigit(target.value);
});

updateDisplay();