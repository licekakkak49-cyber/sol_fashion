import re

with open('src/pages/HomePage.jsx', 'r') as f:
    content = f.read()

content = content.replace("paddingLeft: row.isIndented ? '25%' : '12px',", "paddingLeft: row.isIndented ? '25%' : undefined,")

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(content)

with open('src/pages/HomePage.module.css', 'w') as f:
    f.write("""
.homepageGridWrapper {
  --grid-gap: 6px;
  --page-padding: 20px;

  display: flex;
  flex-direction: column;
  gap: var(--grid-gap);
  padding: var(--page-padding) 0;
  width: 100%;
}

.homepageGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: dense;
  gap: var(--grid-gap);
  padding: 0 var(--page-padding);
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  overflow-x: hidden;
}

.span1 { grid-column: span 1; }
.span2 { grid-column: span 2; }
.span3 { grid-column: span 3; }
.span4 { grid-column: span 4; }

.edgeToEdge {
  width: calc(100% + (var(--page-padding) * 2)) !important;
  margin-left: calc(var(--page-padding) * -1) !important;
  margin-right: calc(var(--page-padding) * -1) !important;
  max-width: none !important;
  position: relative;
  z-index: 1;
}

.fullWidth {
  width: 100vw !important;
  margin-left: calc(-50vw + 50%) !important;
  margin-right: calc(-50vw + 50%) !important;
  max-width: none !important;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .homepageGridWrapper {
    --grid-gap: 4px;
    --page-padding: 10px;
  }
  .homepageGrid {
    grid-template-columns: repeat(2, 1fr);
  }
  .span3, .span4 { grid-column: span 2; }
  .span2 { grid-column: span 2; }
}
""")

print("Done")
