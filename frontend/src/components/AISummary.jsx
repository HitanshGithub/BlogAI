import { useState } from 'react';
import { aiAPI } from '../services/api';
import './AISummary.css';

const AISummary = ({ content, title, onSummaryGenerated, onTagsGenerated, existingSummary }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState(existingSummary || null);

    const generateSummary = async () => {
        if (!content || content.trim().length < 50) {
            setError('Please write at least 50 characters of content before generating a summary.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data } = await aiAPI.summarize(content, title);
            setSummary(data.summary);

            if (onSummaryGenerated) {
                onSummaryGenerated(data.summary);
            }
            if (onTagsGenerated && data.tags) {
                onTagsGenerated(data.tags);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-summary-container">
            <div className="ai-summary-header">
                <div className="ai-icon">✨</div>
                <h3>AI Knowledge Distiller</h3>
            </div>

            <p className="ai-description">
                Generate structured insights from your blog: context, core ideas, actionables, and auto-tags using AI.
            </p>

            {error && (
                <div className="ai-error">
                    <span>⚠️</span> {error}
                </div>
            )}

            {summary && (
                <div className="ai-summary-result">
                    {/* Context Section */}
                    {summary.context && (
                        <div className="summary-section">
                            <h4 className="section-title">📋 CONTEXT</h4>
                            <p className="context-text">{summary.context}</p>
                        </div>
                    )}

                    {/* Core Ideas Section */}
                    {summary.coreIdeas && summary.coreIdeas.length > 0 && (
                        <div className="summary-section">
                            <h4 className="section-title">💡 CORE IDEAS</h4>
                            <ul className="core-ideas-list">
                                {summary.coreIdeas.map((idea, index) => (
                                    <li key={index} className="core-idea-item">
                                        <span className="idea-number">{index + 1}</span>
                                        <span className="idea-text">{idea}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Actionables Section */}
                    {summary.actionables && summary.actionables.length > 0 && (
                        <div className="summary-section">
                            <h4 className="section-title">🚀 ACTIONABLES</h4>
                            <ul className="actionables-list">
                                {summary.actionables.map((action, index) => (
                                    <li key={index} className="actionable-item">
                                        <span className="action-icon">→</span>
                                        <span className="action-text">{action}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={generateSummary}
                disabled={loading}
                className="ai-generate-btn"
            >
                {loading ? (
                    <>
                        <span className="loading-spinner"></span>
                        Distilling Knowledge...
                    </>
                ) : (
                    <>
                        <span>🧠</span>
                        {summary ? 'Regenerate Insights' : 'Distill Knowledge'}
                    </>
                )}
            </button>
        </div>
    );
};

export default AISummary;
