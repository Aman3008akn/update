import { motion } from 'framer-motion';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export default function SocialLogin() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading('google');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Failed to login with Google',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading('facebook');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Failed to login with Facebook',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-black"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white font-bold text-gray-600">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Google Login */}
        <motion.button
          onClick={handleGoogleLogin}
          disabled={loading === 'google'}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-black rounded-lg font-bold hover:bg-gray-50 transition-colors neo-shadow hover:neo-shadow-lg disabled:opacity-50"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaGoogle className="w-5 h-5 text-red-500" />
          <span className="text-sm">{loading === 'google' ? 'Loading...' : 'Google'}</span>
        </motion.button>

        {/* Facebook Login */}
        <motion.button
          onClick={handleFacebookLogin}
          disabled={loading === 'facebook'}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-black rounded-lg font-bold hover:bg-gray-50 transition-colors neo-shadow hover:neo-shadow-lg disabled:opacity-50"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaFacebook className="w-5 h-5 text-blue-600" />
          <span className="text-sm">{loading === 'facebook' ? 'Loading...' : 'Facebook'}</span>
        </motion.button>
      </div>

      <p className="text-xs text-center text-gray-500 mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
