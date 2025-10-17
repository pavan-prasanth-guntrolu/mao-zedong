import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      {/* Spinner container */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Outer spinning ring */}
        <motion.div
          className="w-16 h-16 border-4 border-quantum-blue/30 border-t-quantum-blue rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner spinning ring */}
        <motion.div
          className="absolute inset-2 w-12 h-12 border-2 border-quantum-purple/30 border-b-quantum-purple rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="mt-6 text-center text-muted-foreground font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Loading Qiskit Fall Fest...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
