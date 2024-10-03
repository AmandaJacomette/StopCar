from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import requests
import json
import pandas as pd
import psycopg2
from datetime import datetime

# Singleton para conexão com o banco de dados
class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            try:
                cls._instance = super(DatabaseConnection, cls).__new__(cls)
                cls._instance.connection = psycopg2.connect(
                    host='localhost',
                    database='StopCar',
                    user='postgres',
                    password='147258'
                )
                print("Conexão ao banco de dados estabelecida.")
            except Exception as e:
                print(f"Erro ao conectar ao banco de dados: {e}")
                cls._instance = None
        return cls._instance

    def get_connection(self):
        return self.connection

# Padrão Factory para geração de consultas SQL
class QueryFactory:
    
    @staticmethod
    def select_query(table, columns='*', where_clause=None, order_by=None):
        query = f"SELECT {columns} FROM {table}"
        if where_clause:
            query += f" WHERE {where_clause}"
        if order_by:
            query += f" ORDER BY {order_by}"
        return query

    @staticmethod
    def insert_query(table, columns, values):
        columns_str = ', '.join(columns)
        values_str = ', '.join([f"'{v}'" for v in values])
        return f"INSERT INTO {table} ({columns_str}) VALUES ({values_str})"

    @staticmethod
    def update_query(table, updates, where_clause=None):
        updates_str = ', '.join([f"{col} = '{val}'" for col, val in updates.items()])
        query = f"UPDATE {table} SET {updates_str}"
        if where_clause:
            query += f" WHERE {where_clause}"
        return query

    @staticmethod
    def delete_query(table, where_clause):
        return f"DELETE FROM {table} WHERE {where_clause}"

# Funções auxiliares para manipulação do banco de dados
def consultar_db(query):
    try:
        con = DatabaseConnection().get_connection()
        cur = con.cursor()
        cur.execute(query)
        recset = cur.fetchall()
        cur.close()
        return recset
    except Exception as e:
        print(f"Erro na consulta: {e}")
        con.rollback()  # Rollback da transação em caso de erro
        cur.close()
        return []

def inserir_db(query):
    try:
        con = DatabaseConnection().get_connection()
        cur = con.cursor()
        cur.execute(query)
        con.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Erro ao inserir no banco de dados: {error}")
        con.rollback()  # Rollback da transação em caso de erro
        cur.close()
    finally:
        if con:
            cur.close()


# Inicializando o Flask
app = Flask(__name__)
CORS(app)

# Função para calcular diferença em horas (Comecar testes daqui)
def calcular_diferenca_em_horas(data_armazenada):
    data_armazenada_dt = datetime.strptime(data_armazenada, '%Y-%m-%d %H:%M:%S')
    data_atual = datetime.now()
    diferenca = data_atual - data_armazenada_dt
    diferenca_em_horas = diferenca.total_seconds() / 3600
    return diferenca_em_horas

def busca_veiculo(placa):
    query = QueryFactory.select_query(
        table='veiculo',
        columns='id_veiculo',
        where_clause=f"placa = '{placa}'"
    )
    return consultar_db(query)

def preenche_vaga(veiculo, vaga):
    data_e_hora_em_texto = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    insert_query = QueryFactory.insert_query(
        table='estacionado',
        columns=['veiculo', 'vaga', 'horaentrada'],
        values=[veiculo, vaga, data_e_hora_em_texto]
    )
    
    update_query = QueryFactory.update_query(
        table='vagas',
        updates={'liberada': 'false'},
        where_clause=f"id_vaga = '{vaga}'"
    )
    
    inserir_db(insert_query)
    inserir_db(update_query)

def busca_cliente_veiculo(cpf):
    query = QueryFactory.select_query(
        table='veiculo_cliente',
        columns='veiculo',
        where_clause=f"cliente = '{cpf}'"
    )
    return consultar_db(query)

def updade_fidelidade(cpf):

    query = QueryFactory.select_query(
        table='cliente',
        columns='fidelidade',
        where_clause=f"cpf = '{cpf}'"
    )
    result = consultar_db(query)

    df_bd = pd.DataFrame(result, columns=['fidelidade']).to_dict()
    fidelidade = df_bd['fidelidade'][0]
    fidelidade += 1

    query = QueryFactory.update_query(
        table='cliente',
        updates={'fidelidade': fidelidade},
        where_clause=f"cpf = '{cpf}'"
    )
    return inserir_db(query)

##################   ROTAS   ######################

@app.route('/api/login', methods=['POST'])
def send_data():
    data = request.json
    login = data['login']
    senha = data['senha']
    
    query = QueryFactory.select_query(
        table='public.atendente', 
        columns='nome_atendente', 
        where_clause=f"email_atendente = '{login}' AND senha_atendente = '{senha}'"
    )
    
    reg = consultar_db(query)
    if len(reg) > 0:
        df_bd = pd.DataFrame(reg, columns=['nome_atendente']).to_dict()
        return {'error': False, 'nome': df_bd['nome_atendente'][0]}
    else:
        return {'error': True, 'mensagem': 'Não foi possível encontrar o funcionário'}

@app.route('/api/getVagas', methods=['GET'])
def get_vagas():
    query = QueryFactory.select_query('vagas', order_by='id_vaga')
    vagasBD = consultar_db(query)
    df_bd = pd.DataFrame(vagasBD, columns=['id_vaga', 'liberada']).to_dict()

    vagas = []
    for i in range(len(df_bd['id_vaga'])):
        status_vaga = "Livre" if df_bd['liberada'][i] else "Ocupada"
        vagas.append({'id_vaga': df_bd['id_vaga'][i], 'liberada': status_vaga})
    
    return jsonify(vagas)

