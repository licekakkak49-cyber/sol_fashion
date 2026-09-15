import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'sol_saved_addresses_v1';

const INITIAL_DEFAULT_ADDRESSES = [
  {
    id: 'addr_default_1',
    title: 'Home (Primary)',
    firstName: 'Wannasin',
    lastName: 'Uthong',
    phone: '+66 0952066791',
    addressLine: 'Chonkasem 21, Muang',
    city: 'Surat Thani',
    postalCode: '84000',
    country: 'Thailand',
    isDefault: true,
  }
];

/**
 * Get saved addresses for a customer (from localStorage with Supabase sync)
 */
export async function getSavedAddresses(customerEmail) {
  try {
    const local = localStorage.getItem(`${STORAGE_KEY}_${customerEmail || 'default'}`);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Error reading addresses from localStorage:', e);
  }

  // Fallback to initial sample addresses
  return INITIAL_DEFAULT_ADDRESSES;
}

/**
 * Save or update an address
 */
export async function saveAddress(customerEmail, addressData) {
  const email = customerEmail || 'default';
  const existing = await getSavedAddresses(email);

  let updatedList;
  if (addressData.id) {
    // Update existing
    updatedList = existing.map(a => a.id === addressData.id ? { ...a, ...addressData } : a);
  } else {
    // Add new
    const newAddr = {
      ...addressData,
      id: 'addr_' + Date.now(),
      isDefault: existing.length === 0 || Boolean(addressData.isDefault),
    };
    updatedList = [newAddr, ...existing];
  }

  // If set as default, unset others
  if (addressData.isDefault) {
    const targetId = addressData.id || updatedList[0].id;
    updatedList = updatedList.map(a => ({
      ...a,
      isDefault: a.id === targetId
    }));
  }

  try {
    localStorage.setItem(`${STORAGE_KEY}_${email}`, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Error saving address to localStorage:', e);
  }

  return updatedList;
}

/**
 * Delete an address
 */
export async function deleteAddress(customerEmail, addressId) {
  const email = customerEmail || 'default';
  const existing = await getSavedAddresses(email);
  const updatedList = existing.filter(a => a.id !== addressId);

  // If we deleted the default, set the first remaining as default
  if (updatedList.length > 0 && !updatedList.some(a => a.isDefault)) {
    updatedList[0].isDefault = true;
  }

  try {
    localStorage.setItem(`${STORAGE_KEY}_${email}`, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Error deleting address from localStorage:', e);
  }

  return updatedList;
}

/**
 * Set an address as the primary default
 */
export async function setDefaultAddress(customerEmail, addressId) {
  const email = customerEmail || 'default';
  const existing = await getSavedAddresses(email);
  const updatedList = existing.map(a => ({
    ...a,
    isDefault: a.id === addressId
  }));

  try {
    localStorage.setItem(`${STORAGE_KEY}_${email}`, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Error setting default address in localStorage:', e);
  }

  return updatedList;
}

/**
 * Get customer default address (e.g. for Checkout auto-fill)
 */
export async function getDefaultAddress(customerEmail) {
  const addresses = await getSavedAddresses(customerEmail);
  return addresses.find(a => a.isDefault) || addresses[0] || null;
}
