import React from 'react';

const TextBlockEditor = ({ module, updateData }) => {
  const { data } = module;

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: data?.align || 'center',
      padding: '40px', textAlign: data?.align || 'center', height: '100%', minHeight: '200px'
    }}>
      <h2 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => updateData({ ...data, title: e.currentTarget.innerText })}
        style={{ fontSize: '32px', margin: '0 0 16px 0', fontWeight: 'normal', outline: 'none', borderBottom: '1px dashed #ccc' }}
      >
        {data?.title}
      </h2>
      <p 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => updateData({ ...data, subtitle: e.currentTarget.innerText })}
        style={{ fontSize: '16px', margin: '0 0 24px 0', color: '#666', outline: 'none', borderBottom: '1px dashed #ccc' }}
      >
        {data?.subtitle}
      </p>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => updateData({ ...data, linkText: e.currentTarget.innerText })}
          style={{ fontSize: '14px', textDecoration: 'underline', color: '#000', outline: 'none', borderBottom: '1px dashed #ccc' }}
        >
          {data?.linkText}
        </span>
        <input 
          type="text" 
          value={data?.linkUrl || ''} 
          onChange={(e) => updateData({ ...data, linkUrl: e.target.value })}
          placeholder="/products"
          style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ddd' }}
        />
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '8px', fontSize: '12px' }}>
        <label>Align:</label>
        <select value={data?.align || 'center'} onChange={(e) => updateData({ ...data, align: e.target.value })}>
          <option value="flex-start">Left</option>
          <option value="center">Center</option>
          <option value="flex-end">Right</option>
        </select>
        <label style={{ marginLeft: '12px' }}>Span:</label>
        <select value={data?.span || 4} onChange={(e) => updateData({ ...data, span: parseInt(e.target.value) })}>
          <option value={1}>1 Column</option>
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
          <option value={4}>Full Width (4 Cols)</option>
        </select>
      </div>
    </div>
  );
};

export default TextBlockEditor;
