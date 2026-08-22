import React, { useState } from 'react';
import { X, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const CategoriesManagerModal = ({ isOpen, onClose }) => {
  const { categories, addCategory, addSubCategory, deleteCategory, deleteSubCategory, reorderCategories, reorderSubCategories, products } = useAdmin();
  const [expandedCats, setExpandedCats] = useState({});
  const [addingMain, setAddingMain] = useState(false);
  const [newMainName, setNewMainName] = useState('');
  const [addingSubFor, setAddingSubFor] = useState(null);
  const [newSubName, setNewSubName] = useState('');

  if (!isOpen) return null;

  const mainCategories = Object.keys(categories || {});

  const toggleExpand = (mainName) => {
    setExpandedCats(prev => ({ ...prev, [mainName]: !prev[mainName] }));
  };

  const countProductsInMain = (mainName) => {
    return products.filter(p => p.mainCategory === mainName).length;
  };

  const countProductsInSub = (mainName, subName) => {
    return products.filter(p => p.mainCategory === mainName && p.subCategory === subName).length;
  };

  const handleMoveMain = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === mainCategories.length - 1) return;
    
    const newOrder = [...mainCategories];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    reorderCategories(newOrder);
  };

  const handleMoveSub = (mainName, subArray, index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === subArray.length - 1) return;
    
    const newOrder = [...subArray];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    reorderSubCategories(mainName, newOrder);
  };

  const handleDeleteMain = (mainName) => {
    const count = countProductsInMain(mainName);
    if (count > 0) {
      if (!window.confirm(`Warning: This category contains ${count} products. Are you sure you want to delete it?`)) return;
    } else {
      if (!window.confirm(`Are you sure you want to delete the category "${mainName}"?`)) return;
    }
    deleteCategory(mainName);
  };

  const handleDeleteSub = (mainName, subName) => {
    const count = countProductsInSub(mainName, subName);
    if (count > 0) {
      if (!window.confirm(`Warning: This subcategory contains ${count} products. Are you sure you want to delete it?`)) return;
    } else {
      if (!window.confirm(`Are you sure you want to delete "${subName}"?`)) return;
    }
    deleteSubCategory(mainName, subName);
  };

  const handleSaveMain = () => {
    if (newMainName.trim()) {
      addCategory(newMainName.trim());
      setNewMainName('');
      setAddingMain(false);
    }
  };

  const handleSaveSub = (mainName) => {
    if (newSubName.trim()) {
      addSubCategory(mainName, newSubName.trim());
      setNewSubName('');
      setAddingSubFor(null);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', width: '90%', maxWidth: '600px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
        
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Manage Categories</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#666" /></button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mainCategories.map((mainCat, mainIndex) => {
              const subs = categories[mainCat] || [];
              const isExpanded = expandedCats[mainCat];
              const pCount = countProductsInMain(mainCat);

              return (
                <div key={mainCat} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  {/* Main Category Row */}
                  <div style={{ background: '#f9fafb', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }} onClick={() => toggleExpand(mainCat)}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{mainCat}</span>
                      <span style={{ fontSize: '12px', color: '#888', background: '#eee', padding: '2px 8px', borderRadius: '100px' }}>{pCount} items</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button 
                        onClick={() => handleMoveMain(mainIndex, 'up')}
                        disabled={mainIndex === 0}
                        style={{ background: 'none', border: 'none', cursor: mainIndex === 0 ? 'not-allowed' : 'pointer', opacity: mainIndex === 0 ? 0.3 : 1, padding: '4px' }}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => handleMoveMain(mainIndex, 'down')}
                        disabled={mainIndex === mainCategories.length - 1}
                        style={{ background: 'none', border: 'none', cursor: mainIndex === mainCategories.length - 1 ? 'not-allowed' : 'pointer', opacity: mainIndex === mainCategories.length - 1 ? 0.3 : 1, padding: '4px' }}
                      >
                        <ArrowDown size={16} />
                      </button>
                      <div style={{ width: '1px', height: '16px', background: '#ddd', margin: '0 4px' }} />
                      <button 
                        onClick={() => handleDeleteMain(mainCat)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {isExpanded && (
                    <div style={{ padding: '8px 0', borderTop: '1px solid #eee', background: '#fff' }}>
                      {subs.length === 0 ? (
                        <p style={{ margin: '12px 24px', fontSize: '13px', color: '#888' }}>No subcategories.</p>
                      ) : (
                        subs.map((subCat, subIndex) => {
                          const sCount = countProductsInSub(mainCat, subCat);
                          return (
                            <div key={subCat} style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: subIndex < subs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#333' }}>{subCat}</span>
                                <span style={{ fontSize: '12px', color: '#888' }}>({sCount})</span>
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button 
                                  onClick={() => handleMoveSub(mainCat, subs, subIndex, 'up')}
                                  disabled={subIndex === 0}
                                  style={{ background: 'none', border: 'none', cursor: subIndex === 0 ? 'not-allowed' : 'pointer', opacity: subIndex === 0 ? 0.3 : 1, padding: '4px' }}
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button 
                                  onClick={() => handleMoveSub(mainCat, subs, subIndex, 'down')}
                                  disabled={subIndex === subs.length - 1}
                                  style={{ background: 'none', border: 'none', cursor: subIndex === subs.length - 1 ? 'not-allowed' : 'pointer', opacity: subIndex === subs.length - 1 ? 0.3 : 1, padding: '4px' }}
                                >
                                  <ArrowDown size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteSub(mainCat, subCat)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', padding: '4px', marginLeft: '8px' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                      
                      {/* Add Subcategory Inline */}
                      {addingSubFor === mainCat ? (
                        <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            autoFocus
                            value={newSubName}
                            onChange={e => setNewSubName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveSub(mainCat)}
                            placeholder="Subcategory name..."
                            style={{ flex: 1, padding: '6px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                          />
                          <button onClick={() => handleSaveSub(mainCat)} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setAddingSubFor(null)} style={{ background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ padding: '8px 24px', display: 'flex' }}>
                          <button 
                            onClick={() => { setAddingSubFor(mainCat); setNewSubName(''); }}
                            style={{ background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            + Add Subcategory
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Add Main Category Inline */}
            {addingMain ? (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb' }}>
                <input 
                  autoFocus
                  value={newMainName}
                  onChange={e => setNewMainName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveMain()}
                  placeholder="Main category name..."
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                />
                <button onClick={handleSaveMain} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                <button onClick={() => setAddingMain(false)} style={{ background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Cancel</button>
              </div>
            ) : (
              <button 
                onClick={() => { setAddingMain(true); setNewMainName(''); }}
                style={{ background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '12px', padding: '12px 16px', color: '#666', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 500 }}
              >
                + Add Main Category
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #eee', background: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{ padding: '10px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagerModal;
