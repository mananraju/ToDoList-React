import React, { useState, useEffect } from 'react';
import './App.css';

const PomodoroTimer = () => {
  const [activeTaskMessage, setActiveTaskMessage] = useState("");
  const [sessionLength, setSessionLength] = useState(25);
  const [numOfSessions, setNumOfSessions] = useState(4);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRunning) {
      handleNextSession();
    }
  }, [isRunning, timeLeft]);

  const handleNextSession = () => {
    if (numOfSessions > 1) {
      setCurrentSession(currentSession + 1);
      setNumOfSessions(numOfSessions - 1);
      setActiveTaskMessage("Break time!");
      setTimeLeft(breakLength * 60);
    } else {
      setActiveTaskMessage("All sessions completed. Well done!");
      setCurrentSession(1);
      setNumOfSessions(4);
      setTimeLeft(sessionLength * 60);
    }
    setIsRunning(false);
  };

  const handleSessionLengthChange = (value) => {
    setSessionLength(Math.max(value, 1));
    if (!isRunning && currentSession === 1) {
      setTimeLeft(value * 60);
    }
  };

  const handleBreakLengthChange = (value) => {
    setBreakLength(Math.max(value, 1));
    if (!isRunning && currentSession !== 1) {
      setTimeLeft(value * 60);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSession(1);
    setNumOfSessions(4);
    setTimeLeft(sessionLength * 60);
  };

  const addTask = () => {
    if (taskName.trim() !== "") {
      setTasks([...tasks, { name: taskName.trim(), isRunning: false }]);
      setTaskName("");
    }
  };

  const handleStartTask = (index) => {
    if (!isRunning) {
      setActiveTaskIndex(index);
      setActiveTaskMessage(`Task: ${tasks[index].name} started`);
      setTasks((prevTasks) =>
        prevTasks.map((task, i) =>
          i === index ? { ...task, isRunning: true } : { ...task, isRunning: false }
        )
      );
      setIsRunning(true);
    }
  };

  const finishTask = () => {
    const finishedTask = tasks[activeTaskIndex];
    const updatedTasks = tasks.filter((_, index) => index !== activeTaskIndex);
    setTasks(updatedTasks);
    setActiveTaskIndex(null);
    setActiveTaskMessage(`Task: ${finishedTask.name} completed`);

    // Reset the timer
    setIsRunning(false);
    setCurrentSession(1);
    setNumOfSessions(4);
    setTimeLeft(sessionLength * 60);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <h1>ToDo App with Pomodoro Timer</h1>
      <div className="main-container">
        <div className="pomodoro-task-container">
        <h1>ToDo List</h1>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
            disabled={isRunning}
          />
          <button
            className="pomodoro-timer-button"
            onClick={addTask}
            disabled={isRunning || taskName.trim() === ""}
          >
            Add Task
          </button>
          {tasks.length > 0 && (
            <div className="task-list">
              <h3>Task List:</h3>
              <ul>
                {tasks.map((task, index) => (
                  <li key={index} className={activeTaskIndex === index ? "active-task" : ""}>
                    {task.name}
                    {task.isRunning ? (
                      <button className="pomodoro-timer-button" onClick={finishTask}>
                        Finish
                      </button>
                    ) : (
                      <>
                        <button
                          className="pomodoro-timer-button"
                          onClick={() => handleStartTask(index)}
                          disabled={isRunning}
                        >
                          Start Task
                        </button>
                        <button
                          className="pomodoro-timer-button"
                          onClick={() => handleDeleteTask(index)}
                          disabled={isRunning}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pomodoro-timer-container">
        <h1>Pomodoro Timer</h1>
          <div className="pomodoro-timer">
            <div className="pomodoro-timer-clock">{formatTime(timeLeft)}</div>
            <div className="pomodoro-timer-label">
              {currentSession === 1 ? "Work Time" : "Break Time"}
            </div>
            <div className="pomodoro-timer-session">{`${currentSession}/${numOfSessions}`}</div>
          </div>
          <div className="pomodoro-timer-controls">
            {isRunning ? (
              <button className="pomodoro-timer-button" onClick={pauseTimer}>
                Pause
              </button>
            ) : (
              <button className="pomodoro-timer-button" onClick={startTimer}>
                Start
              </button>
            )}
            <button className="pomodoro-timer-button" onClick={resetTimer}>
              Reset
            </button>
          </div>
          <div className="pomodoro-timer-settings">
            <label>
              Session Length (minutes):
              <input
                type="number"
                value={sessionLength}
                onChange={(e) => handleSessionLengthChange(Number(e.target.value))}
              />
            </label>
            <label>
              Break Length (minutes):
              <input
                type="number"
                value={breakLength}
                onChange={(e) => handleBreakLengthChange(Number(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="task-status-container">
        <h1>Task Status</h1>
          {activeTaskMessage && <div className="task-message">{activeTaskMessage}</div>}
        </div>
      </div>

    </>
  );
};

function App() {
  return (
    <div>
      <PomodoroTimer />
      <div className="Copyright">
        <p>Copyright &copy; All Rights Reserved | App by Mr.Rana</p>
      </div>
    </div>
  );
}

export default App;
