// DOM 
const numbers = document.querySelectorAll(".numbers");
const symbols = document.querySelectorAll(".symbols");
const results = document.querySelector(".results");
const clearButton = document.querySelector(".clear");
const backspace = document.querySelector(".backspace");

// Variables 
var numberMemoryOne = 0;
var numberMemoryTwo = 0;
var stateMem = 0;
var symbolFlag = 0;
var symbolCount = 0;
var symbolChosen = false;

//Keyboard Support
document.addEventListener('keydown', keyHandler);

//Clear Click Event
clearButton.addEventListener("click", function(event){
    clearDisplay();
});

// Backspace Click Event
backspace.addEventListener("click", function(event){
    backspaceDisplay();
});

// Number Click Events
numbers.forEach(function(number){
    number.addEventListener("click", function(event){
        numberHandler(null);
        // 1 dot limit
        if(event.target.innerText == "."){
            this.disabled = true;
        }
    });
});

// Operand Click Events
symbols.forEach(function(symbol){
    symbol.addEventListener("click", function(event){
        if(event.target.innerText == "="){
            operate();
            // Set the state to 1 so entering a new number behaves as a new calculation
            stateMem = 1;
        // Second operand calculates the first 2 numbers
        } else if(symbolCount == 1){
            operate();
            symbolHandler(null);
        } else{
            symbolHandler(null);
        }
        // Enable dot again
        numbers[10].disabled = false;
    });
});

// Clear Function
function clearDisplay(){
    symbolChosen = false;
    numbers[10].disabled = false;
    symbolFlag = 0;
    symbolCount = 0;
    numberMemoryOne = 0;
    numberMemoryTwo = 0;
    results.innerText = 0;
}

// Backspace Function
function backspaceDisplay(){
    // Symbol not chosen yet
    if(!symbolChosen){
        if(results.innerText != 0){
            // Type fix for slice function
            numberMemoryOne = String(numberMemoryOne).slice(0, -1);
            // Replace empty string with a 0
            if(numberMemoryOne == ""){
                numberMemoryOne = 0;
            }
            results.innerText = numberMemoryOne;
        }
    } else if(symbolChosen){
        // Check if the last character is a number or an operand
        var slicedMemory = results.innerText.slice(-1);
        if(isNaN(slicedMemory) && slicedMemory != "."){
            symbolChosen = false;
            symbolFlag = 0;
            symbolCount = 0;
            results.innerText = results.innerText.slice(0, -1);
        } else {
            if(numberMemoryTwo != null){
                numberMemoryTwo = numberMemoryTwo.slice(0, -1);
                results.innerText = results.innerText.slice(0, -1);
            }
        }
    }
}

// Number Function
function numberHandler(keyStore){
    // Check if input is from keyboard or mouse click
    var eventMemory;
    if(keyStore == null){
        eventMemory = event.target.innerText;        
    } else{
        eventMemory = keyStore;
    }
    // Symbol is not chosen
    if(!symbolChosen){
        if(results.innerText == "0" || stateMem == 1){
            //If first click is the dot, keep the 0
            if(eventMemory == "."){
                numberMemoryOne = "0" + eventMemory;
                results.innerText = numberMemoryOne;
            } else{
                numberMemoryOne = eventMemory;
                results.innerText = numberMemoryOne;
            }
            stateMem = 0;
        } else{
            numberMemoryOne = numberMemoryOne + eventMemory;
            results.innerText = results.innerText + eventMemory;
        }
    // Symbol is chosen
    } else if(symbolChosen){
        if(numberMemoryTwo == 0){
            numberMemoryTwo = eventMemory;
        } else{
            numberMemoryTwo = numberMemoryTwo + eventMemory;  
        }                       
        results.innerText = results.innerText + eventMemory;
    }
}

// Operand Function
function symbolHandler(keyStore){
    // Check if input is from keyboard or mouse click
    var eventMemory;
    if(keyStore == null){
        eventMemory = event.target.innerText;        
    } else{
        eventMemory = keyStore;
    }
    // Set Symbol flag according to user choice
    if(eventMemory == "+"){
        symbolFlag = 1;
        results.innerText = results.innerText + "+";
    } else if(eventMemory == "-"){
        symbolFlag = 2;
        results.innerText = results.innerText + "-";
    } else if(eventMemory == "*"){
        symbolFlag = 3;
        results.innerText = results.innerText + "*";
    } else if(eventMemory == "/"){
        symbolFlag = 4;
        results.innerText = results.innerText + "/";
    }
    symbolChosen = true;
    symbolCount++;
}

// Calculation Function
function operate(){
    if(symbolFlag == 1){
        numberMemoryOne = parseFloat(numberMemoryOne) + parseFloat(numberMemoryTwo);
    } else if(symbolFlag == 2){
        numberMemoryOne = parseFloat(numberMemoryOne) - parseFloat(numberMemoryTwo);
    } else if(symbolFlag == 3){
        numberMemoryOne = parseFloat(numberMemoryOne) * parseFloat(numberMemoryTwo);
    } else if(symbolFlag == 4){
        numberMemoryOne = parseFloat(numberMemoryOne) / parseFloat(numberMemoryTwo);
    }
    // Round the number so it will only have 2 decimals
    numberMemoryOne = Math.round((numberMemoryOne + Number.EPSILON) * 100) / 100;
    results.innerText = numberMemoryOne;
    numberMemoryTwo = 0;
    symbolCount = 0;
    symbolChosen = false;
}

// Keyboard support
function keyHandler(e){
    let key = e.key;
    //Allowed Keys
    const validkeys=["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "+", "-", "/", ".", "=", "Backspace"];
    if(validkeys.includes(key)){
        if(isNaN(key) && key != "."){
            if(key == "="){
                operate();
                // Set the state to 1 so entering a new number behaves as a new calculation
                stateMem = 1;
            } else if(key == "Backspace"){
                backspaceDisplay();
            // Second operand calculates the first 2 numbers
            } else if(symbolCount == 1){
                operate();
                symbolHandler(key);
            } else{
                symbolHandler(key);
            }
        } else {
            numberHandler(key);
        }
    }
};