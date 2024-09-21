import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';
import axios from 'axios';
import Popup from '../components/Popup';

function createTableEst(data) {
  const estoque = [];
  
  for (let i = 0; i < Object.keys(data.secao).length; i++) {
    estoque.push({
      idestoque: data['idestoque'][i],
      secaoEstoq: data['secao'][i],
      prod: data['prodnome'][i],
      qtdeAtualProdEstoq: data['quantatualprod'][i]
    });
  }

  return estoque;
}

function createTablePrat(data) {
  const estoque = [];
  
  for (let i = 0; i < Object.keys(data.secao).length; i++) {
    estoque.push({
      idprat: data['idprat'][i],
      secaoPrat: data['secao'][i],
      prod: data['prodnome'][i],
      qtdeAtualProdPrat: data['quantatualprod'][i]
    });
  }

  return estoque;
}

function EstoqueePrateleiras({userData}){
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [tableDataPrat, setTableDataPrat] = useState([]);
  const { setToken, token } = useContext(StoreContext);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonPopupPrat, setButtonPopupPrat] = useState(false);


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

  const[formData, setEstoque] = useState({
    id: 0,
    quantidade: 0
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEstoque((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitModal = (event) => {
    event.preventDefault();
    console.log(formData.id);
    console.log(formData.quantidade);

    axios.post('http://127.0.0.1:5000/api/atualizaEstoque', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopup(false);
        handleCreateEstoque(event)
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const handleSubmitPrat = (event) => {
    event.preventDefault();
    console.log(formData.id);
    console.log(formData.quantidade);

    axios.post('http://127.0.0.1:5000/api/atualizaPrateleira', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopupPrat(false);
        handleCreatePrat(event)
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  

const handleCreateEstoque = (event) => {
  event.preventDefault();
      
  axios.get('http://127.0.0.1:5000/api/getEstoque')
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      const table = createTableEst(response.data)
      setTableData([...table])
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
}

const handleCreatePrat = (event) => {
  event.preventDefault();
      
  axios.get('http://127.0.0.1:5000/api/getPrateleira')
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      const table = createTablePrat(response.data)
      setTableDataPrat([...table])
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
}

const handleReporEstoque = () => {
  setButtonPopup(true);
}

const handleReporPrateleira = () => {
  setButtonPopupPrat(true);
}

    return (
      <div className="container">
        <div className="mform">
          <div className = "text">Estoque</div>
          <button className= "update-btn" onClick={handleCreateEstoque}>Recarregar...</button>
          { token.token == 3 ?
            <button className= "update-btn" onClick={handleReporEstoque}>Repor</button>
          : ""}
          
          <div className="mtable">
            <div class="table">
              <div class="table-header">

                <div class="header__item">
                  <a id="idestoque" class="filter__link filter__link--number" >
                  ID Estoque
                  </a>
                </div>
    
                <div class="header__item">
                  <a id="secaoEstoq" class="filter__link filter__link--number" >
                  Seção
                  </a>
                </div>
                  
                <div class="header__item">
                  <a id="prod" class="filter__link filter__link--number">
                  Produto
                  </a>
                </div>
                  
                <div class="header__item">
                  <a id="qtdeAtualProdEstoq" class="filter__link filter__link--number">
                  Quantidade de Produtos
                  </a>
                </div>
              </div>

              <div class="table-content">
              {
                tableData.map((obj) => {
                  return (
                    <div class="table-row">
                      <div class="table-data">{obj.idestoque}</div>
                      <div class="table-data">{obj.secaoEstoq}</div>
                      <div class="table-data">{obj.prod}</div>
                      <div class="table-data">{obj.qtdeAtualProdEstoq}</div>
                    </div>
                  );
                })
              }
              </div>
            </div>
          </div>
        </div>

        <div className="mform">
          <div className = "text">Prateleiras</div>
          <button className= "update-btn" onClick={handleCreatePrat}>Recarregar...</button>
          { token.token == 3 ?
            <button className= "update-btn" onClick={handleReporPrateleira}>Repor</button>
          : ""}
          
          <div className="mtable">
            <div class="table">
              <div class="table-header">
    
              <div class="header__item">
                  <a id="idprat" class="filter__link filter__link--number" >
                  ID Prateleira
                  </a>
                </div>
    
                <div class="header__item">
                  <a id="secaoEstoq" class="filter__link filter__link--number" >
                  Seção
                  </a>
                </div>
                  
                <div class="header__item">
                  <a id="prod" class="filter__link filter__link--number">
                  Produto
                  </a>
                </div>
                  
                <div class="header__item">
                  <a id="qtdeAtualProdEstoq" class="filter__link filter__link--number">
                  Quantidade de Produtos
                  </a>
                </div>
              </div>

              <div class="table-content">
                {
                  tableDataPrat.map((obj) => {
                    return (
                      <div class="table-row">
                        <div class="table-data">{obj.idprat}</div>
                        <div class="table-data">{obj.secaoPrat}</div>
                        <div class="table-data">{obj.prod}</div>
                        <div class="table-data">{obj.qtdeAtualProdPrat}</div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>

        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <div className='container-modal'>
            <div className="text-modal">Repor Estoque</div>
            <form onSubmit={handleSubmitModal}>
              <div class="input-modal">
                <label className='modalLabel' for="cdprod">
                  ID Estoque
                </label>
                <input 
                  name="id" 
                  className='dadosEncomenda' 
                  value={formData.idestoque}
                  onChange={handleInputChange} required/>

              </div>
              <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Quantidade
                </label>
                <input 
                  name="quantidade" 
                  className='dadosEncomenda' 
                  value={formData.quantidade}
                  onChange={handleInputChange} required />
    
                   
              </div>
              <button className= "modalButton" 
                      type = "submit" >
                Atualizar
              </button>
            </form> 
          </div>
        </Popup>

        <Popup trigger={buttonPopupPrat} setTrigger={setButtonPopupPrat}>
          <div className='container-modal'>
            <div className="text-modal">Repor Prateleira</div>
            <form onSubmit={handleSubmitPrat}>
              <div class="input-modal">
                <label className='modalLabel' for="cdprod">
                  ID Prateleira
                </label>
                <input 
                  name="id" 
                  className='dadosEncomenda' 
                  value={formData.idprat}
                  onChange={handleInputChange} required/>

              </div>
              <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Quantidade
                </label>
                <input 
                  name="quantidade" 
                  className='dadosEncomenda' 
                  value={formData.quantidade}
                  onChange={handleInputChange} required />
    
                   
              </div>
              <button className= "modalButton" 
                      type = "submit" >
                Atualizar
              </button>
            </form> 
          </div>
        </Popup>

      </div>
  );
}

export default EstoqueePrateleiras;