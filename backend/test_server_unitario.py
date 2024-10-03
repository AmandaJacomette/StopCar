import pytest
from datetime import datetime
from server import calcular_diferenca_em_horas
from server import busca_veiculo
from server import preenche_vaga
from server import busca_cliente_veiculo
from server import updade_fidelidade

def test_calcular_diferenca_em_horas(mocker):
    #Mocker da data e hora atual:
    #mocker.patch.object(datetime, 'now', return_value = datetime(2024, 10, 3, 9, 30, 0))
    mocker.patch('server.datetime', wraps=datetime)
    mocker.patch('server.datetime.now', return_value = datetime(2024, 10, 3, 9, 30, 0))

    #Data que foi armazenada para teste:
    data_armazenada = '2024-10-03 12:00:00'
    resultado = calcular_diferenca_em_horas(data_armazenada)

    #Verifica se a diferença em horas esta correta
    assert resultado == -2.5

def test_busca_veiculo(mocker):
    #Mock da função consultar_db:
    mock_consultar_db = mocker.patch('server.consultar_db')
    mock_consultar_db.return_value = [{'id_veiculo': 1}]

    resultado = busca_veiculo('ABC1234')

    #Verifica se o resultado e a consulta estão corretos:
    assert resultado == [{'id_veiculo': 1}]
    mock_consultar_db.assert_called_once()

def test_preenche_vaga(mocker):
    #Mocker da data e hora atual:
    #mocker.patch.object(datetime, 'now', return_value = datetime(2024, 10, 3, 9, 30, 0))
    mocker.patch('server.datetime', wraps=datetime)
    mocker.patch('server.datetime.now', return_value = datetime(2024, 10, 3, 9, 30, 0))

    #Mocker da função inserir_db
    mock_inserir_db = mocker.patch('server.inserir_db')

    #Chama a função com dados para teste:
    preenche_vaga('1', '4')

    #Verifica se a função foi chamada corretamente:
    assert mock_inserir_db.call_count == 2


def test_busca_cliente_veiculo(mocker):
    #Mocker da função consultar_db:
    mock_consultar_db = mocker.patch('server.consultar_db')
    mock_consultar_db.return_value = [{'veiculo': '1'}]

    resultado = busca_cliente_veiculo('12345678900')

    #Verifica se o resultado está certo:
    assert resultado == [{'veiculo': '1'}]
    mock_consultar_db.assert_called_once()

def test_update_fidelidade(mocker):
    #Mock da função consultar_db:
    mock_consultar_db = mocker.patch('server.consultar_db')
    mock_consultar_db.return_value = [{'fidelidade': 4}]

    #Mock da função inserir_db:
    mock_inserir_db = mocker.patch('server.inserir_db')

    #Chama a função:
    updade_fidelidade('12345678900')

    #Verifica se a função foi chamada certo:
    mock_inserir_db.assert_called_once()


