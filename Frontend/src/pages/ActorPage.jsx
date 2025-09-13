import React from 'react'
import { useNavigate } from 'react-router-dom'

const ActorPage = () => {
  const navigate = useNavigate()
  const roles = [
    {
      id: 'admin',
      title: 'Admin',
      description: 'Complete control over store operations, user management, and system configuration',
      icon: '👑',
      roleValue: 'Admin',
      gradient: 'from-red-400 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      features: ['User Management', 'System Settings', 'Full Access']
    },
    {
      id: 'manager',
      title: 'Manager',
      description: 'Oversee daily operations, manage staff, and monitor business performance',
      icon: '👔',
      roleValue: 'Manager',
      gradient: 'from-blue-400 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      features: ['Staff Management', 'Reports', 'Operations']
    },
    {
      id: 'cashier',
      title: 'Cashier',
      description: 'Process sales transactions, handle payments, and provide excellent customer service',
      icon: '🛒',
      roleValue: 'Cashier',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      features: ['Sales Processing', 'Payment Handling', 'Customer Service']
    },
    {
      id: 'inventory',
      title: 'Inventory Manager',
      description: 'Track stock levels, manage suppliers, and optimize inventory workflows',
      icon: '�',
      roleValue: 'Inventory Manager',
      gradient: 'from-purple-400 to-violet-500',
      bgGradient: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      features: ['Stock Management', 'Supplier Relations', 'Analytics']
    }
  ]

  const handleRoleClick = (role) => {
    localStorage.setItem('selectedRole', role.roleValue)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full text-blue-700 font-semibold shadow-lg text-sm mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          Choose Your Role
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-blue-600 mb-6">
          Access Your Dashboard
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Select your role to access tailored features and functionalities designed specifically for your responsibilities.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
        {roles.map((role, index) => (
          <div
            key={role.id}
            className="group relative overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Card */}
            <button
              onClick={() => handleRoleClick(role)}
              className={`relative w-full h-full p-8 bg-gradient-to-br ${role.bgGradient} rounded-3xl border-2 ${role.borderColor} hover:border-opacity-60 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 text-left group-hover:rotate-1`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Orb */}
              <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r ${role.gradient} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-110 transform`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${role.iconBg} rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <span className="text-3xl">{role.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-slate-900 transition-colors duration-300">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 group-hover:text-slate-700 transition-colors duration-300">
                  {role.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {role.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-500">
                      <svg className="w-3 h-3 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${role.gradient} text-white font-bold rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 text-sm`}>
                  <span>Access Dashboard</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
            </button>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto text-center mt-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Need Help Choosing?</h3>
          <p className="text-slate-600 mb-6">Contact your administrator for role assignment or access permissions.</p>
          <button 
            onClick={() => {
              const contactElement = document.getElementById('contact')
              if (contactElement) {
                contactElement.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                })
              }
            }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActorPage