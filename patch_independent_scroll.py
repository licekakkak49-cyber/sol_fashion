import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# 1. Update checkoutContainer
old_container = """.checkoutContainer {
  display: flex;
  align-items: flex-start;
  position: relative;
  min-height: 100vh;
  width: 100vw;
  background-color: #fff;
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  color: rgb(30, 30, 30);
  overflow-x: hidden;
}"""
new_container = """.checkoutContainer {
  display: flex;
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  color: rgb(30, 30, 30);
  overflow: hidden;
}"""
css = css.replace(old_container, new_container)

# 2. Update leftCol
old_leftCol = """.leftCol {
  flex: 0 0 60%;
  padding: 40px 80px 40px 40px;
  display: flex;
  flex-direction: column;
}"""
new_leftCol = """.leftCol {
  flex: 0 0 60%;
  padding: 40px 80px 40px 40px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}"""
css = css.replace(old_leftCol, new_leftCol)

# 3. Update rightCol
old_rightCol = """.rightCol {
  flex: 0 0 40%;
  background-color: #fff;
  border-left: 1px solid #eee;
  padding: 40px 60px 0 60px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}"""
new_rightCol = """.rightCol {
  flex: 0 0 40%;
  background-color: #fff;
  border-left: 1px solid #eee;
  padding: 40px 60px 0 60px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}"""
css = css.replace(old_rightCol, new_rightCol)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
