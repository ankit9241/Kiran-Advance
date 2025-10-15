const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment, tutorId } = req.body;
    
    const feedback = new Feedback({
      user: req.user.userId,
      tutor: tutorId,
      rating,
      comment
    });

    await feedback.save();
    
    // Notify tutor about new feedback
    const notification = new Notification({
      user: tutorId,
      type: 'new_feedback',
      referenceId: feedback._id,
      message: 'You have received new feedback on your tutoring'
    });
    await notification.save();

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get feedback for a tutor
// @route   GET /api/feedback/tutor/:tutorId
// @access  Private
exports.getTutorFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ tutor: req.params.tutorId })
      .populate('user', 'name')
      .sort('-createdAt');
      
    // Calculate average rating
    const averageRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / (feedbacks.length || 1);
    
    res.json({
      feedbacks,
      averageRating: averageRating.toFixed(1),
      totalFeedbacks: feedbacks.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all feedback (admin only)
// @route   GET /api/feedback
// @access  Private/Admin
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name')
      .populate('tutor', 'name')
      .sort('-createdAt');
      
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Private/Admin
exports.getFeedbackStats = async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    const tutors = await User.find({ role: 'tutor' }).select('name');
    
    const stats = await Promise.all(tutors.map(async (tutor) => {
      const tutorFeedbacks = await Feedback.find({ tutor: tutor._id });
      const avgRating = tutorFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / (tutorFeedbacks.length || 1);
      
      return {
        tutor: tutor.name,
        totalFeedbacks: tutorFeedbacks.length,
        averageRating: avgRating.toFixed(1)
      };
    }));
    
    res.json({
      totalFeedbacks,
      tutors: stats.sort((a, b) => b.averageRating - a.averageRating)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    await feedback.remove();
    
    res.json({ message: 'Feedback removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
