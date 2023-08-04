import React, { useState, useEffect } from 'react';
import './App.css';

//TODO LIST 
const TodoList = () => {
  const [task, setTask] = React.useState('');
  const [tasks, setTasks] = React.useState([]);
  const [completedTasks, setCompletedTasks] = React.useState([]);

  const handleChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, isEditable: false, isCompleted: false }]);
      setTask('');
    }
  };

  const handleEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isEditable = true;
    setTasks(updatedTasks);
  };

  const handleSave = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isEditable = false;
    setTasks(updatedTasks);
  };

  const handleTaskChange = (event, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = event.target.value;
    setTasks(updatedTasks);
  };

  const handleDelete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleToggleCompleted = (index) => {
    const updatedTasks = [...tasks];
    const completedTask = updatedTasks.splice(index, 1)[0];
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, completedTask]);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={task}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Add a task..."
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map((taskObj, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={taskObj.isCompleted}
              onChange={() => handleToggleCompleted(index)}
            />
            {taskObj.isEditable ? (
              <>
                <input
                  type="text"
                  value={taskObj.text}
                  onChange={(event) => handleTaskChange(event, index)}
                />
                <button onClick={() => handleSave(index)}>Save</button>
              </>
            ) : (
              <>
                {taskObj.text}
                <button onClick={() => handleEdit(index)}>Edit</button>
              </>
            )}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
      {completedTasks.length > 0 && (
        <div>
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((completedTask, index) => (
              <li key={index}>The task "{completedTask.text}" is completed.</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};





//POMODORO


const PomodoroTimer = () => {
  const [sessionLength, setSessionLength] = useState(25); // Session length in minutes
  const [numOfSessions, setNumOfSessions] = useState(4); // Number of sessions before long break
  const [breakLength, setBreakLength] = useState(5); // Break duration in minutes

  const [timeLeft, setTimeLeft] = useState(sessionLength * 60); // Time in seconds (converted from minutes)
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);

  const [taskName, setTaskName] = useState(""); // Task name field
  const [isTaskRunning, setIsTaskRunning] = useState(false); // Task status

  // Ensuring minimum value of 1 for session length, number of sessions, and break duration
  const handleSessionLengthChange = (value) => {
    setSessionLength(Math.max(value, 1));
  };

  const handleNumOfSessionsChange = (value) => {
    setNumOfSessions(Math.max(value, 1));
  };

  const handleBreakLengthChange = (value) => {
    setBreakLength(Math.max(value, 1));
  };


  // Function to format time in MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Function to handle the timer countdown
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Switch to the next session or break
      if (numOfSessions > 1) {
        setCurrentSession(currentSession + 1);
        setNumOfSessions(numOfSessions - 1);
        setTimeLeft(breakLength * 60);
      } else {
        setCurrentSession(1); // Reset session number after long break
        setNumOfSessions(4); // Reset sessions count after long break
        setTimeLeft(sessionLength * 60);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, sessionLength, breakLength, numOfSessions, currentSession]);

  // Function to start the timer
  const startTimer = () => {
    setIsRunning(true);
  };

  // Function to pause the timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Function to reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setNumOfSessions(4);
    setTimeLeft(sessionLength * 60);
  };

  // Function to start the task
  const startTask = () => {
    if (taskName.trim() !== "") {
      setIsRunning(true);
      setIsTaskRunning(true);
    }
  };

  // Function to finish the task
  const finishTask = () => {
    setIsRunning(false);
    setIsTaskRunning(false);
    setTaskName("");
  };

  return (
    <div className="pomodoro-timer-container">

      <div className="pomodoro-task">
        {!isTaskRunning && (
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
            disabled={isRunning}
          />
        )}
        {isTaskRunning && <div className="pomodoro-task-name">Task: {taskName}</div>}
        {isTaskRunning ? (
          <button className="pomodoro-timer-button" onClick={finishTask}>
            Finish Task
          </button>
        ) : (
          <button className="pomodoro-timer-button" onClick={startTask} disabled={isRunning || taskName.trim() === ""}>
            Start Task
          </button>
        )}
      </div>


      <div className="pomodoro-timer">
        <div className="pomodoro-timer-clock">{formatTime(timeLeft)}</div>
        <div className="pomodoro-timer-label">Pomodoro Timer</div>
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
        <label>
          Number of Sessions:
          <input
            type="number"
            value={numOfSessions}
            onChange={(e) => handleNumOfSessionsChange(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};











function App() {
  return (
    <div>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <div className="todo-list">
              <TodoList />
            </div>
            <div className="pomodoro-timer">
              <PomodoroTimer />
            </div>
          </div>
        </header>
      </div>

    <div className="Copyright">
      <p>Copyright &copy; 2023, Mr.Rana. All Rights Reserved.</p>
    </div>
    </div>

  );
}

export default App;
