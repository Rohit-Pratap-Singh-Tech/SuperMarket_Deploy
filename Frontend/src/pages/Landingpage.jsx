import React from 'react'
import Navbar from '../components/Navbar'
import Hero from './Hero'
import ActorPage from './ActorPage'
import BillingProcessPage from './BillingProcessPage'
import Footer from '../components/Footer'
import SupermarketMap from '../components/SupermarketMap'
import InventoryDashboard from './InventoryDashboard'
import CashierDashboard from './CashierDashboard'
import ManagerDashboard from './ManagerDashboard'

const Landingpage = () => {
  return (
    <div className="min-h-screen">
        <Navbar/>
        <div className="pt-20"> {/* Add padding to account for fixed navbar */}
          <Hero />
          <div id="features">
            <ActorPage />
          </div>
          <div id="about">
            <BillingProcessPage />
          </div>
          <div id="map">
            <SupermarketMap />
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default Landingpage
