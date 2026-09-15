import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Elements, 
  useStripe, 
  useElements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement 
} from '@stripe/react-stripe-js';
import { stripePromise, stripeElementOptions, isStripeConfigured } from '../lib/stripe';
import { createOrderInSupabase } from '../services/orderService';
import { getSavedAddresses } from '../services/addressService';
import styles from './CheckoutPage.module.css';

const CheckoutPageContent = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { 
    cartItems: cart, 
    cartTotal, 
    openCart: setIsCartOpen, 
    formatPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const [email, setEmail] = useState('alizzlolp11@gmail.com');
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cards');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer shipping details
  const [gender, setGender] = useState('Mr');
  const [firstName, setFirstName] = useState('Wannasin');
  const [lastName, setLastName] = useState('Uthong');
  const [country, setCountry] = useState('Thailand');
  const [address, setAddress] = useState('Chonkasem 21, Muang, Surat Thani 84000');
  const [prefix, setPrefix] = useState('+66');
  const [phone, setPhone] = useState('0952066791');

  // Card status (Real Stripe Elements or Simulation mode)
  const [cardError, setCardError] = useState('');
  const [cardBrand, setCardBrand] = useState('unknown');
  const [mockCardNumber, setMockCardNumber] = useState('');
  const [mockCardExpiry, setMockCardExpiry] = useState('');
  const [mockCardCvc, setMockCardCvc] = useState('');

  // Saved addresses from Address Book
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    getSavedAddresses(email).then(list => {
      if (list && list.length > 0) {
        setSavedAddresses(list);
        const def = list.find(a => a.isDefault) || list[0];
        if (def) {
          if (def.firstName) setFirstName(def.firstName);
          if (def.lastName) setLastName(def.lastName);
          if (def.phone) {
            const cleanPhone = def.phone.replace('+66', '').trim();
            setPhone(cleanPhone);
          }
          if (def.addressLine) {
            const fullAddr = `${def.addressLine}, ${def.city || ''} ${def.postalCode || ''}`.trim();
            setAddress(fullAddr);
          }
          if (def.country) setCountry(def.country);
        }
      }
    });
  }, [email]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEditCart = () => {
    setIsCartOpen(true);
  };

  const getFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // Assume 2 days from now
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.length === 0) return;
    setIsSubmitting(true);
    setCardError('');

    let stripeDetails = null;

    if (paymentMethod === 'cards') {
      if (isStripeConfigured && stripe && elements) {
        const cardNumberElement = elements.getElement(CardNumberElement);
        if (cardNumberElement) {
          const { error, paymentMethod: spm } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement,
            billing_details: {
              name: `${firstName || 'Customer'} ${lastName || ''}`.trim(),
              email: email,
              phone: phone,
              address: {
                line1: address,
                country: 'TH',
              },
            },
          });

          if (error) {
            setCardError(error.message);
            setIsSubmitting(false);
            return;
          }

          if (spm) {
            stripeDetails = {
              id: spm.id,
              brand: spm.card?.brand,
              last4: spm.card?.last4,
              expMonth: spm.card?.exp_month,
              expYear: spm.card?.exp_year,
            };
          }
        }
      } else {
        // Simulation mode verification
        const rawNum = mockCardNumber.replace(/\s/g, '');
        if (rawNum.length < 12) {
          setCardError('Please enter card details or click Auto-Fill Test Card');
          setIsSubmitting(false);
          return;
        }
        stripeDetails = {
          id: 'pm_sim_' + Math.random().toString(36).substring(2, 9),
          brand: cardBrand !== 'unknown' ? cardBrand : 'visa',
          last4: rawNum.slice(-4),
          expMonth: mockCardExpiry.split('/')[0]?.trim() || '12',
          expYear: mockCardExpiry.split('/')[1]?.trim() || '30',
        };
      }
    }

    // Build finalized order receipt payload
    const orderNumber = `SOL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderData = {
      orderNumber,
      orderDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      deliveryDate: getFutureDate(),
      customer: {
        email: email || 'alizzlolp11@gmail.com',
        firstName: firstName || 'Wannasin',
        lastName: lastName || 'Uthong',
        gender,
        address: address || 'Chonkasem 21, Muang, Surat Thani 84000',
        country: country || 'Thailand',
        phone: `${prefix || '+66'} ${phone || '0952066791'}`,
        deliveryMethod: 'Express (Free)',
      },
      items: [...cart],
      paymentMethod,
      stripeDetails,
      totals: {
        subtotal: cartTotal,
        shipping: 0,
        total: cartTotal,
      },
    };

    // Save order & items to Supabase and deduct inventory
    try {
      await createOrderInSupabase({ orderData, cartItems: cart });
    } catch (dbErr) {
      console.error('Failed to persist order to database:', dbErr);
    }

    clearCart();
    setIsSubmitting(false);
    navigate('/order-success', { state: { order: orderData } });
  };

  return (
    <div className={`${styles.checkoutContainer} ${step === 1 ? styles.step1Active : ''}`}>
      
      {/* LEFT COLUMN */}
      <div className={styles.leftCol}>
        <div className={styles.logoContainer} onClick={() => navigate('/')}>
          <img src="/LOGO_SOL2.svg" alt="SOL" className={styles.imgLogo} />
          <span className={styles.tagline}>Let your SOL shine</span>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.step} onClick={() => setStep(1)}>
            <span>1 of 4</span>
            <span>Cart</span>
          </div>
          <div className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`} onClick={() => setStep(2)}>
            <span>2 of 4</span>
            <span>Personal details</span>
          </div>
          <div className={`${styles.step} ${step === 3 ? styles.stepActive : ''}`} onClick={() => setStep(3)}>
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
                          <span style={{cursor: 'pointer'}} onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>-</span>
                          <span style={{margin: '0 16px', letterSpacing: '0.05em'}}>Qty {item.quantity}</span>
                          <span style={{cursor: 'pointer'}} onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</span>
                        </div>
                      </div>

                      <div className={styles.cartLargeActions} style={{ letterSpacing: '0.05em' }}>
                        <span className={styles.editLink} onClick={handleEditCart}>Edit</span>
                        <span className={styles.editLink} onClick={() => removeFromCart(item.id, item.size)}>Remove</span>
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
            {savedAddresses.length > 0 && (
              <div style={{ marginBottom: '24px', padding: '16px', background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', display: 'block', marginBottom: '10px' }}>
                  Use Saved Address
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {savedAddresses.map(sa => {
                    const isSelected = address.includes(sa.addressLine);
                    return (
                      <button
                        key={sa.id}
                        type="button"
                        onClick={() => {
                          if (sa.firstName) setFirstName(sa.firstName);
                          if (sa.lastName) setLastName(sa.lastName);
                          if (sa.phone) setPhone(sa.phone.replace('+66', '').trim());
                          if (sa.addressLine) setAddress(`${sa.addressLine}, ${sa.city || ''} ${sa.postalCode || ''}`.trim());
                          if (sa.country) setCountry(sa.country);
                        }}
                        style={{
                          padding: '8px 14px',
                          fontSize: '11px',
                          fontFamily: 'inherit',
                          border: isSelected ? '1px solid #111' : '1px solid #ddd',
                          background: isSelected ? '#111' : '#fff',
                          color: isSelected ? '#fff' : '#333',
                          cursor: 'pointer',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s'
                        }}
                      >
                        {sa.title} {sa.isDefault ? '• Default' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Gender *</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mrs" className={styles.customRadio} checked={gender === 'Mrs'} onChange={() => setGender('Mrs')} /> <span>Mrs</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mr" className={styles.customRadio} checked={gender === 'Mr'} onChange={() => setGender('Mr')} /> <span>Mr</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mx" className={styles.customRadio} checked={gender === 'Mx'} onChange={() => setGender('Mx')} /> <span>Mx</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Prefer not to say" className={styles.customRadio} checked={gender === 'Prefer not to say'} onChange={() => setGender('Prefer not to say')} /> <span>I prefer not to say</span></label>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>First Name *</label>
                <input 
                  type="text" 
                  className={styles.textInput} 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  placeholder="First name"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>Last Name *</label>
                <input 
                  type="text" 
                  className={styles.textInput} 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.staticLabel}>Country/Region *</label>
              <select className={styles.selectInput} value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="Thailand">Thailand</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>

            <div className={styles.formField}>
              <label className={styles.staticLabel}>Address 1 *</label>
              <input 
                type="text" 
                className={styles.textInput} 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Street address, building, district"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField} style={{ flex: '0 0 35%' }}>
                <label className={styles.staticLabel}>Prefix</label>
                <select className={styles.selectInput} value={prefix} onChange={(e) => setPrefix(e.target.value)}>
                  <option value="+66">Thailand +66</option>
                  <option value="+1">United States +1</option>
                  <option value="+44">United Kingdom +44</option>
                  <option value="+81">Japan +81</option>
                  <option value="+65">Singapore +65</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>Phone Number *</label>
                <input 
                  type="text" 
                  className={styles.textInput} 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Phone number"
                />
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
              <p className={styles.reviewText}>{email || 'customer@sol-fashion.com'}</p>
            </div>

            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.reviewTitle}>Shipping details</h3>
                <span className={styles.editLink} onClick={() => setStep(3)}>Update shipping details</span>
              </div>
              <p className={styles.reviewText}>
                {(firstName || 'Wannasin').toUpperCase()} {(lastName || 'Uthong').toUpperCase()}<br/>
                {address || 'Chonkasem 21, Muang'}<br/>
                {country || 'Thailand'}<br/>
                {prefix || '+66'} {phone || '0952066791'}
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
                <span className={styles.editLink} onClick={() => setStep(3)}>Update billing address</span>
              </div>
              <p className={styles.reviewText}>
                {(firstName || 'Wannasin').toUpperCase()} {(lastName || 'Uthong').toUpperCase()} {address || 'Chonkasem 21, Muang'}
              </p>
            </div>

            <div className={styles.paymentSection}>
              <h3 className={styles.reviewTitle} style={{marginBottom: '24px'}}>Payment methods</h3>
              
              {/* STRIPE CREDIT / DEBIT CARDS */}
              <div className={`${styles.paymentBox} ${paymentMethod === 'cards' ? styles.paymentBoxExpanded : ''}`} onClick={() => setPaymentMethod('cards')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'cards'} readOnly />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px', marginRight: '4px'}}>
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <span className={styles.paymentMethodName}>Credit / Debit Cards (Stripe)</span>
                </div>
                
                {paymentMethod === 'cards' && (
                  <div className={styles.paymentForm} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.formRow} style={{ marginTop: '24px' }}>
                      
                      {/* Card Number */}
                      <div className={styles.formField} style={{ flex: 2 }}>
                        <label className={styles.staticLabel}>Card number</label>
                        <div className={`${styles.stripeInputWrapper} ${cardError ? styles.stripeInputWrapperError : ''}`}>
                          <div style={{ flex: 1 }}>
                            {isStripeConfigured ? (
                              <CardNumberElement 
                                options={stripeElementOptions} 
                                onChange={(e) => {
                                  setCardError(e.error ? e.error.message : '');
                                  if (e.brand) setCardBrand(e.brand);
                                }}
                              />
                            ) : (
                              <input 
                                type="text"
                                className={styles.stripeMockInput}
                                placeholder="4242 4242 4242 4242"
                                value={mockCardNumber}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                  const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                                  setMockCardNumber(formatted);
                                  setCardError('');
                                  if (val.startsWith('4')) setCardBrand('visa');
                                  else if (/^5[1-5]/.test(val)) setCardBrand('mastercard');
                                  else if (/^3[47]/.test(val)) setCardBrand('amex');
                                  else setCardBrand('unknown');
                                }}
                                autoComplete="cc-number"
                              />
                            )}
                          </div>
                          <div className={styles.cardIcons}>
                            <img 
                              src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dwb1b33da1/images/cardBrands/visa.svg" 
                              alt="Visa" 
                              style={{ opacity: cardBrand === 'visa' || cardBrand === 'unknown' ? 1 : 0.3 }}
                            />
                            <img 
                              src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw529ef188/images/cardBrands/mc.svg" 
                              alt="Mastercard" 
                              style={{ opacity: cardBrand === 'mastercard' || cardBrand === 'unknown' ? 1 : 0.3 }}
                            />
                            <img 
                              src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw0026e251/images/cardBrands/amex.svg" 
                              alt="Amex" 
                              style={{ opacity: cardBrand === 'amex' || cardBrand === 'unknown' ? 1 : 0.3 }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expiry */}
                      <div className={styles.formField} style={{ flex: 1 }}>
                        <label className={styles.staticLabel}>Expiration</label>
                        <div className={styles.stripeInputWrapper}>
                          <div style={{ flex: 1 }}>
                            {isStripeConfigured ? (
                              <CardExpiryElement 
                                options={stripeElementOptions}
                                onChange={(e) => setCardError(e.error ? e.error.message : '')}
                              />
                            ) : (
                              <input 
                                type="text"
                                className={styles.stripeMockInput}
                                placeholder="MM / YY"
                                value={mockCardExpiry}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                  if (val.length > 2) val = `${val.slice(0, 2)} / ${val.slice(2)}`;
                                  setMockCardExpiry(val);
                                  setCardError('');
                                }}
                                autoComplete="cc-exp"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CVC */}
                      <div className={styles.formField} style={{ flex: 1 }}>
                        <label className={styles.staticLabel}>CVC</label>
                        <div className={styles.stripeInputWrapper}>
                          <div style={{ flex: 1 }}>
                            {isStripeConfigured ? (
                              <CardCvcElement 
                                options={stripeElementOptions}
                                onChange={(e) => setCardError(e.error ? e.error.message : '')}
                              />
                            ) : (
                              <input 
                                type="text"
                                className={styles.stripeMockInput}
                                placeholder="CVC"
                                value={mockCardCvc}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                  setMockCardCvc(val);
                                  setCardError('');
                                }}
                                autoComplete="cc-csc"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Inline card error */}
                    {cardError && (
                      <div className={styles.cardErrorMessage}>
                        {cardError}
                      </div>
                    )}

                    {/* Test Card Quick Helper */}
                    <div className={styles.testCardHint}>
                      <span>
                        {isStripeConfigured 
                          ? 'Stripe Test Mode: Enter 4242 4242 4242 4242 to test without real money' 
                          : 'Simulation Mode: Auto-fill test card to test complete checkout flow'}
                      </span>
                      <button 
                        type="button" 
                        className={styles.testCardBadge}
                        onClick={() => {
                          if (isStripeConfigured) {
                            navigator.clipboard?.writeText('4242424242424242');
                          } else {
                            setMockCardNumber('4242 4242 4242 4242');
                            setMockCardExpiry('12 / 30');
                            setMockCardCvc('123');
                            setCardBrand('visa');
                            setCardError('');
                          }
                        }}
                        title={isStripeConfigured ? "Copy test card number" : "Auto-fill test card"}
                      >
                        {isStripeConfigured ? "Copy Test Card" : "Auto-Fill Test Card"}
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* PROMPTPAY */}
              <div className={`${styles.paymentBox} ${paymentMethod === 'promptpay' ? styles.paymentBoxExpanded : ''}`} onClick={() => setPaymentMethod('promptpay')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'promptpay'} readOnly />
                  <span className={styles.promptpayBadge}>PromptPay</span>
                  <span className={styles.paymentMethodName}>PromptPay QR (Thai Mobile Banking)</span>
                </div>
                {paymentMethod === 'promptpay' && (
                  <div className={styles.paymentForm} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.promptpayBox}>
                      <div className={styles.promptpayQrContainer}>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=00020101021129370016A0000006770101110113006609520667915802TH5303764540${cartTotal}.005802TH6304`} 
                          alt="PromptPay QR Code" 
                          className={styles.promptpayQrImg}
                        />
                        <span className={styles.promptpayAmount}>{formatPrice(cartTotal)}</span>
                      </div>
                      <p className={styles.promptpayNotice}>
                        Scan with K PLUS, SCB EASY, Krungthai NEXT, or any banking app in Thailand. Click <strong>PLACE ORDER</strong> to complete checkout.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* APPLE PAY */}
              <div className={styles.paymentBox} onClick={() => setPaymentMethod('apple')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'apple'} readOnly />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" style={{ height: '16px', marginLeft: '8px', marginRight: '4px' }} />
                  <span className={styles.paymentMethodName}>Apple Pay</span>
                </div>
              </div>

              {/* PAYPAL */}
              <div className={styles.paymentBox} onClick={() => setPaymentMethod('paypal')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'paypal'} readOnly />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '18px', marginLeft: '8px', marginRight: '4px' }} />
                  <span className={styles.paymentMethodName}>PayPal</span>
                </div>
              </div>
            </div>

            <button 
              className={styles.btnSolidFull} 
              style={{ marginTop: '40px' }}
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? 'PROCESSING PAYMENT...' : 'PLACE ORDER'}
            </button>
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

const CheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPageContent />
    </Elements>
  );
};

export default CheckoutPage;
