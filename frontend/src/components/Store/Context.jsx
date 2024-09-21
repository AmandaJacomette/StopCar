import { createContext } from 'react';

const StoreContext = createContext({
  token: null,
  setToken: () => {},
  cpf: null,
  setCpf: () => {},
  nome: null,
  setNome: () => {},
});

export default StoreContext;