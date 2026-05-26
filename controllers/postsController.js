// controllers/postsController.js

const posts = require('../data/posts');

// Helper per generare slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
};

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

// Store - Crea e salva un nuovo post
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

    // Calcolo nuovo ID (massimo ID esistente + 1)
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

    // Generazione slug dal titolo
    const slug = generateSlug(title.trim());

    // Data corrente in formato ISO
    const now = new Date().toISOString();

    // Creazione nuovo post
    const newPost = {
        id: newId,
        title: title.trim(),
        content: content.trim(),
        image: image || null,
        tags: tags,
        slug: slug,
        published: false,
        prep_time: parseInt(prep_time),
        created_at: now
    };

    // Aggiungo all'array
    posts.push(newPost);

    console.log(`✅ Nuovo post creato con ID ${newId}: ${newPost.title}`);
    console.log(`📊 Totale post: ${posts.length}`);

    // Restituisco il post creato con status 201 (Created)
    res.status(201).json({
        message: 'Post creato con successo',
        post: newPost
    });
};

// Update - Modifica un post esistente
const update = (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id);
    const { title, content, image, tags, prep_time, published } = req.body;

    // Validazione ID
    if (isNaN(postId) || postId <= 0) {
        return res.status(400).json({ error: 'ID non valido' });
    }

    // Cerco il post
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post non trovato' });
    }

    // Validazione campi
    const errors = [];

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        errors.push('Il campo "title" deve essere una stringa non vuota');
    }

    if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
        errors.push('Il campo "content" deve essere una stringa non vuota');
    }

    if (image !== undefined && typeof image !== 'string') {
        errors.push('Il campo "image" deve essere una stringa');
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

    // Recupero il post originale
    const oldPost = posts[postIndex];

    // Aggiorno solo i campi forniti
    const updatedPost = { ...oldPost };

    if (title !== undefined) {
        updatedPost.title = title.trim();
        updatedPost.slug = generateSlug(title.trim());  // rigenero lo slug
    }

    if (content !== undefined) {
        updatedPost.content = content.trim();
    }

    if (image !== undefined) {
        updatedPost.image = image;
    }

    if (tags !== undefined) {
        updatedPost.tags = tags;
    }

    if (prep_time !== undefined) {
        updatedPost.prep_time = parseInt(prep_time);
    }

    if (published !== undefined) {
        updatedPost.published = published;
    }

    // Sostituisco il post nell'array
    posts[postIndex] = updatedPost;

    console.log(`✏️ Post ID ${postId} aggiornato: ${updatedPost.title}`);

    res.status(200).json({
        message: 'Post aggiornato con successo',
        post: updatedPost
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
    console.log(`📊 Totale post rimasti: ${posts.length}`);

    res.status(200).json({
        message: 'Post eliminato con successo',
        post: deletedPost
    });
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};