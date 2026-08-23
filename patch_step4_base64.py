import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Replace the img tags for cards
old_imgs = """<div className={styles.cardIcons}>
                            <img src="https://raw.githubusercontent.com/aaronfay/payment-icons/master/svg/flat/visa.svg" alt="Visa" style={{ height: '16px' }} />
                            <img src="https://raw.githubusercontent.com/aaronfay/payment-icons/master/svg/flat/mastercard.svg" alt="Mastercard" style={{ height: '16px' }} />
                            <img src="https://raw.githubusercontent.com/aaronfay/payment-icons/master/svg/flat/amex.svg" alt="Amex" style={{ height: '16px' }} />
                          </div>"""

new_imgs = """<div className={styles.cardIcons}>
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCAxNiI+PHBhdGggZD0iTTIxLjIgMS4zTDE5LjUgMTEuMkgxNi40TDE4LjEgMS4zSDIxLjJaTTMyLjMgNy4yQzMyLjMgNC40IDI4LjMgNC4zIDI4LjMgMi45QzI4LjMgMi41IDI4LjggMi4wIDI5LjggMS45QzMwLjMgMS44IDMxLjUgMS44IDMyLjQgMi4zTDMzLjAgMC40QzMyLjUgMC4yIDMxLjYgMCAzMC42IDBDMjcuNyAwIDI1LjYgMS42IDI1LjYgMy44QzI1LjYgNS41IDI3LjIgNi40IDI4LjQgNy4wQzI5LjYgNy42IDMwLjAgNy45IDMwLjAgOC41QzMwLjAgOS4zIDI5LjAgOS43IDI4LjAgOS43QzI2LjYgOS43IDI1LjcgOS4zIDI1LjEgOS4wTDI0LjUgMTEuMEMyNS4xIDExLjMgMjYuMyAxMS41IDI3LjYgMTEuNUMzMC44IDExLjUgMzIuMyA5LjkgMzIuMyA3LjJaTTQyLjEgMTEuMkw0NC44IDEuM0g0Mi4zQzQxLjUgMS4zIDQwLjkgMS44IDQwLjYgMi41TDM0LjcgMTEuMkgzNy44TDM4LjQgOS40SDQxLjZMNDEuOSAxMS4ySDQyLjFaTTM5LjMgNi45TDQwLjQgMy43TDQxLjAgNi45SDM5LjNaTTE1LjUgMS4zTDExLjIgOC4zTDEwLjcgNi4wQzEwLjUgNC44IDkuNSA0LjEgOC41IDMuNkM3LjUgMy4wIDYuMSAyLjUgNC45IDIuMkw1LjAgMS4zSDExLjVDMTIuMyAxLjMgMTMuMCAxLjggMTMuMSAyLjZMMTQuMiA3LjdMMTYuOCAxLjNIMTUuNVoiIGZpbGw9IiMxQTFGNzEiLz48L3N2Zz4=" alt="Visa" style={{ height: '16px' }} />
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAxNSI+PGNpcmNsZSBjeD0iNy41IiBjeT0iNy41IiByPSI3LjUiIGZpbGw9IiNFQjAwMUIiLz48Y2lyY2xlIGN4PSIxNi41IiBjeT0iNy41IiByPSI3LjUiIGZpbGw9IiNGNzlFMUIiLz48cGF0aCBkPSJNMTIgMTMuOUMxMC43IDEyLjYgOS44IDEwLjggOS44IDguOEM5LjggNi44IDEwLjcgNSAxMiAzLjdDMTMuMyA1IDE0LjIgNi44IDE0LjIgOC44QzE0LjIgMTAuOCAxMy4zIDEyLjYgMTIgMTMuOVoiIGZpbGw9IiNGRjVGMDAiLz48L3N2Zz4=" alt="Mastercard" style={{ height: '16px' }} />
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA0MiI+PHBhdGggZD0iTTAgMGg2NHY0MkgwVjBaIiBmaWxsPSIjMDFDNENDIi8+PHBhdGggZD0iTTEyLjkgMjcuN2g1LjVsNS4zLTEwLjZIMTkuNWwtMS4yIDIuNUgxNC4ybS0uNi02LjVMOSAxOC42TDEzLjQgMTMuNEg4bS00LjUgNy42bDQuNS03LjZIM3ptMjcuNi0uNWgzLjVsMS41IDQuM2wxLjUtNC4zaDMuNWwtMy40IDkuMWwtMy4xIDVsLTMuMS01ek00OCAxMy40aDV2MS40aC0zLjF2Mi42aDMuMXYxLjRoLTMuMXYyLjVoMy4xdjEuNGgtNXYtOS4zbTMuNSA4LjVoMy41di0xLjRoLTMuNXYxLjRtMC0yLjdIMzguNnYtMS40aDNtMTEgNGgzLjV2LTEuNGgtMy41djEuNG0wLTIuN2gzLjV2LTEuNGgtMy41djEuNG03LjEgNC4xaDMuMWMuOSAwIDEuNS0uMSAyLS4zYzEtLjMgMS43LS45IDIuMi0xLjdjLjUtLjggLjctMS44LjctM3MtLjItMi4yLS43LTMtMS4yLTEuNC0yLjItMS43Yy0uNS0uMi0xLjEtLjMtMi0uM2gtMy4xdjkuM20yLS4zYzEgMCAxLjgtLjQgMi40LTEuMWMuNi0uOC45LTEuOS45LTMuMnMtLjMtMi40LS45LTMuMmMtLjYtLjgtMS40LTEuMS0yLjQtMS4xaC0ydjguNmgyeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==" alt="Amex" style={{ height: '16px' }} />
                          </div>"""

code = code.replace(old_imgs, new_imgs)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
