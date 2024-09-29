import './App.css';
import Formulario from './pages/Login.js';
import VagasEstacionamento from './pages/VagasEstacionamento';
import Fidelidade from './pages/Fidelidade'
import Home from './pages/Home.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StoreProvider from './components/Store/Provider.jsx';


function App() {
  return (
    <StoreProvider>
      <Router> 
        <Routes>
          <Route path="/" element={<Formulario />}/>
          <Route path= "Home" element= {<Home/>}/>
          <Route path="VagasEstacionamento" element={<VagasEstacionamento />}/>
          <Route path="Fidelidade" element={<Fidelidade/>}/>
        
        </Routes>        
      </Router>
    </StoreProvider>
  );
}

export default App;