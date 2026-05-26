const posts = require('../data/posts');

// Index - Lista tutti i post
const index = (req, res) => {
    res.status(200).json({
        total: posts.length,
        posts: posts
    });
};

// Show - Mostra un singolo post
const show = (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id);

    if (isNaN(postId) || postId <= 0) {
        return res.status(400).json({ error: 'ID non valido' });
    }

    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post non trovato' });
    }

    res.status(200).json(post);
};

// Store - Crea un nuovo post con validazione (Milestone 1-2)
const store = (req, res) => {
    const { title, content, image, tags, prep_time } = req.body;

    // Array per raccogliere gli errori
    const errors = [];

    // Validazione title
    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.push('Il campo "title" è obbligatorio e deve essere una stringa non vuota');
    }

    // Validazione content
    if (!content || typeof content !== 'string' || content.trim() === '') {
        errors.push('Il campo "content" è obbligatorio e deve essere una stringa non vuota');
    }

    // Validazione image (opzionale ma se presente deve essere stringa)
    if (image !== undefined && typeof image !== 'string') {
        errors.push('Il campo "image" deve essere una stringa');
    }

    // Validazione tags
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
        errors.push('Il campo "tags" è obbligatorio e deve essere un array non vuoto');
    } else {
        // Verifica che ogni tag sia una stringa
        for (let i = 0; i < tags.length; i++) {
            if (typeof tags[i] !== 'string') {
                errors.push(`Il tag all'indice ${i} deve essere una stringa`);
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
        }
    }

    // Se ci sono errori, restituisco 400 con la lista degli errori
    if (errors.length > 0) {
        console.log('❌ Errori di validazione:', errors);
        return res.status(400).json({
            error: 'Dati non validi',
            details: errors
        });
    }

    // Se tutto è valido, stampo e restituisco i dati
    console.log('✅ Dati validi ricevuti in POST /posts:');
    console.log(req.body);

    res.status(200).json({
        message: 'Dati ricevuti correttamente',
        data: req.body
    });
};

// Destroy - Elimina un post
const destroy = (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id);

    if (isNaN(postId) || postId <= 0) {
        return res.status(400).json({ error: 'ID non valido' });
    }

    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post non trovato' });
    }

    const deletedPost = posts.splice(postIndex, 1)[0];

    console.log(`🗑️ Post eliminato: ${deletedPost.title}`);

    res.status(200).json({
        message: 'Post eliminato con successo',
        post: deletedPost
    });
};

module.exports = {
    index,
    show,
    store,
    destroy
};