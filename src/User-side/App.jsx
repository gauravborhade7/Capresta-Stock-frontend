import React, { useEffect, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Company-Logo.png";
import bg from "../assets/turmeric.jpg";
import Loginform from '../login/AuthPage'
export default function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showPreorder, setShowPreorder] = useState(false);
  const [mobile, setMobile] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleImageIndex, setVisibleImageIndex] = useState(null);



  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    setShowTable(false);
    setShowPreorder(false);
  }, []);

  const fetchImages = async (name, location) => {
    // const response = await fetch(`http://stock.caprestaindia.com/api/products/images/${encodeURIComponent(name)}/${encodeURIComponent(location)}`);
    const response = await fetch(`http://localhost:8080/api/products/images/${encodeURIComponent(name)}/${encodeURIComponent(location)}`);
    if (!response.ok) return [];
    const base64List = await response.json();
    return base64List.map(b64 => `data:image/png;base64,${b64}`);
  };


  const fetchPDF = async (name, location) => {
    // const response = await fetch(`http://stock.caprestaindia.com/api/products/${name}/${location}/labreports`);
    const response = await fetch(`http://localhost:8080/api/products/${name}/${location}/labreports`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };



  const searchProduct = async () => {
    const term = searchTerm.trim();
    const location = selectedLocation.trim();

    if (!term || !location) {
      alert("⚠️ Please enter both product name and location.");
      return;
    }

    // const apiUrl = `http://stock.caprestaindia.com/api/products/details/${encodeURIComponent(term)}/${encodeURIComponent(location)}`;
    const apiUrl = `http://localhost:8080/api/products/details/${encodeURIComponent(term)}/${encodeURIComponent(location)}`;

    try {
      setIsLoading(true);
      const response = await fetch(apiUrl);
      if (response.status === 404) {
        alert("Products not available!");
        return;
      }

      const data = await response.json();

      const enriched = data.map(p => ({
        name: p.productName,
        brand: p.brandName,
        quantity: p.stockQuantity,
        netWeight: p.netWeightPerBag,
        location: p.location,
        lot: p.lotNo,
        price: p.ratePerKgExCold,
        imageUrl: p.image ? `data:image/png;base64,${p.image}` : null,
        pdfUrl: p.labReport ? `data:application/pdf;base64,${p.labReport}` : null
      }));



      setProducts(enriched);
      setFilteredProducts(enriched);
      setShowTable(true);
      setShowPreorder(true);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products!");
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

  function openImageInNewTab(base64DataUrl) {
    try {
      const parts = base64DataUrl.split(',');
      const mimeType = parts[0].match(/:(.*?);/)[1];
      const byteString = atob(parts[1]);
      const byteNumbers = new Array(byteString.length);

      for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error("Error opening image:", err);
      alert("Could not open image");
    }
  }


  function openPdfInNewTab(base64PdfDataUrl) {
    try {
      if (!base64PdfDataUrl || !base64PdfDataUrl.includes(',')) {
        alert("Invalid or missing PDF data.");
        return;
      }

      const parts = base64PdfDataUrl.split(',');
      const header = parts[0];
      const base64Data = parts[1];

      const match = header.match(/:(.*?);/);
      if (!match || !match[1]) {
        alert("Invalid PDF MIME type.");
        return;
      }

      const mimeType = match[1];
      const byteString = atob(base64Data);
      const byteNumbers = new Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error("Error opening PDF:", err);
      alert("Could not open lab report");
    }
  }



const sendPreorderRequest = () => {
  const checkboxes = document.querySelectorAll(".preorder-checkbox:checked");
  const selectedProducts = Array.from(checkboxes).map((cb) => {
    const index = parseInt(cb.getAttribute("data-product-index"));
    return filteredProducts[index];
  });

  if (!/^[6-9]\d{9}$/.test(mobile) || selectedProducts.length === 0) {
    alert("⚠️ Enter a valid 10-digit mobile number and select at least one product.");
    return;
  }

  const messageBody = selectedProducts
    .map((p, i) =>
      `  Name     : ${p.name}\n` +
    `  Trade Mark : ${p.brand ?? "-"}\n` + 
      `  Rate     : ₹${p.price}/Kg\n` +
      `  Location : ${p.location}\n` +
      `  Lot No   : ${p.lot}\n` +
      `  Quantity : ${p.quantity} Bags\n`
    )
    .join("\n");

  const subject = `Preorder Request from ${mobile}`;
  const to = "capresta@yahoo.com";
  const body = `Mobile: ${mobile}\n\nProducts:\n${messageBody}`;

  // ✅ Gmail Compose URL
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // ✅ Open Gmail in new tab directly
  window.open(gmailUrl, "_blank");
};



  // const toggleLoginForm = () => setShowLoginForm(<Loginform/>);
  // const toggleFormType = () => setIsSignup(!isSignup);

  // const handleLoginSignup = () => {
  //   if (!email || !password || (isSignup && !fullName)) {
  //     alert("Please fill all fields.");
  //     return;
  //   }
  //   alert(`${isSignup ? "Sign Up" : "Login"} successful (Mock Functionality)`);
  //   setShowLoginForm(false);
  // };

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
              {filteredProducts.map((p, index) => (
                <tr key={index}>
                  <td>{p.name}</td>
                  <td>{p.brand ?? "-"}</td>
                  <td>{p.quantity ?? "-"}</td>
                  <td>{p.netWeight ?? "-"} kg</td>
                  <td>{p.location ?? "-"}</td>
                  <td>{p.lot ?? "-"}</td>
                  <td className="pr">₹{p.price ?? "-"}</td>
                  <td>
                    {p.imageUrl ? (
                      <a href="#" onClick={(e) => { e.preventDefault(); openImageInNewTab(p.imageUrl); }}>
                        View Sample
                      </a>
                    ) : (
                      "No Image"
                    )}
                  </td>


                  <td>
                    {p.pdfUrl ? (
                      <a href="#" onClick={(e) => { e.preventDefault(); openPdfInNewTab(p.pdfUrl); }}>
                        View Report
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </td>
                  <td><input type="checkbox" className="preorder-checkbox" data-product-index={index} /></td>
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
