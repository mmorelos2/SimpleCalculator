import './App.css';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { numPress, opPress } from './actions/index';

function App() {
  const equation = useSelector((state) => state.num.equation);
  const current = useSelector((state) => state.num.currentDisplay);
  const dispatch = useDispatch();
  
  return (

    <div className="App" id="calculator-container">
      <div>
        <h1>Calculator App</h1>
      </div>
      <div id="calculator">
        <div id="output">
          <div id="equation-container">
            <p id="equation">{equation}</p>
          </div>
          <div id="result-container">
            <p id="result">{current}</p>
          </div>
        </div>
        <button className="calculator-button operation-button" id="AC" onClick={() => dispatch(opPress("AC"))}>AC</button>
        <button className="calculator-button operation-button" id="div" onClick={() => dispatch(opPress("/"))}>/</button>
        <button className="calculator-button operation-button" id="mul" onClick={() => dispatch(opPress("*"))}>X</button>
        <button className="calculator-button operation-button" id="sub" onClick={() => dispatch(opPress("-"))}>-</button>
        <button className="calculator-button operation-button" id="add" onClick={() => dispatch(opPress("+"))}>+</button>
        <button className="calculator-button operation-button" id="eq" onClick={() => dispatch(opPress("eq"))}>=</button>
        <button className="calculator-button number-button" id="nine" onClick={() => dispatch(numPress("9"))}>9</button>
        <button className="calculator-button number-button" id="eight" onClick={() => dispatch(numPress("8"))}>8</button>
        <button className="calculator-button number-button" id="seven" onClick={() => dispatch(numPress("7"))}>7</button>
        <button className="calculator-button number-button" id="six" onClick={() => dispatch(numPress("6"))}>6</button>
        <button className="calculator-button number-button" id="five" onClick={() => dispatch(numPress("5"))}>5</button>
        <button className="calculator-button number-button" id="four" onClick={() => dispatch(numPress("4"))}>4</button>
        <button className="calculator-button number-button" id="three" onClick={() => dispatch(numPress("3"))}>3</button>
        <button className="calculator-button number-button" id="two" onClick={() => dispatch(numPress("2"))}>2</button>
        <button className="calculator-button number-button" id="one" onClick={() => dispatch(numPress("1"))}>1</button>
        <button className="calculator-button number-button" id="zero" onClick={() => dispatch(numPress("0"))}>0</button>
        <button className="calculator-button number-button" id="decimal" onClick={() => dispatch(numPress("."))}>.</button>
      </div>
    </div>
  );
}

export default App;
