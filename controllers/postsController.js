const posts = require('../data/posts');

// Store - Crea un nuovo post
const store = (req, res) => {
    const { title, content, image, tags, prep_time } = req.body;

    // Stampo i dati in arrivo nel terminale
    console.log('📥 Dati ricevuti in POST /posts:');
    console.log(req.body);

    // Restituisco i dati al client (echo)
    res.status(200).json({
        message: 'Dati ricevuti correttamente',
        data: req.body
    });
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
    destroy,
    store
};