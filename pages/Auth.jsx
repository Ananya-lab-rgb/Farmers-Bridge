import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Phone, Sprout, ArrowLeft, Loader2 } from "lucide-react";

export default function Auth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmation(result);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    setLoading(true);
    try {
      await confirmation.confirm(otp);
      navigate("/select-role", { replace: true });
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col font-sans">
      {/* Header */}
      <div className="p-8 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-xl flex items-center justify-center shadow-lg shadow-green-100 group-hover:scale-105 transition-transform">
            <Sprout className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-[#1A2E1A] tracking-tighter">Farmer<span className="text-[#2E7D32]">Bridge</span></span>
        </Link>
        <Link to="/" className="text-sm font-bold text-[#4A4A4A] hover:text-[#2E7D32] flex items-center gap-1 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#E8F5E9] rounded-full filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C5E1A5] rounded-full filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>

        <div className="w-full max-w-[460px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(46,125,50,0.1)] border border-gray-100 p-8 lg:p-12 relative z-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[#1A2E1A] leading-tight mb-3">
              {confirmation ? "Identity Verification" : "Welcome Back"}
            </h2>
            <p className="text-[#4A4A4A] font-medium leading-relaxed">
              {confirmation
                ? `Connecting secure line to ${phone}`
                : "Enter your credentials to access the ecosystem."}
            </p>
          </div>

          <div className="space-y-6">
            {!confirmation ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#2E7D32] uppercase tracking-[0.2em] ml-1">Phone Protocol</label>
                  <div className="relative group">
                    <input
                      className="w-full py-4 px-12 bg-[#F1F3F4] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#2E7D32] outline-none transition-all text-[#1A2E1A] font-bold placeholder:text-gray-400"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368] group-focus-within:text-[#2E7D32] transition-colors" />
                  </div>
                </div>
                <button
                  onClick={sendOtp}
                  disabled={loading || !phone}
                  className="w-full bg-[#2E7D32] text-white font-extrabold py-5 rounded-2xl hover:bg-[#1B5E20] transition-all disabled:opacity-50 shadow-xl shadow-green-100 hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Secure Access"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#2E7D32] uppercase tracking-[0.2em] ml-1">Authentication Code</label>
                  <div className="relative group">
                    <input
                      className="w-full py-4 px-12 bg-[#F1F3F4] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#2E7D32] outline-none transition-all text-[#1A2E1A] font-bold text-center tracking-[0.5em] placeholder:text-gray-400"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368] group-focus-within:text-[#2E7D32] transition-colors" />
                  </div>
                </div>
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length < 6}
                  className="w-full bg-[#2E7D32] text-white font-extrabold py-5 rounded-2xl hover:bg-[#1B5E20] transition-all disabled:opacity-50 shadow-xl shadow-green-100 hover:shadow-green-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                </button>
                <button
                  onClick={() => setConfirmation(null)}
                  className="w-full text-[#4A4A4A] font-bold py-2 hover:text-[#2E7D32] transition-colors text-sm"
                >
                  Use a different protocol
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-[#4A4A4A] font-medium">
              Agricultural Professionals First Choice.
            </p>
          </div>
        </div>
      </div>

      <footer className="p-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8 text-[10px] text-[#4A4A4A] font-bold uppercase tracking-widest justify-center">
          <span className="hover:text-[#2E7D32] cursor-pointer transition-colors">Safety</span>
          <span className="hover:text-[#2E7D32] cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-[#2E7D32] cursor-pointer transition-colors">Guidelines</span>
          <span className="hover:text-[#2E7D32] cursor-pointer transition-colors">Contact</span>
        </div>
      </footer>

      <div id="recaptcha-container"></div>
    </div>
  );
}
