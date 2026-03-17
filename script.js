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
    // Use Function instead of direct eval to avoid scope leaks, but still eval math.
    const result = Function('"use strict"; return (' + expr + ')')();
    if (!isFinite(result) || isNaN(result)) {
      throw new Error('Math error');
    }
    return result;
  }

  // ---------- get numeric value with error handling for functions ----------
  function safeGetNumber() {
    return evaluateDisplay();  // may throw
  }

  // ---------- degree/rad conversion ----------
  function toRadians(x) {
    const mode = document.getElementById('mode').value;
    return mode === 'deg' ? x * Math.PI / 180 : x;
  }

  // ---------- trigonometric functions (each handles errors) ----------
  window.sinFn = function() {
    try {
      const v = safeGetNumber();
      display.value = Math.sin(toRadians(v)).toFixed(10).replace(/\.?0+$/, '');
    } catch {
      display.value = 'Error';
    }
  };

  window.cosFn = function() {
    try {
      const v = safeGetNumber();
      display.value = Math.cos(toRadians(v)).toFixed(10).replace(/\.?0+$/, '');
    } catch {
      display.value = 'Error';
    }
  };

  window.tanFn = function() {
    try {
      const v = safeGetNumber();
      const rad = toRadians(v);
      display.value = Math.tan(rad).toFixed(10).replace(/\.?0+$/, '');
    } catch {
      display.value = 'Error';
    }
  };

  // ---------- log / ln ----------
  window.logFn = function() {
    try {
      const v = safeGetNumber();
      if (v <= 0) throw new Error('log of non-positive');
      display.value = Math.log10(v);
    } catch {
      display.value = 'Error';
    }
  };

  window.lnFn = function() {
    try {
      const v = safeGetNumber();
      if (v <= 0) throw new Error('ln of non-positive');
      display.value = Math.log(v);
    } catch {
      display.value = 'Error';
    }
  };

  window.sqrtFn = function() {
    try {
      const v = safeGetNumber();
      if (v < 0) throw new Error('sqrt negative');
      display.value = Math.sqrt(v);
    } catch {
      display.value = 'Error';
    }
  };

  // ---------- power / square / abs / reciprocal ----------
  window.squareFn = function() {
    try {
      const v = safeGetNumber();
      display.value = v * v;
    } catch {
      display.value = 'Error';
    }
  };

  window.powerFn = function() {
    // just append '**' for exponentiation
    display.value += '**';
  };

  window.absFn = function() {
    try {
      const v = safeGetNumber();
      display.value = Math.abs(v);
    } catch {
      display.value = 'Error';
    }
  };

  window.reciprocalFn = function() {
    try {
      const v = safeGetNumber();
      if (v === 0) throw new Error('division by zero');
      display.value = 1 / v;
    } catch {
      display.value = 'Error';
    }
  };

  // ---------- constants ----------
  window.insertPi = function() {
    display.value += Math.PI;
  };

  window.insertE = function() {
    display.value += Math.E;
  };

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
    } else if (key === 'p' || key === 'P') {
      insertPi();
    } else if (key === 'e' || key === 'E') {
      insertE();
    }
  });
})();