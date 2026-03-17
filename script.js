(function() {
  const display = document.getElementById('display');

  // ---------- basic display manipulation ----------
  window.append = function(val) {
    display.value += val;
  };

  window.clearDisplay = function() {
    display.value = '';
  };

  window.deleteLast = function() {
    display.value = display.value.slice(0, -1);
  };

  // ---------- safe evaluation (throws on error) ----------
  function evaluateDisplay() {
    let expr = display.value.trim();
    if (expr === '') return 0;
    // Use Function to evaluate the mathematical expression
    const result = Function('"use strict"; return (' + expr + ')')();
    if (!isFinite(result) || isNaN(result)) {
      throw new Error('Math error');
    }
    return result;
  }

  // ---------- calculate (equals) ----------
  window.calculate = function() {
    try {
      const result = evaluateDisplay();
      display.value = result;
    } catch {
      display.value = 'Error';
    }
  };

  // ---------- keyboard support ----------
  document.addEventListener('keydown', function(e) {
    const key = e.key;
    if (key >= '0' && key <= '9') append(key);
    else if (key === '.') append('.');
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
      if (key === '*') append('*');
      else if (key === '/') append('/');
      else append(key);
    } else if (key === '(' || key === ')') append(key);
    else if (key === '%') append('%');
    else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      calculate();
    } else if (key === 'Backspace') {
      e.preventDefault();
      deleteLast();
    } else if (key === 'Escape') {
      clearDisplay();
    }
  });
})();