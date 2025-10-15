const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');

// @desc    Schedule a new meeting
// @route   POST /api/meetings
// @access  Private
exports.scheduleMeeting = async (req, res) => {
  try {
    const { title, description, scheduledTime, duration, studentId } = req.body;
    
    const meeting = new Meeting({
      title,
      description,
      scheduledTime,
      duration,
      tutor: req.user.userId,
      student: studentId,
      status: 'scheduled'
    });

    await meeting.save();
    
    // Notify student about the meeting
    const notification = new Notification({
      user: studentId,
      type: 'meeting_scheduled',
      referenceId: meeting._id,
      message: `New meeting scheduled: ${title}`
    });
    await notification.save();

    res.status(201).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Private
exports.getMeetings = async (req, res) => {
  try {
    const { status, userType } = req.query;
    let query = {};
    
    if (status) query.status = status;
    
    // Filter based on user role
    if (req.user.role === 'student') {
      query.student = req.user.userId;
    } else if (req.user.role === 'tutor') {
      query.tutor = req.user.userId;
    }
    
    const meetings = await Meeting.find(query)
      .populate('tutor', 'name email')
      .populate('student', 'name email')
      .sort('-scheduledTime');
      
    res.json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single meeting
// @route   GET /api/meetings/:id
// @access  Private
exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('tutor', 'name email')
      .populate('student', 'name email');
      
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    // Check if user is authorized to view this meeting
    if (meeting.tutor._id.toString() !== req.user.userId && 
        meeting.student._id.toString() !== req.user.userId && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update meeting
// @route   PUT /api/meetings/:id
// @access  Private
exports.updateMeeting = async (req, res) => {
  try {
    const { title, description, scheduledTime, duration, status } = req.body;
    
    let meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    // Check if user is authorized to update this meeting
    if (meeting.tutor.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    meeting.title = title || meeting.title;
    meeting.description = description || meeting.description;
    if (scheduledTime) meeting.scheduledTime = scheduledTime;
    if (duration) meeting.duration = duration;
    if (status) meeting.status = status;
    
    await meeting.save();
    
    // Notify the other participant about the update
    const notification = new Notification({
      user: meeting.tutor.toString() === req.user.userId ? meeting.student : meeting.tutor,
      type: 'meeting_updated',
      referenceId: meeting._id,
      message: `Meeting updated: ${meeting.title}`
    });
    await notification.save();
    
    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete meeting
// @route   DELETE /api/meetings/:id
// @access  Private
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    // Check if user is authorized to delete this meeting
    if (meeting.tutor.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await meeting.remove();
    
    // Notify the other participant about the cancellation
    const notification = new Notification({
      user: meeting.tutor.toString() === req.user.userId ? meeting.student : meeting.tutor,
      type: 'meeting_cancelled',
      message: `Meeting cancelled: ${meeting.title}`
    });
    await notification.save();
    
    res.json({ message: 'Meeting removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
