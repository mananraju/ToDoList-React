import React, { useState, useEffect } from "react";
import "./App.css";

const initialSessionCount = 4;
const defaultPomodoroDuration = 25 * 60; // Default Pomodoro duration (25 minutes in seconds)
const defaultBreakDuration = 5 * 60; // Default break duration (5 minutes in seconds)

function App() {
  const [sessionCount, setSessionCount] = useState(initialSessionCount);
  const [pomodoroDuration, setPomodoroDuration] = useState(defaultPomodoroDuration);
  const [breakDuration, setBreakDuration] = useState(defaultBreakDuration);
  const [time, setTime] = useState(defaultPomodoroDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);

  useEffect(() => {
    let interval;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      // Timer has completed a session or break
      // If there are remaining sessions, continue with the next one
      if (isSession) {
        // If it was a session, switch to the break duration
        setIsSession(false);
        setTime(breakDuration);
      } else if (sessionCount > 1) {
        setIsSession(true);
        setSessionCount((prevCount) => prevCount - 1);
        setTime(pomodoroDuration);
      } else {
        // All sessions completed, reset the timer
        setTime(pomodoroDuration);
        setIsRunning(false);
        setIsSession(true);
        setSessionCount(initialSessionCount);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, time, pomodoroDuration, breakDuration, sessionCount, isSession]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(pomodoroDuration);
    setIsRunning(false);
    setIsSession(true);
    setSessionCount(initialSessionCount);
  };

  const handleSessionChange = (event) => {
    const newSessionCount = parseInt(event.target.value);
    setSessionCount(newSessionCount);
  };

  const handlePomodoroDurationChange = (event) => {
    const newDuration = parseInt(event.target.value) * 60;
    setPomodoroDuration(newDuration);
    setTime(newDuration);
  };

  const handleBreakDurationChange = (event) => {
    const newDuration = parseInt(event.target.value) * 60;
    setBreakDuration(newDuration);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <div className="timer">{formatTime(time)}</div>
      <div className="controls">
        {!isRunning ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handlePause}>Pause</button>
        )}
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="settings">
        <label>Number of Sessions:</label>
        <input
          type="number"
          value={sessionCount}
          min={1}
          onChange={handleSessionChange}
        />
        <label>Pomodoro Duration (minutes):</label>
        <input
          type="number"
          value={pomodoroDuration / 60}
          min={1}
          onChange={handlePomodoroDurationChange}
        />
        <label>Break Duration (minutes):</label>
        <input
          type="number"
          value={breakDuration / 60}
          min={1}
          onChange={handleBreakDurationChange}
        />
      </div>
    </div>
  );
}

export default App;
