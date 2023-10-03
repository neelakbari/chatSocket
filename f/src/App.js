
import { Route,Routes } from 'react-router-dom';
import './App.css';
import { useSocket } from './hooks/query/usesocketEmitEvent';
import { useSocketSlice } from './hooks/store/useSocketEventsListner';
import Login from './pages/Login';
import Public from './routing/Public/Public';
import Private from './routing/Private/Private'
import Mainpage from './pages/Mainpage';
import Registerpage from './pages/Registerpage';

function App() {
  const {socket,isSocketConnected,notificationCount} = useSocketSlice();

  useSocket();

  // console.log('socketsocket',socket)
  const privateroutes = [{ name: "/Mainpage", component: <Mainpage/> }];

  const publiceroutes = [
    { name: "/", component: <Registerpage/> },
    { name: "/Login", component: <Login /> },
  ];

  return (
    <>
      <Routes>
        <Route element={<Private />}>
        {/* <Route element={<Creatpost />} path="/Creatpost"></Route> */}
       
          {privateroutes.map(({ name, component }, i) => (
            <Route key={i} path={name} element={component} />
          ))}
        </Route>
        <Route element={<Public />}> 
        {/* <Route element={<Creatpost />} path="/Creatpost"></Route> */}
          {publiceroutes.map(({ name, component }, i) => (
            <Route key={i} path={name} element={component} />
          ))}
        </Route>
      </Routes>
    </>
  );
          }

export default App;
