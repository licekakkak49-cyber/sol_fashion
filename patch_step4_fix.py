with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

append_css = """

/* OVERRIDES FOR PAYMENT BOX */
.paymentBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid rgba(0,0,0,0.2);
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.paymentBoxExpanded {
  border-color: rgb(30, 30, 30);
}

.paymentBox:hover {
  border-color: rgb(30, 30, 30);
}

.paymentBoxLeft {
  display: flex;
  align-items: center;
  gap: 16px;
}

.paymentForm {
  width: 100%;
  animation: fadeIn 0.4s ease forwards;
}

.cardIcons {
  position: absolute;
  right: 0;
  bottom: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.cardIcons img {
  height: 12px;
  width: auto;
  object-fit: contain;
}
"""

with open('src/pages/CheckoutPage.module.css', 'a') as f:
    f.write(append_css)
