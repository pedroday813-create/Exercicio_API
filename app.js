const express = require('express')
const cors = require('cors')
const {
    getTodosDados,
    getDadosUsuario,
    getDadosContato,
    getConversas,
    getConversaUsuarioContato,
    numeroEhValido
} = require('./modulo/funcao.js')

const app = express()
const porta = process.env.PORT || 8080

app.use(cors())

app.get('/', function (request, response) {
    response.status(200).json({
        status: true,
        message: 'API aguardando requisicoes.'
    })
})






app.get('/v1/whatsapp/contatos', function (request, response) {
    let listaContatos = getTodosDados()
    response.status(200).json(listaContatos)
})

app.get('/v1/whatsapp/usuario/:numero/contatos', function (request, response) {
    let numero = request.params.numero

    if (!numeroEhValido(numero)) {
        return response.status(400).json({
            status: false,
            message: 'Numero invalido. Informe um numero com 10 ou 11 digitos.'
        })
    }

    let contatosUsuario = getDadosContato(numero)

    if (!contatosUsuario) {
        return response.status(404).json({
            status: false,
            message: 'Contatos do usuario nao encontrados.'
        })
    }

    response.status(200).json(contatosUsuario)
})

app.get('/v1/whatsapp/mensagens/contato/:numero', function (request, response) {
    let numero = request.params.numero
    let referenciaContato = request.query.referencia || request.query.contato || request.query.nomeContato

    if (!numeroEhValido(numero)) {
        return response.status(400).json({
            status: false,
            message: 'Numero invalido. Informe um numero com 10 ou 11 digitos.'
        })
    }

    if (referenciaContato) {
        let conversaContato = getConversaUsuarioContato(numero, referenciaContato)

        if (!conversaContato) {
            return response.status(404).json({
                status: false,
                message: 'Conversa entre o usuario e o contato nao encontrada.'
            })
        }

        return response.status(200).json(conversaContato)
    }

    let conversasUsuario = getConversas(numero)

    if (!conversasUsuario) {
        return response.status(404).json({
            status: false,
            message: 'Conversas do usuario nao encontradas.'
        })
    }

    response.status(200).json(conversasUsuario)
})

app.get('/v1/whatsapp/usuario/contatos', function (request, response) {
    let numero = request.query.numero

    if (!numeroEhValido(numero)) {
        return response.status(400).json({
            status: false,
            message: 'Numero invalido. Informe um numero com 10 ou 11 digitos.'
        })
    }

    let conversasUsuario = getConversas(numero)

    if (!conversasUsuario) {
        return response.status(404).json({
            status: false,
            message: 'Conversas do usuario nao encontradas.'
        })
    }

    response.status(200).json(conversasUsuario)
})

app.get('/v1/whatsapp/usuario/:numero', function (request, response) {
    let numero = request.params.numero
    let referenciaContato = request.query.referencia

    if (!numeroEhValido(numero)) {
        return response.status(400).json({
            status: false,
            message: 'Numero invalido. Informe um numero com 10 ou 11 digitos.'
        })
    }

    if (!referenciaContato) {
        return response.status(400).json({
            status: false,
            message: 'Informe a referencia do contato pela query ?referencia=nome-do-contato.'
        })
    }

    let conversaContato = getConversaUsuarioContato(numero, referenciaContato)

    if (!conversaContato) {
        return response.status(404).json({
            status: false,
            message: 'Conversa entre o usuario e o contato nao encontrada.'
        })
    }

    response.status(200).json(conversaContato)
})

const enviarHelpAPI = function (request, response) {
    let docAPI = {
        "API-description": "API do Watsapp para busca de conversas e contatos de usuarios",
        "date": "2026-04-13",
        "Developer": "Pedro Rodrigues",
        "version": "1.0",
        "endpoints": [
            {
                "id": 1,
                "Rota 1": "/v1/whatsapp/contatos",
                "obs": "retorna a lista de contatos de todos os usuarios"
            },
            {
                "id": 2,
                "Rota 2": "/v1/whatsapp/usuario/:numero/contatos",
                "obs": "retorna a lista de contatos de um usuario filtrando pelo numero do usuario"
            },
            {
                "id": 3,
                "Rota 3": "/v1/whatsapp/mensagens/contato/:numero",
                "obs": "(Retornar apenas os dados pessoais de cada contato do usuário, como nome, foto e descrição"
            },
            {
                "id": 4,
                "Rota 4": "/v1/whatsapp/usuario/contatos",
                "obs": "retorna a lista de contatos de um usuario filtrando pelo numero do usuario utilizando query ?numero=numero-do-usuario"
            },
            {
                "id": 5,
                "Rota 5": "/v1/whatsapp/usuario/:numero?referencia=nome-do-contato",
                "obs": "retorna a conversa entre o usuario e um contato filtrando pelo numero do usuario e pela referencia do contato utilizando query ?referencia=nome-do-contato"
            },
            {
                "id": 6,
                "Rota 6": "/v1/senai/help",
                "obs": "retorna a documentacao da API"
            },
            {
                "id": 7,
                "Rota 7": "/v1/whatsapp/help",
                "obs": "retorna a documentacao da API"
            }
        ]
    }
    response.status(200).json(docAPI)
}

app.get('/v1/senai/help', enviarHelpAPI)
app.get('/v1/whatsapp/help', enviarHelpAPI)


app.listen(porta, function () {
    console.log(`API aguardando requisicoes na porta ${porta}.`)
})
