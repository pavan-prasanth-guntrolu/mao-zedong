-- Add total_referrals column to registrations table
ALTER TABLE public.registrations ADD COLUMN total_referrals integer DEFAULT 0;

-- Update existing records with current referral counts
-- This calculates and updates the total_referrals for all existing users
UPDATE public.registrations 
SET total_referrals = (
    SELECT COUNT(*) 
    FROM public.registrations r2 
    WHERE r2.referred_by = public.registrations.id
);

-- Create a function to automatically update referral count
CREATE OR REPLACE FUNCTION update_referral_count()
RETURNS TRIGGER AS $$
BEGIN
    -- When a new registration is inserted with a referred_by value
    IF TG_OP = 'INSERT' AND NEW.referred_by IS NOT NULL THEN
        UPDATE public.registrations 
        SET total_referrals = total_referrals + 1 
        WHERE id = NEW.referred_by;
    END IF;
    
    -- When referred_by is updated from NULL to a value
    IF TG_OP = 'UPDATE' AND OLD.referred_by IS NULL AND NEW.referred_by IS NOT NULL THEN
        UPDATE public.registrations 
        SET total_referrals = total_referrals + 1 
        WHERE id = NEW.referred_by;
    END IF;
    
    -- When referred_by is updated from one value to another
    IF TG_OP = 'UPDATE' AND OLD.referred_by IS NOT NULL AND NEW.referred_by IS NOT NULL AND OLD.referred_by != NEW.referred_by THEN
        -- Decrease count for old referrer
        UPDATE public.registrations 
        SET total_referrals = total_referrals - 1 
        WHERE id = OLD.referred_by;
        
        -- Increase count for new referrer
        UPDATE public.registrations 
        SET total_referrals = total_referrals + 1 
        WHERE id = NEW.referred_by;
    END IF;
    
    -- When referred_by is updated from a value to NULL
    IF TG_OP = 'UPDATE' AND OLD.referred_by IS NOT NULL AND NEW.referred_by IS NULL THEN
        UPDATE public.registrations 
        SET total_referrals = total_referrals - 1 
        WHERE id = OLD.referred_by;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update referral counts
DROP TRIGGER IF EXISTS trigger_update_referral_count ON public.registrations;
CREATE TRIGGER trigger_update_referral_count
    AFTER INSERT OR UPDATE ON public.registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_referral_count();