const mongoose = require('mongoose');

// Counter schema for auto-incrementing IDs
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', CounterSchema);

/**
 * Generate the next ID in sequence for a given type
 * @param {string} type - 'student' or 'mentor'
 * @returns {Promise<string>} The generated ID
 */
const generateNextId = async (type) => {
  if (!['student', 'mentor'].includes(type)) {
    throw new Error('Invalid ID type. Must be "student" or "mentor"');
  }

  const prefix = type === 'student' ? 'STU' : 'MEN';
  const year = new Date().getFullYear();
  const counterId = `${type}Id`;

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Format: STU2025001 where 2025 is the year and 001 is the sequence number
    const sequence = String(counter.seq).padStart(4, '0');
    return `${prefix}${year}${sequence}`;
  } catch (error) {
    console.error('Error generating ID:', error);
    throw new Error('Failed to generate ID');
  }
};

module.exports = {
  generateNextId,
  Counter // Export for testing purposes
};
