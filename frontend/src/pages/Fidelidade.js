import React, { useState, useEffect, useContext } from 'react';
import '../components/style/style.css'

import logo from "../img/logo.png"
//import logoSimples from "../img/logoSimples.png"
import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup';
import axios from 'axios';

function Fidelidade({userData}){
  const [tableData, setTableData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonEditPopup, setEditPopup] = useState(false);

  const { setToken, token } = useContext(StoreContext);

  const[formData, setFunc] = useState({
    cpf: '',
    nome: '',
    email: '',
    telefone: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFunc((prevData) => ({
      ...prevData,
      [name]: value,
    }));
};

  useEffect(() => {
    //fetchData();
  }, []);

  /*const fetchData = async () => {
    try {
     console.log(tableData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClearUsers = () => {
    setTableData([]);
  }*/

  const handleCreateUsers = () => {
    setButtonPopup(true);
  }

  const handleEdit = () => {
    setEditPopup(true);
  }

  const handleSubmitModal = (event) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:5000/api/criaCliente', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopup(false);

      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const handleSubmitDelete = (event) => {
    event.preventDefault();
    console.log(formData.cpf);

    axios.post('http://127.0.0.1:5000/api/deletaFuncionario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setEditPopup(false);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }

  return (
    <div className="mform">
      <div className = "text">Clientes</div>
        <div className='fidelidadeButtons'>
          <button className= "update-btn" onClick={handleCreateUsers}>Criar</button>
          <button className= "update-btn" onClick={handleEdit}>Editar</button>
        </div>
      
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <div className='container-modal'>
            <div className="text-modal">Criar Cliente</div>
            <form onSubmit={handleSubmitModal}>
              <div class="form-row">
                <div class="input-modal">
                  <label className='modalLabel' for="cdprod">
                    Nome
                  </label>
                  <input 
                      name="nome" 
                      className='dadosUsers' 
                      value={formData.nome}
                      onChange={handleInputChange} required/>

                  <label className='modalLabel' for="cdprod">
                    CPF
                  </label>
                  <input 
                      name="cpf" 
                      className='dadosUsers' 
                      value={formData.cpf}
                      onChange={handleInputChange} required/>

                  <label className='modalLabel' for="quantidade">
                    Email
                  </label>
                  <input 
                      name="email" 
                      className='dadosUsers' 
                      value={formData.email}
                      onChange={handleInputChange} required />
                
                  <label className='modalLabel' for="quantidade">
                    Telefone
                  </label>
                  <input 
                      name="telefone" 
                      className='dadosUsers' 
                      value={formData.telefone}
                      onChange={handleInputChange} required />
                </div>
              </div>

              <div className='divButtonPopup'>
                <button className= "modalButton" type = "submit" >Criar</button>
              </div>
              
              </form> 
          </div>
        </Popup>

        <Popup trigger={buttonEditPopup} setTrigger={setEditPopup}>
          <div className='container-modal'>
            <div className="text-modal">Editar Cliente</div>
            <form onSubmit={handleSubmitDelete}>
            <div class="form-row">
                <div class="input-modal">
                  

                  <label className='modalLabel' for="cdprod">
                    Digite o CPF do cliente que será editado
                  </label>
                  <input 
                      name="cpf" 
                      className='dadosUsers' 
                      value={formData.cpf}
                      onChange={handleInputChange} required/>

                  <label className='modalLabel' for="cdprod">
                    Digite os dados a serem editados: 
                  </label>

                  <label className='modalLabel' for="cdprod">
                    Nome
                  </label>
                  <input 
                      name="nome" 
                      className='dadosUsers' 
                      value={formData.nome}
                      onChange={handleInputChange} />

                  <label className='modalLabel' for="quantidade">
                    Email
                  </label>
                  <input 
                      name="email" 
                      className='dadosUsers' 
                      value={formData.email}
                      onChange={handleInputChange}  />
                
                  <label className='modalLabel' for="quantidade">
                    Telefone
                  </label>
                  <input 
                      name="telefone" 
                      className='dadosUsers' 
                      value={formData.telefone}
                      onChange={handleInputChange}  />
                </div>
              </div>
              <div className='divButtonPopup'>
                <button className= "modalButton" type = "submit" >Editar</button>
              </div>
              </form> 
          </div>
        </Popup>
      
        </div>
  );
}

export default Fidelidade;