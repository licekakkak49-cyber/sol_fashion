import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import BespokeModuleEditor from './BespokeModuleEditor';
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Save, ArrowLeft, AlertTriangle } from 'lucide-react';
import styles from './AdminLayout.module.css';
import ImageCropper from '../../components/ImageCropper';

const ManageContentEditor = ({ category, backUrl }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contentArticles, updateContentArticle } = useAdmin();
  
  const currentArticle = contentArticles.find(a => a.id === id);
  const [modules, setModules] = useState(currentArticle ? currentArticle.modules : []);
  const [status, setStatus] = useState(currentArticle ? currentArticle.status : 'Draft');
  const [date, setDate] = useState(currentArticle ? currentArticle.date : '');
  const [title, setTitle] = useState(currentArticle ? currentArticle.title : '');
  const [coverImage, setCoverImage] = useState(currentArticle ? currentArticle.coverImage : '');
  const [coverSettings, setCoverSettings] = useState(currentArticle?.coverSettings || { isVisible: true, showTitle: true });
  const [thumbnailImage, setThumbnailImage] = useState(currentArticle ? currentArticle.thumbnailImage : '');
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropThumbnailSrc, setCropThumbnailSrc] = useState(null);
  const [imageWarning, setImageWarning] = useState('');
  const fileInputRef = React.useRef(null);
  const thumbnailInputRef = React.useRef(null);

  useEffect(() => {
    if (currentArticle) {
      setModules(currentArticle.modules);
      setStatus(currentArticle.status);
      setDate(currentArticle.date);
      setTitle(currentArticle.title);
      setCoverImage(currentArticle.coverImage);
      if (currentArticle.coverSettings) {
        setCoverSettings(currentArticle.coverSettings);
      }
      setThumbnailImage(currentArticle.thumbnailImage || '');
    }
  }, [currentArticle]);

  if (!currentArticle) {
    return <div style={{ padding: '40px' }}>Article not found.</div>;
  }

  const handleUpdateModule = (moduleId, updatedModule) => {
    setModules(modules.map(m => m.id === moduleId ? updatedModule : m));
  };

  const handleMove = (index, direction) => {
    const newModules = [...modules];
    if (direction === 'up' && index > 0) {
      [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    } else if (direction === 'down' && index < newModules.length - 1) {
      [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
    }
    setModules(newModules);
  };

  const handleToggleVisibility = (id) => {
    setModules(modules.map(m => m.id === id ? { ...m, isVisible: !m.isVisible } : m));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      setModules(modules.filter(m => m.id !== id));
    }
  };

  const handleAddModule = (type) => {
    const newModule = {
      id: `block-${Date.now()}`,
      type,
      isVisible: true,
      data: {
        image: '',
        heading: 'NEW HEADING',
        paragraph: 'Type your paragraph here...',
        showHeading: true,
        showParagraph: true
      }
    };
    setModules([...modules, newModule]);
  };

  const handleSave = () => {
    updateContentArticle(id, {
      ...currentArticle,
      title,
      status,
      date,
      coverImage,
      coverSettings,
      thumbnailImage,
      modules
    });
    alert('Article saved successfully!');
    navigate(backUrl || `/admin/${category}`);
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.headerArea} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <button onClick={() => navigate(backUrl || `/admin/${category}`)} style={{ background: 'none', border: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', fontSize: '13px' }}>
            <ArrowLeft size={16} /> Back to Overview
          </button>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            style={{ fontSize: '24px', fontWeight: 700, border: 'none', outline: 'none', width: '100%', marginBottom: '8px', background: 'transparent' }} 
            placeholder="Article Title..." 
          />
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>Status:</span>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ fontFamily: "'Inter', sans-serif", padding: '6px 12px', borderRadius: '100px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>Date:</span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ fontFamily: "'Inter', sans-serif", padding: '6px 12px', borderRadius: '100px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', cursor: 'pointer', accentColor: '#ec4899' }} />
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave}
          style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          <Save size={18} /> Save Layout
        </button>
      </div>

      {/* Thumbnail Image Uploader (Explore Only) */}
      {category === 'explore' && (
        <div style={{ marginBottom: '40px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', textTransform: 'uppercase', color: '#111' }}>Thumbnail Image (Explore Index)</span>
            {coverImage && (
              <button 
                onClick={() => setCropThumbnailSrc(coverImage)}
                style={{ background: '#f3f4f6', color: '#111', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ✂️ Crop from Cover Image
              </button>
            )}
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', background: '#fff' }}>
              <div 
                onClick={() => thumbnailInputRef.current?.click()}
                style={{ 
                  width: '25%', 
                  minWidth: '250px',
                  aspectRatio: '4 / 9', 
                  border: thumbnailImage ? 'none' : '1px dashed #d1d5db', 
                  background: thumbnailImage ? '#111' : '#f9fafb', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {thumbnailImage ? (
                  <>
                    <img src={thumbnailImage} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                      <span style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUp size={16} /> Change Thumbnail</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9ca3af' }}>
                    <ArrowUp size={32} style={{ marginBottom: '12px', color: '#d1d5db' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: '#111' }}>Upload Thumbnail</span>
                    <span style={{ fontSize: '12px' }}>Vertical aspect ratio (1:2.5)</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={thumbnailInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setCropThumbnailSrc(ev.target.result);
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                    e.target.value = null;
                  }}
                />
              </div>
          </div>
        </div>
      )}

      {/* Cover Image Uploader - Styled as a Module */}
      <div style={{ marginBottom: '40px', position: 'relative' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '12px', textTransform: 'uppercase', color: '#111' }}>Cover Image</span>
        
        {/* Sidebar Controls for Cover */}
        <div style={{ position: 'absolute', left: '-50px', top: '32px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
          <button 
            onClick={() => setCoverSettings({ ...coverSettings, isVisible: !coverSettings.isVisible })} 
            title={coverSettings.isVisible ? "Hide Cover Image" : "Show Cover Image"}
            style={{ padding: '8px', borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer' }}
          >
            {coverSettings.isVisible ? <Eye size={16} /> : <EyeOff size={16} color="#9ca3af" />}
          </button>
        </div>

        <div style={{ opacity: coverSettings.isVisible ? 1 : 0.4, transition: 'opacity 0.2s', background: '#fff', margin: '0 -40px' }}>
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              width: '100%', 
              aspectRatio: '21 / 9', 
              border: coverImage ? 'none' : '1px dashed #d1d5db', 
              borderRadius: '0', 
              background: coverImage ? '#111' : '#f9fafb', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {coverImage ? (
              <>
                <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                
                {/* Text Overlay Preview */}
                {coverSettings.showTitle && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <h1 style={{ fontFamily: "'Jacopo Mediaeval', serif", fontSize: '88px', fontWeight: 400, color: '#fff', textAlign: 'center', textShadow: '0 4px 20px rgba(0,0,0,0.5)', margin: 0, padding: '0 20px' }}>
                      {title || 'Article Title'}
                    </h1>
                  </div>
                )}

                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                  <span style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUp size={16} /> Change Cover Image</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9ca3af' }}>
                <ArrowUp size={32} style={{ marginBottom: '12px', color: '#d1d5db' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: '#111' }}>Upload Cover Image</span>
                <span style={{ fontSize: '12px' }}>Full width banner recommended</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const base64Str = ev.target.result;
                    const img = new Image();
                    img.src = base64Str;
                    img.onload = () => {
                      if (img.width < 1000 || img.height < 600) {
                        setImageWarning('⚠️ Warning: Image resolution is quite low. It may appear blurry after cropping.');
                      } else {
                        setImageWarning('');
                      }
                      setCropImageSrc(base64Str);
                    };
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
                e.target.value = null;
              }}
            />
          </div>

          {imageWarning && !cropImageSrc && (
            <div style={{ marginTop: '12px', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', color: '#d97706', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={14} />
              {imageWarning}
            </div>
          )}

          {/* Toggle for Title Overlay */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#111' }}>
              <input 
                type="checkbox" 
                checked={coverSettings.showTitle} 
                onChange={(e) => setCoverSettings({ ...coverSettings, showTitle: e.target.checked })} 
                style={{ cursor: 'pointer', accentColor: '#111' }}
              />
              Show Title Overlay on Image
            </label>
            <span style={{ fontSize: '12px', color: '#666' }}>(Jacopo Mediaeval, 88px, White)</span>
          </div>
        </div>
      </div>

      {/* Add New Module Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', marginRight: '8px' }}>Add Module:</span>
        {[
          { type: 'full-image', label: 'Full Image' },
          { type: 'split-left-image', label: 'Image Left, Text Right' },
          { type: 'split-right-image', label: 'Text Left, Image Right' },
          { type: 'center-text', label: 'Center Text' },
          { type: 'product-grid', label: 'Product Grid' },
          { type: 'chat-button', label: 'Chat Button' }
        ].map(btn => (
          <button 
            key={btn.type}
            onClick={() => handleAddModule(btn.type)} 
            style={{ padding: '8px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '100px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <Plus size={14}/> {btn.label}
          </button>
        ))}
      </div>

      {/* Editor Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {modules.map((mod, index) => (
          <div key={mod.id} style={{ position: 'relative' }}>
            {/* Sidebar Controls for the Module */}
            <div style={{ position: 'absolute', left: '-50px', top: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
              <button onClick={() => handleMove(index, 'up')} disabled={index === 0} style={{ padding: '8px', borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', cursor: index === 0 ? 'not-allowed' : 'pointer' }}><ArrowUp size={16} /></button>
              <button onClick={() => handleMove(index, 'down')} disabled={index === modules.length - 1} style={{ padding: '8px', borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', cursor: index === modules.length - 1 ? 'not-allowed' : 'pointer' }}><ArrowDown size={16} /></button>
              <button onClick={() => handleToggleVisibility(mod.id)} style={{ padding: '8px', borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                {mod.isVisible ? <Eye size={16} /> : <EyeOff size={16} color="#9ca3af" />}
              </button>
              <button onClick={() => handleDelete(mod.id)} style={{ padding: '8px', borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
            </div>

            {/* The Module Renderer */}
            <div style={{ opacity: mod.isVisible ? 1 : 0.4, transition: 'opacity 0.2s' }}>
              <BespokeModuleEditor module={mod} updateModule={handleUpdateModule} />
            </div>
          </div>
        ))}
      </div>
      
      {cropImageSrc && (
        <ImageCropper 
          imageSrc={cropImageSrc} 
          aspectRatio={21 / 9}
          showFocusBox={false}
          onCropComplete={(croppedBase64) => {
            setCoverImage(croppedBase64);
            setCropImageSrc(null);
            setImageWarning('');
          }}
          onCancel={() => {
            setCropImageSrc(null);
            setImageWarning('');
          }}
        />
      )}

      {cropThumbnailSrc && (
        <ImageCropper 
          imageSrc={cropThumbnailSrc} 
          aspectRatio={1 / 2.5}
          showFocusBox={false}
          onCropComplete={(croppedBase64) => {
            setThumbnailImage(croppedBase64);
            setCropThumbnailSrc(null);
          }}
          onCancel={() => {
            setCropThumbnailSrc(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageContentEditor;
