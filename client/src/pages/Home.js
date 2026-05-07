import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FiFilter, FiShoppingCart, FiHeart, FiAlertCircle, FiTruck, FiStar, FiCheckCircle, FiSmartphone, FiShoppingBag, FiHome, FiActivity, FiBook, FiGift, FiPackage } from "react-icons/fi";

function Home() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(10000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      await API.post("/cart/add", {
        productId,
        quantity: 1
      });

      alert("Product added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Please login first");
    }
  };

  const categories = [
    { id: 1, name: "Electronics", emoji: "📱" },
    { id: 2, name: "Fashion", emoji: "👔" },
    { id: 3, name: "Home", emoji: "🏠" },
    { id: 4, name: "Sports", emoji: "⚽" },
    { id: 5, name: "Books", emoji: "📚" },
    { id: 6, name: "Beauty", emoji: "💄" }
  ];

  // Mock vendor data
  const getVendorInfo = (index) => {
    const vendors = ["TechStore", "StyleHub", "HomeDecor", "SportsPro", "BookWorld", "BeautyPlus"];
    return {
      name: vendors[index % vendors.length],
      rating: (4.2 + (index % 5) * 0.1).toFixed(1),
      reviews: 100 + index * 50
    };
  };

  const filteredProducts = products.filter(p => {
    const priceMatch = p.price <= priceRange;
    return priceMatch;
  });

  if (loading) {
    return <div className="page-container loading" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⟳</div>
        Loading products...
      </div>
    </div>;
  }

  return (
    <div className="page-container">
      {/* HERO SECTION */}
      <div className="hero-section">
        <h1>Welcome to AccessoryHub</h1>
        <p>Discover the best accessories from trusted vendors worldwide</p>
      </div>

      {/* CATEGORIES SECTION */}
      <div className="categories-section">
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <FiFilter /> Shop by Category
        </h2>
        <div className="categories-grid">
          {categories.map((cat) => {
            const getIcon = () => {
              switch(cat.id) {
                case 1: return <FiSmartphone size={28} />;
                case 2: return <FiShoppingBag size={28} />;
                case 3: return <FiHome size={28} />;
                case 4: return <FiActivity size={28} />;
                case 5: return <FiBook size={28} />;
                case 6: return <FiGift size={28} />;
                default: return <FiShoppingCart size={28} />;
              }
            };
            return (
              <div 
                key={cat.id} 
                className="category-card"
              >
                <div className="emoji" style={{fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center"}}>{getIcon()}</div>
                <h3>{cat.name}</h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRODUCTS WITH FILTERS */}
      <div className="filters-container">
        {/* FILTERS SIDEBAR */}
        <div className="filters-sidebar">
          <div className="filter-group">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ marginRight: "0.25rem" }}>Price Range</span>
            </h3>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              style={{ width: "100%" }}
            />
            <p style={{ marginTop: "0.75rem", marginBottom: 0, color: "#7c3aed", fontWeight: 600 }}>
              Max: ৳ {parseInt(priceRange).toLocaleString()}
            </p>
          </div>

          <div className="filter-group">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiStar size={18} /> Rating
            </h3>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="filter-option">
                <input type="checkbox" id={`rating-${rating}`} />
                <label htmlFor={`rating-${rating}`}>{rating} stars & up</label>
              </div>
            ))}
          </div>

          <div className="filter-group">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiTruck size={18} /> Delivery
            </h3>
            <div className="filter-option">
              <input type="checkbox" id="free-shipping" defaultChecked />
              <label htmlFor="free-shipping">Free Shipping</label>
            </div>
            <div className="filter-option">
              <input type="checkbox" id="express-delivery" />
              <label htmlFor="express-delivery">Express Delivery</label>
            </div>
          </div>
        </div>

        {/* PRODUCTS CONTAINER */}
        <div className="products-container">
          <h2 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            All Products ({filteredProducts.length})
          </h2>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h2>No products available</h2>
              <p>Try adjusting your filters or browse other categories</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => {
                const vendor = getVendorInfo(index);
                const discount = Math.floor(Math.random() * 40) + 5;
                const originalPrice = Math.floor(product.price / (1 - discount / 100));

                return (
                  <div key={product._id} className="product-card">
                    {/* IMAGE */}
                    <div className="product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <FiPackage size={48} style={{color: "#7c3aed"}} />
                      )}
                      {discount > 0 && <div className="product-badge discount">-{discount}%</div>}
                    </div>

                    {/* INFO */}
                    <div className="product-info">
                      {/* VENDOR */}
                      <div className="product-vendor">
                        <span>{vendor.name}</span>
                        <span className="product-vendor-badge"><FiCheckCircle size={14} style={{marginRight: "0.25rem"}}/> Verified</span>
                      </div>

                      {/* PRODUCT NAME */}
                      <h3 className="product-name">{product.name}</h3>

                      {/* RATING */}
                      <div className="product-rating">
                        <span className="rating-stars"><FiStar size={16} style={{display: "inline", marginRight: "0.25rem"}} /> {vendor.rating}</span>
                        <span className="rating-count">({vendor.reviews})</span>
                      </div>

                      {/* PRICE */}
                      <div className="product-price-section">
                        <div className="product-price">
                          <span className="price-current">৳ {product.price}</span>
                          {discount > 0 && <span className="price-original">৳ {originalPrice}</span>}
                          {discount > 0 && <span className="price-discount">{discount}% OFF</span>}
                        </div>
                      </div>

                      {/* DELIVERY */}
                      <div className="product-delivery">
                        <FiTruck size={16} style={{display: "inline", marginRight: "0.25rem"}} />
                        <span className="delivery-badge">FREE SHIPPING</span>
                      </div>

                      {/* STOCK */}
                      <div className={`product-stock ${product.stock <= 5 ? "low" : ""}`}>
                        {product.stock > 0 ? (
                          <>
                            {product.stock <= 5 && <FiAlertCircle size={14} style={{display: "inline", marginRight: "0.25rem"}} />} 
                            {product.stock} in stock
                          </>
                        ) : (
                          "Out of stock"
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div className="product-actions">
                        <button
                          onClick={() => addToCart(product._id)}
                          className="btn-cart"
                          disabled={product.stock === 0}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                        >
                          <FiShoppingCart size={18} /> Add
                        </button>
                        <button className="btn-wishlist" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                          <FiHeart size={18} /> Wish
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;