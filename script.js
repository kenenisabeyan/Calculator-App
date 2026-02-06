//code it now so prepare
* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background: #f4f6f8;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.calculator {
  background: white;
  padding: 20px;
  width: 340px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

#display {
  width: 100%;
  height: 50px;
  font-size: 22px;
  text-align: right;
  margin-bottom: 10px;
  padding: 6px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

button {
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
}

.equal {
  grid-column: span 2;
  background: #007bff;
  color: white;
}

.equal:hover {
  background: #0056b3;
}

.zero {
  grid-column: span 2;
}
