import React, { useState, useEffect, useContext } from 'react';
import '../components/style/style.css'
import Popup from '../components/Popup';
import axios from 'axios';

function Fidelidade({userData}){
  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonEditPopup, setEditPopup] = useState(false);

  const[formData, setFunc] = useState({
    cpf: '',
    nome: '',
    email: '',
    telefone: ''
  });

  const[formDataEdit, setEdit] = useState({
    cpf: '',
    nome: '',
    email: '',
    telefone: ''
  });

  const [successMessage, setSuccessMessage] = useState(''); // Estado para mensagem de sucesso
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Estado para controle do pop-up

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000); // Pop-up some após 3 segundos
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFunc((prevData) => ({
      ...prevData,
      [name]: value,
    }));
};

const handleInputChangeEdit = (event) => {
  const { name, value } = event.target;
  setEdit((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};
  const handleClearUsers = () => {
    setFunc({
      cpf: '',
      nome: '',
      email: '',
      telefone: ''
    });
  }

  const handleClearEdit = () => {
    setEdit({
      cpf: '',
      nome: '',
      email: '',
      telefone: ''
    });
  }

  const handleCreateUsers = () => {
    handleClearUsers()
    setButtonPopup(true);
  }

  const handleEdit = () => {
    handleClearEdit()
    setEditPopup(true);
  }

  const handleSubmitModal = (event) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:5000/api/criaCliente', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        if (response.data.error === false) {
          setButtonPopup(false);
          showSuccess('Cliente criado com sucesso!');
        } else {
          window.alert(response.data.message);
        }
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const handleSubmitEdit = (event) => {
    event.preventDefault();
    console.log(formDataEdit.cpf);

    axios.post('http://127.0.0.1:5000/api/editarCliente', formDataEdit)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        if (response.data.error === false) {
          setEditPopup(false);
          showSuccess('Cliente alterado com sucesso!');
        } else {
          window.alert(response.data.message);
        }
        
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
                <label className='modalLabel' for="quantidade">
                  Carro: 
                </label>
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
                <button className= "modalButton" type = "submit" >Criar</button>
              </div>
              
              </form> 
          </div>
        </Popup>

        <Popup trigger={buttonEditPopup} setTrigger={setEditPopup}>
          <div className='container-modal'>
            <div className="text-modal">Editar Cliente</div>
            <form onSubmit={handleSubmitEdit}>
            <div class="form-row">
                <div class="input-modal">
                  

                  <label className='modalLabel' for="cdprod">
                    Digite o CPF do cliente que será editado
                  </label>
                  <input 
                      name="cpf" 
                      className='dadosUsers' 
                      value={formDataEdit.cpf}
                      onChange={handleInputChangeEdit} required/>

                  <label className='modalLabel' for="cdprod">
                    Digite os dados a serem editados: 
                  </label>

                  <label className='modalLabel' for="cdprod">
                    Nome
                  </label>
                  <input 
                      name="nome" 
                      className='dadosUsers' 
                      value={formDataEdit.nome}
                      onChange={handleInputChangeEdit} />

                  <label className='modalLabel' for="quantidade">
                    Email
                  </label>
                  <input 
                      name="email" 
                      className='dadosUsers' 
                      value={formDataEdit.email}
                      onChange={handleInputChangeEdit}  />
                
                  <label className='modalLabel' for="quantidade">
                    Telefone
                  </label>
                  <input 
                      name="telefone" 
                      className='dadosUsers' 
                      value={formDataEdit.telefone}
                      onChange={handleInputChangeEdit}  />
                </div>
              </div>
              <div className='divButtonPopup'>
                <button className= "modalButton" type = "submit" >Editar</button>
              </div>
              </form> 
          </div>
        </Popup>

        {showSuccessPopup && (
          <div className="success-popup">
            {successMessage}
          </div>
        )}
      
        </div>
  );
}

export default Fidelidade;