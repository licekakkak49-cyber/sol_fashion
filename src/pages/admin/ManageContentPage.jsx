import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Edit2, Trash2, Pin, Eye, EyeOff, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './AdminLayout.module.css';

const ManageContentPage = ({ category, pageTitle, pageSubtitle }) => {
  const { contentArticles, addContentArticle, updateContentArticle, deleteContentArticle, changeContentOrder } = useAdmin();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sort articles: Pinned first, then by date (newest first)
  const categoryArticles = contentArticles.filter(a => a.category === category);
  const sortedArticles = [...categoryArticles].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  };

  useEffect(() => {
    if (category === 'explore') {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }
  }, [category, contentArticles]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = window.innerWidth / 4.5; 
      const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const newArticle = {
      title: newTitle,
      excerpt: 'Add a short excerpt here...',
      date: new Date().toISOString().split('T')[0],
      isPinned: false,
      status: 'Draft',
      category: category,
      coverImage: '',
    };
    
    const newId = addContentArticle(newArticle);
    setNewTitle('');
    setIsModalOpen(false);
    navigate(`/admin/${category}/${newId}`);
  };

  const handleTogglePin = (e, article) => {
    e.stopPropagation();
    updateContentArticle(article.id, { isPinned: !article.isPinned });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteContentArticle(id);
    }
  };



  return (
    <div className={styles.adminContainer}>
      <div className={styles.headerArea} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <p className={styles.pageSubtitle}>{pageSubtitle}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} /> New Article
        </button>
      </div>

      {category === 'explore' ? (
        <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 200px)', minHeight: '600px' }}>
          {canScrollLeft && (
            <button onClick={() => scroll('left')} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <ChevronLeft size={24} />
            </button>
          )}
          <div ref={scrollRef} onScroll={checkScroll} style={{ display: 'flex', overflowX: 'auto', gap: '0', height: '100%', background: '#f9fafb', borderRadius: '0', border: '1px solid #e5e7eb', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {sortedArticles.map(article => {
            return (
              <div 
                key={article.id} 
                onClick={() => navigate(`/admin/${category}/${article.id}`)}
                style={{
                  flex: '0 0 auto',
                  width: 'calc(100vw / 4.5)',
                  minWidth: '280px',
                  height: '100%',
                  position: 'relative',
                  cursor: 'pointer',
                  borderRight: '1px solid #fff'
                }}
                onMouseEnter={e => e.currentTarget.querySelector('.admin-overlay').style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.querySelector('.admin-overlay').style.opacity = '0'}
              >
                { (article.thumbnailImage || article.coverImage) ? (
                  <img 
                    src={article.thumbnailImage || article.coverImage} 
                    alt={article.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', background: '#e5e7eb' }}>
                    <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>NO IMAGE</span>
                  </div>
                )}
                
                {/* Title overlay matching StoryPage */}
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px' }}>
                  {article.isPinned && <span style={{ display: 'inline-block', marginBottom: '8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>Pinned</span>}
                  <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 400, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)', letterSpacing: '0.05em' }}>
                    {article.title}
                  </p>
                </div>

                {/* Admin Hover Overlay */}
                <div 
                  className="admin-overlay" 
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: 0, transition: 'opacity 0.2s', zIndex: 10 }}
                >
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/${category}/${article.id}`); }} style={{ padding: '10px 24px', background: '#fff', border: 'none', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', color: '#111', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Edit2 size={14} /> Edit</button>
                  <button onClick={(e) => handleTogglePin(e, article)} style={{ padding: '10px 24px', background: '#fff', border: 'none', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', color: article.isPinned ? '#dc2626' : '#111', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Pin size={14} fill={article.isPinned ? "currentColor" : "none"} /> {article.isPinned ? 'Unpin' : 'Pin'}</button>
                  <button onClick={(e) => handleDelete(e, article.id)} style={{ padding: '10px 24px', background: '#ef4444', border: 'none', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', color: '#fff', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            );
          })}
            {sortedArticles.length === 0 && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                <p>No articles found for this category.</p>
              </div>
            )}
          </div>
          
          {canScrollRight && sortedArticles.length > 0 && (
            <button onClick={() => scroll('right')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedArticles.map((article, idx) => (
            <div 
              key={article.id} 
              onClick={() => navigate(`/admin/${category}/${article.id}`)}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '160px 1fr auto', 
                gap: '24px', 
                background: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '16px', 
                padding: '16px', 
                cursor: 'pointer',
                transition: 'all 0.2s',
                alignItems: 'center'
              }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { borderColor: '#111', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: '#e5e7eb', transform: 'none', boxShadow: 'none' })}
            >
              {/* Thumbnail */}
              <div style={{ width: '160px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                { (article.thumbnailImage || article.coverImage) ? (
                  <img src={article.thumbnailImage || article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9ca3af' }}>
                    <ImageIcon size={24} style={{ marginBottom: '4px' }} />
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>NO IMAGE</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111' }}>{article.title}</h3>
                  {category !== 'lenses' && article.isPinned && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#dc2626', background: '#fee2e2', padding: '4px 8px', borderRadius: '100px' }}><Pin size={12} fill="currentColor" /> Pinned</span>}
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: article.status === 'Published' ? '#059669' : '#888', background: article.status === 'Published' ? '#d1fae5' : '#f3f4f6', padding: '4px 8px', borderRadius: '100px' }}>
                    {article.status}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666', fontWeight: 500, marginTop: '4px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>{article.date ? new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No date'}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {category === 'lenses' && (
                  <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order:</label>
                    <select 
                      value={idx} 
                      onClick={e => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); changeContentOrder(category, article.id, parseInt(e.target.value, 10)); }}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
                    >
                      {sortedArticles.map((_, i) => (
                        <option key={i} value={i}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                )}
                {category !== 'lenses' && (
                  <button 
                    onClick={(e) => handleTogglePin(e, article)} 
                    title={article.isPinned ? "Unpin" : "Pin to top"}
                    style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: '1px solid #e5e7eb', cursor: 'pointer', color: article.isPinned ? '#dc2626' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Pin size={16} fill={article.isPinned ? "currentColor" : "none"} />
                  </button>
                )}
                <button 
                  onClick={(e) => handleDelete(e, article.id)} 
                  title="Delete"
                  style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: '1px solid #e5e7eb', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {sortedArticles.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', background: '#f9fafb', borderRadius: '16px', border: '1px dashed #d1d5db', color: '#888' }}>
              <p>No articles found for this category.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Create New Article</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateNew}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#444' }}>Article Title *</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. The Art of Craftsmanship"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }}
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={!newTitle.trim()}
                style={{ width: '100%', background: newTitle.trim() ? '#111' : '#e5e7eb', color: newTitle.trim() ? '#fff' : '#9ca3af', border: 'none', padding: '14px', borderRadius: '100px', fontWeight: 600, cursor: newTitle.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
              >
                Create Article
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContentPage;
