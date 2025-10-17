import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { extractAndStoreReferralCode } from '@/lib/referralCodeUtils';

/**
 * Global component to handle referral code extraction and storage
 * This ensures referral codes are captured regardless of which page users land on
 */
const ReferralHandler = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract and store referral code whenever URL changes
    extractAndStoreReferralCode(searchParams);
  }, [searchParams]);

  return null; // This component doesn't render anything
};

export default ReferralHandler;