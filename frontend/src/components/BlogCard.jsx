import { Link } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ blog }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateContent = (content, maxLength = 150) => {
        const plainText = content.replace(/<[^>]*>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    };

    // Check if blog has a valid summary with context
    const hasSummary = blog.summary && (blog.summary.context || blog.summary.coreIdeas?.length > 0);
    const summaryText = blog.summary?.context || '';

    return (
        <Link to={`/blog/${blog._id}`} className="blog-card">
            {blog.coverImage && (
                <div className="blog-card-image">
                    <img src={blog.coverImage} alt={blog.title} />
                </div>
            )}
            <div className="blog-card-content">
                <div className="blog-card-tags">
                    {blog.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="blog-tag">{tag}</span>
                    ))}
                </div>
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{truncateContent(blog.content)}</p>

                {hasSummary && (
                    <div className="blog-card-summary">
                        <span className="ai-badge">✨ AI Summary</span>
                        <p>{summaryText.substring(0, 100)}{summaryText.length > 100 ? '...' : ''}</p>
                    </div>
                )}

                <div className="blog-card-footer">
                    <div className="blog-author">
                        <div className="author-avatar">
                            {blog.author?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className="author-name">{blog.author?.name || 'Anonymous'}</span>
                    </div>
                    <div className="blog-meta">
                        <span className="blog-date">{formatDate(blog.createdAt)}</span>
                        <span className="blog-views">👁 {blog.views}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
