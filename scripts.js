//--------------------
// MODEL
//--------------------

const state = {
  previousNumber: 0,
  operator: "",
  currentNumber: 0,
  result: 0,
  isOperationActive: false,
  isResultActive: false,
  isFloatingNumber: false,
  isFirstDigit: true,
  isCalculatorBroken: false,
  isClearButtonClicked: false,
  isMaxNumberLength: false,
};

const controlNumberLength = (number) => {
  if (number.split("").length >= 8) state.isMaxNumberLength = true;
  else state.isMaxNumberLength = false;
};

const savePreviousNumber = (number) => {
  state.previousNumber = parseFloat(number);
};

const saveOperator = (operator) => {
  state.operator = operator;
  state.isOperationActive = true;
  state.isResultActive = false;
  state.isFloatingNumber = false;
  state.isFirstDigit = true;
};

const saveCurrentNumber = (number) =>
  (state.currentNumber = parseFloat(number));

const calculateResult = () => {
  if (state.isCalculatorBroken) return;

  switch (state.operator) {
    case "+":
      state.result = state.previousNumber + state.currentNumber;
      break;
    case "-":
      state.result = state.previousNumber - state.currentNumber;
      break;
    case "/":
      if (state.currentNumber === 0) {
        state.isCalculatorBroken = true;
        state.isResultActive = false;
        return;
      }
      state.result = state.previousNumber / state.currentNumber;
      break;
    case "*":
      state.result = state.previousNumber * state.currentNumber;
      break;
  }

  state.isOperationActive = false;
  state.isResultActive = true;
};

const resetCalculation = () => {
  state.previousNumber = 0;
  state.operator = "";
  state.currentNumber = 0;
  state.result = 0;
  state.isOperationActive = false;
  state.isResultActive = false;
  state.isFloatingNumber = false;
  state.isCalculatorBroken = false;
  state.isClearButtonClicked = false;
};

const changeToFloatNumber = () => (state.isFloatingNumber = true);
const firstDigitWasEntered = () => (state.isFirstDigit = false);
const fixCalculator = () => (state.isCalculatorBroken = false);
const clearButtonWasClicked = () => (state.isClearButtonClicked = true);
const resetClearButtonWasClicked = () => (state.isClearButtonClicked = false);

//--------------------
// VIEW
//--------------------

const nodes = {
  digits: document.querySelectorAll(".calculator__digit"),
  operation: document.querySelector(".calculator__operation"),
  result: document.querySelector(".calculator__result"),
  clearDigit: document.querySelector(".calculator__clear-digit"),
  clearNumber: document.querySelector(".calculator__clear-number"),
  operators: document.querySelectorAll(".calculator__operator"),
  calculate: document.querySelector(".calculator__calculate"),
  dot: document.querySelector(".calculator__dot"),
  sign: document.querySelector(".calculator__sign"),
};

const displayDigit = (digit) => {
  nodes.result.innerText = nodes.result.innerText += digit;

  if (nodes.result.innerText.split("")[0] === "0") {
    nodes.result.innerText = nodes.result.innerText.slice(1);
  }
};

const clearDigit = () => {
  if (nodes.result.innerText.split("")[0] === "0") return;

  nodes.result.innerText = nodes.result.innerText.slice(0, -1);
  if (nodes.result.innerText === "") nodes.result.innerText = "0";
};

const clearAllDigits = () => (nodes.result.innerText = 0);

const displayResult = (result) => {
  if (typeof result === "string") {
    nodes.result.innerText = result;
  } else {
    nodes.result.innerText = parseFloat(result.toFixed(4));
  }
};

const displayOperation = (previousNumber, operator, currentNumber) => {
  nodes.operation.innerText = `${previousNumber} ${operator}`;

  if (currentNumber) {
    nodes.operation.innerText = `${previousNumber} ${operator} ${currentNumber} = `;
  }
};

const clearOperation = () => {
  nodes.result.innerText = 0;
  nodes.operation.innerText = 0;
};

const changeToClearButton = () => (nodes.clearNumber.innerText = "C");

const changeToClearAllButton = () => (nodes.clearNumber.innerText = "AC");

const changeNumberSign = () => {
  if (nodes.result.innerText.split("")[0] !== "-") {
    nodes.result.innerText = "-" + nodes.result.innerText;
  } else {
    nodes.result.innerText = nodes.result.innerText.slice(1);
  }
};

//--------------------
// CONTROLLER
//--------------------

nodes.digits.forEach((digit) =>
  digit.addEventListener("click", (e) => {
    controlNumberLength(nodes.result.innerText);

    if (
      state.isMaxNumberLength ||
      state.isResultActive ||
      state.isCalculatorBroken
    )
      return;

    changeToClearButton();
    resetClearButtonWasClicked();
    displayDigit(e.target.innerText);
    firstDigitWasEntered();
  })
);

nodes.clearDigit.addEventListener("click", () => {
  if (state.isResultActive || state.isCalculatorBroken) return;
  clearDigit();
});

nodes.clearNumber.addEventListener("click", () => {
  if (state.isResultActive || state.isClearButtonClicked) {
    clearOperation();
    resetCalculation();
    changeToClearButton();
    return;
  }

  clearButtonWasClicked();
  changeToClearAllButton();
  clearAllDigits();
  fixCalculator();
});

nodes.operators.forEach((operator) =>
  operator.addEventListener("click", (e) => {
    if (state.isOperationActive || state.isCalculatorBroken) return;

    changeToClearButton();
    savePreviousNumber(nodes.result.innerText);
    saveOperator(e.target.dataset.symbol);
    clearAllDigits();
    displayOperation(state.previousNumber, state.operator);
  })
);

nodes.calculate.addEventListener("click", () => {
  if (state.isResultActive) return;
  saveCurrentNumber(nodes.result.innerText);
  clearAllDigits();
  displayOperation(state.previousNumber, state.operator, state.currentNumber);
  calculateResult();

  if (state.isCalculatorBroken) {
    displayResult("Not funny");
    return;
  }

  displayResult(state.result);
  changeToClearAllButton();
});

nodes.dot.addEventListener("click", () => {
  if (state.isResultActive || state.isFloatingNumber || state.isFirstDigit)
    return;

  changeToFloatNumber();
  displayDigit(".");
});

nodes.sign.addEventListener("click", () => {
  changeNumberSign();
});
