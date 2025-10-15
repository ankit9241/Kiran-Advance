const Doubt = require('../models/Doubt');
const Notification = require('../models/Notification');

// @desc    Create a new doubt
// @route   POST /api/doubts
// @access  Private
exports.createDoubt = async (req, res) => {
  try {
    const { title, description, subject } = req.body;
    
    const doubt = new Doubt({
      user: req.user.userId,
      title,
      description,
      subject,
      status: 'pending'
    });

    await doubt.save();
    
    // Notify admins about new doubt
    const notification = new Notification({
      user: req.user.userId,
      type: 'new_doubt',
      referenceId: doubt._id,
      message: `New doubt posted: ${title}`
    });
    await notification.save();

    res.status(201).json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all doubts
// @route   GET /api/doubts
// @access  Private
exports.getDoubts = async (req, res) => {
  try {
    const { status, user } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (user) query.user = user;
    
    const doubts = await Doubt.find(query)
      .populate('user', 'name email')
      .populate('tutor', 'name email')
      .sort('-createdAt');
      
    res.json(doubts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single doubt
// @route   GET /api/doubts/:id
// @access  Private
exports.getDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('user', 'name email')
      .populate('tutor', 'name email');
      
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update doubt status
// @route   PUT /api/doubts/:id/status
// @access  Private/Admin/Tutor
exports.updateDoubtStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    doubt.status = status;
    if (status === 'accepted') {
      doubt.tutor = req.user.userId;
    }
    
    await doubt.save();
    
    // Notify user about status update
    const notification = new Notification({
      user: doubt.user,
      type: 'doubt_status',
      referenceId: doubt._id,
      message: `Your doubt status updated to: ${status}`
    });
    await notification.save();
    
    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add response to doubt
// @route   POST /api/doubts/:id/responses
// @access  Private
exports.addDoubtResponse = async (req, res) => {
  try {
    const { content } = req.body;
    
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    const response = {
      user: req.user.userId,
      content,
      isTutor: req.user.role === 'tutor' || req.user.role === 'admin'
    };
    
    doubt.responses.push(response);
    await doubt.save();
    
    // Notify the other party
    const notification = new Notification({
      user: response.isTutor ? doubt.user : doubt.tutor,
      type: 'doubt_response',
      referenceId: doubt._id,
      message: `New response on your doubt: ${doubt.title}`
    });
    await notification.save();
    
    res.status(201).json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
