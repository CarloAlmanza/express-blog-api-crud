const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Rotta index (GET /posts)
router.get('/', postsController.index);

// Rotta show (GET /posts/:id)
router.get('/:id', postsController.show);

// Rotta destroy (DELETE /posts/:id)
router.delete('/:id', postsController.destroy);

// Rotta create (POST /posts) - BONUS
router.post('/', postsController.create);

module.exports = router;