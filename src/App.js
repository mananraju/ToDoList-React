import React, { useEffect } from 'react';
import './App.css';

const PomodoroTimer = () => {
  // React.useState for the Task
  const [taskName, setTaskName] = React.useState("");
  const [tasks, setTasks] = React.useState([]);
  const [activeTaskIndex, setActiveTaskIndex] = React.useState(null);

  // React.useState for the Timer
  const [activeTaskMessage, setActiveTaskMessage] = React.useState('');
  const [timeLeft, setTimeLeft] = React.useState(1500); // 1500 seconds = 25 minutes (default session length)
  const [currentSession, setCurrentSession] = React.useState(1);
  const [numOfSessions, setNumOfSessions] = React.useState(4);
  const [isRunning, setIsRunning] = React.useState(false);
  const [sessionLength, setSessionLength] = React.useState(25); // 25 minutes (default session length)
  const [breakLength, setBreakLength] = React.useState(5); // 5 minutes (default break length)
  const [showSettings, setShowSettings] = React.useState(false);


  // ----------------------------------------------------------------

  // Function to handle timer tick
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished, switch to break or next session
      setIsRunning(false);
      if (currentSession < numOfSessions) {
        // Start the break
        setActiveTaskMessage('Just Chill!!!');
        setCurrentSession((prevSession) => prevSession + 1);
        setTimeLeft(breakLength * 60);
      } else {
        // All sessions completed, show completion message and reset
        setActiveTaskMessage('All sessions completed! Great work!');
        setCurrentSession(1);
        setTimeLeft(sessionLength * 60);
      }
    }

    // Clean up the timer when component unmounts or timer is paused
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentSession, numOfSessions, breakLength, sessionLength]);

  // ----------------------------------------------------------------
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
    setCurrentSession(1);
    setActiveTaskMessage('');
  };

  const handleSessionLengthChange = (value) => {
    // Ensure the session length is not less than 1
    const newSessionLength = Math.max(1, value);
    setSessionLength(newSessionLength);
    if (!isRunning) {
      setTimeLeft(newSessionLength * 60);
    }
  };
  
  const handleBreakLengthChange = (value) => {
    // Ensure the break length is not less than 1
    const newBreakLength = Math.max(1, value);
    setBreakLength(newBreakLength);
  };
  
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------

  return (
    <>
      <h1>ToDo App with Pomodoro Timer</h1>
      <div className="main-container">

        {/* ---------------------------------------------------------------- */}

        <div className="pomodoro-task-container">
          <h3>ToDo List</h3>
          <div className="add-task-container">
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
          </div>
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

        {/* ---------------------------------------------------------------- */}

        <div className="pomodoro-timer-container">
          <h3>Pomodoro Timer</h3>

          <div className="task-status-container">
            {activeTaskMessage && <div className="task-message">{activeTaskMessage}</div>}
          </div>

          <div className="pomodoro-timer">
            <div className="pomodoro-timer-clock">{formatTime(timeLeft)}</div>
            <div className="pomodoro-timer-session">Session:{`${currentSession}/${numOfSessions}`}</div>
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
            <button className="pomodoro-timer-button" onClick={() => setShowSettings(!showSettings)}>
              Settings
            </button>
          </div>

          {showSettings && (
            <div className="pomodoro-timer-settings">
            <label style={{display:'flex', justifyContent:'space-between'}}>
              <p>Session Length (minutes):</p>
              <input
                type="number"
                value={sessionLength}
                onChange={(e) => handleSessionLengthChange(Number(e.target.value))}
                min="1" // Add minimum value attribute for HTML5 validation
              />
            </label>
            <label style={{display:'flex', justifyContent:'space-between'}}>
            <p>Break Length (minutes):</p>
              <input
                type="number"
                value={breakLength}
                onChange={(e) => handleBreakLengthChange(Number(e.target.value))}
                min="1" // Add minimum value attribute for HTML5 validation
              />
            </label>
          </div>
          )}

        </div>

        {/* ---------------------------------------------------------------- */}

      </div>

    </>
  );
};



function App() {
  return (
    <div>
      <PomodoroTimer />
      <div className="Footer">
        <p>Copyright &copy;2023,All Rights Reserved | App by Mr.Rana</p>
      </div>
    </div>
  );
}

export default App;
