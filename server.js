const express = require('express');
const postsRouter = require('./routers/postsRouter');

const app = express();
const PORT = 3000;

// Middleware per parsing JSON (BONUS)
app.use(express.json());
// Middleware per parsing form data (BONUS)
app.use(express.urlencoded({ extended: true }));

// Rotta principale
app.get('/', (req, res) => {
    res.send('Benvenuto nel Blog API!');
});

// Montaggio router posts
app.use('/posts', postsRouter);

// Gestione errori 404 per rotte non trovate
app.use((req, res) => {
    res.status(404).json({
        error: 'Rotta non trovata'
    });
});

// Avvio server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});