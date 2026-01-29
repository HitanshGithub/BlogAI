import { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import './Home.css';

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBlogs();
    }, [page, search]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await blogAPI.getBlogs({ page, search, limit: 9 });
            setBlogs(data.blogs);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchBlogs();
    };

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Discover Amazing Stories
                        <span className="hero-highlight"> Powered by AI</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore insightful blog posts with AI-generated summaries.
                        Write, share, and let AI help you create better content.
                    </p>

                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            🔍 Search
                        </button>
                    </form>
                </div>
                <div className="hero-decoration">
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                    <div className="floating-shape shape-3"></div>
                </div>
            </section>

            <section className="blogs-section">
                <div className="section-header">
                    <h2>Latest Posts</h2>
                    <p>Fresh ideas and perspectives from our community</p>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner-lg"></div>
                        <p>Loading blogs...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📝</span>
                        <h3>No blogs found</h3>
                        <p>Be the first to create a blog post!</p>
                    </div>
                ) : (
                    <>
                        <div className="blogs-grid">
                            {blogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setPage(p => p - 1)}
                                    disabled={page === 1}
                                    className="page-btn"
                                >
                                    ← Previous
                                </button>
                                <span className="page-info">Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page === totalPages}
                                    className="page-btn"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default Home;
