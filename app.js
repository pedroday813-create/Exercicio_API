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

app.listen(porta, function () {
    console.log(`API aguardando requisicoes na porta ${porta}.`)
})
