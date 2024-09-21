import React, { useState, useContext } from 'react';

import '../components/style/style.css'
import StoreContext from '../components/Store/Context';


function getTipo(token){
  if(token == 1){
    return 'Operador'
  } else if(token == 2){
    return 'Gerente'
  } else {
    return 'Repositor'
  }
}

function Usuario({userData}){

  const { setToken, token } = useContext(StoreContext);
  const { setNome, nome } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    nome: nome.nome, 
    tipo: getTipo(token.token), 
  });

    return (
          <div className="profile">
            <a className="item-a">
            <span className="item">
            <svg width="64px" height="64px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 616.2m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" fill="#E73B37"></path><path d="M511.6 656.9m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" fill="#E73B37"></path><path d="M512.4 697.7m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" fill="#E73B37"></path><path d="M512 130.8c42.1 0 81.7 16.4 111.5 46.2s46.2 69.4 46.2 111.5-16.4 81.7-46.2 111.5c-29.8 29.8-69.4 46.2-111.5 46.2s-81.7-16.4-111.5-46.2c-29.8-29.8-46.2-69.4-46.2-111.5s16.4-81.7 46.2-111.5 69.4-46.2 111.5-46.2m0-44c-111.4 0-201.6 90.3-201.6 201.6C310.4 399.8 400.7 490 512 490c111.4 0 201.6-90.3 201.6-201.6S623.3 86.8 512 86.8zM512.3 523.5L84 681.4v255.7h856V681.4L512.3 523.5zM896 893.1H128V712.6l384.3-142.4L896 712.6v180.5z" fill="#39393A"></path><path d="M555.4 585.3l-1.4-0.5v159.9c0 11.7-4.8 22.3-12.4 30-7.7 7.7-18.3 12.4-30 12.4-23.4 0-42.4-19-42.4-42.4V585.3l-1.4 0.5-14.6 5.2v153.8c0 32.2 26.2 58.4 58.4 58.4S570 777 570 744.8V590.5l-14.6-5.2z" fill="#E73B37"></path></g></svg>
            <div className='texts'>
               <div className="text-span" value={formData.nome}>{formData.nome}</div>
            <div className="text-span" value={formData.tipo}>{formData.tipo}</div>
            </div>
           
            </span>
            </a>
          </div>
        
  );
}

export default Usuario;