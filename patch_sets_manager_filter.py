import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old_render = """          sets.map(set => (
            <SetAccordion """

new_render = """          sets.filter(s => {
            if (activeMainCategory && activeMainCategory !== 'New In') {
              if (s.mainCategory !== activeMainCategory && s.main_category !== activeMainCategory) return false;
            }
            if (activeSubCategory && activeSubCategory !== 'View all' && activeSubCategory !== 'New In') {
              if (s.subCategory !== activeSubCategory && s.sub_category !== activeSubCategory) return false;
            }
            return true;
          }).map(set => (
            <SetAccordion """

c = c.replace(old_render, new_render)

# We should also patch the empty state logic
old_empty = """{sets.length === 0 ? ("""
new_empty = """{sets.filter(s => {
            if (activeMainCategory && activeMainCategory !== 'New In') {
              if (s.mainCategory !== activeMainCategory && s.main_category !== activeMainCategory) return false;
            }
            if (activeSubCategory && activeSubCategory !== 'View all' && activeSubCategory !== 'New In') {
              if (s.subCategory !== activeSubCategory && s.sub_category !== activeSubCategory) return false;
            }
            return true;
          }).length === 0 ? ("""
c = c.replace(old_empty, new_empty)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
