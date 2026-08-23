import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

new_css = """
.reviewSection {
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding: 32px 0;
}

.reviewSection:first-child {
  padding-top: 0;
}

.reviewHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.reviewTitle {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgb(30, 30, 30);
  letter-spacing: 0.05em;
  margin: 0;
}

.editLink {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  color: rgb(30, 30, 30);
  text-decoration: underline;
  cursor: pointer;
  letter-spacing: 0.03em;
}

.reviewText {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  color: rgb(150, 150, 150);
  line-height: 1.6;
  margin: 0;
  letter-spacing: 0.03em;
}

.reviewSubtext {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  color: rgb(150, 150, 150);
  margin: 4px 0 0 0;
  letter-spacing: 0.03em;
}

.deliveryReview {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.paymentSection {
  padding-top: 32px;
}

.paymentBox {
  display: flex;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.2);
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.paymentBox:hover {
  border-color: rgb(30, 30, 30);
}

.paymentBoxLeft {
  display: flex;
  align-items: center;
  gap: 16px;
}

.paymentMethodName {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgb(30, 30, 30);
  letter-spacing: 0.03em;
}

/* RIGHT COLUMN */"""

css = css.replace("/* RIGHT COLUMN */", new_css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
