import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getOrderByNumber } from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import styles from './OrderSuccessPage.module.css';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Check if order passed via router navigation state
    if (location.state?.order) {
      setOrder(location.state.order);
      // Also cache in sessionStorage so refreshing the page retains the receipt
      try {
        sessionStorage.setItem('sol_latest_order', JSON.stringify(location.state.order));
      } catch (e) {
        console.error('Failed to cache order', e);
      }
      return;
    }

    // 2. Check query parameter e.g. /order-success?order=SOL-2026-XXXX
    const searchParams = new URLSearchParams(location.search);
    const orderNum = searchParams.get('order');
    if (orderNum) {
      setIsLoading(true);
      getOrderByNumber(orderNum).then(dbOrder => {
        setIsLoading(false);
        if (dbOrder) {
          setOrder({
            orderNumber: dbOrder.order_number,
            orderDate: new Date(dbOrder.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            deliveryDate: dbOrder.metadata?.deliveryDateEstimate || 'In 2-3 business days',
            customer: {
              email: dbOrder.customer_email,
              firstName: dbOrder.customer_first_name,
              lastName: dbOrder.customer_last_name,
              gender: dbOrder.gender,
              address: dbOrder.shipping_address,
              country: dbOrder.shipping_country,
              phone: dbOrder.customer_phone,
              deliveryMethod: dbOrder.delivery_method,
            },
            items: (dbOrder.items || []).map(item => ({
              id: item.product_id,
              name: item.product_name,
              variant: { name: item.variant_name },
              size: item.size,
              quantity: item.quantity,
              price: item.unit_price,
              image: item.image_url,
            })),
            paymentMethod: dbOrder.payment_method,
            stripeDetails: {
              brand: dbOrder.stripe_card_brand,
              last4: dbOrder.stripe_card_last4,
            },
            totals: {
              subtotal: dbOrder.subtotal_amount,
              shipping: dbOrder.shipping_amount,
              total: dbOrder.total_amount,
            },
          });
        }
      });
      return;
    }

    // 3. Fallback: check sessionStorage
    try {
      const cached = sessionStorage.getItem('sol_latest_order');
      if (cached) {
        setOrder(JSON.parse(cached));
      }
    } catch (e) {
      console.error('Failed to parse cached order', e);
    }
  }, [location.state, location.search]);

  const formatPrice = (amount) => {
    return formatCurrency(amount);
  };

  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case 'cards':
        return 'Credit / Debit Card';
      case 'promptpay':
        return 'PromptPay QR';
      case 'apple':
        return 'Apple Pay';
      case 'paypal':
        return 'PayPal';
      default:
        return 'Credit Card';
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* MINIMAL HEADER */}
      <header className={styles.header}>
        <Link to="/" className={styles.logoContainer}>
          <img src="/LOGO_SOL2.svg" alt="SOL" className={styles.imgLogo} />
          <span className={styles.tagline}>Let your SOL shine</span>
        </Link>
        <div className={styles.headerRight}>
          <Link to="/products" className={styles.headerLink}>Shop</Link>
          <Link to="/account" className={styles.headerLink}>Account</Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className={styles.mainContainer}>
        {order ? (
          <>
            {/* STATUS HEADER */}
            <div className={styles.statusHeader}>
              <div className={styles.statusBadge}>
                <span className={styles.statusDot}></span>
                <span>Payment Confirmed</span>
              </div>
              <h1 className={styles.mainTitle}>Thank you for your order</h1>
              <p className={styles.orderReference}>
                Order reference: <span>{order.orderNumber}</span>
              </p>
              <p className={styles.confirmationNotice}>
                We have received your order. A confirmation receipt has been sent to <strong>{order.customer?.email || 'your email'}</strong>.
              </p>
            </div>

            {/* TWO COLUMN GRID */}
            <div className={styles.orderGrid}>
              
              {/* LEFT: ITEMS ORDERED */}
              <div className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>
                  Items Ordered ({order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0})
                </h2>
                <div className={styles.itemsList}>
                  {order.items?.map((item, idx) => (
                    <div key={`${item.id || idx}-${item.size || ''}`} className={styles.itemCard}>
                      <img 
                        src={item.image || item.variant?.images?.[0] || item.coverImage || '/placeholder.jpg'} 
                        alt={item.name} 
                        className={styles.itemThumb} 
                      />
                      <div className={styles.itemInfo}>
                        <div>
                          <div className={styles.itemHeader}>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                          </div>
                          <div className={styles.itemMeta}>
                            {item.variant?.name && <span>Variant: {item.variant.name}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                            <span>Qty: {item.quantity || 1}</span>
                          </div>
                        </div>
                        <p className={styles.itemDelivery}>
                          Estimated delivery: from {order.deliveryDate || '2-4 business days'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: SHIPPING & PAYMENT SUMMARY */}
              <div className={styles.detailsCol}>
                
                {/* SHIPPING DETAILS CARD */}
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Shipping Details</h3>
                  <div className={styles.infoCardContent}>
                    <strong>
                      {order.customer?.firstName} {order.customer?.lastName}
                    </strong>
                    <br />
                    {order.customer?.address}
                    <br />
                    {order.customer?.country || 'Thailand'}
                    <br />
                    Phone: {order.customer?.phone}
                    <br />
                    Method: {order.customer?.deliveryMethod || 'Express (Free)'}
                  </div>
                </div>

                {/* PAYMENT METHOD CARD */}
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Payment Details</h3>
                  <div className={styles.infoCardContent}>
                    <span>Method: <strong>{getPaymentMethodDisplay(order.paymentMethod)}</strong></span>
                    {order.stripeDetails?.last4 && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {order.stripeDetails.brand?.toUpperCase()} •••• {order.stripeDetails.last4}
                      </div>
                    )}
                    <br />
                    <span>Status: <strong style={{ color: '#16a34a' }}>Paid</strong></span>
                  </div>
                </div>

                {/* TOTALS SUMMARY */}
                <div className={styles.totalsCard}>
                  <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totals?.subtotal || order.totals?.total)}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Delivery</span>
                    <span style={{ color: '#16a34a', fontWeight: 500 }}>FREE</span>
                  </div>
                  <div className={styles.grandTotalRow}>
                    <div>
                      <span className={styles.grandTotalLabel}>TOTAL PAID</span>
                      <span className={styles.vatNotice}>VAT Included</span>
                    </div>
                    <span className={styles.grandTotalPrice}>
                      {formatPrice(order.totals?.total)}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* ACTIONS */}
            <div className={styles.actionSection}>
              <button 
                className={styles.btnContinue}
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
              <button 
                className={styles.linkAccount}
                onClick={() => navigate('/account')}
              >
                View order in your account
              </button>
            </div>
          </>
        ) : (
          /* EMPTY OR DIRECT ACCESS FALLBACK */
          <div className={styles.emptyState}>
            <h1 className={styles.emptyStateTitle}>No recent order found</h1>
            <p className={styles.emptyStateText}>
              It looks like you haven't placed an order recently, or your session has expired.
            </p>
            <button 
              className={styles.btnContinue}
              onClick={() => navigate('/products')}
            >
              Explore Collection
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderSuccessPage;
