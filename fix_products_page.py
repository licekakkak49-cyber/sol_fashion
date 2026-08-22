with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

import re

# We will just replace the return statement block.
# Start of return statement:
#   return (
#     <div className={styles.page}>
#       {/* Options Bar */}
c = c.replace("""  return (
    <div className={styles.page}>
      {/* Options Bar */}""", """  return (
    <div className={styles.page}>
      {!previewSets && (
      <>
      {/* Options Bar */}""")

# End of Global Filter:
#           onClearAll={clearAllFilters}
#         />
c = c.replace("""          onClearAll={clearAllFilters}
        />""", """          onClearAll={clearAllFilters}
        />
        </>
      )}""")

# The bottom section logic was messed up. Let's fix that too.
# First remove my previous messy replace:
c = c.replace("""      {!previewSets && (
      {/* Bottom Section */}
      <div className={styles.bottomSection}>""", """      {!previewSets && (
      <div className={styles.bottomSection}>""")

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
