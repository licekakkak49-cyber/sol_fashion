import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    code = f.read()

# Update rightCol padding
old_right_col = """.rightCol {
  flex: 0 0 40%;
  background-color: #fff;
  border-left: 1px solid #eee;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
}"""
new_right_col = """.rightCol {
  flex: 0 0 40%;
  background-color: #fff;
  border-left: 1px solid #eee;
  padding: 40px 60px 0 60px;
  display: flex;
  flex-direction: column;
}"""
code = code.replace(old_right_col, new_right_col)

# Update totalsSection
old_totals = """.totalsSection {
  margin-bottom: 60px;
  flex: 1;
}"""
new_totals = """.totalsSection {
  margin-top: auto;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  padding-top: 24px;
  padding-bottom: 40px;
  border-top: 1px solid rgba(0,0,0,0.1);
  z-index: 10;
}"""
code = code.replace(old_totals, new_totals)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(code)
