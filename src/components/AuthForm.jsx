import { useAuth } from "../lib/supabase";

function AuthForm() {
  const { signIn } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signIn({ provider: "google" });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="auth-form">
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
      {/* Existing email/password form elements */}
    </div>
  );
}

export default AuthForm;
