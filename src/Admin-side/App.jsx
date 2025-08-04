// import React, { useEffect, useRef, useState } from 'react';
// import './App.css';
// import logo from '../assets/Company-Logo.png';

// function App() {
//   const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('products')) || []);
//   const [visibleData, setVisibleData] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [editProductId, setEditProductId] = useState(null);
//   const [editingProduct, setEditingProduct] = useState(null);

//   const formRef = useRef(null);
//   const nameRef = useRef(null);
//   const priceRef = useRef(null);
//   const purchaseRateRef = useRef(null);
//   const netWeightRef = useRef(null);
//   const quantityRef = useRef(null);
//   const locationRef = useRef(null);
//   const lotRef = useRef(null);
//   const brandRef = useRef(null);
//   const searchRef = useRef(null);
//   const locationSearchRef = useRef(null);
//   const footerRef = useRef(null);
//   const productImageRef = useRef(null);
//   const labReportRef = useRef(null);

//   useEffect(() => {
//     setShowTable(false);
//     if (footerRef.current) footerRef.current.style.display = 'block';
//   }, []);

//   const resetForm = () => {
//     formRef.current.reset();
//     setEditProductId(null);
//     setEditingProduct(null);
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (editProductId) {
//     // Prepare product data as JSON for update
//     const productData = {
//       productName: nameRef.current.value.trim(),
//       purchaseRate: parseFloat(purchaseRateRef.current.value),
//       netWeightPerBag: parseFloat(netWeightRef.current.value),
//       quantityAvailableBags: parseInt(quantityRef.current.value),
//       location: locationRef.current.value.trim(),
//       lotNo: lotRef.current.value.trim(),
//       tradeMark: brandRef.current.value.trim(),
//       ratePerKgExCold: parseFloat(priceRef.current.value),
//       // add other fields if needed matching your Product model
//     };

//     try {
//       // const response = await fetch(`http://stock.caprestaindia.com/api/products/${editProductId}`, {
//       const response = await fetch(`http://localhost:8080/api/products/${editProductId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(productData)
//       });

//       if (response.ok) {
//         alert("✅ Product updated successfully!");
//         resetForm();  // Reset form and edit state
//         if (showTable) searchProduct();  // Reload product list if needed
//       } else {
//         const errorText = await response.text();
//         alert("❌ Failed to update product: " + errorText);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("❌ Could not connect to backend.");
//     }

//   } else {
//     // Your existing code for adding a new product (using FormData for image upload)
//     const formData = new FormData();
//     formData.append("productName", nameRef.current.value.trim());
//     formData.append("purchaseRate", parseFloat(purchaseRateRef.current.value));
//     formData.append("netWeightPerBag", parseFloat(netWeightRef.current.value));
//     formData.append("quantityAvailableBags", parseInt(quantityRef.current.value));
//     formData.append("location", locationRef.current.value.trim());
//     formData.append("lotNo", lotRef.current.value.trim());
//     formData.append("tradeMark", brandRef.current.value.trim());
//     formData.append("ratePerKgExCold", parseFloat(priceRef.current.value));

//     const productImageInput = productImageRef.current;
// const labReportInput = labReportRef.current;


//     if (productImageInput.files.length > 0) {
//       formData.append("viewProduct", productImageInput.files[0]);
//     }
//     if (labReportInput.files.length > 0) {
//       formData.append("labReport", labReportInput.files[0]);
//     }

//     try {
//       // const response = await fetch("http://stock.caprestaindia.com/api/products/add", {
//       const response = await fetch("http://localhost:8080/api/products/add", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         alert("✅ Product added successfully!");
//         resetForm();
//       } else {
//         const errorText = await response.text();
//         alert("❌ Failed to add product: " + errorText);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("❌ Could not connect to backend.");
//     }
//   }
// };



//   const searchProduct = async () => {
//     const term = searchRef.current.value.trim();
//     const selectedLocation = locationSearchRef.current.value.trim();
//     if (!term || !selectedLocation) {
//       alert("Please enter both product name and location.");
//       setShowTable(false);
//       return;
//     }
//     try {
//       const response = await fetch(
//         // `http://stock.caprestaindia.com/api/products/details/${encodeURIComponent(term)}/${encodeURIComponent(selectedLocation)}`
//         `http://localhost:8080/api/products/details/${encodeURIComponent(term)}/${encodeURIComponent(selectedLocation)}`
//       );

//       if (!response.ok) {
//         alert("❌ Product not found.");
//         setShowTable(false);
//         return;
//       }

//       const data = await response.json();

//       const enriched = data.map(p => ({
//         id: p.id,
//         name: p.productName,
//         brand: p.brandName,
//         quantity: p.stockQuantity,
//         netweight: p.netWeightPerBag,
//         location: p.location,
//         lot: p.lotNo,
//         price: p.ratePerKgExCold,
//         imageUrl: p.image ? `data:image/png;base64,${p.image}` : null,
//         labReport: p.labReport ? `data:application/pdf;base64,${p.labReport}` : null,
//         purchaseRate: p.purchaseRate,
//       }));

//       setVisibleData(enriched);
//       setShowTable(true);
//       if (footerRef.current) footerRef.current.style.display = 'none';
//     } catch (err) {
//       console.error("🔴 Search failed:", err);
//       alert("❌ Something went wrong while searching products.");
//       setShowTable(false);
//     }
//   };

//   // Edit product functionality
//   const onEditProduct = (product) => {
//     setEditProductId(product.id);
//     setEditingProduct(product);

//     // set refs' values
//     nameRef.current.value = product.name || "";
//     priceRef.current.value = product.price || "";
//     purchaseRateRef.current.value = product.purchaseRate || "";
//     netWeightRef.current.value = product.netweight || "";
//     quantityRef.current.value = product.quantity || "";
//     locationRef.current.value = product.location || "";
//     lotRef.current.value = product.lot || "";
//     brandRef.current.value = product.brand || "";
//     // Note: Image/LabReport uploads can't be auto-populated for security reasons
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const deleteProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       // const response = await fetch(`http://stock.caprestaindia.com/api/products/delete/${id}`, {
//       const response = await fetch(`http://localhost:8080/api/products/delete/${id}`, {
//         method: 'DELETE',
//       });
//       if (response.ok) {
//         alert("✅ Product deleted successfully");
//         setVisibleData(prev => prev.filter(p => p.id !== id));
//         if (editProductId === id) resetForm();
//       } else {
//         alert("❌ Failed to delete product");
//       }
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("❌ Server error");
//     }
//   };

//   function openImageInNewTab(base64DataUrl) {
//     try {
//       const parts = base64DataUrl.split(',');
//       const mimeType = parts[0].match(/:(.*?);/)[1];
//       const byteString = atob(parts[1]);
//       const byteNumbers = new Array(byteString.length);
//       for (let i = 0; i < byteString.length; i++) byteNumbers[i] = byteString.charCodeAt(i);
//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], { type: mimeType });
//       const blobUrl = URL.createObjectURL(blob);
//       window.open(blobUrl, '_blank');
//     } catch (err) {
//       console.error("Error opening image:", err);
//       alert("Could not open image");
//     }
//   }

//   function openPdfInNewTab(base64PdfDataUrl) {
//     try {
//       if (!base64PdfDataUrl || !base64PdfDataUrl.includes(',')) {
//         alert("Invalid or missing PDF data.");
//         return;
//       }
//       const parts = base64PdfDataUrl.split(',');
//       const mimeType = parts[0].match(/:(.*?);/)[1];
//       const base64Data = parts[1];
//       const byteString = atob(base64Data);
//       const byteArray = new Uint8Array([...byteString].map(char => char.charCodeAt(0)));
//       const blob = new Blob([byteArray], { type: mimeType });
//       const blobUrl = URL.createObjectURL(blob);
//       window.open(blobUrl, '_blank');
//     } catch (err) {
//       console.error("Error opening PDF:", err);
//       alert("Could not open lab report");
//     }
//   }

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault();
//       searchProduct();
//     }
//   };

//   const clearTableOnly = () => {
//     searchRef.current.value = '';
//     setVisibleData([]);
//     setShowTable(false);
//     resetForm();
//     if (locationSearchRef.current) locationSearchRef.current.selectedIndex = 0;
//     if (footerRef.current) footerRef.current.style.display = 'block';
//   };

//   return (
//     <div className="container">
//       <img src={logo} className="companyLG" alt="logo" />
//       <h1>CAPRESTA INDIA PVT.LTD</h1>
//       <h3>(Ready Stock Portal)</h3>
//       <div className="company-info">
//         <p><strong>CIN:</strong> <span>U51909MH2020PTC352852</span></p>
//         <p><strong>GSTIN:</strong> <span>27AAJCC2191E12R</span></p>
//         <p><strong>FSSAI:</strong> <span>11523998001026</span></p>
//       </div>
//       <div className="search-bar-row">
//         <div className="search-input-icon-wrapper">
//           <i className="fas fa-search"></i>
//           <input
//             list="product-options"
//             type="text"
//             id="search-input"
//             placeholder="Search Product..."
//             onKeyDown={handleKeyDown}
//             ref={searchRef}
//           />
//         </div>
//         <datalist id="product-options">
//           <option value="TURMERIC" />
//           <option value="CHILLI" />
//           <option value="CORIANDER" />
//           <option value="RAISINS" />
//         </datalist>
//         <button onClick={searchProduct} type="submit">Search</button>
//       </div>
//       <div className="search-location">
//         <label htmlFor="search-location">📍 Select Location:</label>
//         <select id="search-location" ref={locationSearchRef}>
//           <option value="" disabled selected>Select Location</option>
//           <option>Jaipur</option>
//           <option>Ahmedabad</option>
//           <option>Sangli</option>
//           <option>Mumbai</option>
//         </select>
//       </div>
//       <form id="product-form" ref={formRef} onSubmit={handleSubmit}>
//         <input type="text" ref={nameRef} placeholder="Product Name" required />
//         <input type="number" ref={priceRef} placeholder="Rate-Per Kg (Ex-Cold)" min="1" required />
//         <input type="number" ref={netWeightRef} placeholder="Net Weight (Per-Bag)" min="1" required />
//         <input type="number" ref={quantityRef} placeholder="Quantity (Available-Bags)" min="1" required />
//         <select ref={locationRef} required>
//           <option value="" disabled >Select Location</option>
//           <option>Jaipur</option>
//           <option>Ahmedabad</option>
//           <option>Sangli</option>
//           <option>Mumbai</option>
//         </select>
//         <input type="text" ref={lotRef} placeholder="Lot No (Cold-Storage)" required />
//         <select ref={brandRef} required>
//           <option value="" disabled selected>Trade Mark</option>
//           <option>If any</option>
//           <option>NIRALA</option>
//           <option>KABA</option>
//           <option>WINCI</option>
//           <option>BISARANI</option>
//         </select>
//         <input type="number" ref={purchaseRateRef} placeholder="Purchase Rate" required />
//         <label htmlFor="productImage">Add Product Image :</label>
//         <input type="file" id="productImage" accept="image/*" ref={productImageRef}/>
//         <label htmlFor="labReport">Add Lab Report :</label>
//         <input type="file" id="labReport" accept=".pdf,.doc,.docx,image/*" ref={labReportRef} />
//         <button type="submit">{editProductId ? "Update Product" : "Add Product"}</button>
//         {editProductId && (
//           <button type="button" style={{marginLeft:8}} onClick={resetForm}>Cancel</button>
//         )}
//       </form>
//       <div className="clear-btn-wrapper">
//         <button onClick={clearTableOnly} id="clear-btn">Clear</button>
//       </div>
//       {showTable && (
//         <div className="table-wrapper">
//           <table>
//             <thead>
//               <tr>
//                 <th>Product Name</th>
//                 <th>Trade-Mark</th>
//                 <th>Quantity (Available-Bags)</th>
//                 <th>Net Weight (Per-Bag)</th>
//                 <th>Location</th>
//                 <th>Lot No</th>
//                 <th>Rate-Per Kg (Ex-Cold)</th>
//                 <th>view product</th>
//                 <th>Lab-report</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleData.length === 0 ? (
//                 <tr className="no-result-row">
//                   <td colSpan="10">Products are not available!</td>
//                 </tr>
//               ) : (
//                 visibleData.map((p, index) => (
//                   <tr key={index}>
//                     <td>{p.name}</td>
//                     <td>{p.brand || '-'}</td>
//                     <td>{p.quantity}</td>
//                     <td>{p.netweight}</td>
//                     <td>{p.location}</td>
//                     <td>{p.lot}</td>
//                     <td className="p-color">₹{p.price}</td>
//                     <td>
//                       {p.imageUrl ? (
//                         <a href="#" onClick={(e) => { e.preventDefault(); openImageInNewTab(p.imageUrl); }}>
//                           View Product
//                         </a>
//                       ) : (
//                         "No Image"
//                       )}
//                     </td>
//                     <td>
//                       {p.labReport ? (
//                         <a href="#" onClick={(e) => { e.preventDefault(); openPdfInNewTab(p.labReport); }}>
//                           View Report
//                         </a>
//                       ) : (
//                         'Not available'
//                       )}
//                     </td>
//                     <td className="actions">
//                       <button className="edit" onClick={() => onEditProduct(p)}>Edit</button>
//                       <button className="delete" onClick={() => deleteProduct(p.id)}>Delete</button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//       <div className="footer" id="footer-section" ref={footerRef}>
//         <h3>Thanks For Your Interest !</h3>
//         <h4>For More Info Where We Can Help Your Business Join Our Free Consultation .</h4>
//         <p>Contact : 08793712082</p>
//         <a href="mailto:capresta@yahoo.com">Reach us at : capresta@yahoo.com</a>
//         <strong><a href="https://www.facebook.com/share/15jH3iS9m8/"><i className="fa-brands fa-square-facebook"></i></a></strong>
//         <strong><a href="https://www.instagram.com/capresta.in?igsh=eTd1MXRvYXpkYXNj"><i className="fa-brands fa-square-instagram"></i></a></strong>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import logo from '../assets/Company-Logo.png';

function App() {
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('products')) || []);
  const [visibleData, setVisibleData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const formRef = useRef(null);
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const purchaseRateRef = useRef(null);
  const netWeightRef = useRef(null);
  const quantityRef = useRef(null);
  const locationRef = useRef(null);
  const lotRef = useRef(null);
  const brandRef = useRef(null);
  const searchRef = useRef(null);
  const locationSearchRef = useRef(null);
  const footerRef = useRef(null);
  const productImageRef = useRef(null);
  const labReportRef = useRef(null);
  

  useEffect(() => {
    setShowTable(false);
    if (footerRef.current) footerRef.current.style.display = 'block';
  }, []);

  const resetForm = () => {
    formRef.current.reset();
    setEditProductId(null);
    setEditingProduct(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (editProductId) {
    const formData = new FormData();
    formData.append("productName", nameRef.current.value.trim());
    formData.append("purchaseRate", parseFloat(purchaseRateRef.current.value));
    formData.append("netWeightPerBag", parseFloat(netWeightRef.current.value));
    formData.append("quantityAvailableBags", parseInt(quantityRef.current.value));
    formData.append("location", locationRef.current.value.trim());
    formData.append("lotNo", lotRef.current.value.trim());
    formData.append("tradeMark", brandRef.current.value.trim());
    formData.append("ratePerKgExCold", parseFloat(priceRef.current.value));

    if (productImageRef.current.files.length > 0) {
      formData.append("viewProduct", productImageRef.current.files[0]);
    }
    if (labReportRef.current.files.length > 0) {
      formData.append("labReport", labReportRef.current.files[0]);
    }

    try {
      // const response = await fetch(`http://stock.caprestaindia.com/api/products/${editProductId}`, {
      const response = await fetch(`http://localhost:8080/api/products/${editProductId}`, {
        method: "PUT",
        body: formData, // No 'Content-Type' header manually set!
      });

      if (response.ok) {
        alert("✅ Product updated successfully!");
        resetForm();
        if (showTable) searchProduct();
      } else {
        const errorText = await response.text();
        alert("❌ Failed to update product: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Could not connect to backend.");
    }
  } else {
    const formData = new FormData();
    formData.append("productName", nameRef.current.value.trim());
    formData.append("purchaseRate", parseFloat(purchaseRateRef.current.value));
    formData.append("netWeightPerBag", parseFloat(netWeightRef.current.value));
    formData.append("quantityAvailableBags", parseInt(quantityRef.current.value));
    formData.append("location", locationRef.current.value.trim());
    formData.append("lotNo", lotRef.current.value.trim());
    formData.append("tradeMark", brandRef.current.value.trim());
    formData.append("ratePerKgExCold", parseFloat(priceRef.current.value));

    const productImageInput = productImageRef.current;
const labReportInput = labReportRef.current;


    if (productImageInput.files.length > 0) {
      formData.append("viewProduct", productImageInput.files[0]);
    }
    if (labReportInput.files.length > 0) {
      formData.append("labReport", labReportInput.files[0]);
    }

    try {
      // const response = await fetch("http://stock.caprestaindia.com/api/products/add", {
      const response = await fetch("http://localhost:8080/api/products/add", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Product added successfully!");
        resetForm();
      } else {
        const errorText = await response.text();
        alert("❌ Failed to add product: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Could not connect to backend.");
    }
  }
  
};


  const searchProduct = async () => {
    const term = searchRef.current.value.trim();
    const selectedLocation = locationSearchRef.current.value.trim();
    if (!term || !selectedLocation) {
      alert("Please enter both product name and location.");
      setShowTable(false);
      return;
    }
    try {
      const response = await fetch(
        // `http://stock.caprestaindia.com/api/products/details/${encodeURIComponent(term)}/${encodeURIComponent(selectedLocation)}`
        `http://localhost:8080/api/products/details/${encodeURIComponent(term)}/${encodeURIComponent(selectedLocation)}`
      );

      if (!response.ok) {
        alert("❌ Product not found.");
        setShowTable(false);
        return;
      }

      const data = await response.json();

      const enriched = data.map(p => ({
        id: p.id,
        name: p.productName,
        brand: p.brandName,
        quantity: p.stockQuantity,
        netweight: p.netWeightPerBag,
        location: p.location,
        lot: p.lotNo,
        price: p.ratePerKgExCold,
        imageUrl: p.image ? `data:image/png;base64,${p.image}` : null,
        labReport: p.labReport ? `data:application/pdf;base64,${p.labReport}` : null,
        purchaseRate: p.purchaseRate,
      }));

      setVisibleData(enriched);
      setShowTable(true);
      if (footerRef.current) footerRef.current.style.display = 'none';
    } catch (err) {
      console.error("🔴 Search failed:", err);
      alert("❌ Something went wrong while searching products.");
      setShowTable(false);
    }
  };

  // Edit product functionality
  const onEditProduct = (product) => {
    setEditProductId(product.id);
    setEditingProduct(product);

    // set refs' values
    nameRef.current.value = product.name || "";
    priceRef.current.value = product.price || "";
    purchaseRateRef.current.value = product.purchaseRate || "";
    netWeightRef.current.value = product.netweight || "";
    quantityRef.current.value = product.quantity || "";
    locationRef.current.value = product.location || "";
    lotRef.current.value = product.lot || "";
    brandRef.current.value = product.brand || "";
    // Note: Image/LabReport uploads can't be auto-populated for security reasons
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      // const response = await fetch(`http://stock.caprestaindia.com/api/products/delete/${id}`, {
      const response = await fetch(`http://localhost:8080/api/products/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("✅ Product deleted successfully");
        setVisibleData(prev => prev.filter(p => p.id !== id));
        if (editProductId === id) resetForm();
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Server error");
    }
  };

  // Safer open image helper with a check on input format
  function openImageInNewTab(base64DataUrl) {
    try {
      if (!base64DataUrl || !base64DataUrl.includes(',')) {
        alert("Invalid or missing image data.");
        return;
      }
      const parts = base64DataUrl.split(',');
      const mimeType = parts[0].match(/:(.*?);/)[1];
      const byteString = atob(parts[1]);
      const byteNumbers = new Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) byteNumbers[i] = byteString.charCodeAt(i);
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
      const mimeType = parts[0].match(/:(.*?);/)[1];
      const base64Data = parts[1];
      const byteString = atob(base64Data);
      const byteArray = new Uint8Array([...byteString].map(char => char.charCodeAt(0)));
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error("Error opening PDF:", err);
      alert("Could not open lab report");
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchProduct();
    }
  };

  const clearTableOnly = () => {
    searchRef.current.value = '';
    setVisibleData([]);
    setShowTable(false);
    resetForm();
    if (locationSearchRef.current) locationSearchRef.current.selectedIndex = 0;
    if (footerRef.current) footerRef.current.style.display = 'block';
  };

  return (
    <div className="container">
      <img src={logo} className="companyLG" alt="logo" />
      <h1>CAPRESTA INDIA PVT.LTD</h1>
      <h3>(Ready Stock Portal)</h3>
      <div className="company-info">
        <p><strong>CIN:</strong> <span>U51909MH2020PTC352852</span></p>
        <p><strong>GSTIN:</strong> <span>27AAJCC2191E12R</span></p>
        <p><strong>FSSAI:</strong> <span>11523998001026</span></p>
      </div>
      <div className="search-bar-row">
        <div className="search-input-icon-wrapper">
          <i className="fas fa-search"></i>
          <input
            list="product-options"
            type="text"
            id="search-input"
            placeholder="Search Product..."
            onKeyDown={handleKeyDown}
            ref={searchRef}
          />
        </div>
        <datalist id="product-options">
          <option value="TURMERIC" />
          <option value="CHILLI" />
          <option value="CORIANDER" />
          <option value="RAISINS" />
        </datalist>
        <button onClick={searchProduct} type="submit">Search</button>
      </div>
      <div className="search-location">
        <label htmlFor="search-location">📍 Select Location:</label>
        <select id="search-location" ref={locationSearchRef} defaultValue="">
          <option value="" disabled>Select Location</option>
          <option>Jaipur</option>
          <option>Ahmedabad</option>
          <option>Sangli</option>
          <option>Mumbai</option>
        </select>
      </div>
      <form id="product-form" ref={formRef} onSubmit={handleSubmit}>
        <input type="text" ref={nameRef} placeholder="Product Name" required />
        <input type="number" ref={priceRef} placeholder="Rate-Per Kg (Ex-Cold)" min="1" required />
        <input type="number" ref={netWeightRef} placeholder="Net Weight (Per-Bag)" min="1" required />
        <input type="number" ref={quantityRef} placeholder="Quantity (Available-Bags)" min="1" required />
        <select ref={locationRef} required defaultValue="">
          <option value="" disabled>Select Location</option>
          <option>Jaipur</option>
          <option>Ahmedabad</option>
          <option>Sangli</option>
          <option>Mumbai</option>
        </select>
        <input type="text" ref={lotRef} placeholder="Lot No (Cold-Storage)" required />
        <select ref={brandRef} required defaultValue="">
          <option value="" disabled>Trade Mark</option>
          <option>If any</option>
          <option>NIRALA</option>
          <option>KABA</option>
          <option>WINCI</option>
          <option>BISARANI</option>
        </select>
        <input type="number" ref={purchaseRateRef} placeholder="Purchase Rate" required />
        <label htmlFor="productImage">Add Product Image :</label>
        <input type="file" id="productImage" accept="image,.png,.jpeg" ref={productImageRef} />
        <label htmlFor="labReport">Add Lab Report :</label>
        <input type="file" id="labReport" accept=".pdf,.doc,.docx,image/*" ref={labReportRef} />
        <button type="submit">{editProductId ? "Update Product" : "Add Product"}</button>
        {editProductId && (
          <button type="button" style={{ marginLeft: 8 }} onClick={resetForm}>Cancel</button>
        )}
      </form>
      <div className="clear-btn-wrapper">
        <button onClick={clearTableOnly} id="clear-btn">Clear</button>
      </div>
      {showTable && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Trade-Mark</th>
                <th>Quantity (Available-Bags)</th>
                <th>Net Weight (Per-Bag)</th>
                <th>Location</th>
                <th>Lot No</th>
                <th>Rate-Per Kg (Ex-Cold)</th>
                <th>view product</th>
                <th>Lab-report</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleData.length === 0 ? (
                <tr className="no-result-row">
                  <td colSpan="10">Products are not available!</td>
                </tr>
              ) : (
                visibleData.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.brand || '-'}</td>
                    <td>{p.quantity}</td>
                    <td>{p.netweight}</td>
                    <td>{p.location}</td>
                    <td>{p.lot}</td>
                    <td className="p-color">₹{p.price}</td>
                    <td>
                      {p.imageUrl ? (
                        <a href="#" onClick={(e) => { e.preventDefault(); openImageInNewTab(p.imageUrl); }}>
                          View Product
                        </a>
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      {p.labReport ? (
                        <a href="#" onClick={(e) => { e.preventDefault(); openPdfInNewTab(p.labReport); }}>
                          View Report
                        </a>
                      ) : (
                        'Not available'
                      )}
                    </td>
                    <td className="actions">
                      <button className="edit" onClick={() => onEditProduct(p)}>Edit</button>
                      <button className="delete" onClick={() => deleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="footer" id="footer-section" ref={footerRef}>
        <h3>Thanks For Your Interest !</h3>
        <h4>For More Info Where We Can Help Your Business Join Our Free Consultation .</h4>
        <p>Contact : 08793712082</p>
        <a href="mailto:capresta@yahoo.com">Reach us at : capresta@yahoo.com</a>
        <strong><a href="https://www.facebook.com/share/15jH3iS9m8/"><i className="fa-brands fa-square-facebook"></i></a></strong>
        <strong><a href="https://www.instagram.com/capresta.in?igsh=eTd1MXRvYXpkYXNj"><i className="fa-brands fa-square-instagram"></i></a></strong>
      </div>
    </div>
  );
}

export default App;
