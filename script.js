const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentValue = "";

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "C") {
      currentValue = "";
      display.value = "";
    } 
    else if (value === "=") {
      display.value = eval(currentValue);
      currentValue = display.value;
    } 
    else {
      currentValue += value;
      display.value = currentValue;
    }
  });
});
