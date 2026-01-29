import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import AISummary from '../components/AISummary';
import './CreateBlog.css';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState(null);
    const [tags, setTags] = useState([]);
    const [manualTags, setManualTags] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const { data } = await blogAPI.getBlog(id);
            setTitle(data.title);
            setContent(data.content);
            setSummary(data.summary || null);
            setTags(data.tags || []);
            setCoverImage(data.coverImage || '');
            setNotes(data.notes || '');
        } catch (err) {
            setError('Failed to load blog');
        } finally {
            setLoading(false);
        }
    };

    const handleSummaryGenerated = (newSummary) => {
        setSummary(newSummary);
    };

    const handleTagsGenerated = (generatedTags) => {
        setTags(generatedTags);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            // Combine existing tags with manual tags
            const allTags = [...new Set([
                ...tags,
                ...manualTags.split(',').map(tag => tag.trim()).filter(Boolean)
            ])];

            const blogData = {
                title,
                content,
                summary: summary || { context: '', coreIdeas: [], actionables: [] },
                coverImage,
                tags: allTags,
                notes
            };

            await blogAPI.updateBlog(id, blogData);
            navigate(`/blog/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update blog');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="create-blog-page">
                <div className="loading-container">
                    <div className="loading-spinner-lg"></div>
                    <p>Loading blog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="create-blog-page">
            <div className="create-blog-container">
                <div className="page-header">
                    <h1>✏️ Edit Blog</h1>
                    <p>Update your blog post</p>
                </div>

                {error && (
                    <div className="form-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="blog-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter an engaging title..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="coverImage">Cover Image URL (optional)</label>
                        <input
                            type="url"
                            id="coverImage"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your blog content here..."
                            rows={12}
                            required
                        />
                    </div>

                    {/* AI Summary Section */}
                    <AISummary
                        content={content}
                        title={title}
                        onSummaryGenerated={handleSummaryGenerated}
                        onTagsGenerated={handleTagsGenerated}
                        existingSummary={summary}
                    />

                    {/* Existing/AI Generated Tags */}
                    {tags.length > 0 && (
                        <div className="generated-tags-section">
                            <label>🏷️ Tags</label>
                            <div className="tags-container">
                                {tags.map((tag, index) => (
                                    <span key={index} className="generated-tag">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => setTags(tags.filter((_, i) => i !== index))}
                                            className="remove-tag"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="tags">Additional Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            value={manualTags}
                            onChange={(e) => setManualTags(e.target.value)}
                            placeholder="productivity, tech, business"
                        />
                    </div>

                    {/* My Notes Section */}
                    <div className="notes-section">
                        <div className="notes-header">
                            <span className="notes-icon">✏️</span>
                            <h3>MY NOTES</h3>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add your thoughts, connections, or reflections..."
                            rows={4}
                            className="notes-textarea"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Saving...
                                </>
                            ) : (
                                '💾 Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;
