import React from 'react';
import Context from './Context';
import useStorage from '../utils/useStorage.js';

const StoreProvider = ({ children }) => {
  const [token, setToken] = useStorage('token');
  const [cpf, setCpf] = useStorage('cpf');
  const [nome, setNome] = useStorage('nome');

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        cpf,
        setCpf,
        nome,
        setNome,
      }}
    >
      {children}
    </Context.Provider>
  )
}


export default StoreProvider;