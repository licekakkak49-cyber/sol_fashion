import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getOrdersByCustomerEmail } from '../services/orderService';
import { getSavedAddresses, saveAddress, deleteAddress, setDefaultAddress } from '../services/addressService';
import { formatCurrency } from '../utils/formatCurrency';
import { X, Plus, Check, ArrowLeft, Trash2 } from 'lucide-react';
import styles from './AccountPage.module.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Active Tab: 'orders' | 'addresses' | 'saved' | 'profile'
  const [activeTab, setActiveTab] = useState('orders');

  // Customer identity
  const [customerEmail, setCustomerEmail] = useState(() => {
    return localStorage.getItem('sol_customer_email') || 'alizzlolp11@gmail.com';
  });
  const [firstName, setFirstName] = useState(() => {
    return localStorage.getItem('sol_customer_first_name') || 'Wannasin';
  });
  const [lastName, setLastName] = useState(() => {
    return localStorage.getItem('sol_customer_last_name') || 'Uthong';
  });
  const [gender, setGender] = useState('Mr');
  const [phone, setPhone] = useState('+66 0952066791');

  // Fit Preferences
  const [clothingSize, setClothingSize] = useState('36 (S)');
  const [shoeSize, setShoeSize] = useState('39');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Address Book State
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    title: 'Home',
    firstName: '',
    lastName: '',
    phone: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'Thailand',
    isDefault: false
  });

  // Feedback Notification Banner
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // 1. Fetch Orders on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingOrders(true);
      const userOrders = await getOrdersByCustomerEmail(customerEmail);
      if (isMounted) {
        setOrders(userOrders || []);
        setIsLoadingOrders(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [customerEmail]);

  // 2. Fetch Addresses on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadAddresses() {
      const addrs = await getSavedAddresses(customerEmail);
      if (isMounted) {
        setAddresses(addrs || []);
      }
    }
    loadAddresses();
    return () => { isMounted = false; };
  }, [customerEmail]);

  const showFeedback = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('sol_customer_email');
    navigate('/');
  };

  // Address Actions
  const handleOpenNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm({
      title: 'Home',
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || '',
      addressLine: '',
      city: 'Bangkok',
      postalCode: '',
      country: 'Thailand',
      isDefault: addresses.length === 0
    });
    setIsAddingAddress(true);
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      title: addr.title || 'Home',
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      phone: addr.phone || '',
      addressLine: addr.addressLine || '',
      city: addr.city || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'Thailand',
      isDefault: Boolean(addr.isDefault)
    });
    setIsAddingAddress(true);
  };

  const handleSaveAddressSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...addressForm,
      id: editingAddressId || undefined
    };
    const updated = await saveAddress(customerEmail, payload);
    setAddresses(updated);
    setIsAddingAddress(false);
    showFeedback(editingAddressId ? 'Address updated successfully.' : 'New address saved to your address book.');
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updated = await deleteAddress(customerEmail, id);
      setAddresses(updated);
      showFeedback('Address removed.');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    const updated = await setDefaultAddress(customerEmail, id);
    setAddresses(updated);
    showFeedback('Default shipping address updated.');
  };

  // Move Wishlist Piece to Cart
  const handleMoveToBag = (item) => {
    addToCart(item, item.selectedSize || item.size || 'Standard', 1);
    showFeedback(`Added "${item.name}" to your shopping bag.`);
  };

  // Save Profile Changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('sol_customer_first_name', firstName);
    localStorage.setItem('sol_customer_last_name', lastName);
    localStorage.setItem('sol_customer_email', customerEmail);
    showFeedback('Profile and preferences updated successfully.');
  };

  const getOrderStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'shipped':
        return styles.statusShipped;
      case 'delivered':
        return styles.statusDelivered;
      case 'processing':
      default:
        return styles.statusProcessing;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerWrapper}>
        
        {/* TOP BAR */}
        <div className={styles.topNav}>
          <Link to="/products" className={styles.backLink}>
            <ArrowLeft size={13} />
            Continue Shopping
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Log Out
          </button>
        </div>

        {/* HERO TITLE AREA */}
        <div className={styles.heroHeader}>
          <span className={styles.microLabel}>Client Space</span>
          <h1 className={styles.greetingTitle}>
            Hello, {firstName || 'Client'}
          </h1>
        </div>

        {/* NOTIFICATION FEEDBACK BANNER */}
        {feedbackMessage && (
          <div className={styles.feedbackBanner}>
            <Check size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            {feedbackMessage}
          </div>
        )}

        {/* EDITORIAL SUB-NAV TABS */}
        <div className={styles.tabsBar}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            01. Orders
            <span className={styles.countBadge}>({orders.length})</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'addresses' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            02. Address Book
            <span className={styles.countBadge}>({addresses.length})</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'saved' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            03. Saved Pieces
            <span className={styles.countBadge}>({wishlistItems.length})</span>
          </button>

          <button 
            className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            04. Profile & Fit
          </button>
        </div>

        {/* TAB PANELS */}
        <div className={styles.tabPanel}>

          {/* ================================================================
              TAB 1: ORDERS
              ================================================================ */}
          {activeTab === 'orders' && (
            <div className={styles.ordersList}>
              {isLoadingOrders ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>Loading your orders from atelier records...</p>
                </div>
              ) : orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderCardHeader}>
                      <div className={styles.orderMetaLeft}>
                        <span className={styles.orderNumber}>ORDER #{order.order_number}</span>
                        <span className={styles.orderDate}>
                          Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span className={`${styles.orderStatusBadge} ${getOrderStatusClass(order.order_status)}`}>
                        {order.order_status || 'Processing'}
                      </span>
                    </div>

                    <div className={styles.orderCardBody}>
                      <div className={styles.orderThumbnails}>
                        {(order.items || []).map((item, idx) => (
                          <div key={`${item.id || idx}`} className={styles.orderThumbWrapper} title={item.product_name}>
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.product_name} className={styles.orderThumb} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#999' }}>
                                SOL
                              </div>
                            )}
                            {item.quantity > 1 && (
                              <span className={styles.orderThumbQty}>×{item.quantity}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className={styles.orderMetaRight}>
                        <span className={styles.orderTotalAmount}>
                          {formatCurrency(order.total_amount)}
                        </span>
                        <button 
                          className={styles.btnViewReceipt}
                          onClick={() => navigate(`/order-success?order=${order.order_number}`)}
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <h3 className={styles.emptyTitle}>No orders found</h3>
                  <p className={styles.emptyText}>
                    You haven't placed any orders yet. Discover our latest collection and timeless wardrobe essentials.
                  </p>
                  <Link to="/products" className={styles.btnSolidSmall} style={{ textDecoration: 'none' }}>
                    Explore Collection
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 2: ADDRESS BOOK
              ================================================================ */}
          {activeTab === 'addresses' && (
            <div>
              <div className={styles.addressSectionHeader}>
                <h3 className={styles.sectionHeading}>Saved Delivery Addresses</h3>
                {!isAddingAddress && (
                  <button className={styles.btnSolidSmall} onClick={handleOpenNewAddressForm}>
                    <Plus size={13} />
                    Add Address
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {isAddingAddress && (
                <form className={styles.addressFormBox} onSubmit={handleSaveAddressSubmit}>
                  <h4 className={styles.formTitle}>
                    {editingAddressId ? 'Edit Address' : 'New Delivery Address'}
                  </h4>

                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>Address Label</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        placeholder="e.g. Home, Atelier, Office" 
                        value={addressForm.title} 
                        onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                        required 
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>Phone Number</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        placeholder="+66 09X XXX XXXX" 
                        value={addressForm.phone} 
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required 
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>Recipient First Name</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        placeholder="First name" 
                        value={addressForm.firstName} 
                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        required 
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>Recipient Last Name</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        placeholder="Last name" 
                        value={addressForm.lastName} 
                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        required 
                      />
                    </div>

                    <div className={styles.inputGroupFull}>
                      <label className={styles.formLabel}>Street Address / Building</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        placeholder="House / Unit no., Street, Sub-district" 
                        value={addressForm.addressLine} 
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                        required 
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>City / Province</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        placeholder="e.g. Bangkok, Surat Thani" 
                        value={addressForm.city} 
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required 
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>Postal Code</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        placeholder="e.g. 10110" 
                        value={addressForm.postalCode} 
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        required 
                      />
                    </div>

                    <div className={styles.checkboxRow}>
                      <input 
                        type="checkbox" 
                        id="isDefaultCheckbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      />
                      <label htmlFor="isDefaultCheckbox">Set as my default delivery address</label>
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className={styles.btnSolidSmall}>
                        Save Address
                      </button>
                      <button type="button" className={styles.btnSecondary} onClick={() => setIsAddingAddress(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Addresses List Grid */}
              <div className={styles.addressesGrid}>
                {addresses.map(addr => (
                  <div key={addr.id} className={`${styles.addressCard} ${addr.isDefault ? styles.addressCardDefault : ''}`}>
                    <div>
                      <div className={styles.addressCardTop}>
                        <h4 className={styles.addressTitle}>{addr.title || 'Address'}</h4>
                        {addr.isDefault && (
                          <span className={styles.defaultBadge}>Default</span>
                        )}
                      </div>

                      <div className={styles.addressDetails}>
                        <div className={styles.addressName}>{addr.firstName} {addr.lastName}</div>
                        <div>{addr.addressLine}</div>
                        <div>{addr.city} {addr.postalCode}</div>
                        <div>{addr.country}</div>
                        <div style={{ marginTop: '6px', color: '#888' }}>{addr.phone}</div>
                      </div>
                    </div>

                    <div className={styles.addressActions}>
                      {!addr.isDefault && (
                        <button 
                          className={styles.addressActionLink}
                          onClick={() => handleSetDefaultAddress(addr.id)}
                        >
                          Set default
                        </button>
                      )}
                      <button 
                        className={styles.addressActionLink}
                        onClick={() => handleEditAddress(addr)}
                      >
                        Edit
                      </button>
                      <button 
                        className={`${styles.addressActionLink} ${styles.addressActionLinkDanger}`}
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {addresses.length === 0 && !isAddingAddress && (
                  <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                    <h3 className={styles.emptyTitle}>No saved addresses</h3>
                    <p className={styles.emptyText}>Save your shipping address now to breeze through checkout in one click.</p>
                    <button className={styles.btnSolidSmall} onClick={handleOpenNewAddressForm}>
                      <Plus size={13} />
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 3: SAVED PIECES (WARDROBE)
              ================================================================ */}
          {activeTab === 'saved' && (
            <div>
              {wishlistItems.length > 0 ? (
                <div className={styles.wishlistGrid}>
                  {wishlistItems.map(item => (
                    <div key={item.id} className={styles.wishlistCard}>
                      <div className={styles.wishlistImageWrapper} onClick={() => navigate(`/product/${item.id}`)}>
                        <img 
                          src={item.image || item.cover_image_url || item.images?.[0] || '/placeholder.svg'} 
                          alt={item.name} 
                          className={styles.wishlistImage} 
                        />
                        <button 
                          type="button" 
                          className={styles.btnRemovePiece}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(item.id);
                          }}
                          title="Remove piece"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className={styles.wishlistCardInfo}>
                        <p className={styles.pieceName}>{item.name}</p>
                        <p className={styles.piecePrice}>
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <button 
                        className={styles.btnMoveToBag}
                        onClick={() => handleMoveToBag(item)}
                      >
                        Add to Bag
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <h3 className={styles.emptyTitle}>Your personal wardrobe is empty</h3>
                  <p className={styles.emptyText}>
                    Save your favorite runway silhouettes, outerwear, and accessories to revisit them anytime.
                  </p>
                  <Link to="/products" className={styles.btnSolidSmall} style={{ textDecoration: 'none' }}>
                    Discover Collection
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 4: PROFILE & FIT
              ================================================================ */}
          {activeTab === 'profile' && (
            <div className={styles.profileContainer}>
              <form onSubmit={handleSaveProfile}>
                
                {/* Personal Information */}
                <div className={styles.profileSection}>
                  <h3 className={styles.profileSectionTitle}>Personal Information</h3>
                  
                  <div className={styles.genderSelector}>
                    {['Mr', 'Ms', 'Non-binary'].map(g => (
                      <button
                        key={g}
                        type="button"
                        className={`${styles.genderBtn} ${gender === g ? styles.genderBtnActive : ''}`}
                        onClick={() => setGender(g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>First Name</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>Last Name</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>Email Address</label>
                      <input 
                        type="email" 
                        className={styles.formInput} 
                        value={customerEmail} 
                        onChange={(e) => setCustomerEmail(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.formLabel}>Phone Number</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* Fit Preferences */}
                <div className={styles.profileSection}>
                  <h3 className={styles.profileSectionTitle}>Fit & Silhouette Preferences</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label className={styles.formLabel}>Preferred Ready-to-Wear Size</label>
                    <div className={styles.pillsRow}>
                      {['34 (XS)', '36 (S)', '38 (M)', '40 (L)', '42 (XL)'].map(sz => (
                        <button
                          key={sz}
                          type="button"
                          className={`${styles.pillBtn} ${clothingSize === sz ? styles.pillBtnActive : ''}`}
                          onClick={() => setClothingSize(sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={styles.formLabel}>Preferred Footwear Size (EU)</label>
                    <div className={styles.pillsRow}>
                      {['36', '37', '38', '39', '40', '41', '42'].map(sz => (
                        <button
                          key={sz}
                          type="button"
                          className={`${styles.pillBtn} ${shoeSize === sz ? styles.pillBtnActive : ''}`}
                          onClick={() => setShoeSize(sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Communication Preferences */}
                <div className={styles.profileSection}>
                  <h3 className={styles.profileSectionTitle}>Exclusive Communications</h3>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      id="newsletterCheck" 
                      checked={newsletterSubscribed}
                      onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                    />
                    <label htmlFor="newsletterCheck">
                      Receive bespoke previews, invitations to private sales, and seasonal runway releases.
                    </label>
                  </div>
                </div>

                <button type="submit" className={styles.btnSolidSmall}>
                  Save Changes
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AccountPage;
