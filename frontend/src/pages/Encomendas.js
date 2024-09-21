import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup';

function createTableEnc(data) {
    const encomendas = [];
    
    for (let i = 0; i < Object.keys(data.idencomenda).length; i++) {
      encomendas.push({
        id: data['idencomenda'][i],
        repnome: data['repnome'][i],
        prodnome: data['prodnome'][i],
        datapedido: data['datapedido'][i],
        quantidade: data['quantidade'][i],
        valor: data['valor'][i],
        status: data['status'][i],
      });
    }
  
    return encomendas;
  }

function Encomendas({userData}){
    //const history = useNavigate();
    const navigate = useNavigate();
    const { setToken, token } = useContext(StoreContext);
    const { setCpf, cpf } = useContext(StoreContext);
    const [tableData, setTableData] = useState([]);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [buttonDeletePopup, setDeletePopup] = useState(false);

    const[formData, setEncomendas] = useState({
            id: 0,
            solicitante: cpf.cpf,
            repnome: 'Funcionário 1',
            prodnome: 'Funcionário 1',
            datapedido: '24-01-2024',
            quantidade: 0,
            valor: 0,
            status: ' '
            
        
    });

    useEffect(() => {
        fetchData();
        console.log(token);
      }, []);
    
      const fetchData = async () => {
        try {
          /*
          const response = await fetch("https://cities-qd9i.onrender.com/agents");
          const agents = await response.json();
          
          setTableData(agents);
          */
         console.log(tableData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    const handleCreateEnc = (event) => {
      
      event.preventDefault();
    
      axios.get('http://127.0.0.1:5000/api/getEncomendas')
        .then(response => {
          console.log('Resposta do servidor:', response.data);          
          const table = createTableEnc(response.data)
          setTableData([...table])
        })
        .catch(error => {
          console.error('Erro ao enviar dados:', error);
        });
        
    }
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEncomendas((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

  const handleSubmit = (event) => {
      event.preventDefault();
      
      axios.post('http://127.0.0.1:5000/api/criaEncomenda', formData)
        .then(response => {
          console.log('Resposta do servidor:', response.data);
        })
        .catch(error => {
          console.error('Erro ao enviar dados:', error);
        });
    };

    const handleChangeStatus = () => {
        setButtonPopup(true);
    }

    const handleDelete = () => {
      setDeletePopup(true);
    }
  
    const handleSubmitModal = (event) => {
      event.preventDefault();
      console.log(formData.id);
      console.log(formData.status);

      axios.post('http://127.0.0.1:5000/api/atualizaEncomenda', formData)
        .then(response => {
          console.log('Resposta do servidor:', response.data);
          setButtonPopup(false);
          handleCreateEnc(event)
        })
        .catch(error => {
          console.error('Erro ao enviar dados:', error);
        });
    }

    const handleSubmitDelete = (event) => {
      event.preventDefault();
      console.log(formData.id);
      console.log(formData.status);

      axios.post('http://127.0.0.1:5000/api/deletaEncomenda', formData)
        .then(response => {
          console.log('Resposta do servidor:', response.data);
          setDeletePopup(false);
          handleCreateEnc(event)
        })
        .catch(error => {
          console.error('Erro ao enviar dados:', error);
        });

        
    }

    return (
      <div className="containerEnc">
        <div className="mform">
        <div class = "text">Encomendas</div>
        <form onSubmit={handleSubmit}>
           
          { token.token == 3 ? 
          <div className='form-all'>
              <div class = "text">
                Criar Encomenda
              </div>
              <div class="form-row">
              <div class="input-data">
                <input 
                        name="solicitante" 
                        className='dadosEncomenda' 
                        value={formData.solicitante}
                        onChange={handleInputChange} required/>
                        <div class="underline"></div>
                    <label for="solicitante">
                    CPF Solicitante
                    </label>
              </div>
              
                
              </div>
              
              <div className="form-row">
              <div class="input-data">
                  <input 
                        name="cdprod" 
                        className='dadosEncomenda' 
                        value={formData.cdprod}
                        onChange={handleInputChange} required/>
                  <div class="underline"></div>
                <label for="cdprod">
                    Código do Produto
                    
                </label>    
                </div>
              <div class = "input-data">
                  <input 
                        name="quantidade" 
                        className='dadosEncomenda' 
                        value={formData.quantidade}
                        onChange={handleInputChange} required />
                  <div class="underline"></div>
                <label for="quantidade">
                    Quantidade do Produto 
                </label>     
                </div>
              </div>
              
                <div class="form-row submit-btn">
                  <div class="input-data">
                    <div class="inner"></div>
                      <input type="submit" value="submit"/>

                  </div>
                </div>
                
                
            </div> : ""}
        </form>
        <div className='encomendasFeitas'>
        <div class = "text">Encomendas Feitas</div>
        <button className= "update-btn" onClick={handleCreateEnc}>Recarregar...</button>
        <button className= "delete-btn" onClick={handleDelete}>Deletar</button>
        { token.token == 2 ?<button className= "update-btn" onClick={handleChangeStatus}>Atualizar</button>: ''}
          <div className="mtable">
     
      <div class="table">
      <div class="table-header">
      <div class="header__item">
          <a id="id" class="filter__link filter__link--number" >
          ID
          </a>
          </div>
        <div class="header__item">
          <a id="repnome" class="filter__link filter__link--number" >
           Nome Solicitante
          </a>
          </div>
          <div class="header__item">
          <a id="prodnome" class="filter__link filter__link--number">
            Produto</a>
          </div>
          <div class="header__item">
          <a id="quantidade" class="filter__link filter__link--number">
            Quantidade do Produto</a>
          </div>
          <div class="header__item">
          <a id="valor" class="filter__link filter__link--number">
           Valor Total</a>
          </div>
          <div class="header__item">
          <a id="status" class="filter__link filter__link--number">
            Status</a>
          </div>
          <div class="header__item">
          <a id="data" class="filter__link filter__link--number">
            Data do Pedido</a>
          </div>
          

        </div>
        <div class="table-content">
          {
            tableData.map((obj) => {
              return (
                <div class="table-row">
                  <div class="table-data">{obj.id}</div>
                  <div class="table-data">{obj.repnome}</div>
                  <div class="table-data">{obj.prodnome}</div>
                  <div class="table-data">{obj.quantidade}</div>
                  <div class="table-data">{obj.valor}</div>
                  <div class="table-data">{obj.status}</div>
                  <div class="table-data">{obj.datapedido}</div>
                  
                </div>
              );
            })
          }
        </div>
      </div>
        </div>

        </div>
      </div>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <div className='container-modal'>
            <div className="text-modal">Atualizar Encomenda</div>
            <form onSubmit={handleSubmitModal}>
              <div class="input-modal">
              <label className='modalLabel' for="cdprod">
                  ID
                </label>
                  <input 
                        name="id" 
                        className='dadosEncomenda' 
                        value={formData.id}
                        onChange={handleInputChange} required/>
                  
                </div>
              <div class = "input-modal">
              <label className='modalLabel' for="quantidade">
                  Status
                </label>
                  <input 
                        name="status" 
                        className='dadosEncomenda' 
                        value={formData.status}
                        onChange={handleInputChange} required />
          
                   
                </div>
              <button className= "modalButton" 
              type = "submit"
             >Atualizar</button>
              </form> 
          </div>
        </Popup>
        <Popup trigger={buttonDeletePopup} setTrigger={setDeletePopup}>
          <div className='container-modal'>
            <div className="text-modal">Deleta Encomenda</div>
            <form onSubmit={handleSubmitDelete}>
              <div class="input-modal">
              <label className='modalLabel' for="cdprod">
                  ID
                </label>
                  <input 
                        name="id" 
                        className='dadosEncomenda' 
                        value={formData.id}
                        onChange={handleInputChange} required/>
                  
                </div>
              <button className= "modalButton" 
              type = "submit"
             >Excluir</button>
              </form> 
          </div>
        </Popup>

      </div>
  );
}

export default Encomendas;