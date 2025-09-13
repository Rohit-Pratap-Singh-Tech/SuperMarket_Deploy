import React from 'react'

const BillingProcessPage = () => {
  const stages = [
    {
      id: 'store',
      title: 'Store',
      icon: '🏪',
      description: 'Browse products and add to cart'
    },
    {
      id: 'checkout',
      title: 'Checkout',
      icon: '🛒',
      description: 'Review cart and proceed to payment'
    },
    {
      id: 'invoice',
      title: 'Invoice',
      icon: '🧾',
      description: 'Generate and view invoice'
    }
  ]

  return (
    <div className="h-[250px] w-full bg-white p-8">
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Store and Billing Process
        </h2>
        
        <div className="flex items-center justify-center space-x-8">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="text-5xl text-blue-600 mb-2">
                  {stage.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {stage.title}
                </h3>
                <p className="text-sm text-gray-600 text-center mt-1 max-w-[120px]">
                  {stage.description}
                </p>
              </div>
              
              {index < stages.length - 1 && (
                <div className="mx-6 text-blue-600">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BillingProcessPage