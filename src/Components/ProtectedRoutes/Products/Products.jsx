import React, { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([
    // sample existing product
    {
      hsCode: "8471.3000",
      description: "Automatic Data Processing Machines",
      uom: "Numbers",
      taxType: "Goods at Standard Rates (Default)",
      qtyInHand: 10,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    hsCode: "",
    description: "",
    uom: "Numbers",
    taxType: "Goods at Standard Rates (Default)",
    qtyInHand: 0,
  });

  // Format HS Code ####.#### automatically
  const formatHSCode = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);
    return cleaned.replace(/(\d{4})(\d{0,4})/, (_, a, b) =>
      b ? `${a}.${b}` : a
    );
  };

  // Fetch description when HS code changes (debounced)
  useEffect(() => {
    const code = newProduct.hsCode;
    if (code && code.length === 9 && code.includes(".")) {
      // Example placeholder: fetch from HS/Tariff API
      const fetchDescription = async () => {
        try {
          // This is a placeholder URL — replace with a real API
          const resp = await fetch(`https://api.example.com/hs/${code}`);
          if (resp.ok) {
            const data = await resp.json();
            // Suppose data.description holds the product description
            setNewProduct((prev) => ({
              ...prev,
              description: data.description || "",
            }));
          } else {
            console.warn("HS description fetch failed:", resp.status);
          }
        } catch (err) {
          console.error("Error fetching HS description:", err);
        }
      };
      fetchDescription();
    }
  }, [newProduct.hsCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hsCode") {
      setNewProduct({ ...newProduct, hsCode: formatHSCode(value) });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const addProduct = () => {
    if (!newProduct.hsCode) {
      alert("Please enter HS Code.");
      return;
    }
    if (!newProduct.description) {
      alert("Please enter or fetch Product Description.");
      return;
    }
    if (newProduct.qtyInHand < 0) {
      alert("Quantity in hand cannot be negative.");
      return;
    }

    setProducts([...products, newProduct]);
    setNewProduct({
      hsCode: "",
      description: "",
      uom: "Numbers",
      taxType: "Goods at Standard Rates (Default)",
      qtyInHand: 0,
    });
  };

  const deleteProduct = (idx) => {
    if (window.confirm("Delete this product?")) {
      const arr = products.slice();
      arr.splice(idx, 1);
      setProducts(arr);
    }
  };

  const editProduct = (index) => {
  // Load the selected product data into the form fields
  const selectedProduct = products[index];

  setFormData({
    hsCode: selectedProduct.hsCode,
    description: selectedProduct.description,
    uom: selectedProduct.uom,
    salesTaxType: selectedProduct.salesTaxType,
    qtyInHand: selectedProduct.qtyInHand,
  });

  // Enable editing mode
  setIsEditing(true);
  setEditIndex(index);
};


  return (
    <div className="container">
      <h2 className="page-title">📦 Product Management</h2>

      <div className="form-section">
        <h3>Add / Edit Product</h3>
        <div className="form-grid">
          <input
            type="text"
            name="hsCode"
            placeholder="HS Code (####.####)"
            value={newProduct.hsCode}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Product Description"
            value={newProduct.description}
            onChange={handleChange}
            
          />
          <select name="uom" value={newProduct.uom} onChange={handleChange}>
            <option value="Numbers">Numbers</option>
            <option value="KG">KG</option>
            <option value="PKTs">PKTs</option>
          </select>
          <select
            name="taxType"
            value={newProduct.taxType}
            onChange={handleChange}
          >
            <option value="Goods at Standard Rates (Default)">
              Goods at Standard Rates (Default)
            </option>
            <option value="Goods at Reduced Rates">
              Goods at Reduced Rates
            </option>
            <option value="3rd Schedule Goods">3rd Schedule Goods</option>
          </select>
          <input
            type="number"
            name="qtyInHand"
            placeholder="Quantity in Hand"
            value={newProduct.qtyInHand}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                qtyInHand: Number(e.target.value),
              })
            }
          />
        </div>

        <button className="btn" onClick={addProduct}>
          ➕ Add Product
        </button>
      </div>

      <div className="grid-section">
        <h3>Existing Products</h3>
        <table className="data-grid">
          <thead>
            <tr>
              <th>#</th>
              <th>HS Code</th>
              <th>Description</th>
              <th>UoM</th>
              <th>Tax Type</th>
              <th>Qty In Hand</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{prod.hsCode}</td>
                <td>{prod.description}</td>
                <td>{prod.uom}</td>
                <td>{prod.taxType}</td>
                <td>{prod.qtyInHand}</td>
                <td>
                  <button
                    className="btn danger small"
                    onClick={() => editProduct(idx)}
                  >
                    🗑️ Edit
                  </button>
                  
                  
                  <button
                    className="btn danger small"
                    onClick={() => deleteProduct(idx)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
