let display = document.getElementById("display")

function append(value){
display.value += value
}

function clearDisplay(){
display.value=""
}

function deleteLast(){
display.value = display.value.slice(0,-1)
}

function calculate(){
try{
display.value = eval(display.value)
}catch{
display.value="Error"
}
}

function sin(){
display.value = Math.sin(toRadians(getValue()))
}

function cos(){
display.value = Math.cos(toRadians(getValue()))
}

function tan(){
display.value = Math.tan(toRadians(getValue()))
}

function log(){
display.value = Math.log10(getValue())
}

function ln(){
display.value = Math.log(getValue())
}

function sqrt(){
display.value = Math.sqrt(getValue())
}

function square(){
let v=getValue()
display.value = v*v
}

function power(){
display.value += "**"
}

function abs(){
display.value = Math.abs(getValue())
}

function reciprocal(){
display.value = 1/getValue()
}

function insertPi(){
display.value += Math.PI
}

function insertE(){
display.value += Math.E
}

function getValue(){
return parseFloat(display.value)
}

function toRadians(deg){
return deg*Math.PI/180
}