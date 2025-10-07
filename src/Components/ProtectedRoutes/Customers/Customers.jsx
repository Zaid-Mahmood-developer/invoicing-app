import React, { useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([
    {
      name: "Ali Traders",
      ntnCnic: "35202-1234567-8",
      address: "Karachi, Sindh",
      contact: "0300-1234567",
      product: "Cotton Fabric",
    },
    {
      name: "Style Line",
      ntnCnic: "42101-9876543-2",
      address: "Lahore, Punjab",
      contact: "0321-7654321",
      product: "Ladies Tops",
    },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    ntnCnic: "",
    address: "",
    contact: "",
    product: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Add New Customer
  const addCustomer = () => {
    if (
      !newCustomer.name ||
      !newCustomer.ntnCnic ||
      !newCustomer.address ||
      !newCustomer.contact
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    setCustomers([...customers, newCustomer]);
    setNewCustomer({
      name: "",
      ntnCnic: "",
      address: "",
      contact: "",
      product: "",
    });
  };

  // Delete Customer
  const deleteCustomer = (index) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const updated = [...customers];
      updated.splice(index, 1);
      setCustomers(updated);
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">👤 Customer Management</h2>

      <div className="form-section">
        <h3>Add New Customer</h3>
        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={newCustomer.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ntnCnic"
            placeholder="Customer NTN / CNIC"
            value={newCustomer.ntnCnic}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newCustomer.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact No."
            value={newCustomer.contact}
            onChange={handleChange}
          />
          <input
            type="text"
            name="product"
            placeholder="Preferred Product"
            value={newCustomer.product}
            onChange={handleChange}
          />
        </div>

        <button className="btn" onClick={addCustomer}>
          ➕ Add Customer
        </button>
      </div>

      <div className="grid-section">
        <h3>Existing Customers</h3>
        <table className="data-grid">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>NTN / CNIC</th>
              <th>Address</th>
              <th>Contact No.</th>
              <th>Preferred Product</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{cust.name}</td>
                <td>{cust.ntnCnic}</td>
                <td>{cust.address}</td>
                <td>{cust.contact}</td>
                <td>{cust.product}</td>
                <td>
                  <button
                    className="btn danger small"
                    onClick={() => deleteCustomer(index)}
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
