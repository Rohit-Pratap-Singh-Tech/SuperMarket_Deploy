import React, { useEffect, useRef, useState } from 'react';
import { productAPI, categoryAPI } from '../services/api';

const SupermarketMap = () => {
  const canvasRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 50, y: 850 });
  const [highlightedBlock, setHighlightedBlock] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapWidth = 1400;
  const mapHeight = 900;
  const entrance = { x: 50, y: mapHeight - 50 };
  const userRadius = 15;

  const blocks = [
    // Top row - Aisle 1-4
    { x: 100, y: 50, w: 280, h: 120, name: "Dairy & Eggs", icon: "🥛", products: ["Organic Milk", "Artisanal Cheese", "Greek Yogurt", "Pasture-Raised Eggs"] },
    { x: 410, y: 50, w: 280, h: 120, name: "Bakery", icon: "🍞", products: ["Sourdough Bread", "Fresh Baguette", "Croissants", "Gluten-Free Pastries"] },
    { x: 720, y: 50, w: 280, h: 120, name: "Specialty Coffee & Tea", icon: "☕️", products: ["Specialty Coffee Beans", "Cold Brew Concentrate", "Matcha", "Herbal Tea"] },
    { x: 1030, y: 50, w: 280, h: 120, name: "Fresh Produce", icon: "🍎", products: ["Avocados", "Heirloom Tomatoes", "Organic Berries", "Exotic Fruits"] },

          // Middle row - Aisle 5-8
      { x: 100, y: 220, w: 280, h: 120, name: "Electronics", icon: "🔌", products: ["Fan", "Mixer", "Gadgets", "Devices"] },
      { x: 410, y: 220, w: 280, h: 120, name: "Pantry Staples", icon: "🥫", products: ["Imported Olive Oil", "Gourmet Pasta", "Artisanal Spices", "Grains & Rice"] },
      { x: 720, y: 220, w: 280, h: 120, name: "Frozen Foods", icon: "❄️", products: ["Vegan Ice Cream", "Gourmet Frozen Meals", "Frozen Berries", "Pizzas"] },
      { x: 1030, y: 220, w: 280, h: 120, name: "Snacks & Confections", icon: "🍫", products: ["Hand-Crafted Chocolates", "Gourmet Chips", "Local Honey", "Nut Mixes"] },

    // Bottom row - Aisle 9-12
    { x: 100, y: 390, w: 280, h: 120, name: "Beverages", icon: "🥤", products: ["Kombucha", "Cold-Pressed Juices", "Craft Soda", "Mineral Water"] },
    { x: 410, y: 390, w: 280, h: 120, name: "Wine & Spirits", icon: "🍷", products: ["Fine Wine", "Craft Beer", "Spirits", "Champagne"] },
    { x: 720, y: 390, w: 280, h: 120, name: "Health & Wellness", icon: "🌿", products: ["Vitamins & Supplements", "Organic Protein Powders", "Herbal Remedies", "Gluten-Free"] },
    { x: 1030, y: 390, w: 280, h: 120, name: "Household & Baby", icon: "🧹", products: ["Organic Baby Food", "Natural Diapers", "Eco-Friendly Cleaners", "Paper Towels"] },
    
    // Additional sections for a "premium" feel
    { x: 100, y: 560, w: 280, h: 120, name: "Butcher & Deli", icon: "🔪", products: ["Custom Cuts of Meat", "Imported Salami", "Freshly Sliced Turkey"] },
    { x: 410, y: 560, w: 280, h: 120, name: "Fresh Flowers", icon: "🌸", products: ["Seasonal Bouquets", "Potted Plants"] },
    { x: 720, y: 560, w: 280, h: 120, name: "Sushi & Bistro", icon: "🍣", products: ["Freshly Made Sushi", "Prepared Meals", "Salad Bar"] },
    { x: 1030, y: 560, w: 280, h: 120, name: "Checkout", icon: "💳", products: ["Checkout Counters"] },
  ];

  // Map product categories to map blocks
  const getBlockFromCategory = (categoryName) => {
    // Map category names to block coordinates
    const categoryMap = {
      'Electronics': { x: 100, y: 220, w: 280, h: 120, name: "Electronics", icon: "🔌" },
      'Fresh Produce': { x: 1030, y: 50, w: 280, h: 120, name: "Fresh Produce", icon: "🍎" },
      'Bakery': { x: 410, y: 50, w: 280, h: 120, name: "Bakery", icon: "🍞" },
      'Dairy & Eggs': { x: 100, y: 50, w: 280, h: 120, name: "Dairy & Eggs", icon: "🥛" },
      'Pantry Staples': { x: 410, y: 220, w: 280, h: 120, name: "Pantry Staples", icon: "🥫" },
      'Frozen Foods': { x: 720, y: 220, w: 280, h: 120, name: "Frozen Foods", icon: "❄️" },
      'Snacks & Confections': { x: 1030, y: 220, w: 280, h: 120, name: "Snacks & Confections", icon: "🍫" },
      'Beverages': { x: 100, y: 390, w: 280, h: 120, name: "Beverages", icon: "🥤" },
      'Wine & Spirits': { x: 410, y: 390, w: 280, h: 120, name: "Wine & Spirits", icon: "🍷" },
      'Health & Wellness': { x: 720, y: 390, w: 280, h: 120, name: "Health & Wellness", icon: "🌿" },
      'Household & Baby': { x: 1030, y: 390, w: 280, h: 120, name: "Household & Baby", icon: "🧹" },
      'Butcher & Deli': { x: 100, y: 560, w: 280, h: 120, name: "Butcher & Deli", icon: "🔪" },
      'Fresh Flowers': { x: 410, y: 560, w: 280, h: 120, name: "Fresh Flowers", icon: "🌸" },
      'Sushi & Bistro': { x: 720, y: 560, w: 280, h: 120, name: "Sushi & Bistro", icon: "🍣" },
      'Checkout': { x: 1030, y: 560, w: 280, h: 120, name: "Checkout", icon: "💳" }
    };
    
    const result = categoryMap[categoryName];
    console.log('Category lookup result:', result);
    return result || null;
  };



  // Fetch products and categories from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productAPI.getAllProducts(),
        categoryAPI.getAllCategories()
      ]);
      
      console.log('Raw products response:', productsResponse);
      console.log('Raw categories response:', categoriesResponse);
      
      // Handle different possible response structures
      let products = [];
      let categories = [];
      
      // Check if productsResponse has the expected structure
      if (productsResponse && productsResponse.status === 'success') {
        products = productsResponse.products || [];
      } else if (productsResponse && Array.isArray(productsResponse)) {
        // Direct array response
        products = productsResponse;
      } else if (productsResponse && productsResponse.data) {
        // Nested data response
        products = productsResponse.data || [];
      } else {
        console.log('Products response structure:', productsResponse);
        products = [];
      }
      
      // Check if categoriesResponse has the expected structure
      if (categoriesResponse && categoriesResponse.status === 'success') {
        categories = categoriesResponse.categories || [];
      } else if (categoriesResponse && Array.isArray(categoriesResponse)) {
        // Direct array response
        categories = categoriesResponse;
      } else if (categoriesResponse && categoriesResponse.data) {
        // Nested data response
        categories = categoriesResponse.data || [];
      } else {
        console.log('Categories response structure:', categoriesResponse);
        categories = [];
      }
      
      console.log('Processed products:', products);
      console.log('Processed categories:', categories);
      
      setProducts(products);
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create product map from backend data
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    console.log('useEffect triggered - products length:', products.length, 'categories length:', categories.length);
    console.log('Products state:', products);
    console.log('Categories state:', categories);
    
    if (products.length > 0 && categories.length > 0) {
      console.log('Products loaded:', products);
      console.log('Categories loaded:', categories);
      
      // Log first product and category to see structure
      if (products.length > 0) {
        console.log('First product structure:', products[0]);
        console.log('First product keys:', Object.keys(products[0]));
      }
      if (categories.length > 0) {
        console.log('First category structure:', categories[0]);
        console.log('First category keys:', Object.keys(categories[0]));
      }
      
      // Create a map of category IDs to category names
      const categoryMap = {};
      categories.forEach(cat => {
        console.log('Processing category:', cat);
        // Check for different possible category ID field names
        const categoryId = cat._id || cat.id || cat.category_id;
        const categoryName = cat.category_name || cat.name;
        
        if (categoryId && categoryName) {
          categoryMap[categoryId] = categoryName;
          console.log(`Mapped category ID ${categoryId} to name ${categoryName}`);
        } else {
          console.log('Category missing required fields:', { id: categoryId, name: categoryName });
        }
      });
      
      console.log('Category mapping created:', categoryMap);
      
      const newProductMap = {};
      products.forEach(product => {
        console.log('Processing product:', product);
        // Check for different possible field names
        const productName = product.product_name || product.name;
        const productCategory = product.category || product.category_id;
        
        if (productName && productCategory) {
          // Since backend provides category name directly, use it directly
          const categoryName = productCategory;
          console.log(`Product: ${productName}, Category: ${productCategory}, Using category directly`);
          
          newProductMap[productName.toLowerCase()] = {
            name: productName,
            location: product.location || 'Unknown',
            category: categoryName,
            block: getBlockFromCategory(categoryName)
          };
        } else {
          console.log('Product missing required fields:', { 
            product_name: productName, 
            category: productCategory,
            available_keys: Object.keys(product)
          });
        }
      });
      console.log('Product map created:', newProductMap);
      setProductMap(newProductMap);
    } else {
      console.log('Not enough data to create product map');
      console.log('Products array:', products);
      console.log('Categories array:', categories);
    }
  }, [products, categories]);

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Store floor background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Entrance
    ctx.fillStyle = "#22c55e"; // Green circle
    ctx.beginPath();
    ctx.arc(entrance.x, entrance.y, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "1.2rem 'Poppins', sans-serif";
    ctx.fillText("Entrance", entrance.x - 30, entrance.y + 45);

    // Blocks
    blocks.forEach(block => {
      ctx.fillStyle = (highlightedBlock && block.name === highlightedBlock.name) ? "#fde047" : "#dbeafe";
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 2;
      ctx.fillRect(block.x, block.y, block.w, block.h);
      ctx.strokeRect(block.x, block.y, block.w, block.h);
      
      // Block text
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "2.5rem 'Poppins', sans-serif";
      ctx.fillText(block.icon, block.x + 20, block.y + 65);
      ctx.font = "1.2rem 'Poppins', sans-serif";
      ctx.fillText(block.name, block.x + 80, block.y + 65);
    });

    // Path
    if (highlightedBlock) {
      ctx.strokeStyle = "#ef4444"; // Red dashed line
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(currentPosition.x, currentPosition.y);
      ctx.lineTo(highlightedBlock.x + highlightedBlock.w / 2, highlightedBlock.y + highlightedBlock.h / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // User marker
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.arc(currentPosition.x, currentPosition.y, userRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 1rem 'Poppins', sans-serif";
    ctx.fillText("You", currentPosition.x - 12, currentPosition.y + 5);
  };

  const highlightProduct = () => {
    const input = searchInput.trim().toLowerCase();
    console.log('Searching for:', input);
    console.log('Available products in map:', Object.keys(productMap));
    console.log('Full product map:', productMap);
    
    const productInfo = productMap[input];
    console.log('Product info found:', productInfo);
    
    if (productInfo && productInfo.block) {
      setHighlightedBlock(productInfo.block);
    } else {
      alert(`❌ Product "${searchInput}" not found! Please check the product name or try searching by category.`);
      setHighlightedBlock(null);
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / (rect.width / canvas.width);
    const mouseY = (e.clientY - rect.top) / (rect.height / canvas.height);
    
    const block = blocks.find(b => 
      mouseX >= b.x && mouseX <= b.x + b.w && 
      mouseY >= b.y && mouseY <= b.y + b.h
    );
    
    if (block) {
      setHighlightedBlock(block);
    }
  };

  const handleKeyDown = (e) => {
    const step = 20;
    const minX = 10, maxX = mapWidth - 10;
    const minY = 10, maxY = mapHeight - 10;
    
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      setCurrentPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        switch (e.key) {
          case "ArrowUp": newY = Math.max(minY, prev.y - step); break;
          case "ArrowDown": newY = Math.min(maxY, prev.y + step); break;
          case "ArrowLeft": newX = Math.max(minX, prev.x - step); break;
          case "ArrowRight": newX = Math.min(maxX, prev.x + step); break;
        }
        
        return { x: newX, y: newY };
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = mapWidth;
    canvas.height = mapHeight;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    console.log('Component mounted, calling fetchData...');
    fetchData();
  }, []);

  useEffect(() => {
    drawMap();
  }, [currentPosition, highlightedBlock]);

  return (
    <div style={{
      fontFamily: 'Poppins, sans-serif',
      textAlign: 'center',
      margin: 0,
      background: 'linear-gradient(135deg, #f0f2f5, #e0e6ed)',
      color: '#333',
      padding: '20px'
    }}>
      <header style={{
        padding: '30px',
        background: '#1e3a8a',
        color: 'white',
        fontSize: '2.5rem',
        fontWeight: 700,
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        🛒 Supreme Market Navigation
      </header>

      <div style={{
        margin: '30px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={loading ? "Loading products..." : "Search for a product (e.g., tomato, milk, bread)..."}
              list="products"
              style={{
                padding: '12px 20px',
                width: 'clamp(250px, 40%, 450px)',
                border: '2px solid #ccc',
                borderRadius: '30px',
                outline: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.6 : 1
              }}
            />

                 <datalist id="products">
           {products.map((product, index) => (
             <option key={index} value={product.product_name || product.name} />
           ))}
         </datalist>
        <button
          onClick={highlightProduct}
          disabled={loading}
          style={{
            padding: '12px 25px',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? '#9ca3af' : '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '1.1rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#1c3373';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#1e3a8a';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            }
          }}
        >
          {loading ? 'Loading...' : 'Find Product'}
        </button>
      </div>

      <div style={{
        position: 'relative',
        width: '95%',
        maxWidth: '1400px',
        margin: '0 auto',
        border: '5px solid #1e3a8a',
        borderRadius: '25px',
        background: '#ffffff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        padding: '20px'
      }}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto'
          }}
        />
      </div>
      
      <div style={{
        fontSize: '1rem',
        margin: '20px auto',
        color: '#555',
        background: '#eef2f5',
        padding: '15px',
        width: '90%',
        maxWidth: '800px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        lineHeight: 1.6
      }}>
        Welcome! Navigate the map using the <b>arrow keys</b> ⬆️⬇️⬅️➡️ to move the "You Are Here" marker. <br /> 
        You can also <b>click on any aisle block</b> to see what's inside and find your way.
      </div>

             {highlightedBlock && (
         <div style={{
           margin: '20px auto',
           width: '90%',
           maxWidth: '800px',
           padding: '20px',
           background: '#e3f2fd',
           borderLeft: '6px solid #1e3a8a',
           borderRadius: '12px',
           fontSize: '1.1rem',
           boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
           lineHeight: 1.5
         }}>
           <b style={{ color: '#1e3a8a' }}>
             {highlightedBlock.icon} {highlightedBlock.name}
           </b><br />
           <span style={{ fontSize: '0.9rem', color: '#666' }}>
             Category Section: {highlightedBlock.name}
           </span>
           {searchInput && (
             <div style={{ marginTop: '10px', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
               <strong>Product Found:</strong> {searchInput}<br />
               <strong>Category:</strong> {productMap[searchInput.toLowerCase()]?.category || 'Unknown'}<br />
               <strong>Storage Location:</strong> {productMap[searchInput.toLowerCase()]?.location || 'Unknown'}
             </div>
           )}
         </div>
       )}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          
          @media (max-width: 768px) {
            header {
              font-size: 2rem !important;
              padding: 20px !important;
            }
            .controls {
              flex-direction: column !important;
            }
            button {
              width: 100% !important;
            }
            .instructions, .legend {
              padding: 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SupermarketMap;
