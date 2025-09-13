import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-32 bg-gradient-to-l from-purple-500/20 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white rounded-2xl p-3 shadow-lg">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="url(#gradient)"/>
                    <text
                      x="16"
                      y="21"
                      textAnchor="middle"
                      fontSize="11"
                      fill="white"
                      fontFamily="Arial"
                      fontWeight="bold"
                    >
                      SM
                    </text>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#6366f1"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  StoreMax
                </h3>
                <p className="text-slate-400 text-sm font-medium">Management System</p>
              </div>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
              Transform your retail business with our cutting-edge store management platform. 
              <span className="text-blue-400 font-semibold"> Trusted by 10,000+ businesses worldwide.</span>
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">99.9%</div>
                <div className="text-xs text-slate-400 font-medium">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">10K+</div>
                <div className="text-xs text-slate-400 font-medium">Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">24/7</div>
                <div className="text-xs text-slate-400 font-medium">Support</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { name: 'Twitter', icon: '𝕏', color: 'from-slate-400 to-slate-600' },
                { name: 'LinkedIn', icon: '💼', color: 'from-blue-400 to-blue-600' },
                { name: 'GitHub', icon: '⚡', color: 'from-slate-400 to-slate-600' },
                { name: 'Discord', icon: '💬', color: 'from-indigo-400 to-purple-600' }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`group relative w-12 h-12 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1`}
                >
                  <span className="text-lg">{social.icon}</span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Dashboard', icon: '📊' },
                { name: 'Analytics', icon: '📈' },
                { name: 'Inventory', icon: '📦' },
                { name: 'Reports', icon: '📋' },
                { name: 'Settings', icon: '⚙️' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href="#"
                    className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 text-sm"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', icon: '❓' },
                { name: 'Contact Us', icon: '📞' },
                { name: 'API Docs', icon: '📖' },
                { name: 'Status', icon: '🟢' },
                { name: 'Privacy', icon: '🔒' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href="#"
                    className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 text-sm"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <h5 className="font-bold text-white mb-2">Need Help?</h5>
              <p className="text-slate-300 text-sm mb-2">Get in touch with our team</p>
              <a href="mailto:support@storemax.com" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold">
                support@storemax.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>© 2025</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">StoreMax</span>
              <span>• All rights reserved</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
              <div className="flex items-center space-x-2 text-slate-400">
                <span>Made with</span>
                <span className="text-red-400 animate-pulse">❤️</span>
                <span>by StoreMax Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
