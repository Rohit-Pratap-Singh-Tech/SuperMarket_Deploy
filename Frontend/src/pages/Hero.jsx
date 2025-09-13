import React from 'react'

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-20 py-20">
        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-2xl order-1">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full text-blue-700 font-semibold shadow-lg text-sm mb-8 animate-bounce">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            #1 Store Management Solution
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 mb-8 leading-tight">
            Super Market Store
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Management
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed mb-10 max-w-xl font-medium">
            Transform your retail business with our powerful, intuitive management platform. 
            <span className="text-blue-600 font-semibold"> Boost efficiency by 40%</span> and streamline operations like never before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center">
                Get Started Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
            </button>
            
            <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-50">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.82 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Watch Demo
              </span>
            </button>
          </div>

          {/* Features Badge */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100/80 backdrop-blur-sm border border-emerald-200/50 rounded-full text-emerald-700 font-semibold shadow-md text-sm">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Real-time Analytics
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-orange-100/80 backdrop-blur-sm border border-orange-200/50 rounded-full text-orange-700 font-semibold shadow-md text-sm">
              <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Bank-level Security
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-violet-100/80 backdrop-blur-sm border border-violet-200/50 rounded-full text-violet-700 font-semibold shadow-md text-sm">
              <svg className="w-5 h-5 mr-2 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Lightning Fast
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 flex justify-center items-center order-2 lg:order-1 relative">
          <div className="relative">
            {/* Floating Cards Animation */}
            <div className="absolute -top-10 -left-10 w-24 h-32 bg-white rounded-xl shadow-xl border border-slate-200 p-4 animate-float delay-1000">
              <div className="w-4 h-4 bg-blue-500 rounded mb-2"></div>
              <div className="w-full h-2 bg-slate-200 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
            </div>
            <div className="absolute -top-5 -right-16 w-28 h-36 bg-white rounded-xl shadow-xl border border-slate-200 p-4 animate-float delay-2000">
              <div className="w-5 h-5 bg-emerald-500 rounded mb-2"></div>
              <div className="w-full h-2 bg-slate-200 rounded mb-1"></div>
              <div className="w-full h-2 bg-slate-200 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-slate-200 rounded"></div>
            </div>
            <div className="absolute -bottom-8 -left-6 w-20 h-28 bg-white rounded-xl shadow-xl border border-slate-200 p-3 animate-float delay-3000">
              <div className="w-3 h-3 bg-purple-500 rounded mb-2"></div>
              <div className="w-full h-1.5 bg-slate-200 rounded mb-1"></div>
              <div className="w-4/5 h-1.5 bg-slate-200 rounded"></div>
            </div>

            {/* Main Image */}
            <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
              <img 
                src="/superMarket.svg" 
                alt="Store Management System" 
                className="max-w-[400px] sm:max-w-[450px] lg:max-w-[500px] max-h-[400px] sm:max-h-[450px] lg:max-h-[500px] object-contain drop-shadow-2xl filter hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </div>
  )
}

export default Hero