import React from 'react';

const SpacerBlockEditor = ({ module, updateData }) => {
  const { data } = module;

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '20px', height: '100%', minHeight: '100px', background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #fff 10px, #fff 20px)'
    }}>
      <div style={{ background: '#fff', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', gap: '16px', fontSize: '13px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontWeight: 600 }}>Spacer Columns (Span)</label>
          <select value={data?.span || 1} onChange={(e) => updateData({ ...data, span: parseInt(e.target.value) })}>
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>Full Width (4 Cols)</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontWeight: 600 }}>Min Height</label>
          <input 
            type="text" 
            value={data?.height || '0px'} 
            onChange={(e) => updateData({ ...data, height: e.target.value })}
            placeholder="e.g. 100px, 10vh"
            style={{ padding: '4px 8px', width: '80px', border: '1px solid #ccc' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SpacerBlockEditor;
