import React, { useEffect, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Company-Logo.png";
import bg from "../assets/turmeric.jpg";
import Loginform from '../login/AuthPage';

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showPreorder, setShowPreorder] = useState(false);
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowTable(false);
    setShowPreorder(false);
  }, []);

  const searchProduct = async () => {
    const productName = searchTerm.trim();
    const location = selectedLocation.trim();

    if (!productName || !location) {
      alert("Please enter both product name and location.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://stock.caprestaindia.com/api/products/search?productName=${encodeURIComponent(productName)}&location=${encodeURIComponent(location)}`
      );

      if (!response.ok) {
        throw new Error("No products found.");
      }

      const data = await response.json();
      console.log("Products:", data);
      setProducts(data);
      setFilteredProducts(data);
      setShowTable(true);
      setShowPreorder(true);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(error.message);
      setShowTable(false);
      setShowPreorder(false);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setShowTable(false);
    setShowPreorder(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchProduct();
    }
  };

  const sendPreorderRequest = async () => {
    const checkboxes = document.querySelectorAll(".preorder-checkbox:checked");
    const selectedProducts = Array.from(checkboxes).map((cb) => {
      const index = parseInt(cb.getAttribute("data-product-index"));
      return filteredProducts[index];
    });

    if (!/^[6-9]\d{9}$/.test(mobile) || selectedProducts.length === 0) {
      alert("⚠️ Enter a valid 10-digit mobile number and select at least one product.");
      return;
    }

    const payload = {
      mobile: mobile,
      userEmail: `${mobile}@preorder.com`,
      products: selectedProducts.map((product) => ({
        productName: product.productName,
        tradeMark: product.tradeMark || "-",
        location: product.location,
        netWeightPerBag: product.netWeightPerBag ?? "-",
        quantityAvailableBags: product.quantityAvailableBags ?? "-",
        ratePerKgExCold: product.ratePerKgExCold ?? "-",
        lotNo:product.lotNo  ?? "-"
      })),
    };

    try {
      const res = await fetch(`http://stock.caprestaindia.com/api/email/send?mobile=${encodeURIComponent(mobile)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      if (!res.ok) {
        throw new Error(responseText);
      }

      alert("✅ Preorder request sent successfully!");
    } catch (error) {
      console.error("❌ Error sending preorder:", error);
      alert("❌ Failed to send preorder. Check console for details.");
    }
  };

  const handleLoginClick = () => navigate("/login");

  return (
    <div className="container">
      <img src={logo} alt="Company Logo" className="Company-Logo" />
      <h1>CAPRESTA INDIA PVT.LTD.</h1>
      <h3>(Ready Stock Portal)</h3>

      <div className="login-section">
        <button className="login-btn" onClick={handleLoginClick}>
          Login
        </button>
      </div>

      <div className="company-info">
        <p><strong>CIN:</strong> <span>U51909MH2020PTC352852</span></p>
        <p><strong>GSTIN:</strong> <span>27AAJCC2191E12R</span></p>
        <p><strong>FSSAI:</strong> <span>11523998001026</span></p>
      </div>

      <div className="search-bar-row">
        <div className="search-bar-container">
          <i className="fas fa-search"></i>
          <input
            list="product-options"
            type="text"
            placeholder="Search Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <i className="fas fa-times clear-input-icon" onClick={() => setSearchTerm("")}></i>
          <datalist id="product-options">
            <option value="TURMERIC" />
            <option value="CHILLI" />
            <option value="CORIANDER" />
            <option value="RAISINS" />
          </datalist>
        </div>
      </div>

      <div className="search-location">
        <label htmlFor="search-location">📍 Select Location:</label>
        <select
          id="search-location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="" disabled>Select Location</option>
          <option>Jaipur</option>
          <option>Ahmedabad</option>
          <option>Sangli</option>
          <option>Mumbai</option>
        </select>
      </div>

      <div className="button-row">
        <button type="submit" onClick={searchProduct}>Search</button>
        <button id="clear-btn" onClick={clearSearch}>Clear</button>
      </div>

      {isLoading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {showTable && (
        <div className="table-wrapper">
          <table id="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Trade Mark</th>
                <th>Quantity (Available-Bags)</th>
                <th>Net Weight (Per Bag)</th>
                <th>Location</th>
                <th>Lot No</th>
                <th>Rate-Per Kg (Ex-Cold)</th>
                <th>View Product</th>
                <th>Lab Report</th>
                <th>Pre-Order</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{product.productName || '-'}</td>
                  <td>{product.tradeMark || '-'}</td>
                  <td>{product.quantityAvailableBags}</td>
                  <td>{product.netWeightPerBag} kg</td>
                  <td>{product.location}</td>
                  <td>{product.lotNo}</td>
                  <td className="rate">₹{product.ratePerKgExCold}</td>
                  <td>
                    {product.imagePath ? (
                      <a href={`http://stock.caprestaindia.com/api/products/file/${encodeURIComponent(product.imagePath)}`} target="_blank" rel="noopener noreferrer">View</a>
                    ) : (
                      'Not available'
                    )}
                  </td>
                  <td>
                    {product.labReportPath ? (
                      <a href={`http://stock.caprestaindia.com/api/products/file/${encodeURIComponent(product.labReportPath)}`} target="_blank" rel="noopener noreferrer">View Report</a>
                    ) : (
                      'Not available'
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="preorder-checkbox"
                      data-product-index={index}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPreorder && (
        <div id="preorder-section" style={{ display: "block", marginTop: "20px", textAlign: "center" }}>
          <h4>Proceed for Pre-Order Request</h4>
          <input
            type="text"
            id="user-mobile"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={{ padding: "8px", width: "250px" }}
          />
          <br /><br />
          <button className="send-request-btn" onClick={sendPreorderRequest}>Send Request</button>
        </div>
      )}

      {!showTable && (
        <div className="footer" id="footer-section">
          <h3>Thanks For Your Interest !</h3>
          <h4>For More Info Where We Can Help Your Business Join Our Free Consultation.</h4><br />
          <p><strong>Contact:</strong> <span className="contact-number">08793712082</span></p>
          <p><strong>Reach us at :</strong> <a href="mailto:capresta@yahoo.com" className="contact-email">capresta@yahoo.com</a></p>
          <strong className="follow"><a href="https://www.facebook.com/share/15jH3iS9m8/"><i className="fa-brands fa-square-facebook"></i> Capresta India</a></strong> <br />
          <strong className="instagram"><a href="https://www.instagram.com/capresta.in?igsh=eTd1MXRvYXpkYXNj"><i className="fa-brands fa-square-instagram"></i> Capresta.in</a></strong>
        </div>
      )}
    </div>
  );
}
