document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.btn');

    let currentInput = '';
    let result = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;

            if (button.classList.contains('number') || buttonText === '.') {
                currentInput += buttonText;
            } else if (button.classList.contains('operator')) {
                if (buttonText === '^2') {
                    currentInput += '**2';
                } else if (buttonText === '^3') {
                    currentInput += '**3';
                } else if (buttonText === '√') {
                    // Handle square root carefully: wrap the next number/expression in Math.sqrt()
                    // This is a simplified approach, a more robust solution might involve parsing
                    currentInput += 'Math.sqrt(';
                } else {
                    currentInput += buttonText;
                }
            } else if (button.classList.contains('clear')) {
                currentInput = '';
                result = '';
            } else if (button.classList.contains('delete')) {
                currentInput = currentInput.slice(0, -1);
            } else if (button.classList.contains('equals')) {
                try {
                    // Replace 'Math.sqrt(' with actual Math.sqrt() calls that close
                    // This is a quick fix for the simplified sqrt,
                    // a full parser would be more robust for nested sqrt
                    let expressionToEvaluate = currentInput.replace(/Math\.sqrt\(([^)]*)\)/g, (match, p1) => {
                        try {
                            return Math.sqrt(eval(p1));
                        } catch (e) {
                            throw new Error('Invalid sqrt expression');
                        }
                    });

                    // Handle expressions like 2**3, 5**2
                    // Use eval cautiously as it can be a security risk with untrusted input
                    result = eval(expressionToEvaluate);
                    currentInput = result.toString();
                } catch (e) {
                    result = 'Error';
                    currentInput = ''; // Clear input on error
                }
            }
            display.value = currentInput || result; // Show current input or result
        });
    });
});