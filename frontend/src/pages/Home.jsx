import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/GlobalContext';
import LoadingPage from '../components/Loading';
import { useForm } from 'react-hook-form';
import axios from '../services/axios';
import { toast } from 'react-toastify';

const PlayIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M9 11l3 3L22 4" />
  </svg>
);

const ZapIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const GlobeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const DollarSignIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign">
    <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const MailIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.83 1.83 0 0 1-2.06 0L2 7" />
  </svg>
);

const ClockIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { user, loading } = useContext(AppContext);
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
    reset
  } = useForm();

  useEffect(() => {
    if (user && (loading === false)) {
      navigate('/dashboard');
    }
  }, [user, loading]);

  if (loading) return <LoadingPage />;

  const features = [
    {
      icon: <ZapIcon className="h-8 w-8" />,
      title: "Fast Response AI",
      description: "Get immediate, AI-driven answers to your complex legal questions, anytime.",
    },
    {
      icon: <GlobeIcon className="h-8 w-8" />,
      title: "Multi-Language Support",
      description: "Communicate your concerns in the language you're most comfortable with.",
    },
    {
      icon: <LockIcon className="h-8 w-8" />,
      title: "Secure & Confidential",
      description: "With end-to-end encryption, your conversations and data are always private.",
    },
    {
      icon: <DollarSignIcon className="h-8 w-8" />,
      title: "Low Pricing",
      description: "Access premium legal guidance and tools at a fraction of the traditional cost.",
    },
  ];

  const onSubmit = async (data) => {
    try{
      let res = await axios.post('/contact' , data)
      if(res.status === 200 ){
        if(res.data.status === 1){
          toast.success("You message has been submitted sucesfully")
        }
        if(res.data.status === 7){
          toast.success("please enter all valid fields")
        }
        if(res.data.status === 0){
          toast.success("error in submitting message")
        }
      }
    }catch(err) {
      toast.error("internal server error")
    }
  }



  return (
    <div className="bg-white text-slate-900 font-inter antialiased min-h-screen">
      <style>{`
        /* Custom scrollbar for aesthetic */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>

      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <a href="/" className="text-2xl font-extrabold text-blue-700 tracking-tight flex justify-center items-center">
            <img className='w-20 aspect-square' src="/logo.png" alt="" />
            Apna Vakil
          </a>
          <div className="hidden md:flex items-center space-x-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition duration-300">Features</a>
            <a href="#demo" className="hover:text-blue-600 transition duration-300">Demo</a>
            <a href="#about" className="hover:text-blue-600 transition duration-300">About Us</a>
            <a href="#contact" className="hover:text-blue-600 transition duration-300">Contact</a>
          </div>
          <div className="flex items-center space-x-3">
            <Link to='/login'>
              <button className="font-semibold text-slate-700 px-4 py-2 rounded-full hover:bg-slate-100 transition duration-300">
                Login
              </button>
            </Link>
            <Link to='/signup'>
              <button className="font-semibold text-white bg-blue-600 px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/50 hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-300 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-white">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* --- Hero Section (Impactful Gradient) --- */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-br from-white to-blue-50">
          {/* Decorative shapes for visual interest */}
          <div className="absolute top-0 right-0 h-96 w-96 bg-blue-200/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 bg-indigo-200/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full tracking-wider uppercase mb-4 shadow-md">
              AI Powered Legal Clarity
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-tight">
              Your Personal <span className="text-blue-600">AI Legal Assistant</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-xl text-slate-600 leading-relaxed">
              **Apna Vakil** translates complex legal jargon into simple, actionable insights, empowering you to navigate your rights with absolute confidence.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="#contact" className="w-full sm:w-auto font-bold text-lg text-white bg-blue-600 px-10 py-4 rounded-full shadow-xl shadow-blue-500/40 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1">
                Get Started for Free
              </a>
              <a href="#demo" className="w-full sm:w-auto font-semibold text-lg text-slate-700 bg-white border border-slate-200 px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 flex items-center justify-center space-x-2">
                <PlayIcon className="w-5 h-5" />
                <span>Watch a Quick Demo</span>
              </a>
            </div>
          </div>
        </section>

        {/* --- Features Section (Elevated Cards) --- */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Features Built for Trust and Speed</h2>
            <p className="text-slate-600 mt-3 mb-16 max-w-3xl mx-auto">
              A comprehensive suite of tools designed to provide expert legal information efficiently and securely.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-3xl p-8 text-left shadow-lg transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-2xl hover:border-blue-300">
                  <div className="bg-blue-50 text-blue-600 h-16 w-16 rounded-xl flex items-center justify-center mb-6 ring-4 ring-blue-100/50">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Video Demo Section (Cinematic Card) - UPDATED FOR INTERACTIVITY --- */}
        <section id="demo" className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Future of Legal Assistance</h2>
            <p className="text-slate-600 mt-3 mb-16 max-w-2xl mx-auto">
              Watch this quick demonstration to see the power of our AI in a real-world scenario.
            </p>

            {/* Conditional Video Player */}
            <div className="max-w-5xl mx-auto aspect-video rounded-3xl bg-slate-900 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">

              {!isPlaying ? (
                /* State 1: Cover Image and Play Button */
                <div
                  className="w-full h-full bg-cover bg-center rounded-2xl flex items-center justify-center relative transition-transform duration-500 ease-in-out group cursor-pointer"
                  style={{ backgroundImage: `url(https://placehold.co/1200x675/0f172a/94a3b8?text=AI+Chatbot+Demo)` }}
                  onClick={() => setIsPlaying(true)} // Set isPlaying to true on click
                >
                  <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-20 transition-opacity duration-300 z-10"></div>
                  <div className="relative z-20 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/40 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                    <PlayIcon className="w-12 h-12 text-white fill-white ml-1" />
                  </div>
                </div>
              ) : (
                /* State 2: Simulated Iframe Video Player */
                <div className="w-full h-full rounded-2xl bg-black">
                  {/* NOTE: This iframe uses a non-intrusive placeholder video source (Rick Astley, muted) 
                          to simulate the video starting upon click in a safe environment. */}
                  <iframe
                    title="Apna Vakil Demo Video"
                    className="w-full h-full rounded-2xl"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&modestbranding=1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  ></iframe>
                </div>
              )}
            </div>
            {isPlaying && (
              <button
                onClick={() => setIsPlaying(false)}
                className="mt-6 font-semibold text-sm text-slate-600 hover:text-blue-600 transition duration-300 underline"
              >
                Hide Demo
              </button>
            )}
          </div>
        </section>
        

        {/* --- About Section (Modern Split Layout) --- */}
        <section id="about" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Our Mission: Legal Clarity for All</h2>
                <p className="text-slate-600 leading-relaxed mt-5 text-lg">
                  Navigating the legal world can be intimidating and expensive. **Apna Vakil** was founded on a simple principle: everyone deserves access to clear, reliable, and affordable legal information. We leverage the power of artificial intelligence to break down barriers.
                </p>
                <div className="mt-8 space-y-5">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0 stroke-[2.5]" />
                    <p className="text-slate-700"><span className="font-semibold text-slate-900">Accessibility:</span> Making legal help available to anyone, anywhere, at any time.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0 stroke-[2.5]" />
                    <p className="text-slate-700"><span className="font-semibold text-slate-900">Affordability:</span> Disrupting the high cost of legal services with a transparent, low-cost model.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-4 mt-1 flex-shrink-0 stroke-[2.5]" />
                    <p className="text-slate-700"><span className="font-semibold text-slate-900">Empowerment:</span> Giving you the tools and knowledge to handle your legal matters confidently.</p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-xl relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img src="https://placehold.co/600x400/3b82f6/ffffff?text=Trusted+Guidance" alt="Our Mission" className="rounded-2xl w-full" />
                  <div className="absolute -bottom-6 -right-6 p-4 bg-blue-600 rounded-lg shadow-xl text-white font-bold text-sm tracking-wider">
                    OUR VISION
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Contact Section (Sleek Form Card) --- */}
        <section id="contact" className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get in Touch with Our Team</h2>
              <p className="text-slate-600 mt-3 max-w-2xl mx-auto">We are here to help. Contact us with any questions about the platform or your legal needs.</p>
            </div>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-slate-50 border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden">

              {/* Info Section */}
              <div className="p-8 md:p-12 bg-blue-700 text-white flex flex-col justify-center space-y-8 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                <h3 className="text-3xl font-bold tracking-tight">Contact Information</h3>
                <p className="opacity-90">Reach out to our support team for any technical or informational assistance.</p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MailIcon className="h-7 w-7 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Email Support</h4>
                      <p className="font-medium text-blue-200 hover:text-white transition">support@apnavakil.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <ClockIcon className="h-7 w-7 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Support Hours</h4>
                      <p className="font-medium">Mon - Fri, 9:00 AM - 5:00 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-8 md:p-12 bg-white">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto"
                >
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-medium text-slate-700 text-sm mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your Name"
                      className={`w-full px-4 py-3 border ${errors.name ? "border-red-500" : "border-slate-300"
                        } rounded-xl focus:ring-blue-500 focus:border-blue-500 transition`}
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters long",
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-medium text-slate-700 text-sm mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-slate-300"
                        } rounded-xl focus:ring-blue-500 focus:border-blue-500 transition`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block font-medium text-slate-700 text-sm mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      placeholder="How can we assist you?"
                      className={`w-full px-4 py-3 border ${errors.message ? "border-red-500" : "border-slate-300"
                        } rounded-xl focus:ring-blue-500 focus:border-blue-500 transition`}
                      {...register("message", {
                        required: "Message is required",
                        minLength: {
                          value: 10,
                          message: "Message must be at least 10 characters long",
                        },
                      })}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full font-bold text-lg text-white bg-blue-600 px-6 py-3.5 rounded-xl shadow-md shadow-blue-500/30 hover:bg-blue-700 transform transition-all duration-300 mt-4"
                  >
                    {isSubmitting?"Submitting...":"Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer (Simple & Clean) --- */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10 border-b border-slate-700 pb-10">
            {/* Branding */}
            <div className='col-span-2'>
              <h3 className="font-extrabold text-blue-400 text-2xl mb-3 tracking-wider">Apna Vakil</h3>
              <p className="text-slate-400 max-w-xs">Empowering millions with accessible, AI-driven legal clarity worldwide.</p>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-400 hover:text-blue-400 transition">Features</a></li>
                <li><a href="#demo" className="text-slate-400 hover:text-blue-400 transition">Demo</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition">Pricing</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">Company</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-slate-400 hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-blue-400 transition">Contact</a></li>
                <li><a href="https://merchant.razorpay.com/policy/RP0Nyr12K9mLHn/contact_us" className="text-slate-400 hover:text-blue-400 transition">administrators</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-sm tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li><a href="https://merchant.razorpay.com/policy/RP0Nyr12K9mLHn/terms" className="text-slate-400 hover:text-blue-400 transition">Terms of Service</a></li>
                <li><a href="https://merchant.razorpay.com/policy/RP0Nyr12K9mLHn/privacy" className="text-slate-400 hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="https://merchant.razorpay.com/policy/RP0Nyr12K9mLHn/refund" className="text-slate-400 hover:text-blue-400 transition">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Apna Vakil. All Rights Reserved. Not a substitute for licensed legal counsel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
