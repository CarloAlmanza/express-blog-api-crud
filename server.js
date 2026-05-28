// server.js

const express = require('express');
const postsRouter = require('./routers/postsRouter');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 3000;

// Middleware built-in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware (opzionale, utile per debugging)
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.originalUrl}`);
    next();
});

// Rotte
app.get('/', (req, res) => {
    res.json({
        message: 'Benvenuto nel Blog API!',
        endpoints: {
            'GET /posts': 'Lista tutti i post',
            'GET /posts/:id': 'Mostra un singolo post (per ID o slug)',
            'POST /posts': 'Crea un nuovo post',
            'PUT /posts/:id': 'Aggiorna un post esistente',
            'DELETE /posts/:id': 'Elimina un post'
        }
    });
});

app.use('/posts', postsRouter);

// Middleware per rotte non trovate (DEVE essere dopo tutte le rotte)
app.use(notFound);

// Middleware per gestione errori (DEVE essere per ultimo)
app.use(errorHandler);

// Avvio server
app.listen(PORT, () => {
    console.log(`🚀 Server in esecuzione su http://localhost:${PORT}`);
});