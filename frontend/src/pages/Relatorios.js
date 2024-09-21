import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';
import axios from 'axios';

import logo from "../img/logo.png"
//import logoSimples from "../img/logoSimples.png"

function createTableEst(data) {
  const estoque = [];
  
  for (let i = 0; i < Object.keys(data.secao).length; i++) {
    estoque.push({
      secaoEstoq: data['secao'][i],
      prod: data['prodnome'][i],
      qtdeAtualProdEstoq: data['quantatualprod'][i]
    });
  }

  return estoque;
}

function createRandomInfo(count = 5) {
  const chamados = [];
  
  for (let i = 0; i < count; i++) {
    chamados.push({
      totalFunc: (i) * 150,
      totalVendas: 20000 + (400 * i) + 0.75,
      totalForn: 134 + (i * 5),
      totalProdutos: 35335 + (250 * i),
      totalPrateleiras: 168,
      dataPeriodo: "01-0" + (i + 1) + "-2024"
    });
  }

  return chamados;
}

function Relatorios({userData}){

  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const { setToken, token } = useContext(StoreContext);
  
  
  useEffect(() => {
    fetchData();
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

  const handleClearInfo = () => {
    setTableData([]);
  }



const handleCreateInfo = (event) => {
  event.preventDefault();
      
  axios.get('http://127.0.0.1:5000/api/getEstoque')
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      const table = createTableEst(response.data)
      setTableData([...tableData, ...table])
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
}


    return (
      <div className="mform">
        <div className = "text">Relatório</div>
        <button className= "update-btn" onClick={handleCreateInfo}>Atualizar...</button>
        <div className="mtable">
          <div class="table">
            <div class="table-header">
      
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

  );
}

export default Relatorios;