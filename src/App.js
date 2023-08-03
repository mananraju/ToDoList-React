import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const initialSessionCount = 4;
const defaultPomodoroDuration = 25 * 60; // Default Pomodoro duration (25 minutes in seconds)
const defaultBreakDuration = 5 * 60; // Default break duration (5 minutes in seconds)

function App() {
  const [taskName, setTaskName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [sessionCount, setSessionCount] = useState(initialSessionCount);
  const [pomodoroDuration, setPomodoroDuration] = useState(defaultPomodoroDuration);
  const [breakDuration, setBreakDuration] = useState(defaultBreakDuration);
  const [time, setTime] = useState(defaultPomodoroDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [startedTaskIndex, setStartedTaskIndex] = useState(-1);

  const startButtonRef = useRef();

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
        setStartedTaskIndex(-1);
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
    setStartedTaskIndex(-1);
  };

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleAddTask = () => {
    if (taskName.trim() !== "") {
      setTaskList([...taskList, { name: taskName, completed: false }]);
      setTaskName("");
    }
  };

  const handleCompleteTask = (index) => {
    const updatedTaskList = taskList.map((task, i) =>
      i === index ? { ...task, completed: true } : task
    );
    setTaskList(updatedTaskList);
  };

  const handleDeleteTask = (index) => {
    const updatedTaskList = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTaskList);
  };

  const handleStartTask = (index) => {
    if (!isRunning) {
      setTaskName(taskList[index].name);
      handleReset();
      setStartedTaskIndex(index);
    }
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

  const handleTaskSelection = (index) => {
    if (!isRunning) {
      setTaskName(taskList[index].name);
      handleReset();
      setStartedTaskIndex(index);
      startButtonRef.current.click(); // Trigger automatic click of the "Start" button
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <div className="task">
        <input
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={handleTaskNameChange}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div className="task-list">
        <ul>
          {taskList.map((task, index) => (
            <li key={index} onClick={() => handleTaskSelection(index)}>
              {task.name}
              {!task.completed ? (
                <>
                  {startedTaskIndex === index ? (
                    <span className="started">Started</span>
                  ) : (
                    <button onClick={() => handleStartTask(index)}>Let's Go</button>
                  )}
                  <button onClick={() => handleCompleteTask(index)}>Complete</button>
                  <button onClick={() => handleDeleteTask(index)}>Delete</button>
                </>
              ) : (
                <span className="completed">Completed</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="timer">{formatTime(time)}</div>
      <div className="controls">
        {!isRunning ? (
          <button onClick={handleStart} ref={startButtonRef}>Start</button>
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
