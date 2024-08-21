const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/formularioDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.log('Erro ao conectar ao MongoDB', err));

// Criar um esquema para os dados
const formSchema = new mongoose.Schema({
    nome: String,
    email: String,
    telefone: String
});

// Criar um modelo baseado no esquema
const Formulario = mongoose.model('Formulario', formSchema);

// Configuração do Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para servir o formulário
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rota para lidar com o envio do formulário
app.post('/submit-form', async (req, res) => {
    const { nome, email, telefone } = req.body;

    try {
        // Criar um novo documento usando o modelo
        const novoFormulario = new Formulario({
            nome: nome,
            email: email,
            telefone: telefone
        });

        // Salvar o documento no banco de dados
        await novoFormulario.save();
        
        // Responder com a mensagem centralizada
        res.send(`
            <html>
            <head>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                    }
                    .message {
                        text-align: center;
                        font-size: 24px;
                        color: green;
                    }
                </style>
            </head>
            <body>
                <div class="message">Formulário enviado com sucesso, aguarde nosso contato!</div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error(err);
        res.send('Ocorreu um erro ao enviar o formulário.');
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
