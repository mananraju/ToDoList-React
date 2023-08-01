// import logo from './logo.svg'
import './App.css';
import Main from './Components/Main';
import SideBar from './Components/SideBar';
import AddNewTodo from './Components/AddNewTodo';
import Calender from './Components/Calender';
import EditTodo from './Components/EditTodo';
import Projects from  './Components/Projects';
import Todos from './Components/Todos';
import User from './Components/User';

function App() {
  return (
    <div className='App'>

      <SideBar>
        <User/>
        <AddNewTodo/>
        <Calender/>
        <Projects/>
      </SideBar>

      <Main>
        <Todos />
        <EditTodo/>
      </Main>
      
    </div>

  );
}

export default App;
