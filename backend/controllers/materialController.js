const Material = require('../models/Material');
const Notification = require('../models/Notification');

// @desc    Upload new material
// @route   POST /api/materials
// @access  Private/Admin/Tutor
exports.uploadMaterial = async (req, res) => {
  try {
    const { title, description, subject, fileUrl, fileType } = req.body;
    
    const material = new Material({
      title,
      description,
      subject,
      fileUrl,
      fileType,
      uploadedBy: req.user.userId,
    });

    await material.save();
    
    // Notify all users about new material
    const notification = new Notification({
      type: 'new_material',
      referenceId: material._id,
      message: `New study material available: ${title}`,
      // No specific user means it's a broadcast to all users
    });
    await notification.save();

    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all materials
// @route   GET /api/materials
// @access  Private
exports.getMaterials = async (req, res) => {
  try {
    const { subject, search, sortBy } = req.query;
    const query = {};
    
    if (subject) query.subject = subject;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = {};
    if (sortBy === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { title: 1 }; // Default sort by title
    }
    
    const materials = await Material.find(query)
      .populate('uploadedBy', 'name')
      .sort(sortOption);
      
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
// @access  Private
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name email');
      
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private/Admin/Tutor
exports.updateMaterial = async (req, res) => {
  try {
    const { title, description, subject, fileUrl, fileType } = req.body;
    
    let material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if user is authorized to update this material
    if (material.uploadedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    material.title = title || material.title;
    material.description = description || material.description;
    if (subject) material.subject = subject;
    if (fileUrl) material.fileUrl = fileUrl;
    if (fileType) material.fileType = fileType;
    
    await material.save();
    
    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private/Admin/Tutor
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if user is authorized to delete this material
    if (material.uploadedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await material.remove();
    
    res.json({ message: 'Material removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
