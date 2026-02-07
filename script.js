const display = document.getElementById("display");

function append(value) {
  display.value += value;
}
function clearAll() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}
