import { Rating } from '../models/Rating.js';

export const createRating = async (req, res, next) => {
  try {
    const { movieCode, rating, note, ratedBy } = req.body;

    if (!movieCode || rating === undefined) {
      return res.status(400).json({ message: 'movieCode and rating are required' });
    }

    const newRating = new Rating({
      movieCode,
      rating,
      note,
      ratedBy,
    });

    await newRating.save();
    res.status(201).json({ rating: newRating });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'User has already rated this movie' });
    }
    next(err);
  }
};

export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find().lean();
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

export const getRating = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.id).lean();
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
};

export const getRatingSummary = async (req, res, next) => {
  try {
    const { movieCode } = req.query;

    if (!movieCode) {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const summaryResult = await Rating.aggregate([
      { $match: { movieCode } },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (summaryResult.length === 0) {
      return res.status(200).json({
        movieCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    const { averageRating, ratingCount } = summaryResult[0];
    res.status(200).json({
      movieCode,
      averageRating,
      ratingCount,
    });
  } catch (err) {
    next(err);
  }
};
