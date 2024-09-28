from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import requests
import json
import pandas as pd
import psycopg2
from datetime import datetime

def calcular_diferenca_em_horas(data_armazenada):
    # Converter a string de data/hora armazenada no banco para um objeto datetime
    data_armazenada_dt = datetime.strptime(data_armazenada, '%Y-%m-%d %H:%M:%S')
    
    # Pegar a data/hora atual
    data_atual = datetime.now()
    
    # Calcular a diferença entre as duas datas
    diferenca = data_atual - data_armazenada_dt
    
    # Converter a diferença para horas
    diferenca_em_horas = diferenca.total_seconds() / 3600
    
    return diferenca_em_horas
 
# Initializing flask app
app = Flask(__name__)
CORS(app)

# Função para criar conexão no banco
def conecta_db():
  con = psycopg2.connect(host='localhost', 
                         database='stopCar',
                         user='postgres', 
                         password='147258')
  return con

# Função para consultas no banco
def consultar_db(sql):
  con = conecta_db()
  cur = con.cursor()
  cur.execute(sql)
  recset = cur.fetchall()
  registros = []
  for rec in recset:
    registros.append(rec)
  con.close()
  return registros

def inserir_db(sql):
  con = conecta_db()
  cur = con.cursor()
  try:
    cur.execute(sql)
    con.commit()
  except (Exception, psycopg2.DatabaseError) as error:
    print("Error: %s" % error)
    con.rollback()
    cur.close()
    return 1
  con.close()

##################   ROTAS   ######################
 
@app.route('/api/login', methods=['POST'])
def send_data():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    login = data['login']
    senha = data['senha']
    reg = consultar_db('select nome_atendente from public.atendente where email_atendente = \'' + login +'\' and senha_atendente = \''+ str(senha) + '\'')
    print("Dados banco:", reg)
    if(len(reg) > 0):
        df_bd = pd.DataFrame(reg, columns=['nome_atendente'])
        df_bd.head()
        df_bd = df_bd.to_dict()
        data = {'error': False,
                'nome': df_bd['nome_atendente'][0]}
        result = 0
    
    else:
       df_bd = {}
       data = {'error': True,
               'mensage': 'Não foi possivel encontrar o funcionario'}
    return data

