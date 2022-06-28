const operationSymbolToInsert = (currentDisplay, opSelected) => {
  let symbol = "+";
  let numToRemove = 0;
  if (currentDisplay.match(/[+*\-/]-/)) { // If negative is present
    if (opSelected === "-") { 
      symbol = "-";
      numToRemove = 2;
    } else { 
      symbol = opSelected;
      numToRemove = 2;
    }
  } else if (currentDisplay.match(/[+*-/]/) && opSelected === "-") { // Symbol present and pressing op === "-"
    symbol = currentDisplay + opSelected;
    numToRemove = 1;
  } else if (currentDisplay.match(/[+*-/]/)) { // Symbol present and pressing op !== "-"
    symbol = opSelected;
    numToRemove = 1;
  } else { // No symbols present
    symbol = opSelected;
    numToRemove = 0;
  }
  return {
    symbol: symbol,
    numToRemove: numToRemove
  }
}

const equationAfterOp = (equation, numSplice, opSelected) => {
  if (numSplice === 2) {
    equation = equation.slice(0, -2);
    equation += opSelected;
  } else if (numSplice === 1) {
    equation = equation.slice(0, -1);
    equation += opSelected;
  } else {
    equation += opSelected;
  }
  return equation;
}

const evaluateExpressionHelper = (firstNum, op, secondNum) => {
  let result = 0;
  let error = false;
  if (op === "+") {
    result = firstNum + secondNum;
  } else if (op === "-") {
    result = firstNum - secondNum;
  } else if (op === "*") {
    result = firstNum * secondNum;
  } else { // op === "/"
    if (secondNum !== 0) {
      result = firstNum / secondNum;
    } else {
      error = true;
    }
  }
  return {
    num: result,
    error: error
  }
}

const evaluateExpression = (expression) => {
  let numbers = expression.match(/((?<!\d)[-]?[\d]+[.]?[\d]*)/g);
  let operations = expression.match(/(?<=[\d.])[+\-*/]/g);
  console.log(numbers);
  console.log(operations);
  let lastOperation = [""];
  if (operations !== null && operations.length > 0) {
    lastOperation[0] = operations[operations.length - 1] + numbers[numbers.length - 1];
  }
  numbers = numbers.map((num) => parseFloat(num));
  
  while (operations !== null && operations.length > 0) {
    if (operations.indexOf("*") !== -1) { // Multiplication
      let index = operations.indexOf("*");
      numbers[index] = evaluateExpressionHelper(numbers[index], operations[index], numbers[index + 1]).num;
      numbers.splice(index + 1, 1);
      operations.splice(index, 1);
    } else if (operations.indexOf("/") !== -1) { // Division
      let index = operations.indexOf("/");
      let tempObj = evaluateExpressionHelper(numbers[index], operations[index], numbers[index + 1]);
      numbers[index] = tempObj.num;
      if (tempObj.error) { // SPECIAL CASE: divide by 0
        return {
          error: true,
          display: ["ERROR"],
          lastOperation: ["ERROR"]
        }
      } else {
        numbers.splice(index + 1, 1);
        operations.splice(index, 1);
      }
    } else if (operations.indexOf("+") !== -1) { // Addition
      let index = operations.indexOf("+");
      numbers[index] = evaluateExpressionHelper(numbers[index], operations[index], numbers[index + 1]).num;
      numbers.splice(index + 1, 1);
      operations.splice(index, 1);
    } else if (operations.indexOf("-") !== -1) { // Subtraction
      let index = operations.indexOf("-");
      numbers[index] = evaluateExpressionHelper(numbers[index], operations[index], numbers[index + 1]).num;
      numbers.splice(index + 1, 1);
      operations.splice(index, 1);
    }
  }
  return {
    error: false,
    display: numbers[0],
    lastOperation: lastOperation
  };
}

