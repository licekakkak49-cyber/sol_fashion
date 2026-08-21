with open('/Users/aliceer/sol_fashion/src/utils/cropImage.js', 'r') as f:
    c = f.read()

import re

# We will cap width to 800
new_logic = """
  const MAX_WIDTH = 800;
  let scale = 1;
  if (pixelCrop.width > MAX_WIDTH) {
    scale = MAX_WIDTH / pixelCrop.width;
  }

  canvas.width = pixelCrop.width * scale;
  canvas.height = pixelCrop.height * scale;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    // Drop quality to 0.7 for even smaller base64
    resolve(canvas.toDataURL('image/jpeg', 0.7));
  });
"""

c = re.sub(r"  canvas\.width = pixelCrop\.width;.*resolve\(canvas\.toDataURL\('image/webp', 0\.9\)\);\n  \}\);\n", new_logic, c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/utils/cropImage.js', 'w') as f:
    f.write(c)

