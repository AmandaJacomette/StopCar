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
    if json_data['error']:
        assert json_data['mensagem'] == 'Não foi possível encontrar o funcionário'
    else:
        assert 'nome' in json_data

def test_get_vagas(client):
    response = client.get('/api/getVagas')
    json_data = response.get_json()

    assert response.status_code == 200
    assert isinstance(json_data, list)
    if len(json_data) > 0:
        assert 'id_vaga' in json_data[0]
        assert 'liberada' in json_data[0]

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
    assert json_data['placa'] == 'ABC1234'

def test_veiculo_cadastrado(client):
    response = client.post('/api/veiculoCadastrado', json = {
        'placa': 'ABC1234',
        'vaga': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert json_data['placa'] == 'ABC1234'

def test_get_finalizacao(client):
    response = client.post('/api/getFinalizacao', json = {
        'vaga': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert isinstance(json_data, list)
    if len(json_data) > 0:
        assert 'placa' in json_data[0]
        assert 'valor' in json_data[0]

def test_encerrar_vaga(client):
    response = client.post('/api/encerraVaga', json = {
        'vaga': '1',
        'id_veiculo': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert json_data['vaga'] == '1'

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
    assert json_data['cpf'] == '12345678900'

def test_editar_cliente(client):
    response = client.post('/api/editarCliente', json = {
        'nome': 'Alice Atualizada',
        'cpf': '12345678900',
        'email': 'alice.atualizada@email.com',
        'telefone': '31987563412'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert json_data['cpf'] == '12345678900'

def test_cliente_cadastrado(client):
    response = client.post('/api/clienteCadastrado', json = {
        'cpf': '12345678900',
        'vaga': '1'
    })
    json_data = response.get_json()

    assert response.status_code == 200
    assert json_data['cpf'] == '12345678900'