const defaultState = {
  equation: "", // Displayed Equation
  decimalIncluded: false, // keeps track of decimal on current number
  selectingOperation: true, // keep track of whether we are currently selecting operation or number
  currentDisplay: "", // current display below the equation
  firstNeg: true, // special case needed when using first negative
  validEQ: false, // Gets rid of bugs with eq when not having any numbers written yet
  errorLock: false, // Locks the program until user presses AC
  lastOp: [""], // keeps track of the last operation && number used
  repeatLastOp: false // if we should repeat last op when pressing eq
}

const numReducer = (state = defaultState, action) => {
  let equation = state.equation; 
  let decimalIncluded = state.decimalIncluded; 
  let selectingOperation = state.selectingOperation; 
  let currentDisplay = state.currentDisplay; 
  let firstNeg = state.firstNeg;
  let validEQ = state.validEQ;
  let errorLock = state.errorLock;
  let lastOp = state.lastOp;
  let repeatLastOp = state.repeatLastOp;
  if (errorLock) {
    if (action.payload === "AC") return defaultState;
  } else {
    switch (action.type) {
      case 'NUMPRESS':
        validEQ = true;
        repeatLastOp = false;
        if (equation.indexOf("=") !== -1) {
          equation = "";
        }
        if (selectingOperation === true) { // This updates the current display
          selectingOperation = false;
          currentDisplay = "";
        }
        firstNeg = false;
        if (action.payload === ".") {
          if (!decimalIncluded) {
            if (currentDisplay === "") {
              equation += "0.";
              currentDisplay += "0.";
            } else {
              equation += ".";
              currentDisplay += ".";
            }
            decimalIncluded = true;
          }
        } else {
          if (action.payload === "0") {
            if (currentDisplay !== "0") {
              equation += "0";
              currentDisplay += "0";
            }
          } else {
            equation += action.payload;
            currentDisplay += action.payload;
          }
        }
        break;
      case 'OPPRESS':
        decimalIncluded = false;
        if (equation.indexOf("=") !== -1) {
          equation = currentDisplay;
        } else if (!selectingOperation) { // This updates the current display
          selectingOperation = true;
          currentDisplay = "";
        }
        if (firstNeg) { // Unique instructions for the first operation symbol (can only be negative sign)
          selectingOperation = true;
          if (action.payload === "AC") return defaultState;
          if (action.payload === "-") {
            if (currentDisplay === "-") {
              equation = "";
              currentDisplay = "";
            } else {
              equation = "-";
              currentDisplay = "-";
            }
          }
        } else { // Any operation symbol after the first
          if (action.payload === "AC") return defaultState;
          else if (action.payload === "eq" && repeatLastOp) {
            equation += lastOp;
            const evaluatedEquation = evaluateExpression(equation);
            currentDisplay = evaluatedEquation.display.toString();
            equation += " = " + evaluatedEquation.display.toString();
          }
          else if (action.payload === "eq" && validEQ) {
            const evaluatedEquation = evaluateExpression(equation);
            currentDisplay = evaluatedEquation.display.toString();
            equation += " = " + evaluatedEquation.display.toString();
            lastOp = evaluatedEquation.lastOperation;
            if (evaluatedEquation.display.toString() === "ERROR") errorLock = true;
            repeatLastOp = true;
          } else if (action.payload === "-" || action.payload === "+" || action.payload === "*" || action.payload === "/") {
            repeatLastOp = false;
            validEQ = false;
            let opData = operationSymbolToInsert(currentDisplay, action.payload);
            equation = equationAfterOp(equation, opData.numToRemove, opData.symbol);
            currentDisplay = opData.symbol;
          }
        }
        break;
      default:
        break;
    }
    return {
      equation: equation,
      decimalIncluded: decimalIncluded,
      selectingOperation: selectingOperation,
      currentDisplay: currentDisplay,
      firstNeg: firstNeg,
      validEQ: validEQ,
      errorLock: errorLock,
      lastOp: lastOp,
      repeatLastOp: repeatLastOp
    }
  }
}

export default numReducer;