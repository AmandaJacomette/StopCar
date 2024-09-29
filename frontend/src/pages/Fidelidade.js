import React, { useState, useEffect, useContext } from 'react';
import '../components/style/style.css'

import logo from "../img/logo.png"
//import logoSimples from "../img/logoSimples.png"
import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup';
import axios from 'axios';


function createRandomUsers(data) {
  const users = [];
  
  for (let i = 0; i < Object.keys(data).length; i++) {
    users.push(data[i]);
  }

  return users;
}

function Fidelidade({userData}){
  const [tableData, setTableData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonEditPopup, setEditPopup] = useState(false);

  const { setToken, token } = useContext(StoreContext);

  const[formData, setFunc] = useState({
    cpf: '',
    nome: '',
    funcao: '',
    senha: '',
    salario: 0,
    intervalo: '',
    setor: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFunc((prevData) => ({
      ...prevData,
      [name]: value,
    }));
};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
     console.log(tableData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClearUsers = () => {
    setTableData([]);
  }

  const handleCreateUsers = () => {
    setButtonPopup(true);
  }

  const handleEdit = () => {
    setEditPopup(true);
  }

  const handleSubmitModal = (event) => {
    event.preventDefault();
    console.log(formData.cpf);

    axios.post('http://127.0.0.1:5000/api/criaFuncionario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopup(false);
        handleGetUsers(event)

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
        handleGetUsers(event)
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }

  const handleGetUsers = (event) => {
      
    event.preventDefault();
    
    
    axios.get('http://127.0.0.1:5000/api/getFuncionario')
      .then(response => {
        console.log('Resposta do servidor:', response.data);          
        const table = createRandomUsers(response.data)
        setTableData([...table])
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
                      name="tel" 
                      className='dadosUsers' 
                      value={formData.tel}
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
                      name="tel" 
                      className='dadosUsers' 
                      value={formData.tel}
                      onChange={handleInputChange} required />
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