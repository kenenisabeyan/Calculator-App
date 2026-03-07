// Get DOM elements
const display = document.getElementById('display');
const expressionHistory = document.getElementById('expression');

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
        if (currentValue !== '0' && currentValue !== '') {
            display.value = `(${currentValue})^2`;
        } else {
            display.value = '0^2';
        }
        updateExpression();
        return;
    }

    // Replace initial zero
    if (display.value === '0' && !isOperator(value) && value !== '.') {
        display.value = value;
    } else {
        // Prevent multiple operators in a row
        const lastChar = display.value.slice(-1);
        if (isOperator(lastChar) && isOperator(value)) {
            // Replace last operator with new one
            display.value = display.value.slice(0, -1) + value;
        } else {
            display.value += value;
        }
    }
    
    updateExpression();
}

// Check if character is an operator
function isOperator(char) {
    return ['+', '-', '*', '/', '%', '^'].includes(char);
}

// Clear all
function clearAll() {
    display.value = '0';
    expressionHistory.textContent = '';
    display.classList.remove('error');
}

// Delete last character
function deleteLast() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
    display.classList.remove('error');
    updateExpression();
}

// Update expression history
function updateExpression() {
    if (display.value !== '0' && display.value !== 'Error') {
        expressionHistory.textContent = display.value;
    } else {
        expressionHistory.textContent = '';
    }
}

// Calculate result
function calculate() {
    try {
        let expression = display.value;
        
        // Don't calculate empty or error expressions
        if (!expression || expression === '0' || expression === 'Error') {
            return;
        }

        // Store expression in history
        expressionHistory.textContent = expression + ' =';
        
        // Replace mathematical constants
        expression = expression.replace(/π/g, Math.PI.toString());
        expression = expression.replace(/e/g, Math.E.toString());
        
        // Handle power operator (xʸ)
        expression = expression.replace(/\^/g, '**');
        
        // Handle square (x²)
        expression = expression.replace(/²/g, '**2');
        
        // Handle percentage
        expression = expression.replace(/%/g, '/100');
        
        // Handle square root
        expression = expression.replace(/√\(/g, 'Math.sqrt(');
        
        // Handle trigonometric functions (input in degrees)
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        
        // Handle logarithmic functions
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        
        // Validate expression before evaluation
        if (!isValidExpression(expression)) {
            throw new Error('Invalid expression');
        }
        
        // Evaluate expression
        const result = evaluateExpression(expression);
        
        // Check for invalid results
        if (!isFinite(result) || isNaN(result)) {
            throw new Error('Invalid result');
        }
        
        // Format and display result
        display.value = formatResult(result);
        display.classList.remove('error');
        
    } catch (error) {
        handleError();
    }
}

// Validate expression for safety
function isValidExpression(expr) {
    // Check for dangerous patterns
    const dangerousPatterns = [
        /Math\.\w+\(\)/g,  // Empty function calls
        /[^0-9+\-*/()^.\s Math.sqrtloglnten]/g,  // Invalid characters
    ];
    
    for (let pattern of dangerousPatterns) {
        if (pattern.test(expr)) {
            return false;
        }
    }
    
    // Check for balanced parentheses
    let parentheses = 0;
    for (let char of expr) {
        if (char === '(') parentheses++;
        if (char === ')') parentheses--;
        if (parentheses < 0) return false;
    }
    
    return parentheses === 0;
}

// Safe evaluation using Function constructor
function evaluateExpression(expr) {
    // Convert to a safe expression
    const safeExpr = expr.replace(/Math\.(\w+)/g, 'Math.$1');
    const fn = new Function('return ' + safeExpr);
    return fn();
}

// Format result to avoid long decimals
function formatResult(result) {
    if (Number.isInteger(result)) {
        return result.toString();
    }
    // Limit to 8 decimal places for clean display
    return parseFloat(result.toFixed(8)).toString();
}

// Handle errors
function handleError() {
    display.value = 'Error';
    display.classList.add('error');
    expressionHistory.textContent = 'Invalid expression';
    
    // Clear error after 2 seconds
    setTimeout(() => {
        if (display.value === 'Error') {
            clearAll();
        }
    }, 2000);
}

// Keyboard support (optional enhancement)
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    // Prevent default for calculator keys
    if (isCalculatorKey(key)) {
        e.preventDefault();
    }
    
    // Numbers
    if (/[0-9.]/.test(key)) {
        append(key);
    }
    
    // Operators
    if (key === '+') append('+');
    if (key === '-') append('-');
    if (key === '*') append('*');
    if (key === '/') append('/');
    if (key === '%') append('%');
    if (key === '^') append('^');
    
    // Control keys
    if (key === 'Enter' || key === '=') calculate();
    if (key === 'Escape') clearAll();
    if (key === 'Backspace') deleteLast();
    
    // Constants (Ctrl+ key combinations)
    if (e.ctrlKey && key === 'p') append('π');
    if (e.ctrlKey && key === 'e') append('e');
});

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
        button.classList.add('pressed');
    });
    
    button.addEventListener('mouseup', () => {
        button.classList.remove('pressed');
    });
    
    button.addEventListener('mouseleave', () => {
        button.classList.remove('pressed');
    });
});

// Export functions for HTML onclick attributes
window.append = append;
window.clearAll = clearAll;
window.deleteLast = deleteLast;
window.calculate = calculate;