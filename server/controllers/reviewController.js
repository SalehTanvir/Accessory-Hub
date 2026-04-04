const Review = require("../models/Review");
const Product = require("../models/Product");


// ADD REVIEW
exports.addReview = async (req, res) => {
  try {

    const { productId, rating, comment } = req.body;

    // check duplicate review
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this product"
      });
    }

    const review = new Review({
      product: productId,
      user: req.user.id,
      rating,
      comment
    });

    await review.save();

    // update product ratings
    const reviews = await Review.find({ product: productId });

    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(productId, {
      ratings: avgRating,
      numReviews: reviews.length
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET PRODUCT REVIEWS
exports.getProductReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      product: req.params.productId
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};