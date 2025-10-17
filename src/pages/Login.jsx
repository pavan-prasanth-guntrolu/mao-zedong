import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthComponent from "@/components/Auth";
import { useAuth } from "@/components/AuthProvider";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <AuthComponent />
      </div>
    </motion.div>
  );
};

export default Login;
