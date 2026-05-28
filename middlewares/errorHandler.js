// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Log dell'errore completo per debugging (solo in sviluppo)
    console.error('❌ ERRORE:', err);

    // Status predefinito: 500 Internal Server Error
    const status = err.status || 500;

    // Messaggio di errore
    const message = err.message || 'Errore interno del server';

    // Risposta al client
    res.status(status).json({
        error: message,
        status: status,
        timestamp: new Date().toISOString(),
        // In produzione, non inviare lo stack trace
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;