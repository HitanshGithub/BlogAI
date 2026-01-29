const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide content']
    },
    summary: {
        context: {
            type: String,
            default: ''
        },
        coreIdeas: [{
            type: String
        }],
        actionables: [{
            type: String
        }]
    },
    notes: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    qualityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
