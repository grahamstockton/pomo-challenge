import './App.css';
import { useState, useEffect } from 'react';

const SESSION = "SESSION";
const BREAK = "BREAK";

function App() {
  const [state, setState] = useState({
    current_time: 25 * 60,
    current_time_string: getTimeString(25 * 60),
    mode: SESSION,
    is_running: false,
    lengths: {
      SESSION: 25,
      BREAK: 5
    }
  });

  // update timer when running
  useEffect(() => {
    const countDown = () => {
      if (state.current_time === 0) {
        return;
      } else {
        setState((state) => {
          return {
            ...state,
            current_time: state.current_time - 1,
            current_time_string: getTimeString(state.current_time - 1)
          }
        });
      }
    }

    if (state.is_running) {
      const interval = setInterval(countDown, 1000);
      return () => clearInterval(interval);
    }
  }, [state.is_running, state.current_time, state.current_time_string]);

  // switch modes on timeout
  useEffect(() => {
    const newMode = state.mode === SESSION ? BREAK : SESSION;
    if (state.current_time === 0) {
      // play audio
      document.getElementById("beep").play();

      // update state
      setState((state) => {
        return {
          ...state,
          current_time: 60 * state.lengths[newMode],
          current_time_string: getTimeString(60 * state.lengths[newMode]),
          is_running: true,
          mode: newMode
        }
      })
    }
  }, [state.current_time, state.mode]);

  // string repr
  function getTimeString(t) {
    return Math.floor(t / 60).toString().padStart(2, '0') + ":" + (t % 60).toString().padStart(2, '0');
  }

  function conditionalIncrementDecrement(newTime, mode) {
    const n = mode === state.mode ? 60 * newTime : state.current_time;
    if (!(state.is_running && (mode === state.mode))) {
      setState({
        ...state,
        current_time: n,
        current_time_string: getTimeString(n),
        lengths: {
          ...state.lengths,
          [mode]: newTime
        }
      });
    } else {}
  }

  function conditionalIncrementSession() {
    const newTime = Math.min(state.lengths[SESSION] + 1, 60);
    conditionalIncrementDecrement(newTime, SESSION);
  }

  function conditionalDecrementSession() {
    const newTime = Math.max(state.lengths[SESSION] - 1, 1);
    conditionalIncrementDecrement(newTime, SESSION);
  }

  function conditionalIncrementBreak() {
    const newTime = Math.min(state.lengths[BREAK] + 1, 60);
    conditionalIncrementDecrement(newTime, BREAK);
  }

  function conditionalDecrementBreak() {
    const newTime = Math.max(state.lengths[BREAK] - 1, 1);
    conditionalIncrementDecrement(newTime, BREAK);
  }

  // change
  function startStopHandler() {
    setState ({ ...state, is_running: !state.is_running });
  }

  function resetTimer() {
    // stop audio
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;

    // reset state
    setState({
      current_time: 25 * 60,
      current_time_string: getTimeString(25 * 60),
      mode: SESSION,
      is_running: false,
      lengths: {
        SESSION: 25,
        BREAK: 5
      }
    });
  }

  return (
    <div className="App">
      <h1 id="title">25 + 5 Clock</h1>
      <div className="control-bar-container">
        <div className="controller">
          <h2 id="break-label">Break Length</h2>
          <div className="control-bar">
            <button id="break-decrement" onClick={conditionalDecrementBreak}><span>&#8595;</span></button>
            <h3 id="break-length">{state.lengths[BREAK]}</h3>
            <button id="break-increment" onClick={conditionalIncrementBreak}><span>&#8593;</span></button>
          </div>
        </div>
        <div className="controller">
          <h2 id="session-label">Session Length</h2>
          <div className="control-bar">
            <button id="session-decrement" onClick={conditionalDecrementSession}><span>&#8595;</span></button>
            <h3 id="session-length">{state.lengths[SESSION]}</h3>
            <button id="session-increment" onClick={conditionalIncrementSession}><span>&#8593;</span></button>
          </div>
        </div>
      </div>
      <div id="timer-label">
        <h2 id="timer-header">{state.mode === SESSION ? "Session" : "Break"}</h2>
        <h3 id="time-left">{state.current_time_string}</h3>
      </div>
      <div id="timer-controls">
        <button id="start_stop" onClick={startStopHandler}>Start/Pause</button>
        <button id="reset" onClick={resetTimer}>Reset</button>
      </div>
      <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
    </div>
  );
}

export default App;
