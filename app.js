import express from 'express'
import cors from 'cors'

const app = express()
const porta = process.env.PORT || 8080

app.use(cors())

app.get('/', function (request, response) {})

app.get('/v1/whatsapp/contatos', function (request, response) {



})

app.get('/v1/whatsapp/usuario', function (request, response) {
let numero = request.query.numero
let usuario = getDadosUsuario(numero)

response.json(usuario)
response.status(200)
})

app.get('/v1/whatsapp/usuario/contatos', function (request, response) {

})

app.get('/v1/whatsapp/usuario/:numero', function (request, response) {

})

app.get('/v1/whatsapp/usuario/:numero/contatos', function (request, response) {

})

app.listen(porta, function () {
    console.log(`API aguardando requisicoes na porta ${porta}.`)
})
