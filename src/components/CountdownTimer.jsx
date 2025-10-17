import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate the time difference between now and the target date
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // If the target date has passed, set all values to 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately and then set up interval
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="mb-8">
      {/* Mobile View */}
      <motion.div 
        className="flex md:hidden flex-wrap justify-center items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TimeUnitMobile value={timeLeft.days} label="D" />
        <TimeUnitMobile value={timeLeft.hours} label="H" />
        <TimeUnitMobile value={timeLeft.minutes} label="M" />
        <TimeUnitMobile value={timeLeft.seconds} label="S" />
      </motion.div>

      {/* Desktop View */}
      <motion.div 
        className="hidden md:flex justify-center items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeSeparator />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </motion.div>
    </div>
  );
};

// Desktop time unit component
const TimeUnit = ({ value, label }) => {
  // Create an array of the two digits
  const digits = value.toString().padStart(2, '0').split('');
  
  return (
    <div className="text-center">
      <div className="flex gap-1">
        {digits.map((digit, index) => (
          <motion.div 
            key={`${label}-${index}`}
            className="relative overflow-hidden"
          >
            <div className="relative w-16 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-md rounded-lg border border-white/20 shadow-lg flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={digit}
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent absolute"
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 rounded-t-lg"></div>
              <div className="absolute inset-0 border-b border-white/10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-secondary/40"></div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div 
        className="mt-2 text-xs font-medium text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {label}
      </motion.div>
    </div>
  );
};

// Mobile time unit component (more compact)
const TimeUnitMobile = ({ value, label }) => (
  <motion.div 
    className="relative"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <div className="w-16 h-16 btn-quantum rounded-lg flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
      <motion.span 
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-white"
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
      <span className="text-xs text-white/80 font-medium">{label}</span>
      
      {/* Animated glow effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
        animate={{ 
          x: ['-100%', '100%'],
        }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "loop", 
          duration: 2,
          ease: "linear",
        }}
      />
    </div>
  </motion.div>
);

// Separator between time units
const TimeSeparator = () => (
  <div className="flex flex-col items-center justify-center h-20">
    <motion.div 
      className="w-2 h-2 rounded-full bg-primary/50 mb-1"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <motion.div 
      className="w-2 h-2 rounded-full bg-primary/50"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
    />
  </div>
);

export default CountdownTimer;