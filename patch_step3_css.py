import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    code = f.read()

new_css = """
.stepContainer {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.4s ease forwards;
}

.formGroup {
  margin-bottom: 32px;
}

.formLabel {
  display: block;
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgb(150, 150, 150);
  margin-bottom: 16px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.radioGroup {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.radioLabel {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgb(30, 30, 30);
  cursor: pointer;
  letter-spacing: 0.03em;
}

.customRadio {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid rgb(30, 30, 30);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  position: relative;
  background: transparent;
}

.customRadio:checked::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  background: rgb(30, 30, 30);
  border-radius: 50%;
}

.formRow {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}

.formField {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 32px;
}

.formRow .formField {
  margin-bottom: 0;
}

.staticLabel {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgb(150, 150, 150);
  margin-bottom: 8px;
  letter-spacing: 0.03em;
}

.textInput, .selectInput {
  width: 100%;
  border: none;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  background: transparent;
  padding: 8px 0;
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: rgb(30, 30, 30);
  outline: none;
  transition: border-color 0.2s;
  letter-spacing: 0.03em;
}

.textInput:focus, .selectInput:focus {
  border-bottom: 1px solid rgb(30, 30, 30);
}

.selectInput {
  appearance: none;
  cursor: pointer;
}

.checkboxGroup {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.checkboxTitle {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgb(30, 30, 30);
  letter-spacing: 0.03em;
}

.checkboxSubtext {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  color: rgb(150, 150, 150);
  padding-left: 28px;
  letter-spacing: 0.03em;
}

.deliveryBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.2);
  padding: 24px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.deliveryBox:hover {
  border-color: rgb(30, 30, 30);
}

.deliveryBoxLeft {
  display: flex;
  align-items: center;
  gap: 20px;
}

.deliveryDetails {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.deliveryTitle {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgb(30, 30, 30);
  letter-spacing: 0.03em;
}

.deliverySubtext {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  color: rgb(150, 150, 150);
  letter-spacing: 0.03em;
}

.deliveryPrice {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgb(30, 30, 30);
  letter-spacing: 0.05em;
}

.btnSolidFull {
  width: 100%;
  background-color: rgb(30, 30, 30);
  color: #fff;
  border: 1px solid rgb(30, 30, 30);
  padding: 16px;
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btnSolidFull:hover {
  background-color: #fff;
  color: rgb(30, 30, 30);
}
"""

if ".stepContainer {" not in code:
    code = code.replace("/* RIGHT COLUMN */", new_css + "\n/* RIGHT COLUMN */")

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(code)
