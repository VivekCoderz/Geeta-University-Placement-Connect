import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Building2,
  ShieldCheck,
  Phone,
  Hash,
  Award,
  Briefcase,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../utils/api";
import AuthLayout from "../components/AuthLayout";

export const Register = () => {
  const navigate = useNavigate();

  // Core Form Fields
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student Fields
  const [rollNumber, setRollNumber] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState("3");
  const [phone, setPhone] = useState("");

  // Recruiter Fields
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");

  // Local API States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");

  // Reset errors when changing roles
  useEffect(() => {
    setError("");
    setRegisterSuccess(false);
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // General validation
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill out all basic fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role: role === "recruiter" ? "company" : role,
    };

    // Role-based validation
    if (role === "student") {
      if (!rollNumber.trim()) {
        setError("Roll Number is required");
        return;
      }
      if (cgpa === "" || isNaN(cgpa) || parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) {
        setError("Please enter a valid CGPA between 0 and 10");
        return;
      }
      payload.rollNumber = rollNumber.trim();
      payload.cgpa = parseFloat(cgpa);
      payload.branch = branch;
      payload.year = parseInt(year, 10);
      payload.phone = phone.trim();
    } else if (role === "recruiter") {
      if (!companyName.trim()) {
        setError("Company Name is required");
        return;
      }
      payload.companyName = companyName.trim();
      payload.industry = industry.trim();
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", payload);
      setRegisterMessage(response.data.message || "Account registered successfully!");
      setRegisterSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If successfully registered, show success screen
  if (registerSuccess) {
    return (
      <AuthLayout
        title="Registration Complete!"
        subtitle="Your account has been successfully created."
      >
        <div className="w-full max-w-md mx-auto text-center space-y-6 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mb-2">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-text-primary">Success!</h3>
            <p className="text-sm text-text-secondary">
              {role === "recruiter"
                ? "Your recruiter account is pending admin approval. You will be able to log in once approved by the Placement Cell."
                : registerMessage}
            </p>
          </div>
          <button
            onClick={() => {
              setRegisterSuccess(false);
              navigate("/login");
            }}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-sm transition-all duration-200 cursor-pointer shadow-md shadow-primary/10"
          >
            Go to Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Geeta University's placement community to connect, hire, or coordinate campus placements."
    >
      <div className="w-full max-w-xl mx-auto space-y-6 max-h-[85vh] overflow-y-auto pr-2">
        <div>
          <h3 className="text-2xl font-bold text-text-primary tracking-tight">Register</h3>
          <p className="text-sm text-text-secondary mt-1">Select your account role to proceed</p>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "student", label: "Student", icon: GraduationCap },
            { id: "recruiter", label: "Recruiter", icon: Building2 },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm"
                    : "border-slate-200 bg-slate-50 text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-primary" : "text-slate-400"}`} />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="flex items-start space-x-3 bg-rose-50 border border-rose-100 text-rose-800 text-sm p-4 rounded-lg animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Validation Error</p>
                <p className="text-rose-600/80 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* General Fields: Row 1 (Name & Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@geetauniversity.edu.in"
                  className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* General Fields: Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Student Fields (Conditional) */}
          {role === "student" && (
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-4 animate-fade-in">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                Student Academic Details
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Roll Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Hash className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="e.g. 210304001"
                      className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">CGPA</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Award className="w-4 h-4" />
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 8.75"
                      className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                  >
                    <option value="CSE" className="bg-white text-text-primary">CSE</option>
                    <option value="IT" className="bg-white text-text-primary">IT</option>
                    <option value="ECE" className="bg-white text-text-primary">ECE</option>
                    <option value="ME" className="bg-white text-text-primary">ME</option>
                    <option value="CE" className="bg-white text-text-primary">CE</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Current Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                  >
                    <option value="1" className="bg-white text-text-primary">1st Year</option>
                    <option value="2" className="bg-white text-text-primary">2nd Year</option>
                    <option value="3" className="bg-white text-text-primary">3rd Year</option>
                    <option value="4" className="bg-white text-text-primary">4th Year</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Phone (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recruiter Fields (Conditional) */}
          {role === "recruiter" && (
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-4 animate-fade-in">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                Recruiter & Company Info
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Company Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Industry Sector</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Briefcase className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Software, Finance"
                      className="w-full bg-slate-50 border border-slate-200 text-text-primary rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md shadow-primary/10 mt-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
