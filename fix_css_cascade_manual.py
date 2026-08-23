with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

responsive_start = css.find('/* RESPONSIVE */')

if responsive_start != -1:
    before = css[:responsive_start]
    responsive_block = css[responsive_start:]
    
    # We just need to make sure ALL non-responsive code is before the responsive block.
    # Wait, the responsive_block actually contains things that I appended, like .cartLargeHeaderRow which was appended to the end of the file!
    # Because they were appended AFTER the responsive block!
    
    # Let's cleanly separate it. The responsive block starts at /* RESPONSIVE */ and ends with `}`.
    # We can find the closing brace of the responsive block. It's the last `}` before `.cartLargeHeaderRow`.
    pass
