const posts = require('../data/posts');

// Index - restituisce tutti i post con filtri opzionali
const index = (req, res) => {
    let filteredPosts = [...posts];
    const { tag, published, limit } = req.query;

    // Filtro per tag
    if (tag) {
        filteredPosts = filteredPosts.filter(post =>
            post.tags && post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
        );
    }

    // Filtro per stato pubblicazione
    if (published !== undefined) {
        const isPublished = published === 'true';
        filteredPosts = filteredPosts.filter(post => post.published === isPublished);
    }

    // Limite risultati
    if (limit && !isNaN(parseInt(limit))) {
        filteredPosts = filteredPosts.slice(0, parseInt(limit));
    }

    res.status(200).json({
        total: filteredPosts.length,
        posts: filteredPosts
    });
};

// Show - restituisce un singolo post
const show = (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id);

    // Validazione ID
    if (isNaN(postId) || postId <= 0) {
        return res.status(400).json({
            error: 'ID non valido. Deve essere un numero positivo.'
        });
    }

    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({
            error: `Post con ID ${postId} non trovato.`
        });
    }

    res.status(200).json(post);
};

// Destroy - elimina un singolo post
const destroy = (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id);

    // Validazione ID
    if (isNaN(postId) || postId <= 0) {
        return res.status(400).json({
            error: 'ID non valido. Deve essere un numero positivo.'
        });
    }

    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({
            error: `Post con ID ${postId} non trovato.`
        });
    }

    const deletedPost = posts.splice(postIndex, 1)[0];

    console.log('Lista post dopo eliminazione:');
    console.log(JSON.stringify(posts, null, 2));

    res.status(200).json({
        message: `Post "${deletedPost.title}" eliminato con successo.`,
        deletedPost: deletedPost
    });
};

// Create - crea un nuovo post (BONUS)
const create = (req, res) => {
    const newPost = req.body;

    console.log('Dati ricevuti per la creazione:');
    console.log(newPost);

    // Opzionale: validazione base
    if (!newPost.title || !newPost.content) {
        return res.status(400).json({
            error: 'I campi title e content sono obbligatori.'
        });
    }

    res.status(201).json({
        message: 'Stai provando a creare dei dati',
        data: newPost
    });
};

module.exports = {
    index,
    show,
    destroy,
    create
};