@app.route('/api/getVagas', methods=['GET'])
def get_vagas():
    vagasBD = consultar_db('SELECT * FROM VAGAS ORDER BY id_vaga')
    df_bd = pd.DataFrame(vagasBD, columns=['id_vaga', 'liberada'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    vagas = []
    for i in range(len(df_bd['id_vaga'])):
        liberada = "Ocupada"
        if(df_bd['liberada'][i] == True):
            liberada = "Livre"
        vagas.append({'id_vaga': df_bd['id_vaga'][i],
            'liberada': liberada})
        
    
    print("Dados vagas:", vagas)
    return vagas

@app.route('/api/cadastraVeiculo', methods=['POST'])
def create_veiculos():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    tipo = data['tipo']
    placa = data['placa']
    cor = data['cor']
    modelo = data['modelo']
    vaga = data['vaga']
    
    inserir_db('INSERT INTO veiculo (tipo, placa, cor, modelo) VALUES ( \''+ tipo +'\', \'' + placa + '\', \''+ cor + '\', \'' + modelo + '\')')
    veiculo = busca_veiculo(placa)
    
    df_bd = pd.DataFrame(veiculo, columns=['id_veiculo'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    veiculoCadastrado = []
    for i in range(len(df_bd['id_veiculo'])):
        veiculoCadastrado.append({'id_veiculo': df_bd['id_veiculo'][i]})
    veiculoEntrando = veiculoCadastrado[0]['id_veiculo']
    print("carro ", veiculoCadastrado)
    preenche_vaga(veiculoEntrando, vaga)

    return data

@app.route('/api/veiculoCadastrado', methods=['POST'])
def veiculo_cadastrado():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    placa = data['placa']
    vaga = data['vaga']
    
    veiculo = busca_veiculo(placa)
    
    df_bd = pd.DataFrame(veiculo, columns=['id_veiculo'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    veiculoCadastrado = []
    for i in range(len(df_bd['id_veiculo'])):
        veiculoCadastrado.append({'id_veiculo': df_bd['id_veiculo'][i]})

    veiculoEntrando = veiculoCadastrado[0]['id_veiculo']
    print("carro ", veiculoCadastrado)
    preenche_vaga(veiculoEntrando, vaga)

    return data

def busca_veiculo(placa):
    veiculo = consultar_db('SELECT id_veiculo ' +
                             'FROM veiculo '+
                             'WHERE placa = \'' + str(placa)+ '\'')
    
    return veiculo


def preenche_vaga(veiculo, vaga):
    data_e_hora_atuais = datetime.now()
    data_e_hora_em_texto = data_e_hora_atuais.strftime('%Y-%m-%d %H:%M:%S')
    inserir_db('INSERT INTO estacionado (veiculo, vaga, horaentrada) VALUES ( \''+ str(veiculo) +'\', \'' + str(vaga) + '\', \'' + str(data_e_hora_em_texto) + '\')')
    inserir_db('UPDATE vagas SET liberada = false WHERE id_vaga = \'' + str(vaga) + '\'')

@app.route('/api/getFinalizacao', methods=['POST'])
def get_finalizacao():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    vaga = data['vaga']
    vagasBD = consultar_db('SELECT E.*, V.* FROM estacionado E, veiculo V WHERE V.id_veiculo = E.veiculo AND E.vaga = \'' +str(vaga)+ '\'')
    df_bd = pd.DataFrame(vagasBD, columns=['id_est', 'veiculo', 'vaga', 'horaentrada', 'id_veiculo', 'tipo', 'placa', 'cor', 'modelo'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    preenchida = []
    for i in range(len(df_bd['id_est'])):

        diferenca = calcular_diferenca_em_horas(df_bd['horaentrada'][i])
        valor = round(diferenca, 2) * 10
        
        preenchida.append({'id_est': df_bd['id_est'][i],
            'placa': (df_bd['placa'][i]).upper(),
            'id_veiculo': df_bd['id_veiculo'][i],
            'vaga': df_bd['vaga'][i],
            'horaentrada': df_bd['horaentrada'][i],
            'horas': round(diferenca, 2),
            'valor': round(valor, 2)})
        
    
    print("Dados vagas:", preenchida)
    return preenchida

@app.route('/api/encerraVaga', methods=['POST'])
def encerrar_vaga():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    vaga = data['vaga']
    id_veiculo = data['id_veiculo']
    inserir_db('DELETE FROM estacionado WHERE veiculo = \'' +str(id_veiculo)+ '\' AND vaga = \'' +str(vaga)+ '\'')
    inserir_db('UPDATE vagas SET liberada = TRUE WHERE id_vaga = \'' +str(vaga)+ '\'')

    return data
    


@app.route('/api/atualizaEncomenda', methods=['POST'])
def update_encomenda():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    status = data['status']
    encomenda = inserir_db('UPDATE ENCOMENDA SET STATUS = \'' + status +'\' WHERE IDENCOMENDA = ' + id)
    data = {'error': False}
    return data

@app.route('/api/atualizaEstoque', methods=['POST'])
def update_estoque():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    quantidade = data['quantidade']
    encomenda = inserir_db('UPDATE ESTOQUE SET QUANTATUALPROD = \'' + quantidade +'\' WHERE IDESTOQUE = ' + id)
    data = {'error': False}
    return data

@app.route('/api/atualizaPrateleira', methods=['POST'])
def update_prateleira():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    quantidade = data['quantidade']
    encomenda = inserir_db('UPDATE PRATELEIRA SET QUANTATUALPROD = \'' + quantidade +'\' WHERE IDPRAT = ' + id)
    data = {'error': False}
    return data

@app.route('/api/deletaEncomenda', methods=['POST'])
def delete_encomenda():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    encomenda = inserir_db('DELETE FROM ENCOMENDA WHERE idencomenda = ' + id)
    data = {'error': False}
    return data



@app.route('/api/getEstoque', methods=['GET'])
def get_estoque():
    estoque = consultar_db('SELECT E.IDESTOQUE, P.PRODNOME, E.QUANTATUALPROD, E.SECAO ' +
                             'FROM ESTOQUE E, PRODUTO P '+
                             'WHERE E.CDPROD = P.CODBARRAS')
    df_bd = pd.DataFrame(estoque, columns=['idestoque', 'prodnome', 'quantatualprod', 'secao'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    print("Dados banco:", df_bd)
    return df_bd

@app.route('/api/getPrateleira', methods=['GET'])
def get_prateleira():
    estoque = consultar_db('SELECT T.IDPRAT, T.SECAO, P.PRODNOME, T.QUANTATUALPROD '+
                            'FROM PRATELEIRA T, PRODUTO P '+
                            'WHERE T.CDPROD = P.CODBARRAS')
    df_bd = pd.DataFrame(estoque, columns=['idprat', 'secao', 'prodnome', 'quantatualprod'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    print("Dados banco:", df_bd)
    return df_bd

@app.route('/api/criaChamado', methods=['POST'])
def create_chamado():
    chamado = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", chamado)
    cpffuncionario = '12345678910'
    nome = chamado['nome']
    departamento = chamado['departamento']
    titulo = chamado['titulo']
    assunto = chamado['assunto']
    inserir_db('INSERT INTO RECURSOSHUMANOS(cpffuncionario, nomefuncionario,'+
               ' departamento, titulo, assunto) '+
                ' VALUES ( \''+ cpffuncionario +'\', \'' + nome + '\', '+ departamento +', \'' + titulo + '\', \'' + assunto + '\')')
    
    return chamado

@app.route('/api/entraCaixa', methods=['POST'])
def entra_caixa():
    chamado = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", chamado)
    idope = chamado['idope']
    idcaixa = chamado['idcaixa']
    inserir_db('INSERT INTO OPERA'+
                ' VALUES ( \''+ str(idope) +'\', \'' + str(idcaixa) + '\', \''+ str(datahj) +'\', \''+ str(datahj) +'\')')
    
    return chamado

@app.route('/api/getChamado', methods=['GET'])
def get_chamado():
    estoque = consultar_db('SELECT * FROM RECURSOSHUMANOS')
    df_bd = pd.DataFrame(estoque, columns=['idchamado', 'cpffuncionario', 'nomefuncionario', 'departamento', 'titulo', 'assunto'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    print("Dados banco:", df_bd)
    return df_bd


@app.route('/api/deletaChamado', methods=['POST'])
def delete_chamado():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    chamado = inserir_db('DELETE FROM RECURSOSHUMANOS WHERE idencomenda = ' + id)
    data = {'error': False}
    return data


@app.route('/api/getFuncionario', methods=['GET'])
def get_funcionario():
    operador = consultar_db('SELECT O.CPFOP, O.OPNOME, O.SALARIOOP, O.DATAINIOP, O.HORAINTER FROM OPERADOR O')
    repositor = consultar_db('SELECT R.CPFREP, R.REPNOME, R.SALARIOREP, R.DATAINIREP FROM REPOSITOR R')
    df_bd1 = pd.DataFrame(operador, columns=['cpfop', 'opnome', 'salarioop', 'datainiop', 'horainter'])
    df_bd2 = pd.DataFrame(repositor, columns=['cpfrep', 'repnome', 'salariorep', 'datainirep'])
    df_bd1.head()
    df_bd2.head()
    df_bd1 = df_bd1.to_dict()
    df_bd2 = df_bd2.to_dict()
    print("Dados banco op:", df_bd1)
    print("Dados banco rep:", df_bd2)

    dict_funcionarios = []
    
    for i in range(len(df_bd1['cpfop'])):
    #for operador in df_bd1:
        dict_funcionarios.append({'cpf': df_bd1['cpfop'][i],
            'nome': df_bd1['opnome'][i],
            'salario': df_bd1['salarioop'][i],
            'dataInicio': str(df_bd1['datainiop'][i]),
            'horaIntervalo': str(df_bd1['horainter'][i]),
            'funcao': 'Operador'})
        

    for i in range(len(df_bd2['cpfrep'])):
    #for repositor in df_bd2:
        dict_funcionarios.append({'cpf': df_bd2['cpfrep'][i],
          'nome': df_bd2['repnome'][i],
          'salario': df_bd2['salariorep'][i],
          'dataInicio': str(df_bd2['datainirep'][i]),
          'horaIntervalo': '12:15',
          'funcao': 'Repositor'})


    print("Dados retorno:", dict_funcionarios)
    return json.dumps(dict_funcionarios)

@app.route('/api/criaFuncionario', methods=['POST'])
def create_funcionario():
    funcionario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", funcionario)
    if(funcionario['funcao'] == 'Operador'):
        cpf = funcionario['cpf']
        nome = funcionario['nome']
        ##funcao = funcionario['funcao']
        senha = funcionario['senha']
        salario = funcionario['salario']
        ##datainiop = funcionario['datainiop']
        horainter =funcionario['intervalo']
        inserir_db('INSERT INTO OPERADOR(senhaop, opnome, cpfop, datainiop, salarioop, horainter) '+
                ' VALUES ( ' + senha + ', \'' + nome + '\',  \''+ cpf +'\',\'' + str(datahj) + '\', ' + salario + ',  \'' + horainter + '\')')
    if(funcionario['funcao'] == 'Repositor'):
        cpf = funcionario['cpf']
        nome = funcionario['nome']
        ##funcao = funcionario['funcao']
        senha = funcionario['senha']
        salario = funcionario['salario']
        setor = funcionario['setor']
        ##datainirep = funcionario['datainirep']
        ##horainter =funcionario['horainter']
        inserir_db('INSERT INTO REPOSITOR( senharep, repnome, cpfrep, datainirep, salariorep, setor) '+
                ' VALUES ( ' + senha + ', \'' + nome + '\', \''+ cpf +'\', \'' + str(datahj) + '\', ' + salario + ', \'' + setor+ '\')')

    return funcionario

@app.route('/api/deletaFuncionario', methods=['POST'])
def delete_funcionario():
    funcionario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", funcionario)
    if(funcionario['funcao'] == 'Operador'):
        cpfop = funcionario['cpf']
        funcionario = inserir_db('DELETE FROM OPERA WHERE idope = \'' + cpfop + '\'')
        funcionario = inserir_db('DELETE FROM OPERADOR WHERE cpfop = \'' + cpfop + '\'')
        
    elif(funcionario['funcao'] == 'Repositor'):
        cpfrep = funcionario['cpf']
        funcionario = inserir_db('DELETE FROM REPOSITOR WHERE cpfrep = \'' + cpfrep +'\'')
    funcionario = {'error': False}
    return funcionario

# Running app
if __name__ == '__main__':
    app.run(debug=True)


