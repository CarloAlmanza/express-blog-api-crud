// controllers/postsController.js

const posts = require('../data/posts');
const { generateSlug, findPost, findPostIndex } = require('../utils/helpers');

// Index - Lista tutti i post
const index = (req, res, next) => {
    try {
        res.status(200).json({
            total: posts.length,
            posts: posts
        });
    } catch (error) {
        next(error);
    }
};

// Show - Mostra un singolo post (per ID o slug)
const show = (req, res, next) => {
    try {
        const { id } = req.params;
        const post = findPost(id);

        if (!post) {
            const error = new Error('Post non trovato');
            error.status = 404;
            return next(error);
        }

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

// Store - Crea un nuovo post
const store = (req, res, next) => {
    try {
        const { title, content, image, tags, prep_time } = req.body;

        // Calcolo nuovo ID
        const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

        // Generazione slug
        const slug = generateSlug(title);

        // Data corrente
        const now = new Date().toISOString();

        // Creazione nuovo post
        const newPost = {
            id: newId,
            title,
            content,
            image: image || null,
            tags,
            slug,
            published: false,
            prep_time,
            created_at: now
        };

        posts.push(newPost);

        console.log(`✅ Nuovo post creato con ID ${newId}: ${newPost.title}`);

        res.status(201).json({
            message: 'Post creato con successo',
            post: newPost
        });
    } catch (error) {
        next(error);
    }
};

// Update - Modifica un post esistente
const update = (req, res, next) => {
    try {
        const { id } = req.params;
        const postId = parseInt(id);
        const { title, content, image, tags, prep_time, published } = req.body;

        const postIndex = findPostIndex(id);

        if (postIndex === -1) {
            const error = new Error('Post non trovato');
            error.status = 404;
            return next(error);
        }

        const oldPost = posts[postIndex];
        const updatedPost = { ...oldPost };

        if (title !== undefined) {
            updatedPost.title = title;
            updatedPost.slug = generateSlug(title);
        }

        if (content !== undefined) updatedPost.content = content;
        if (image !== undefined) updatedPost.image = image;
        if (tags !== undefined) updatedPost.tags = tags;
        if (prep_time !== undefined) updatedPost.prep_time = prep_time;
        if (published !== undefined) updatedPost.published = published;

        posts[postIndex] = updatedPost;

        console.log(`✏️ Post ID ${postId} aggiornato: ${updatedPost.title}`);

        res.status(200).json({
            message: 'Post aggiornato con successo',
            post: updatedPost
        });
    } catch (error) {
        next(error);
    }
};

// Destroy - Elimina un post
const destroy = (req, res, next) => {
    try {
        const { id } = req.params;
        const postId = parseInt(id);

        const postIndex = findPostIndex(id);

        if (postIndex === -1) {
            const error = new Error('Post non trovato');
            error.status = 404;
            return next(error);
        }

        const deletedPost = posts.splice(postIndex, 1)[0];

        console.log(`🗑️ Post eliminato: ${deletedPost.title}`);

        res.status(200).json({
            message: 'Post eliminato con successo',
            post: deletedPost
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};