@app.route('/api/cadastraVeiculo', methods=['POST'])
def create_veiculos():
    data = request.json
    tipo = data['tipo']
    placa = data['placa']
    cor = data['cor']
    modelo = data['modelo']
    vaga = data['vaga']
    
    query = QueryFactory.insert_query(
        table='veiculo',
        columns=['tipo', 'placa', 'cor', 'modelo'],
        values=[tipo, placa, cor, modelo]
    )
    
    inserir_db(query)
    
    veiculo = busca_veiculo(placa)
    df_bd = pd.DataFrame(veiculo, columns=['id_veiculo']).to_dict()
    veiculoEntrando = df_bd['id_veiculo'][0]
    
    preenche_vaga(veiculoEntrando, vaga)
    return jsonify(data)

@app.route('/api/veiculoCadastrado', methods=['POST'])
def veiculo_cadastrado():
    data = request.json
    placa = data['placa']
    vaga = data['vaga']
    
    veiculo = busca_veiculo(placa)
    df_bd = pd.DataFrame(veiculo, columns=['id_veiculo']).to_dict()
    veiculoEntrando = df_bd['id_veiculo'][0]
    
    preenche_vaga(veiculoEntrando, vaga)
    return jsonify(data)

@app.route('/api/getFinalizacao', methods=['POST'])
def get_finalizacao():
    data = request.json
    vaga = data['vaga']
    
    query = QueryFactory.select_query(
        table='estacionado E, veiculo V',
        columns='E.*, V.*',
        where_clause=f"V.id_veiculo = E.veiculo AND E.vaga = '{vaga}'"
    )
    
    vagasBD = consultar_db(query)
    df_bd = pd.DataFrame(vagasBD, columns=['id_est', 'veiculo', 'vaga', 'horaentrada', 'id_veiculo', 'tipo', 'placa', 'cor', 'modelo']).to_dict()
    
    preenchida = []
    for i in range(len(df_bd['id_est'])):
        diferenca = calcular_diferenca_em_horas(df_bd['horaentrada'][i])
        valor = round(diferenca, 2) * 10
        preenchida.append({
            'id_est': df_bd['id_est'][i],
            'placa': df_bd['placa'][i].upper(),
            'id_veiculo': df_bd['id_veiculo'][i],
            'vaga': df_bd['vaga'][i],
            'horaentrada': df_bd['horaentrada'][i],
            'horas': round(diferenca, 2),
            'valor': round(valor, 2)
        })
    
    return jsonify(preenchida)

@app.route('/api/encerraVaga', methods=['POST'])
def encerrar_vaga():
    data = request.json
    vaga = data['vaga']
    id_veiculo = data['id_veiculo']
    
    delete_query = QueryFactory.delete_query(
        table='estacionado',
        where_clause=f"veiculo = '{id_veiculo}' AND vaga = '{vaga}'"
    )
    
    update_query = QueryFactory.update_query(
        table='vagas',
        updates={'liberada': 'TRUE'},
        where_clause=f"id_vaga = '{vaga}'"
    )
    
    inserir_db(delete_query)
    inserir_db(update_query)
    
    return jsonify(data)

@app.route('/api/criaCliente', methods=['POST'])
def create_clientes():
    data = request.json
    nome = data['nome']
    cpf = data['cpf']
    email = data['email']
    telefone = data['telefone']

    tipo = data['tipo']
    placa = data['placa']
    cor = data['cor']
    modelo = data['modelo']
    
    query = QueryFactory.insert_query(
        table='veiculo',
        columns=['tipo', 'placa', 'cor', 'modelo'],
        values=[tipo, placa, cor, modelo]
    )
    
    inserir_db(query)

    veiculo = busca_veiculo(placa)
    df_bd = pd.DataFrame(veiculo, columns=['id_veiculo']).to_dict()
    veiculoEntrando = df_bd['id_veiculo'][0]
    
    
    query = QueryFactory.insert_query(
        table='cliente',
        columns=['cpf', 'nome_cliente', 'email_cliente', 'telefone_cliente'],
        values=[cpf, nome, email, telefone]
    )
    
    inserir_db(query)

    query = QueryFactory.insert_query(
        table='carro_cliente',
        columns=['cliente', 'veiculo'],
        values=[cpf, veiculoEntrando]
    )
    
    inserir_db(query)
    
    return jsonify(data)

@app.route('/api/editarCliente', methods=['POST'])
def edit_clientes():
    data = request.json
    nome = data['nome']
    cpf = data['cpf']
    email = data['email']
    telefone = data['telefone']
    
    updates = {}

    if(nome):
        updates['nome_cliente'] = nome
    if(email):
        updates['email_cliente'] = email
    if(telefone):
        updates['telefone_cliente'] = telefone

    update_query = QueryFactory.update_query(
        table='cliente',
        updates=updates,
        where_clause=f"cpf = '{cpf}'"
    )
    
    inserir_db(update_query)
    
    return jsonify(data)

@app.route('/api/clienteCadastrado', methods=['POST'])
def cliente_cadastrado():
    data = request.json
    cpf = data['cpf']
    vaga = data['vaga']
    
    veiculo = busca_cliente_veiculo(cpf)
    df_bd = pd.DataFrame(veiculo, columns=['veiculo']).to_dict()
    veiculoEntrando = df_bd['veiculo'][0]
    
    preenche_vaga(veiculoEntrando, vaga)
    updade_fidelidade(cpf)
    return jsonify(data)

# Rodando a aplicação
if __name__ == '__main__':
    app.run(debug=True)
