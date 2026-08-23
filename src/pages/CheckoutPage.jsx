import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems: cart, cartTotal, openCart: setIsCartOpen, formatPrice, updateQuantity, removeFromCart } = useCart();
    const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cards');
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEditCart = () => {
    setIsCartOpen(true);
  };

  
  const getFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // Assume 2 days from now
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  return (
    <div className={`${styles.checkoutContainer} ${step === 1 ? styles.step1Active : ''}`}>
      
      {/* LEFT COLUMN */}
      <div className={styles.leftCol}>
        <div className={styles.logoContainer} onClick={() => navigate('/')}>
          <span className={styles.textLogo}>SOL</span>
          <span className={styles.tagline}>Let your SOL shine</span>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.step} onClick={() => setStep(1)}>
            <span>1 of 4</span>
            <span>Cart</span>
          </div>
          <div className={`${styles.step} $        {step === 1 && (
          <div className={styles.stepContainer}>
            <h2 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '24px' }}>Your products</h2>
            <div className={styles.cartLargeList}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '40px' }}>
                  <div className={styles.cartLargeItem}>
                    <img src={item.image || item.variant?.images?.[0] || item.coverImage} alt={item.name} className={styles.cartLargeImg} />
                    <div className={styles.cartLargeDetails}>
                      <div className={styles.cartLargeHeaderRow}>
                        <span className={styles.cartLargeName}>{item.name}</span>
                        <span className={styles.cartLargePrice}>{formatPrice(item.price)}</span>
                      </div>
                      
                      <div className={styles.cartLargeMeta}>
                        <div className={styles.cartLargeVariant}>
                          {item.variant?.name || 'Dark Brown'}
                        </div>
                        {(item.size || item.selectedSize) && (
                          <div className={styles.cartLargeVariant}>
                            Size {item.size || item.selectedSize}
                          </div>
                        )}
                        
                        <div className={styles.cartLargeQtyBox}>
                          <span style={{cursor: 'pointer'}}>-</span>
                          <span style={{margin: '0 16px', letterSpacing: '0.05em'}}>Qty {item.quantity}</span>
                          <span style={{cursor: 'pointer'}}>+</span>
                        </div>
                      </div>

                      <div className={styles.cartLargeActions} style={{ letterSpacing: '0.05em' }}>
                        <span className={styles.editLink}>Edit</span>
                        <span className={styles.editLink}>Remove</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cartLargeDelivery}>
                    Estimated delivery date: from {getFutureDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 ? styles.stepActive : ''}`} onClick={() => setStep(2)}>
            <span>2 of 4</span>
            <span>Personal details</span>
          </div>
          <div className={`${styles.step} ${step === 3 ? styles.stepActive : ''}`}>
            <span>3 of 4</span>
            <span>Shipping details</span>
          </div>
          <div className={`${styles.step} ${step === 4 ? styles.stepActive : ''}`}>
            <span>4 of 4</span>
            <span className={styles.desktopOnly}>Payment & Confirmation</span>
            <span className={styles.mobileOnly}>Payment &<br/>Confirmation</span>
          </div>
        </div>

                {step === 1 && (
          <div className={styles.stepContainer}>
            <h2 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '24px' }}>Your products</h2>
            <div className={styles.cartLargeList}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '40px' }}>
                  <div className={styles.cartLargeItem}>
                    <img src={item.image || item.variant?.images?.[0] || item.coverImage} alt={item.name} className={styles.cartLargeImg} />
                    <div className={styles.cartLargeDetails}>
                      <div className={styles.cartLargeHeaderRow}>
                        <span className={styles.cartLargeName}>{item.name}</span>
                        <span className={styles.cartLargePrice}>{formatPrice(item.price)}</span>
                      </div>
                      
                      <div className={styles.cartLargeMeta}>
                        <div className={styles.cartLargeVariant}>
                          {item.variant?.name || 'Dark Brown'}
                        </div>
                        {(item.size || item.selectedSize) && (
                          <div className={styles.cartLargeVariant}>
                            Size {item.size || item.selectedSize}
                          </div>
                        )}
                        
                        <div className={styles.cartLargeQtyBox}>
                          <span style={{cursor: 'pointer'}}>-</span>
                          <span style={{margin: '0 16px', letterSpacing: '0.05em'}}>Qty {item.quantity}</span>
                          <span style={{cursor: 'pointer'}}>+</span>
                        </div>
                      </div>

                      <div className={styles.cartLargeActions} style={{ letterSpacing: '0.05em' }}>
                        <span className={styles.editLink}>Edit</span>
                        <span className={styles.editLink}>Remove</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cartLargeDelivery}>
                    Estimated delivery date: from {getFutureDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContainer}>
            <input 
              type="email" 
              className={styles.emailInput} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />

            {isEmailValid && (
              <div className={styles.actionBlock}>
                <div className={styles.actionRow}>
                  <button className={styles.btnSolid}>LOGIN</button>
                  <button className={styles.btnOutline} onClick={() => setStep(3)}>CONTINUE AS A GUEST</button>
                </div>

                <div className={styles.helpText}>
                  If you wish to create an account, you can do so after payment.
                </div>

                <div className={styles.separator}>Or connect with</div>

                <button className={styles.googleBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  CONTINUE WITH GOOGLE
                </button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContainer}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Gender *</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mrs" className={styles.customRadio} /> <span>Mrs</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mr" className={styles.customRadio} /> <span>Mr</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mx" className={styles.customRadio} /> <span>Mx</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Prefer not to say" className={styles.customRadio} /> <span>I prefer not to say</span></label>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>First Name *</label>
                <input type="text" className={styles.textInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>Last Name *</label>
                <input type="text" className={styles.textInput} />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.staticLabel}>Country/Region *</label>
              <select className={styles.selectInput}>
                <option value="Thailand">Thailand</option>
              </select>
            </div>

            <div className={styles.formField}>
              <label className={styles.staticLabel}>Address 1 *</label>
              <input type="text" className={styles.textInput} />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField} style={{ flex: '0 0 35%' }}>
                <label className={styles.staticLabel}>Prefix</label>
                <select className={styles.selectInput}>
                  <option value="+66">Thailand +66</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>Phone Number *</label>
                <input type="text" className={styles.textInput} />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '40px' }}>
              <label className={styles.formLabel}>Delivery method</label>
              <label className={styles.deliveryBox}>
                <div className={styles.deliveryBoxLeft}>
                  <input type="radio" name="delivery" defaultChecked className={styles.customRadio} />
                  <div className={styles.deliveryDetails}>
                    <span className={styles.deliveryTitle}>Express</span>
                    <span className={styles.deliverySubtext}>Delivery within 2-4 days</span>
                  </div>
                </div>
                <span className={styles.deliveryPrice}>FREE</span>
              </label>
            </div>

            <button className={styles.btnSolidFull} onClick={() => setStep(4)} style={{ marginTop: '40px' }}>PAYMENT</button>
          </div>
        )}

        {step === 4 && (
          <div className={styles.stepContainer}>
            
            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.reviewTitle}>Personal details</h3>
                <span className={styles.editLink} onClick={() => setStep(2)}>Edit details</span>
              </div>
              <p className={styles.reviewText}>{email || 'alizzlolp11@gmail.com'}</p>
            </div>

            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.reviewTitle}>Shipping details</h3>
                <span className={styles.editLink} onClick={() => setStep(3)}>Update shipping details</span>
              </div>
              <p className={styles.reviewText}>
                WANNASIN UTHONG<br/>
                Chonkasem 21<br/>
                muang 84000<br/>
                +660952066791
              </p>
            </div>

            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.reviewTitle}>Delivery method</h3>
              </div>
              <div className={styles.deliveryReview}>
                <div>
                  <p className={styles.reviewText}>Express</p>
                  <p className={styles.reviewSubtext}>Estimated delivery date: from {getFutureDate()}</p>
                </div>
                <p className={styles.reviewText}>FREE</p>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.reviewTitle}>Billing Address</h3>
                <span className={styles.editLink}>Update billing address</span>
              </div>
              <p className={styles.reviewText}>WANNASIN UTHONG Chonkasem 21 muang 84000</p>
            </div>

            <div className={styles.paymentSection}>
              <h3 className={styles.reviewTitle} style={{marginBottom: '24px'}}>Payment methods</h3>
              
              <div className={`${styles.paymentBox} ${paymentMethod === 'cards' ? styles.paymentBoxExpanded : ''}`} onClick={() => setPaymentMethod('cards')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'cards'} readOnly />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px', marginRight: '4px'}}>
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <span className={styles.paymentMethodName}>Cards</span>
                </div>
                
                {paymentMethod === 'cards' && (
                  <div className={styles.paymentForm}>
                    <div className={styles.formRow} style={{ marginTop: '32px' }}>
                      <div className={styles.formField} style={{ flex: 2 }}>
                        <label className={styles.staticLabel}>Card number</label>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className={styles.textInput} style={{ paddingRight: '100px' }} />
                                                                              <div className={styles.cardIcons}>
                            <img src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dwb1b33da1/images/cardBrands/visa.svg" alt="Visa" />
                            <img src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw529ef188/images/cardBrands/mc.svg" alt="Mastercard" />
                            <img src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw0026e251/images/cardBrands/amex.svg" alt="Amex" />
                          </div>
                        </div>
                      </div>
                      <div className={styles.formField} style={{ flex: 1 }}>
                        <label className={styles.staticLabel}>Expiration</label>
                        <input type="text" className={styles.textInput} />
                      </div>
                      <div className={styles.formField} style={{ flex: 1 }}>
                        <label className={styles.staticLabel}>CVC</label>
                        <input type="text" className={styles.textInput} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.paymentBox} onClick={() => setPaymentMethod('apple')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'apple'} readOnly />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" style={{ height: '16px', marginLeft: '8px', marginRight: '4px' }} />
                  <span className={styles.paymentMethodName}>Apple Pay</span>
                </div>
              </div>

              <div className={styles.paymentBox} onClick={() => setPaymentMethod('paypal')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'paypal'} readOnly />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '18px', marginLeft: '8px', marginRight: '4px' }} />
                  <span className={styles.paymentMethodName}>PayPal</span>
                </div>
              </div>
            </div>

            <button className={styles.btnSolidFull} style={{ marginTop: '40px' }}>PLACE ORDER</button>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className={styles.rightCol}>
        {step === 1 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '16px', letterSpacing: '0.05em' }}>
              <span className={styles.desktopOnly}>Shopping cart</span>
              <span className={styles.mobileOnly}>Cart</span>
            </h2>
            <div style={{ fontSize: '11px', color: '#666' }}>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</div>
          </div>
        )}

        {step > 1 && (
          <>
            <div className={styles.summaryHeader}>
              <span className={styles.summaryTitle}>Order summary</span>
              <span className={styles.editCart} onClick={handleEditCart}>Edit cart</span>
            </div>

            <div className={styles.cartItemsList}>
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className={styles.item}>
                    <div className={styles.itemTop}>
                      <img 
                        src={item.image || item.variant?.images?.[0] || item.coverImage} 
                        alt={item.name} 
                        className={styles.itemImage} 
                      />
                      <div className={styles.itemDetails}>
                        <div className={styles.itemHeaderRow}>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                        </div>
                        
                        <div className={styles.itemMeta}>
                          <p className={styles.metaText}>{item.variant?.name || 'Dark Brown'}</p>
                          {(item.size || item.selectedSize) && (
                            <p className={styles.metaText}>Size {item.size || item.selectedSize}</p>
                          )}
                          <p className={styles.metaText}>Qty {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                    <p className={styles.deliveryEstimate}>
                      Estimated delivery date: from {getFutureDate()}
                    </p>
                  </div>
                ))
              ) : (
                <div className={styles.item}>
                  <div className={styles.itemTop}>
                    <div className={styles.itemDetails}>
                      <p className={styles.itemName}>Your cart is empty</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className={styles.totalsSection} style={step === 1 ? { borderTop: 'none', marginTop: '0', paddingTop: '0' } : {}}>
          {step > 1 && (
            <div className={styles.subtotalRow}>
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} item{cart.length !== 1 && 's'}</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          )}
          <div className={`${styles.subtotalRow} ${step === 1 ? styles.hideOnMobile : ''}`}>
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          
          <div className={styles.totalRow}>
            <div className={styles.totalLabel}>
              <h3 className={styles.totalTitle}>TOTAL</h3>
              <p className={styles.vatText}>VAT Included</p>
            </div>
            <h3 className={styles.totalPrice}>{formatPrice(cartTotal)}</h3>
          </div>
          
          {step === 1 && (
            <button className={styles.btnSolidFull} style={{ marginTop: '24px' }} onClick={() => setStep(2)}>PROCEED TO CHECKOUT</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;