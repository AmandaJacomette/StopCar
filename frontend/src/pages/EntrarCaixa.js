import React, { useState, useContext } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../img/logo.png"
//import logoSimples from "../img/logoSimples.png"
import StoreContext from '../components/Store/Context';

function EntrarCaixa({userData}){
  const { setToken, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: ' ',
        cpf: ' ',
        caixa: '20', 
        hora: '09:00', 
    });
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/", {state: {userData: userData}});

        /*axios.post('http://127.0.0.1:5000/api/sendDados', formData)
          .then(response => {
            console.log('Resposta do servidor:', response.data);
          })
          .catch(error => {
            console.error('Erro ao enviar dados:', error);
          });*/
      };
    

    return (
        <div >
          <header className='header-caixa'>
          <img src={logo} className='logoHeader'/>
          </header>
          <div className="App-header">
          <form onSubmit={handleSubmit}>
            <div className='form'>
                <label>
                    Caixa:<br/>
                    <input 
                        name="caixa" 
                        value={formData.caixa}
                        onChange={handleInputChange} />
                </label>
                <label>
                    Hora de entrada:<br/>
                    <input 
                        name="hora" 
                        value={formData.hora}
                        onChange={handleInputChange} />
                </label>
                <button type="submit"> Entrar </button>
                
            </div>
        </form>
          </div>
        </div>
  );
}

export default EntrarCaixa;