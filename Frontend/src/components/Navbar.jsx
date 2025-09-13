import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavClick = (e, to) => {
    e.preventDefault()
    
    if (to === '#contact') {
      // Smooth scroll to contact section (footer)
      const contactElement = document.getElementById('contact')
      if (contactElement) {
        contactElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    } else if (to === '/') {
      // Navigate to home
      window.location.href = '/'
    } else if (to.startsWith('#')) {
      // Handle other anchor links
      const targetElement = document.querySelector(to)
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20' 
        : 'bg-white/60 backdrop-blur-sm'
    }`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-xl p-2 shadow-lg">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-8 sm:h-10 w-auto group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { name: 'Home', to: '/', icon: '🏠' },
            { name: 'Features', to: '#features', icon: '⭐' },
            { name: 'About', to: '#about', icon: '💡' },
            { name: 'Contact', to: '#contact', icon: '📞' },
          ].map((link) => (
            <a
              key={link.name}
              href={link.to}
              onClick={(e) => handleNavClick(e, link.to)}
              className="group relative px-4 py-2 text-slate-700 font-semibold hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 text-slate-700 font-semibold hover:text-blue-600 transition-colors duration-300"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden relative p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 text-slate-700 hover:text-blue-600 hover:bg-white/90 transition-all duration-300"
          aria-label="Toggle menu"
        >
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 ${
        isMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      } overflow-hidden bg-white/90 backdrop-blur-md border-t border-white/20`}>
        <div className="px-4 py-6 space-y-4">
          {[
            { name: 'Home', to: '/', icon: '🏠' },
            { name: 'Features', to: '#features', icon: '⭐' },
            { name: 'About', to: '#about', icon: '💡' },
            { name: 'Contact', to: '#contact', icon: '📞' },
          ].map((link, index) => (
            <a
              key={link.name}
              href={link.to}
              onClick={(e) => {
                handleNavClick(e, link.to)
                setIsMenuOpen(false)
              }}
              className="flex items-center space-x-3 px-4 py-3 text-slate-700 font-semibold hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </a>
          ))}
          
          <div className="pt-4 space-y-3 border-t border-slate-200">
            <Link
              to="/login"
              className="block w-full text-center px-6 py-3 text-slate-700 font-semibold hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
