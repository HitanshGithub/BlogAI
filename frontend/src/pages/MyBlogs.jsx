import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import './MyBlogs.css';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBlogs();
    }, []);

    const fetchMyBlogs = async () => {
        try {
            const { data } = await blogAPI.getMyBlogs();
            setBlogs(data);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            await blogAPI.deleteBlog(id);
            setBlogs(blogs.filter(blog => blog._id !== id));
        } catch (error) {
            console.error('Failed to delete blog:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="my-blogs-page">
                <div className="loading-container">
                    <div className="loading-spinner-lg"></div>
                    <p>Loading your blogs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-blogs-page">
            <div className="my-blogs-container">
                <div className="page-header">
                    <div className="header-content">
                        <h1>📚 My Blogs</h1>
                        <p>Manage your blog posts</p>
                    </div>
                    <Link to="/create" className="create-btn">
                        + New Blog
                    </Link>
                </div>

                {blogs.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">✍️</span>
                        <h3>No blogs yet</h3>
                        <p>Start writing your first blog post!</p>
                        <Link to="/create" className="start-btn">Create Blog</Link>
                    </div>
                ) : (
                    <div className="blogs-list">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="blog-item">
                                <div className="blog-info">
                                    <Link to={`/blog/${blog._id}`} className="blog-title">
                                        {blog.title}
                                    </Link>
                                    <div className="blog-meta">
                                        <span className="blog-date">{formatDate(blog.createdAt)}</span>
                                        <span className="blog-views">👁 {blog.views} views</span>
                                        {blog.summary && <span className="has-summary">✨ AI Summary</span>}
                                    </div>
                                </div>
                                <div className="blog-actions">
                                    <Link to={`/edit/${blog._id}`} className="action-btn edit">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        className="action-btn delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBlogs;
