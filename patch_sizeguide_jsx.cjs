const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldSidebarContainer = `          <motion.div
            className={styles.sidebarContainer}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>`;
            
const newSidebarContainer = `          <motion.div
            className={styles.sidebarContainer}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.innerContainer}>
              <div className={styles.header}>`;

code = code.replace(oldSidebarContainer, newSidebarContainer);

// add closing div for innerContainer right before </motion.div>
const oldClosing = `          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};`;
const newClosing = `            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};`;
code = code.replace(oldClosing, newClosing);

fs.writeFileSync(path, code);
