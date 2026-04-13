/****************************************************************
 * objetivo: Funcoes para manipular conversas do arquivo contatos.js
 * Autor: Pedro Rodrigues
 * data:04/04/2026
 * versao: 1.0
 ****************************************************************/

const { contatos } = require('./contatos.js')

const listaUsuarios = contatos['whats-users']

const normalizarTextoBusca = function (texto) {
    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
}

const numeroEhValido = function (numero) {
    return /^[0-9]{10,11}$/.test(String(numero))
}

const manipularContatos = function () {
    return listaUsuarios.length
}

const montarMensagens = function (mensagensContato) {
    let mensagens = Array.isArray(mensagensContato) ? mensagensContato : []

    return mensagens.map(function (mensagem) {
        return {
            sender: mensagem.sender,
            content: mensagem.content,
            time: mensagem.time
        }
    })
}

const montarConversaContato = function (contato) {
    let mensagensContato = montarMensagens(contato.messages)

    return {
        name: contato.name,
        description: contato.description,
        image: contato.image,
        messages: mensagensContato,
        nome: contato.name,
        descricao: contato.description,
        imagem: contato.image,
        mensagens: mensagensContato,
        conversa: mensagensContato
    }
}






// Listar todos os dados de contato de todos os usuarios
const getTodosDados = function () {
    let listaContatos = []

    listaUsuarios.forEach(function (usuario) {
        usuario.contacts.forEach(function (contato) {
            listaContatos.push({
                nome: contato.name,
                descricao: contato.description,
                imagem: contato.image,
                telefone: usuario.number
            })
        })
    })

    return listaContatos
}

// Listar os dados do perfil de um usuario pelo numero
const getDadosUsuario = function (numero) {
    let usuarioEncontrado = false

    listaUsuarios.forEach(function (usuario) {
        if (usuario.number === numero) {
            usuarioEncontrado = {
                nome: usuario.account,
                apelido: usuario.nickname,
                imagemPerfil: usuario['profile-image'],
                numero: usuario.number,
                corDeFundo: usuario.background,
                membroDesde: usuario['created-since'],
                conversas: usuario.contacts.map(function (contato) {
                    return montarConversaContato(contato)
                })
            }
        }
    })

    return usuarioEncontrado
}

// Listar os contatos de um usuario pelo numero
const getDadosContato = function (numero) {
    let listaContatos = false

    listaUsuarios.forEach(function (usuario) {
        if (usuario.number === numero) {
            listaContatos = []

            usuario.contacts.forEach(function (contato) {
                listaContatos.push({
                    nome: contato.name,
                    descricao: contato.description,
                    imagem: contato.image
                })
            })
        }
    })

    return listaContatos
}

// Listar todas as mensagens trocadas de uma conta de usuario
const getConversas = function (numero) {
    let listaConversas = false

    listaUsuarios.forEach(function (usuario) {
        if (usuario.number === numero) {
            listaConversas = []

            usuario.contacts.forEach(function (contato) {
                listaConversas.push(montarConversaContato(contato))
            })
        }
    })

    return listaConversas
}

// Listar uma conversa especifica entre um usuario e um contato
const getConversaUsuarioContato = function (numero, nomeContato) {
    let conversaEncontrada = false

    listaUsuarios.forEach(function (usuario) {
        if (usuario.number === numero) {
            usuario.contacts.forEach(function (contato) {
                if (normalizarTextoBusca(contato.name) === normalizarTextoBusca(nomeContato)) {
                    conversaEncontrada = {
                        nome: contato.name,
                        numeroCelular: usuario.number,
                        conversas: montarMensagens(contato.messages)
                    }
                }
            })
        }
    })

    return conversaEncontrada
}

module.exports = {
    manipularContatos,
    getTodosDados,
    getDadosUsuario,
    getDadosContato,
    getConversas,
    getConversaUsuarioContato,
    numeroEhValido
}
