with open('/Users/aliceer/sol_fashion/src/components/ImageCropper.jsx', 'r') as f:
    c = f.read()

import re

# Add allowAspectChange to props
c = c.replace(
    "const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 4 / 3, showFocusBox = true, warningMessage = '' }) => {",
    "const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 4 / 3, showFocusBox = true, warningMessage = '', allowAspectChange = false }) => {"
)

# Add state for aspect
c = c.replace(
    "const [crop, setCrop] = useState({ x: 0, y: 0 });",
    "const [crop, setCrop] = useState({ x: 0, y: 0 });\n  const [currentAspect, setCurrentAspect] = useState(aspectRatio);"
)

# Update Cropper component
c = c.replace("aspect={aspectRatio}", "aspect={currentAspect}")

# Add Aspect ratio buttons
aspect_buttons_jsx = """
      {allowAspectChange && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', background: '#333', padding: '8px', borderRadius: '100px' }}>
          {[
            { label: '3:4', value: 3/4 },
            { label: '1:1', value: 1 },
            { label: '4:3', value: 4/3 },
            { label: '16:9', value: 16/9 },
          ].map(opt => (
            <button 
              key={opt.label}
              onClick={() => setCurrentAspect(opt.value)}
              style={{
                padding: '6px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                background: currentAspect === opt.value ? '#fff' : 'transparent',
                color: currentAspect === opt.value ? '#111' : '#fff'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
"""
c = c.replace("<div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>", aspect_buttons_jsx + "\n      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>")

with open('/Users/aliceer/sol_fashion/src/components/ImageCropper.jsx', 'w') as f:
    f.write(c)

