let display = document.getElementById("display");

// Append numbers
function appendNumber(number) {
  display.value += number;
}

// Append operators
function appendOperator(operator) {
  display.value += operator;
}

// Clear all
function clearDisplay() {
  display.value = "";
}

// Delete last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// Calculate result
function calculate() {
  try {
    display.value = Function("return " + display.value)();
  } catch {
    display.value = "Error";
  }
}

// Square
function square() {
  display.value = Math.pow(display.value, 2);
}

// Square root
function squareRoot() {
  display.value = Math.sqrt(display.value);
}

// Percentage
function calculatePercent() {
  display.value = display.value / 100;
}
