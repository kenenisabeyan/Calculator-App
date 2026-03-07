// Get display element
const display = document.getElementById('display');
const historyDiv = document.getElementById('history');
let lastResult = null;

// Add keyboard support
document.addEventListener('keydown', handleKeyboardInput);

// Initialize display
display.value = '0';

// Function to append value to display
function append(value) {
    // Handle special cases
    if (value === 'π') {
        value = Math.PI.toString();
    } else if (value === 'e') {
        value = Math.E.toString();
    } else if (value === '²') {
        // Handle square
        const currentValue = display.value;
        if (currentValue && currentValue !== '0') {
            display.value = `(${currentValue})^2`;
        } else {
            display.value = '0^2';
        }
        return;
    } else if (value === '^') {
        display.value += '^';
        return;
    } else if (value === '√(') {
        display.value += 'sqrt(';
        return;
    }

    // Replace initial 0 with new value
    if (display.value === '0' && !isOperator(value) && value !== '.') {
        display.value = value;
    } else {
        // Check for multiple operators
        const lastChar = display.value.slice(-1);
        if (isOperator(lastChar) && isOperator(value)) {
            // Replace last operator
            display.value = display.value.slice(0, -1) + value;
        } else {
            display.value += value;
        }
    }
    
    // Update history
    updateHistory();
}

// Function to check if character is operator
function isOperator(char) {
    return ['+', '-', '*', '/', '%', '^'].includes(char);
}

// Function to clear all
function clearAll() {
    display.value = '0';
    historyDiv.textContent = '';
    lastResult = null;
    display.classList.remove('error');
}

// Function to delete last character
function deleteLast() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
    display.classList.remove('error');
    updateHistory();
}

// Function to calculate result
function calculate() {
    try {
        let expression = display.value;
        
        // Don't calculate empty expression
        if (!expression || expression === '0') return;
        
        // Store expression in history
        historyDiv.textContent = expression + ' =';
        
        // Replace mathematical constants
        expression = expression.replace(/π/g, Math.PI.toString());
        expression = expression.replace(/e/g, Math.E.toString());
        
        // Handle power operator (^)
        expression = expression.replace(/\^/g, '**');
        
        // Handle square notation
        expression = expression.replace(/²/g, '**2');
        
        // Handle percentage
        expression = expression.replace(/%/g, '/100');
        
        // Handle square root
        expression = expression.replace(/√\(/g, 'Math.sqrt(');
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
        
        // Handle trigonometric functions (convert degrees to radians)
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        
        // Handle logarithmic functions
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        
        // Evaluate the expression safely
        const result = evaluateExpression(expression);
        
        // Check if result is valid
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Format result
        const formattedResult = formatResult(result);
        display.value = formattedResult;
        lastResult = formattedResult;
        display.classList.remove('error');
        
    } catch (error) {
        handleError(error.message);
    }
}

// Safe evaluation function
function evaluateExpression(expr) {
    // Remove any unsafe characters
    if (!isSafeExpression(expr)) {
        throw new Error('Invalid expression');
    }
    
    // Use Function constructor for safe evaluation
    const fn = new Function('return ' + expr);
    return fn();
}

// Check if expression is safe
function isSafeExpression(expr) {
    const unsafePattern = /[^0-9+\-*/().% Math\s]|Math\.\w+\(\)/g;
    return !unsafePattern.test(expr.replace(/Math\.\w+/g, ''));
}

// Format result to avoid long decimals
function formatResult(result) {
    if (Number.isInteger(result)) {
        return result.toString();
    }
    // Limit to 10 decimal places
    return parseFloat(result.toFixed(10)).toString();
}

// Handle calculation errors
function handleError(message) {
    display.value = 'Error';
    display.classList.add('error');
    historyDiv.textContent = 'Invalid expression';
    
    // Clear error after 2 seconds
    setTimeout(() => {
        if (display.value === 'Error') {
            clearAll();
        }
    }, 2000);
}

// Update history display
function updateHistory() {
    if (display.value !== '0' && display.value !== 'Error') {
        historyDiv.textContent = display.value;
    } else {
        historyDiv.textContent = '';
    }
}

// Handle keyboard input
function handleKeyboardInput(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if (isCalculatorKey(key)) {
        event.preventDefault();
    }
    
    // Number keys
    if (/[0-9.]/.test(key)) {
        append(key);
    }
    
    // Operator keys
    if (key === '+') append('+');
    if (key === '-') append('-');
    if (key === '*') append('*');
    if (key === '/') append('/');
    if (key === '%') append('%');
    if (key === '^' || key === '**') append('^');
    
    // Function keys
    if (key === 'Enter' || key === '=') calculate();
    if (key === 'Escape') clearAll();
    if (key === 'Backspace') deleteLast();
    
    // Scientific functions (with modifier keys)
    if (event.ctrlKey && key === 's') append('sin(');
    if (event.ctrlKey && key === 'c') append('cos(');
    if (event.ctrlKey && key === 't') append('tan(');
    if (event.ctrlKey && key === 'l') append('log(');
    if (event.ctrlKey && key === 'n') append('ln(');
    if (event.ctrlKey && key === 'r') append('√(');
    
    // Constants
    if (key === 'p' && event.ctrlKey) append('π');
    if (key === 'e' && event.ctrlKey) append('e');
}

// Check if key is calculator key
function isCalculatorKey(key) {
    const calculatorKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.',
        '+', '-', '*', '/', '%', '^', '=', 'Enter', 'Escape', 'Backspace'
    ];
    return calculatorKeys.includes(key);
}

// Add button press animation
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.classList.add('press');
    });
    
    button.addEventListener('mouseup', () => {
        button.classList.remove('press');
    });
    
    button.addEventListener('mouseleave', () => {
        button.classList.remove('press');
    });
});

// Scientific mode toggle (optional feature)
let isScientificMode = true;

function toggleScientificMode() {
    isScientificMode = !isScientificMode;
    const scientificButtons = document.querySelectorAll('.scientific');
    const modeIndicator = document.querySelector('.mode-indicator');
    
    scientificButtons.forEach(btn => {
        btn.style.display = isScientificMode ? 'block' : 'none';
    });
    
    modeIndicator.textContent = isScientificMode ? 'Scientific' : 'Standard';
}

// Initialize tooltips for scientific functions
function initializeTooltips() {
    const scientificButtons = document.querySelectorAll('.scientific');
    scientificButtons.forEach(btn => {
        btn.setAttribute('title', `Scientific function: ${btn.textContent}`);
    });
}

// Call initialization
initializeTooltips();

// Export functions for HTML onclick attributes
window.append = append;
window.clearAll = clearAll;
window.deleteLast = deleteLast;
window.calculate = calculate;