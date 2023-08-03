// App.js
import React , {useState,useEffect}from 'react';
import './App.css';

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
  const [task, setTask] = useState("");
  const [sessionDuration, setSessionDuration] = useState(25); // in minutes
  const [breakDuration, setBreakDuration] = useState(5); // in minutes
  const [numSessions, setNumSessions] = useState(4); // number of sessions
  const [currentSession, setCurrentSession] = useState(1);
  const [time, setTime] = useState(sessionDuration * 60); // convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      // Timer finished, switch to break or next session
      if (currentSession < numSessions) {
        setCurrentSession((prevSession) => prevSession + 1);
        setTime(breakDuration * 60);
      } else {
        // All sessions completed, reset timer and pause
        resetTimer();
        setCurrentSession(1);
      }
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, time, currentSession, numSessions, breakDuration]);

  useEffect(() => {
    // Update time whenever sessionDuration changes
    if (!isRunning) {
      setTime(sessionDuration * 60);
    }
  }, [sessionDuration, isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTime(sessionDuration * 60);
    setIsRunning(false);
    setCurrentSession(1);
    setTask(""); // Clear the task input when resetting the timer
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <div>
        <label>
          Task:
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={isRunning && time > 0}
          />
        </label>
      </div>
      <div>
        {currentSession}/{numSessions} - {formatTime(time)}
      </div>
      {!isRunning ? (
        <button onClick={startTimer}>Start</button>
      ) : (
        <button onClick={pauseTimer}>Pause</button>
      )}
      <button onClick={resetTimer}>Reset</button>

      <div>
        <label>
          Session Duration (minutes):
          <input
            type="number"
            value={sessionDuration}
            onChange={(e) => setSessionDuration(Math.max(1, parseInt(e.target.value)))}
            disabled={isRunning}
          />
        </label>
      </div>
      <div>
        <label>
          Break Duration (minutes):
          <input
            type="number"
            value={breakDuration}
            onChange={(e) => setBreakDuration(Math.max(1, parseInt(e.target.value)))}
            disabled={isRunning}
          />
        </label>
      </div>
      <div>
        <label>
          Number of Sessions:
          <input
            type="number"
            value={numSessions}
            onChange={(e) => setNumSessions(Math.max(1, parseInt(e.target.value)))}
            disabled={isRunning}
          />
        </label>
      </div>
    </div>
  );
};








function App() {
  return (
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
  );
}

export default App;
