// utils/helpers.js

const posts = require('../data/posts');

// Genera slug da titolo
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Trova post per ID o slug
const findPost = (identifier) => {
    if (!isNaN(parseInt(identifier))) {
        return posts.find(p => p.id === parseInt(identifier));
    }
    return posts.find(p => p.slug === identifier);
};

// Trova indice del post per ID
const findPostIndex = (id) => {
    const postId = parseInt(id);
    if (isNaN(postId) || postId <= 0) return -1;
    return posts.findIndex(p => p.id === postId);
};

module.exports = {
    generateSlug,
    findPost,
    findPostIndex
};