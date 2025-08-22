import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "../assets/Company-Logo.png";

function App() {
  // States
  const [products, setProducts] = useState(
    () => JSON.parse(localStorage.getItem("products")) || []
  );
  const [visibleData, setVisibleData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [productName, setProductName] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showPreorder, setShowPreorder] = useState(false);

  // Refs
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const purchaseRateRef = useRef(null);
  const netWeightRef = useRef(null);
  const quantityRef = useRef(null);
  const locationRef = useRef(null);
  const lotRef = useRef(null);
  const brandRef = useRef(null);
  const footerRef = useRef(null);
  const productImageRef = useRef(null);
  const labReportRef = useRef(null);

  const API_BASE = "http://stock.caprestaindia.com";

  // Component mount
  useEffect(() => {
    setShowTable(false);
    if (footerRef.current) footerRef.current.style.display = "block";
  }, []);

  // Reset Form
  const resetForm = () => {
    formRef.current.reset();
    setEditProductId(null);
    setEditingProduct(null);
    if (locationRef.current) locationRef.current.value = "";
    if (brandRef.current) brandRef.current.value = "";
  };

  // Add / Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", nameRef.current.value.trim());
    formData.append("purchaseRate", parseFloat(purchaseRateRef.current.value));
    formData.append("netWeightPerBag", parseFloat(netWeightRef.current.value));
    formData.append(
      "quantityAvailableBags",
      parseInt(quantityRef.current.value)
    );
    formData.append("location", locationRef.current.value.trim());
    formData.append("lotNo", lotRef.current.value.trim());
    formData.append("tradeMark", brandRef.current.value.trim());
    formData.append("ratePerKgExCold", parseFloat(priceRef.current.value));

    if (productImageRef.current.files.length > 0) {
      formData.append("image", productImageRef.current.files[0]);
    }
    if (labReportRef.current.files.length > 0) {
      formData.append("labReport", labReportRef.current.files[0]);
    }

    try {
      const url = editProductId
        ? `${API_BASE}api/products/update/${editProductId}`
        : `${API_BASE}api/products/add`;

      const method = editProductId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(
          `❌ Failed to ${
            editProductId ? "update" : "add"
          } product: ${errorText}`
        );
        return;
      }

      const savedProduct = await response.json();

      const enriched = {
        id: savedProduct.id,
        name: savedProduct.productName,
        brand: savedProduct.tradeMark,
        quantity: savedProduct.quantityAvailableBags,
        netweight: savedProduct.netWeightPerBag,
        location: savedProduct.location,
        lot: savedProduct.lotNo,
        price: savedProduct.ratePerKgExCold,
        purchaseRate: savedProduct.purchaseRate,
        imageUrl: savedProduct.imagePath
          ? `${API_BASE}${encodeURIComponent(savedProduct.imagePath).replace(
              /%2F/g,
              "/"
            )}`
          : null,
        labReportUrl: savedProduct.labReportPath
          ? `${API_BASE}${encodeURIComponent(
              savedProduct.labReportPath
            ).replace(/%2F/g, "/")}`
          : null,
      };

      // Update table data
      if (editProductId) {
        setVisibleData((prev) =>
          prev.map((p) => (p.id === editProductId ? enriched : p))
        );
        alert("✅ Product updated successfully!");
      } else {
        setVisibleData((prev) => [...prev, enriched]);
        alert("✅ Product added successfully!");
      }

      resetForm();
      setShowTable(true);
      if (footerRef.current) footerRef.current.style.display = "none";
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Could not connect to backend.");
    }
  };

  // Search product
  const searchProduct = async () => {
    const nameToSearch = productName.trim();
    const locationToSearch = location.trim();

    if (!nameToSearch || !locationToSearch) {
      alert("Please enter both product name and location.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE}api/products/search?productName=${encodeURIComponent(
          nameToSearch
        )}&location=${encodeURIComponent(locationToSearch)}`
      );

      if (!response.ok) {
        throw new Error("No products found.");
      }

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setVisibleData(data);
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

  // Edit product
  const onEditProduct = (product) => {
  setEditProductId(product.id);
  setEditingProduct(product);

  // Match API field names
  nameRef.current.value = product.productName || "";
  priceRef.current.value = product.ratePerKgExCold || "";
  purchaseRateRef.current.value = product.purchaseRate || "";
  netWeightRef.current.value = product.netWeightPerBag || "";
  quantityRef.current.value = product.quantityAvailableBags || "";
  locationRef.current.value = product.location || "";
  lotRef.current.value = product.lotNo || "";
  brandRef.current.value = product.tradeMark || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
};


  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(`${API_BASE}api/products/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("✅ Product deleted successfully");
        setVisibleData((prev) => prev.filter((p) => p.id !== id));
        if (editProductId === id) resetForm();
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Server error");
    }
  };

  // Clear table
  const clearTableOnly = () => {
    setProductName("");
    setLocation("");
    setVisibleData([]);
    setShowTable(false);
    resetForm();
    if (footerRef.current) footerRef.current.style.display = "block";
  };

  return (
    <div className="container">
      <img src={logo} className="companyLG" alt="logo" />
      <h1>CAPRESTA INDIA PVT.LTD</h1>
      <h3>(Ready Stock Portal)</h3>
      <div className="company-info">
        <p><strong>CIN:</strong> <span>U51909MH2020PTC352852</span></p>
        <p><strong>GSTIN:</strong> <span>27AAJCC2191E1ZR</span></p>
        <p><strong>FSSAI:</strong> <span>11523998001026</span></p>
      </div>

      {/* Search */}
      <div className="search-bar-row">
        <div className="search-input-icon-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Enter Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <button onClick={searchProduct} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="search-location">
        <label htmlFor="search-location">📍 Select Location:</label>
        <select
          id="search-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="" disabled>
            Select Location
          </option>
          <option>Jaipur</option>
          <option>Ahmedabad</option>
          <option>Sangli</option>
          <option>Mumbai</option>
        </select>
      </div>

      {/* Form */}
      <form id="product-form" ref={formRef} onSubmit={handleSubmit}>
        <input type="text" ref={nameRef} placeholder="Product Name" required />
        <input
          type="number"
          ref={priceRef}
          placeholder="Rate-Per Kg (Ex-Cold)"
          min="1"
          required
        />
        <input
          type="number"
          ref={netWeightRef}
          placeholder="Net Weight (Per-Bag)"
          min="1"
          required
        />
        <input
          type="number"
          ref={quantityRef}
          placeholder="Quantity (Available-Bags)"
          min="1"
          required
        />
        <select ref={locationRef} required defaultValue="">
          <option value="" disabled>
            Select Location
          </option>
          <option>Jaipur</option>
          <option>Ahmedabad</option>
          <option>Sangli</option>
          <option>Mumbai</option>
        </select>
        <input
          type="text"
          ref={lotRef}
          placeholder="Lot No (Cold-Storage)"
          required
        />
        <select ref={brandRef} required defaultValue="">
          <option value="" disabled>
            Trade Mark
          </option>
          <option>If any</option>
          <option>NIRALA</option>
          <option>KABA</option>
          <option>WINCI</option>
          <option>BISARANI</option>
        </select>
        <input
          type="number"
          ref={purchaseRateRef}
          placeholder="Purchase Rate"
          required
        />
        <label>Add Product Image:</label>
        <input type="file" accept="image/*" ref={productImageRef} />
        <label>Add Lab Report:</label>
        <input type="file" accept=".pdf,.doc,.docx,image/*" ref={labReportRef} />
        <button type="submit">
          {editProductId ? "Update Product" : "Add Product"}
        </button>
        {editProductId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {/* Clear */}
      <div className="clear-btn-wrapper">
        <button id="clear-btn" onClick={clearTableOnly}>Clear</button>
      </div>

      {/* Table */}
      {showTable && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Trade-Mark</th>
                <th>Quantity</th>
                <th>Net Weight</th>
                <th>Location</th>
                <th>Lot No</th>
                <th>Rate-Per Kg</th>
                <th>Purchase Rate</th>
                <th>View Product</th>
                <th>Lab Report</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {visibleData.length === 0 ? (
    <tr>
      <td colSpan="10">Products are not available!</td>
    </tr>
  ) : (
    visibleData.map((product) => (
      <tr key={product.id}>
        <td>{product.productName || '-'}</td>
        <td>{product.tradeMark || '-'}</td>
        <td>{product.quantityAvailableBags}</td>
        <td>{product.netWeightPerBag} kg</td>
        <td>{product.location}</td>
        <td>{product.lotNo}</td>
        <td className="rate">₹{product.ratePerKgExCold}</td>
        <td className="rate">₹{product.purchaseRate}</td>
        <td>
          {product.imagePath ? (
            <a
              href={`http://stock.caprestaindia.com/api/products/file/${encodeURIComponent(product.imagePath)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          ) : (
            "Not available"
          )}
        </td>
        <td>
          {product.labReportPath ? (
            <a
              href={`http://stock.caprestaindia.com/api/products/file/${encodeURIComponent(product.labReportPath)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Report
            </a>
          ) : (
            "Not available"
          )}
        </td>
        <td>
          <button className="edit" onClick={() => onEditProduct(product)}>Edit</button>
          <button className="delete" onClick={() => deleteProduct(product.id)}>Delete</button>
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>
      )}

      {/* Footer */}
      <div className="footer" ref={footerRef}>
        <h3>Thanks For Your Interest!</h3>
        <h4>
          For More Info Where We Can Help Your Business Join Our Free
          Consultation.
        </h4>
        <p>Contact: 08793712082</p>
        <a href="mailto:capresta@yahoo.com">capresta@yahoo.com</a>
      </div>
    </div>
  );
}

export default App;
