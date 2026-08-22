import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

# Add import
import_statement = "import PreviewModal from './PreviewModal';\n"
if "PreviewModal" not in c:
    c = c.replace("import styles from '../AdminLayout.module.css';", "import styles from '../AdminLayout.module.css';\n" + import_statement)
    c = c.replace("import { Plus, X, ChevronDown, ChevronUp, Trash2, Edit2, Image as ImageIcon, LayoutGrid, Layout }", "import { Plus, X, ChevronDown, ChevronUp, Trash2, Edit2, Image as ImageIcon, LayoutGrid, Layout, Eye }")

# Add state
state_code = """  const [isAddingSet, setIsAddingSet] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [showPreview, setShowPreview] = useState(false);"""
c = c.replace("""  const [isAddingSet, setIsAddingSet] = useState(false);
  const [newSetName, setNewSetName] = useState("");""", state_code)

# Add button
old_btns = """        <button 
          onClick={() => setIsAddingSet(true)}
          style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> New Look Set
        </button>"""

new_btns = """        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setShowPreview(true)}
            style={{ padding: '10px 20px', background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Eye size={18} /> Live Preview
          </button>
          <button 
            onClick={() => setIsAddingSet(true)}
            style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> New Look Set
          </button>
        </div>"""
c = c.replace(old_btns, new_btns)

# Add modal rendering
modal_code = """
      {showPreview && <PreviewModal sets={sets} onClose={() => setShowPreview(false)} />}
    </div>
  );"""
c = c.replace("""    </div>
  );""", modal_code)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
