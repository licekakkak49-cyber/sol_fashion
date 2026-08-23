import re
with open('src/context/AdminContext.jsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if line.startswith("  const [homepageModules,"):
        new_lines.append("  const [homepageModules, setHomepageModules] = useState([]);\n")
        skip = True
    elif skip and "setHomepageModules] = useState([]);" in line:
        skip = False
    elif not skip:
        new_lines.append(line)

with open('src/context/AdminContext.jsx', 'w') as f:
    f.writelines(new_lines)

