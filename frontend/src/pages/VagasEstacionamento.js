import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {withRouter} from 'react-router-dom';
import axios from 'axios';
// import $ from 'jquery';

import logo from "../img/logo.png"
//import Popup from '../components/popuplogin';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup';

function VagasEstacionamento({userData}){
  //const history = useNavigate();
  const navigate = useNavigate();
  const [tableDataVagas, setTableDataVagas] = useState([]);
  //const [formDataEncerra, setEncerra] = useState([]);
  const [vagaEscolhida, setVaga] = useState(null);
  const { setToken, token } = useContext(StoreContext);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonPopupOcupado, setButtonPopupOcupado] = useState(false);
  const [buttonPopupCadastrar, setCadastrarVeiculo] = useState(false);
  const [buttonPopupBusca, setBuscaVeiculo] = useState(false);
  const [buttonDeletePopup, setDeletePopup] = useState(false);

  const[formData, setFunc] = useState({
    tipo: '',
    placa: '',
    cor: '',
    modelo: ''
  });

  const[formDataEncerra, setEncerra] = useState({
    placa: '',
    tempo: '',
    valor: ''
  });

  const[formDataBusca, setBusca] = useState({
    placa: ''
  });
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFunc((prevData) => ({
    ...prevData,
    [name]: value,
    }));
  };

  const handleInputChangeBusca = (event) => {
  const { name, value } = event.target;
  setBusca((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

// Função para limpar o formulário
const clearCadastrar = () => {
  setFunc({
  tipo: '',
  placa: '',
  cor: '',
  modelo: ''
  });
  
};

const clearBuscar = () => {
  setBusca({
  placa: ''
  });
  
};
  
useEffect(() => {
  const interval = setInterval(() => {
  getVagas();
  }, 5000); 
  return () => clearInterval(interval);
  
}, [tableDataVagas]);

const getVagas = (event) => {
    
  axios.get('http://127.0.0.1:5000/api/getVagas')
  .then(response => {
    console.log('Resposta do servidor:', response.data);
    const vagas = response.data
    setTableDataVagas([...vagas])
  })
  .catch(error => {
    console.error('Erro ao buscar vagas:', error);
  });
}

const handleVaga = (vaga, status) => {
  console.log('Vaga selecionada:', vaga); // Log para depuração
  setVaga(vaga);
  if (status === "Livre") {
  handleVagaLivre();
  } else {
  handleVagaOcupada(vaga);
  }
};

const handleVagaLivre = () => {
  setButtonPopup(true);
  
}

const handleVagaOcupada = (vaga) => {
  getFinalizacao(vaga)
  setButtonPopupOcupado(true);
  
}

const getFinalizacao = (vaga) => {
  
  const dataToSend = {
    vaga: vaga
  };
      console.log(dataToSend)
  axios.post('http://127.0.0.1:5000/api/getFinalizacao', dataToSend)
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      const preenchido = response.data[0]
      setEncerra(preenchido)
    })
    .catch(error => {
      console.error('Erro ao buscar vagas:', error);
    });
}

const cadastrarVeiculo = (vaga) => {
  clearCadastrar();
  setButtonPopup(false);
  setCadastrarVeiculo(true);
}

const handleSubmitModal = (event) => {
  event.preventDefault();

  const dataToSend = {
  ...formData,
  vaga: vagaEscolhida // Adiciona a vaga selecionada ao objeto formData
  };
  
  axios.post('http://127.0.0.1:5000/api/cadastraVeiculo', dataToSend)
  .then(response => {
    console.log('Resposta do servidor:', response.data);
    setCadastrarVeiculo(false);
    clearCadastrar();
  })
  .catch(error => {
    console.error('Erro ao enviar dados:', error);
  });
}

const buscaVeiculo = (vaga) => {
  clearBuscar()
  setButtonPopup(false);
  setBuscaVeiculo(true);
}

const handleSubmitModalBusca = (event) => {
  event.preventDefault();

  const dataToSend = {
  ...formDataBusca,
  vaga: vagaEscolhida // Adiciona a vaga selecionada ao objeto formData
  };
  
  axios.post('http://127.0.0.1:5000/api/veiculoCadastrado', dataToSend)
  .then(response => {
    console.log('Resposta do servidor:', response.data);
    setBuscaVeiculo(false);
    clearBuscar()
  })
  .catch(error => {
    console.error('Erro ao enviar dados:', error);
  });
}

const handleSubmitModalEncerrar = (event) => {
  event.preventDefault();
  
  axios.post('http://127.0.0.1:5000/api/encerraVaga', formDataEncerra)
  .then(response => {
    console.log('Resposta do servidor:', response.data);
    setButtonPopupOcupado(false);
  })
  .catch(error => {
    console.error('Erro ao enviar dados:', error);
  });
}


  return (
    <div className="mform">
    <div class = "text">Vagas</div>
    {
        tableDataVagas.map((vaga) => {
        return (
          <div className='vaga' onClick={() => handleVaga(vaga.id_vaga, vaga.liberada)}>
          <div className={`${vaga.liberada == 'Livre' ? 'vaga-livre' : 'vaga-ocupada'}`}>
            <div className='vagaName'>Vaga {vaga.id_vaga}</div>
            <div className='vagaStatus'>Status: {vaga.liberada}</div>
          </div>
          </div>   
          
        );
        })
    }
      
    <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
    <div className='textVagas'>Vaga {vagaEscolhida}</div>
      <div className='popupVagas'>
        <button className= "buttonVagas" onClick={cadastrarVeiculo} >Cadastrar Veiculo</button>
        <button className= "buttonVagas" onClick={buscaVeiculo} >Buscar Veiculo</button>
         
      </div>
    </Popup>

    <Popup trigger={buttonPopupCadastrar} setTrigger={setCadastrarVeiculo}>
      <div className='container-modal'>
      <div className="text-modal">Cadastrar Veículo</div>
      <form onSubmit={handleSubmitModal}>
      <div class="form-row">
        <div class="input-modal">
        <label className='modalLabel' for="cdprod">
          Tipo
        </label>
        <input 
            name="tipo" 
            className='dadosUsers' 
            value={formData.tipo}
            onChange={handleInputChange} required/>
        </div>

        <div class = "input-modal">
        <label className='modalLabel' for="quantidade">
          Placa
        </label>
        <input 
            name="placa" 
            className='dadosUsers' 
            value={formData.placa}
            onChange={handleInputChange} required />
        </div>
        </div>
        <div class="form-row">
        <div class = "input-modal">
        <label className='modalLabel' for="quantidade">
          Cor
        </label>
        <input 
            name="cor" 
            className='dadosUsers' 
            value={formData.cor}
            onChange={handleInputChange} required />
        </div>

        <div class = "input-modal">
        <label className='modalLabel' for="quantidade">
          Modelo
        </label>
        <input 
            name="modelo" 
            className='dadosUsers' 
            value={formData.modelo}
            onChange={handleInputChange} required />
        </div>
        </div>

        <div className='divButtonPopup'>
        <button className= "modalButton" type = "submit" >Cadastrar</button>
        </div>
        
        </form> 
      </div>
    </Popup>

    <Popup trigger={buttonPopupBusca} setTrigger={setBuscaVeiculo}>
      <div className='container-modal'>
      <div className="text-modal">Buscar Veículo</div>
      <form onSubmit={handleSubmitModalBusca}>
      <div class="form-row">
        <div class="input-modal">
        <label className='modalLabel' for="cdprod">
          Placa
        </label>
        <input 
            name="placa" 
            className='dadosUsers' 
            value={formDataBusca.placa}
            onChange={handleInputChangeBusca} required/>
        </div>
      </div>
        

        <div className='divButtonPopup'>
        <button className= "modalButton" type = "submit" >Buscar</button>
        </div>
        
        </form> 
      </div>
    </Popup>

    <Popup trigger={buttonPopupOcupado} setTrigger={setButtonPopupOcupado}>
      <div className='container-modal'>
      <div className="text-modal">Encerrar vaga {vagaEscolhida}</div>
      <form onSubmit={handleSubmitModalEncerrar}>
      <div class="form-row">
        <div class="input-modal">
        <label className='modalLabel' for="cdprod">
          Placa: 
        </label>
        <input 
            name="placa" 
            className='dadosUsers' 
            type="text"
            value={formDataEncerra.placa}
            readOnly />
        <label className='modalLabel' for="cdprod">
          Tempo
        </label>
        <input 
            name="tempo" 
            className='dadosUsers' 
            value={formDataEncerra.horas}
            readOnly/>
        <label className='modalLabel' for="cdprod">
          Valor
        </label>
        <input 
            name="valor" 
            className='dadosUsers' 
            value={formDataEncerra.valor}
            readOnly/>
        </div>
      </div>
        

        <div className='divButtonPopup'>
        <button className= "modalButton" type = "submit" >Encerrar</button>
        </div>
        
        </form> 
      </div>
    </Popup>

    </div>   
  );
}

export default VagasEstacionamento;