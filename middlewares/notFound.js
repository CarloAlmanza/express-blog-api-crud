// middlewares/notFound.js

const notFound = (req, res, next) => {
    res.status(404).json({
        error: 'Rotta non trovata',
        message: `La rotta ${req.method} ${req.originalUrl} non esiste`,
        status: 404
    });
};

module.exports = notFound;