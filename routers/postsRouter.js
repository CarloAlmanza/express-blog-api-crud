const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Index (GET /posts)
router.get('/', postsController.index);

// Show (GET /posts/:id)
router.get('/:id', postsController.show);

// Store (POST /posts)
router.post('/', postsController.store);

// Update (PUT /posts/:id)
router.put('/:id', postsController.update);

// Destroy (DELETE /posts/:id)
router.delete('/:id', postsController.destroy);

module.exports = router;