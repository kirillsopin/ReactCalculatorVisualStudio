import { useState } from 'react';

function App() {
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);
  const [finished, setFinished] = useState(false);

  const formatNumber = (number) => {
    if (!Number.isFinite(number)) return 'Помилка';
    const rounded = Number.parseFloat(number.toPrecision(12));
    return String(rounded);
  };

  const enterDigit = (digit) => {
    if (display === 'Помилка' || finished) {
      setDisplay(digit);
      setFirstNumber(null);
      setOperator(null);
      setWaitingForSecond(false);
      setFinished(false);
      return;
    }

    if (waitingForSecond) {
      setDisplay(digit);
      setWaitingForSecond(false);
      return;
    }

    setDisplay((current) => current === '0' ? digit : current + digit);
  };

  const enterDecimal = () => {
    if (display === 'Помилка' || finished) {
      setDisplay('0.');
      setFinished(false);
      setFirstNumber(null);
      setOperator(null);
      setWaitingForSecond(false);
      return;
    }

    if (waitingForSecond) {
      setDisplay('0.');
      setWaitingForSecond(false);
      return;
    }

    if (!display.includes('.')) setDisplay(display + '.');
  };

  const chooseOperator = (nextOperator) => {
    if (display === 'Помилка') return;
    const inputValue = Number(display);

    if (operator && !waitingForSecond) {
      const result = calculate(firstNumber, inputValue, operator);
      if (result === null) {
        setDisplay('Помилка');
        setFirstNumber(null);
        setOperator(null);
        setWaitingForSecond(true);
        return;
      }
      setDisplay(formatNumber(result));
      setFirstNumber(result);
    } else {
      setFirstNumber(inputValue);
    }

    setOperator(nextOperator);
    setWaitingForSecond(true);
    setFinished(false);
  };

  const calculate = (a, b, op) => {
    if (a === null || !Number.isFinite(a) || !Number.isFinite(b)) return null;
    switch (op) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? null : a / b;
      default: return b;
    }
  };

  const showResult = () => {
    if (!operator || firstNumber === null || waitingForSecond) return;
    const result = calculate(firstNumber, Number(display), operator);
    setDisplay(result === null ? 'Помилка' : formatNumber(result));
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecond(true);
    setFinished(true);
  };

  const clear = () => {
    setDisplay('0');
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecond(false);
    setFinished(false);
  };

  const deleteLast = () => {
    if (display === 'Помилка' || finished || waitingForSecond) {
      setDisplay('0');
      setFinished(false);
      setWaitingForSecond(false);
      return;
    }
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    if (display.length === 2 && display.startsWith('-')) setDisplay('0');
  };

  const toggleSign = () => {
    if (display === 'Помилка' || Number(display) === 0) return;
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const percent = () => {
    if (display === 'Помилка') return;
    setDisplay(formatNumber(Number(display) / 100));
    setFinished(false);
  };

  const buttons = [
    { label: 'C', type: 'utility', action: clear },
    { label: '⌫', type: 'utility', action: deleteLast },
    { label: '%', type: 'utility', action: percent },
    { label: '÷', type: 'operator', action: () => chooseOperator('÷') },
    { label: '7', action: () => enterDigit('7') },
    { label: '8', action: () => enterDigit('8') },
    { label: '9', action: () => enterDigit('9') },
    { label: '×', type: 'operator', action: () => chooseOperator('×') },
    { label: '4', action: () => enterDigit('4') },
    { label: '5', action: () => enterDigit('5') },
    { label: '6', action: () => enterDigit('6') },
    { label: '−', type: 'operator', action: () => chooseOperator('−') },
    { label: '1', action: () => enterDigit('1') },
    { label: '2', action: () => enterDigit('2') },
    { label: '3', action: () => enterDigit('3') },
    { label: '+', type: 'operator', action: () => chooseOperator('+') },
    { label: '±', type: 'utility', action: toggleSign },
    { label: '0', action: () => enterDigit('0'), wide: true },
    { label: '.', action: enterDecimal },
    { label: '=', type: 'equals', action: showResult }
  ];

  return (
    <main className="page">
      <section className="calculator">
        <div className="topline">
          <div>
            <p className="eyebrow">REACT • КАЛЬКУЛЯТОР</p>
            <h1>Калькулятор</h1>
          </div>
          <div className="react-mark" aria-label="React">⚛</div>
        </div>

        <div className="screen" aria-live="polite">
          <div className="screen-operation">
            {firstNumber !== null && operator ? `${formatNumber(firstNumber)} ${operator}` : ' '}
          </div>
          <div className={`screen-value ${display.length > 12 ? 'small' : ''}`}>
            {display}
          </div>
        </div>

        <div className="keys">
          {buttons.map((button) => (
            <button
              key={button.label}
              type="button"
              className={`key ${button.type || ''} ${button.wide ? 'wide' : ''}`}
              onClick={button.action}
              aria-label={button.label}
            >
              {button.label}
            </button>
          ))}
        </div>
        <p className="hint">Функціональні компоненти · useState · React</p>
      </section>
    </main>
  );
}

export default App;