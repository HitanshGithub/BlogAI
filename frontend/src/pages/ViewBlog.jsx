import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ViewBlog.css';

const ViewBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [notes, setNotes] = useState('');
    const [savingNotes, setSavingNotes] = useState(false);
    const [showCollapse, setShowCollapse] = useState(true);

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            // Use sessionStorage to track if we've already counted this view
            const viewedKey = `viewed_${id}`;
            const alreadyViewed = sessionStorage.getItem(viewedKey);

            // Mark as viewed BEFORE making API call (prevents race condition)
            if (!alreadyViewed) {
                sessionStorage.setItem(viewedKey, 'true');
            }

            const { data } = await blogAPI.getBlog(id, !alreadyViewed);

            setBlog(data);
            setNotes(data.notes || '');
        } catch (err) {
            setError('Blog not found');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        setDeleting(true);
        try {
            await blogAPI.deleteBlog(id);
            navigate('/my-blogs');
        } catch (err) {
            setError('Failed to delete blog');
            setDeleting(false);
        }
    };

    const handleSaveNotes = async () => {
        setSavingNotes(true);
        try {
            await blogAPI.updateNotes(id, notes);
        } catch (err) {
            console.error('Failed to save notes');
        } finally {
            setSavingNotes(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isAuthor = user && blog && user._id === blog.author?._id;
    const hasSummary = blog?.summary && (blog.summary.context || blog.summary.coreIdeas?.length > 0);

    if (loading) {
        return (
            <div className="view-blog-loading">
                <div className="loading-spinner-lg"></div>
                <p>Loading blog...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-blog-error">
                <span className="error-icon">😕</span>
                <h2>{error}</h2>
                <Link to="/" className="back-link">← Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="view-blog-page">
            <article className="blog-article">
                {blog.coverImage && (
                    <div className="blog-cover">
                        <img src={blog.coverImage} alt={blog.title} />
                    </div>
                )}

                <div className="blog-content-wrapper">
                    <header className="blog-header">
                        {/* Tags */}
                        <div className="blog-tags">
                            {blog.tags?.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                            ))}
                        </div>
                        <h1 className="blog-title">{blog.title}</h1>

                        <div className="blog-meta">
                            <div className="author-info">
                                <div className="author-avatar">
                                    {blog.author?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="author-details">
                                    <span className="author-name">{blog.author?.name || 'Anonymous'}</span>
                                    <span className="publish-date">{formatDate(blog.createdAt)}</span>
                                </div>
                            </div>
                            <div className="blog-stats">
                                <span className="views">👁 {blog.views} views</span>
                            </div>
                        </div>
                    </header>

                    {/* AI Summary Section - Noesis Style */}
                    {hasSummary && (
                        <div className="knowledge-card">
                            <div className="knowledge-header" onClick={() => setShowCollapse(!showCollapse)}>
                                <span className="collapse-text">{showCollapse ? 'COLLAPSE' : 'EXPAND'} ∧</span>
                            </div>

                            {showCollapse && (
                                <div className="knowledge-content">
                                    {/* Context */}
                                    {blog.summary.context && (
                                        <div className="knowledge-section">
                                            <h4 className="section-label">CONTEXT</h4>
                                            <p className="context-text">{blog.summary.context}</p>
                                        </div>
                                    )}

                                    {/* Core Ideas */}
                                    {blog.summary.coreIdeas?.length > 0 && (
                                        <div className="knowledge-section">
                                            <h4 className="section-label">CORE IDEAS</h4>
                                            <div className="core-ideas">
                                                {blog.summary.coreIdeas.map((idea, index) => (
                                                    <div key={index} className="core-idea">
                                                        <span className="idea-num">{index + 1}</span>
                                                        <p>{idea}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actionables */}
                                    {blog.summary.actionables?.length > 0 && (
                                        <div className="knowledge-section">
                                            <h4 className="section-label">ACTIONABLES</h4>
                                            <div className="actionables">
                                                {blog.summary.actionables.map((action, index) => (
                                                    <div key={index} className="actionable">
                                                        <span className="action-arrow">→</span>
                                                        <p>{action}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* My Notes Section */}
                    {isAuthor && (
                        <div className="notes-section">
                            <div className="notes-header">
                                <span className="notes-icon">✏️</span>
                                <h3>MY NOTES</h3>
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={handleSaveNotes}
                                placeholder="Add your thoughts, connections, or reflections..."
                                className="notes-textarea"
                            />
                            {savingNotes && <span className="saving-indicator">Saving...</span>}
                        </div>
                    )}

                    {/* Blog Content */}
                    <div className="blog-body">
                        <h4 className="raw-text-label">RAW TEXT</h4>
                        <div className="raw-text-content">
                            {blog.content.split('\n').map((paragraph, index) => (
                                paragraph.trim() && <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {isAuthor && (
                        <div className="blog-actions">
                            <Link to={`/edit/${blog._id}`} className="action-btn edit-btn">
                                ✏️ Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="action-btn delete-btn"
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : '🗑️ Delete'}
                            </button>
                        </div>
                    )}
                </div>
            </article>

            <Link to="/" className="back-home">
                ← Back to all blogs
            </Link>
        </div>
    );
};

export default ViewBlog;
