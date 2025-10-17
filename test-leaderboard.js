import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLeaderboardLogic() {
  console.log('🔍 Testing current leaderboard logic...')
  
  try {
    // Replicate the exact logic from Refer.jsx
    console.log('🔍 Starting leaderboard fetch...');
    
    // Get all referrals - improved filtering to catch all non-null/non-empty values
    const { data: referrals, error: referralsError } = await supabase
      .from("registrations")
      .select("referred_by, fullName, email, id")
      .not("referred_by", "is", null)
      .neq("referred_by", "")
      .neq("referred_by", "-");

    if (referralsError) throw referralsError;

    console.log(`📊 Raw referrals data:`, referrals.slice(0, 5));
    console.log(`📊 Total referrals found: ${referrals.length}`);

    // Filter out any remaining invalid referrer IDs and get unique referrer IDs
    const validReferrals = referrals.filter(ref => 
      ref.referred_by && 
      ref.referred_by !== null && 
      ref.referred_by !== "" && 
      ref.referred_by !== "-" &&
      !isNaN(ref.referred_by)
    );

    console.log(`📊 Valid referrals after filtering: ${validReferrals.length}`);

    const referrerIds = [...new Set(validReferrals.map((ref) => parseInt(ref.referred_by)))];
    console.log(`📊 Unique referrer IDs:`, referrerIds.slice(0, 10));

    if (referrerIds.length === 0) {
      console.log('❌ No valid referrer IDs found');
      return;
    }

    // Fetch referrer details
    const { data: referrers, error: referrersError } = await supabase
      .from("registrations")
      .select("id, fullName, email")
      .in("id", referrerIds);

    if (referrersError) throw referrersError;

    console.log(`📊 Referrer details fetched: ${referrers.length}`);

    // Create a map of referrer details
    const referrerMap = {};
    referrers.forEach((referrer) => {
      referrerMap[referrer.id] = {
        fullName: referrer.fullName,
        email: referrer.email,
      };
    });

    // Count referrals per referrer
    const referrerCounts = {};
    validReferrals.forEach((ref) => {
      const referrerId = parseInt(ref.referred_by);
      if (!referrerCounts[referrerId]) {
        referrerCounts[referrerId] = {
          id: referrerId,
          count: 0,
          fullName: referrerMap[referrerId]?.fullName || "Unknown",
          email: referrerMap[referrerId]?.email || "Unknown",
        };
      }
      referrerCounts[referrerId].count++;
    });

    console.log(`📊 Referrer counts sample:`, Object.values(referrerCounts).slice(0, 5));

    // Convert to array, sort by count descending, take top 10
    const leaderboardData = Object.values(referrerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    console.log(`🏆 Final leaderboard data:`, leaderboardData);

    // Check for high performers
    const allSorted = Object.values(referrerCounts).sort((a, b) => b.count - a.count);
    console.log(`🔍 Top 15 referrers:`, allSorted.slice(0, 15).map(r => ({ name: r.fullName, count: r.count })));
    
    // Look for anyone with 36+ referrals
    const high36 = allSorted.find(r => r.count >= 36);
    if (high36) {
      const rank = allSorted.findIndex(r => r.count >= 36) + 1;
      console.log(`🔍 Person with ${high36.count} referrals found: ${high36.fullName}, Rank: ${rank}`);
    } else {
      console.log('❌ No one found with 36+ referrals');
      console.log('📊 Highest referrer count:', allSorted[0]?.count || 0);
    }

  } catch (error) {
    console.error("Error testing leaderboard:", error);
  }
}

testLeaderboardLogic()