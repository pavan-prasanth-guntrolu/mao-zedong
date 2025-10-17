import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const ChatWidget = () => {
  const handleClick = () => {
    window.location.href = "https://wa.me/+919392810073";
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.button
        onClick={handleClick}
        className="bg-primary hover:bg-primary/80 text-primary-foreground p-4 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </motion.div>
  );
};

export default ChatWidget;