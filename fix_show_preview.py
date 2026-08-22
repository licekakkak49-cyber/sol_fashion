import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

# The first one is in SetAccordion, around line 457.
old_accordion_end = """      {showPreview && <PreviewModal sets={sets} onClose={() => setShowPreview(false)} />}
    </div>
  );
};"""

new_accordion_end = """    </div>
  );
};"""

c = c.replace(old_accordion_end, new_accordion_end)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
