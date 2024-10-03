import pytest
from server import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client

def test_login(client):
    response = client.post('/api/login', json = {
        'login': 'teste@email.com',
        'senha': '123456'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'message' in json_data
    if json_data['error']:
        assert json_data['message'] == 'Não foi possível encontrar o funcionário'

def test_login_falha(client):
    response = client.post('/api/login', json = {
        'login': 'invalido@email.com',
        'senha': 'errada'
    })
    
    json_data = response.get_json()
    json_data['error'] == True
    json_data['message'] == 'Dados inválidos'

def test_get_vagas(client):
    response = client.get('/api/getVagas')
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'data' in json_data
    assert isinstance(json_data['data'], list)


def test_cadastra_veiculo(client):
    response = client.post('/api/cadastraVeiculo', json = {
        'tipo': 'Carro',
        'placa': 'ABC1234',
        'cor': 'Prata',
        'modelo': 'Corolla',
        'vaga': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'placa' in json_data['data']
    assert json_data['data']['placa'] == 'ABC1234'

def test_cadastra_veiculo_falha(client):
    response = client.post('/api/cadastraVeiculo', json = {})
    json_data = response.get_json()

    assert json_data['error'] == True
    assert 'message' in json_data

def test_veiculo_cadastrado(client):
    response = client.post('/api/veiculoCadastrado', json = {
        'placa': 'ABC1234',
        'vaga': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'placa' in json_data['data']
    assert json_data['data']['placa'] == 'ABC1234'

def test_veiculo_cadastrado_falha(client):
    response = client.post('/api/veiculoCadastrado', json = {
        'placa': 'inexistente',
        'vaga': '0'
    })
    json_data = response.get_json()

    assert json_data['error'] == True
    assert json_data['message'] == 'Erro ao registrar veículo na vaga: 0'

def test_get_finalizacao(client):
    response = client.post('/api/getFinalizacao', json = {
        'vaga': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'data' in json_data
    assert isinstance(json_data['data'], list)

def test_get_finalizacao_falha(client):
    response = client.post('/api/getFinalizacao', json = {})
    json_data = response.get_json()

    assert json_data['error'] == True
    assert 'message' in json_data

def test_encerrar_vaga(client):
    response = client.post('/api/encerraVaga', json = {
        'vaga': '1',
        'id_veiculo': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'vaga' in json_data['data']
    assert json_data['data']['vaga'] == '1'

def test_encerrar_vaga_falha(client):
    response = client.post('/api/encerraVaga', json = {})
    json_data = response.get_json()

    assert json_data['error'] == True
    assert json_data['message'] == 'Erro ao encerrar vaga: \'vaga\''

def test_cria_cliente(client):
    response = client.post('/api/criaCliente', json = {
        'nome': 'Alice Silva',
        'cpf': '12345678900',
        'email': 'alice@email.com',
        'telefone': '31987563412',
        'tipo': 'Carro',
        'placa': 'FGH7898',
        'cor': 'Branco',
        'modelo': 'Compass'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'cpf' in json_data['data']
    assert json_data['data']['cpf'] == '12345678900'

def test_cria_cliente_falha(client):
    response = client.post('/api/criaCliente', json = {})
    json_data = response.get_json()

    assert json_data['error'] == True
    assert 'message' in json_data

def test_editar_cliente(client):
    response = client.post('/api/editarCliente', json = {
        'nome': 'Alice Atualizada',
        'cpf': '12345678900',
        'email': 'alice.atualizada@email.com',
        'telefone': '31987563412'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'cpf' in json_data['data']
    assert json_data['data']['cpf'] == '12345678900'

def test_editar_cliente_falha(client):
    response = client.post('/api/editarCliente', json = {})
    json_data = response.get_json()

    assert json_data['error'] == True
    assert json_data['message'] == 'Erro ao atualizar cliente: \'nome\''

def test_cliente_cadastrado(client):
    response = client.post('/api/clienteCadastrado', json = {
        'cpf': '12345678900',
        'vaga': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert 'cpf' in json_data['data']
    assert json_data['data']['cpf'] == '12345678900'

def test_cliente_cadastrado_falha(client):
    response = client.post('/api/clienteCadastrado', json = {
        'cpf': '00000000000',
        'vaga': '0'
    })
    json_data = response.get_json()

    assert json_data['error'] == True
    assert json_data['message'] == 'Erro ao registrar cliente na vaga: 0'