import './App.css';
import Formulario from './pages/Login.js';
import EntrarCaixa from './pages/EntrarCaixa';
import Encomendas from './pages/Encomendas';
import VagasEstacionamento from './pages/VagasEstacionamento';
import VendasRealizadas from './pages/VendasRealizadas';
import PrateleiraseEstoque from './pages/EstoqueePrateleiras'
import Relatorios from './pages/Relatorios'
import Departamento from './pages/Departamento'
import JornadadeTrabalho from './pages/JornadadeTrabalho'
import Home from './pages/Home.js'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import StoreContext from './components/Store/Context.jsx';
import StoreProvider from './components/Store/Provider.jsx';


function App() {
  return (
    <StoreProvider>
      <Router> 
        <Routes>
          <Route path="/" element={<Formulario />}/>
          <Route path="EntrarCaixa" element={<EntrarCaixa />}/>
          <Route path= "Home" element= {<Home/>}/>
          <Route path="JornadadeTrabalho" element={<JornadadeTrabalho/>}/>
          <Route path="VagasEstacionamento" element={<VagasEstacionamento />}/>
          <Route path="VendasRealizadas" element={<VendasRealizadas/>}/>
          <Route path="PrateleiraseEstoque" element={<PrateleiraseEstoque/>}/>
          <Route path="Encomendas" element={<Encomendas/>}/>
          <Route path="Relatorios" element={<Relatorios/>}/>
          <Route path="Departamento" element={<Departamento/>}/>
        
        </Routes>        
      </Router>
    </StoreProvider>
  );
}

export default App;