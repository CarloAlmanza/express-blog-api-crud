// middlewares/validatePost.js

// Middleware per validare i dati nella creazione (POST)
const validateCreatePost = (req, res, next) => {
    const { title, content, tags, prep_time } = req.body;
    const errors = [];

    // Validazione title
    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.push('Il campo "title" è obbligatorio e deve essere una stringa non vuota');
    }

    // Validazione content
    if (!content || typeof content !== 'string' || content.trim() === '') {
        errors.push('Il campo "content" è obbligatorio e deve essere una stringa non vuota');
    }

    // Validazione tags
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
        errors.push('Il campo "tags" è obbligatorio e deve essere un array non vuoto');
    } else {
        for (let i = 0; i < tags.length; i++) {
            if (typeof tags[i] !== 'string') {
                errors.push('Ogni tag deve essere una stringa');
                break;
            }
        }
    }

    // Validazione prep_time
    if (prep_time === undefined || prep_time === null) {
        errors.push('Il campo "prep_time" è obbligatorio');
    } else {
        const prepTimeNum = parseInt(prep_time);
        if (isNaN(prepTimeNum) || prepTimeNum <= 0) {
            errors.push('Il campo "prep_time" deve essere un numero positivo');
        } else {
            // Validazione superata, converto a numero
            req.body.prep_time = prepTimeNum;
        }
    }

    // Validazione image (opzionale)
    const { image } = req.body;
    if (image !== undefined && typeof image !== 'string') {
        errors.push('Il campo "image" deve essere una stringa');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Dati non validi',
            details: errors
        });
    }

    // Pulisco e normalizzo i dati
    if (title) req.body.title = title.trim();
    if (content) req.body.content = content.trim();

    next();
};

// Middleware per validare l'ID o slug del post
const validatePostId = (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'ID o slug non fornito' });
    }

    // Il controllo effettivo dell'esistenza del post lo facciamo nel controller
    // Questo middleware serve solo per passare l'identifier al controller
    req.postIdentifier = id;
    next();
};

// Middleware per validare l'aggiornamento (PUT)
const validateUpdatePost = (req, res, next) => {
    const { title, content, tags, prep_time, published } = req.body;
    const errors = [];

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        errors.push('Il campo "title" deve essere una stringa non vuota');
    }

    if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
        errors.push('Il campo "content" deve essere una stringa non vuota');
    }

    if (tags !== undefined) {
        if (!Array.isArray(tags) || tags.length === 0) {
            errors.push('Il campo "tags" deve essere un array non vuoto');
        } else {
            for (let i = 0; i < tags.length; i++) {
                if (typeof tags[i] !== 'string') {
                    errors.push('Ogni tag deve essere una stringa');
                    break;
                }
            }
        }
    }

    if (prep_time !== undefined) {
        const prepTimeNum = parseInt(prep_time);
        if (isNaN(prepTimeNum) || prepTimeNum <= 0) {
            errors.push('Il campo "prep_time" deve essere un numero positivo');
        } else {
            req.body.prep_time = prepTimeNum;
        }
    }

    if (published !== undefined && typeof published !== 'boolean') {
        errors.push('Il campo "published" deve essere un booleano');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Dati non validi',
            details: errors
        });
    }

    if (title) req.body.title = title.trim();
    if (content) req.body.content = content.trim();

    next();
};

module.exports = {
    validateCreatePost,
    validatePostId,
    validateUpdatePost
};