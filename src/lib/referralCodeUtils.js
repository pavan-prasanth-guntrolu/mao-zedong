/**
 * Utility functions for handling referral codes with localStorage persistence
 */

export const REFERRAL_CODE_STORAGE_KEY = 'referralCode';

/**
 * Extract referral code from URL parameters and store in localStorage
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {string|null} - The referral code if found, null otherwise
 */
export const extractAndStoreReferralCode = (searchParams) => {
  const ref = searchParams.get('ref');
  if (ref) {
    localStorage.setItem(REFERRAL_CODE_STORAGE_KEY, ref);
    return ref;
  }
  return null;
};

/**
 * Get referral code from localStorage
 * @returns {string|null} - The stored referral code or null if not found
 */
export const getStoredReferralCode = () => {
  return localStorage.getItem(REFERRAL_CODE_STORAGE_KEY);
};

/**
 * Clear referral code from localStorage
 */
export const clearStoredReferralCode = () => {
  localStorage.removeItem(REFERRAL_CODE_STORAGE_KEY);
};

/**
 * Check if there's a referral code in URL or localStorage and return it
 * Priority: URL parameter > localStorage
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {string|null} - The referral code from URL or localStorage
 */
export const getReferralCode = (searchParams) => {
  // First check URL parameters
  const urlRef = searchParams.get('ref');
  if (urlRef) {
    // Store in localStorage for persistence
    localStorage.setItem(REFERRAL_CODE_STORAGE_KEY, urlRef);
    return urlRef;
  }
  
  // Fallback to localStorage
  return getStoredReferralCode();
};