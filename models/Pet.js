const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Pet type is required'],
        enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Other']
    },
    breed: {
        type: String,
        required: [true, 'Breed is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: 0
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 500
    },
    color: {
        type: String,
        default: 'Mixed'
    },
    size: {
        type: String,
        enum: ['Small', 'Medium', 'Large'],
        default: 'Medium'
    },
    vaccinated: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Available', 'Adopted', 'Pending'],
        default: 'Available'
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x300?text=Pet+Image'
    },
    contactEmail: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        default: ''
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pet', petSchema);