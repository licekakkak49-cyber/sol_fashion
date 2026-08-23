import re
with open('src/components/GlobalFilterPanel.jsx', 'r') as f:
    code = f.read()

old_line_accordion = """                <div className={styles.accordionItem}>
                  <button className={styles.accordionHeader} onClick={() => toggleSection('LINE')}>"""

new_line_accordion = """                {dynamicFilterData.line && dynamicFilterData.line.length > 0 && (
                <div className={styles.accordionItem}>
                  <button className={styles.accordionHeader} onClick={() => toggleSection('LINE')}>"""

old_line_end = """                        {renderBoxOptions('line', dynamicFilterData.line)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>"""

new_line_end = """                        {renderBoxOptions('line', dynamicFilterData.line)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                )}"""

code = code.replace(old_line_accordion, new_line_accordion)
code = code.replace(old_line_end, new_line_end)

with open('src/components/GlobalFilterPanel.jsx', 'w') as f:
    f.write(code)
