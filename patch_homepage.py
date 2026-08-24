import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

# Replace the component signature and state
old_signature = """const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {"""

new_signature = """const HomePage = ({ previewItems }) => {
  const [items, setItems] = useState(previewItems || []);
  const [loading, setLoading] = useState(!previewItems);

  useEffect(() => {
    if (previewItems) {
      setItems(previewItems);
      setLoading(false);
      return;
    }
    
    const fetchItems = async () => {"""

code = code.replace(old_signature, new_signature)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)
