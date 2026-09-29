import express from 'express';
import * as ratingController from '../controllers/ratingController.js';

const router = express.Router();

// Summary must be before :id
router.get('/summary', ratingController.getRatingSummary);

router.post('/', ratingController.createRating);
router.get('/', ratingController.getAllRatings);
router.get('/:id', ratingController.getRating);

export default router;
