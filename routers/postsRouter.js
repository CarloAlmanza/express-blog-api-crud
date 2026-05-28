// routers/postsRouter.js

const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { validateCreatePost, validateUpdatePost } = require('../middlewares/validatePost');

// Index (GET /posts)
router.get('/', postsController.index);

// Show (GET /posts/:id)
router.get('/:id', postsController.show);

// Store (POST /posts) - con middleware di validazione
router.post('/', validateCreatePost, postsController.store);

// Update (PUT /posts/:id) - con middleware di validazione
router.put('/:id', validateUpdatePost, postsController.update);

// Destroy (DELETE /posts/:id)
router.delete('/:id', postsController.destroy);

module.exports = router;