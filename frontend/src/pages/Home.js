import React, { useContext, useState, useEffect } from 'react';
import StoreContext from '../components/Store/Context';
import Sidebar from '../components/Sidebar'
import '../components/sidebar.css'
import { useNavigate } from 'react-router-dom';
import VagasEstacionamento from './VagasEstacionamento';
import Fidelidade from './Fidelidade';
import Usuario from './Usuario';

const Home = ({userData}) => {
  const { setToken, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [state, setState] = useState(0)

  const handleClick = (event, value) => {
    console.log(event.target);
    console.log(value);
    setState({
      message: value
    });
  }

  useEffect(() => {
    console.log(userData);
    console.log(state);
    console.log(token);
  })

  return (
    <div className="main">
      { token ?
        <div>
        <Sidebar userData={userData} newMessage={ handleClick }></Sidebar>
        <Usuario userData={userData}></Usuario>
        {state.message === 0 ?
          <h2>Pagina Inicial</h2>
        : ''}

        {state.message === 1 ?
          <Fidelidade userData={userData}></Fidelidade>
          
        : ''}
        
        {state.message === 2 ?
          <VagasEstacionamento userData={userData}></VagasEstacionamento>
          
        : ''}
        <br/>
      </div>
      
      : navigate("/")}
      
    </div>
  );
};

export default Home;