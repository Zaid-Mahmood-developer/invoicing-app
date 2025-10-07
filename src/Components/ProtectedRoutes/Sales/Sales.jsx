import { useState } from "react";

const Sales = () => {
  
      // 🎤 Voice State
    const [isListening, setIsListening] = useState(false);
    const [spokenText, setSpokenText] = useState("");
    // ✅ Add these at the top, with other useState hooks
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);


    // Buyers list
    const buyers = [
        {
            ntn: "1000000000000",
            businessName: "FERTILIZER MANUFAC IRS NEW",
            province: "Sindh",
            address: "Karachi",
            registrationType: "Registered",
        },
        {
            ntn: "2000000000000",
            businessName: "ABC TRADERS",
            province: "Punjab",
            address: "Lahore",
            registrationType: "Registered",
        },
    ];

    const [invoice, setInvoice] = useState({
        invoiceType: "Sale Invoice",
        invoiceDate: "2025-04-21",
        sellerBusinessName: "Company 8",
        sellerProvince: "Sindh",
        sellerAddress: "Karachi",
        sellerNTNCNIC: "3520265288809",
        buyerNTNCNIC: "",
        buyerBusinessName: "",
        buyerProvince: "",
        buyerAddress: "",
        buyerRegistrationType: "",
        invoiceRefNo: "",
        scenarioId: "SN001",
        items: [],
    });

    const [newItem, setNewItem] = useState({
        hsCode: "",
        productDescription: "",
        rate: "18%",
        uoM: "Numbers, pieces, units",
        quantity: 1,
        totalValues: 0,
        valueSalesExcludingST: 0,
        salesTaxApplicable: 18,
        furtherTax: 0,
    });

    // 🎤 Voice Recognition
    const startListening = () => {
        const recognition = new (window.SpeechRecognition ||
            window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setSpokenText(text);
            handleVoiceCommand(text);
        };

        recognition.onend = () => setIsListening(false);
    };

    // 🧠 Voice Command
    const handleVoiceCommand = (text) => {
        const regex =
            /invoice to\s+(.+?)\s+for\s+(\d+)\s+(\w+)\s+(?:at|at the rate of)\s+(\d+)/i;
        const match = text.match(regex);

        if (match) {
            const buyerName = match[1].trim();
            const quantity = parseInt(match[2]);
            const product = match[3].trim();
            const rate = parseInt(match[4]);

            const selectedBuyer = buyers.find(
                (b) =>
                    b.businessName.toLowerCase().includes(buyerName.toLowerCase()) ||
                    buyerName.toLowerCase().includes(b.businessName.toLowerCase())
            );

            if (selectedBuyer) {
                setInvoice((prev) => ({
                    ...prev,
                    buyerNTNCNIC: selectedBuyer.ntn,
                    buyerBusinessName: selectedBuyer.businessName,
                    buyerProvince: selectedBuyer.province,
                    buyerAddress: selectedBuyer.address,
                    buyerRegistrationType: selectedBuyer.registrationType,
                }));
            }

            const item = {
                ...newItem,
                productDescription: product,
                quantity,
                valueSalesExcludingST: rate,
                salesTaxApplicable: 18,
            };

            setInvoice((prev) => ({ ...prev, items: [...prev.items, item] }));

            window.alert(
                `✅ Invoice data captured:\nBuyer: ${buyerName}\nItem: ${product}\nQty: ${quantity}\nRate: ${rate}`
            );
        } else {
            window.alert("⚠️ Could not understand voice command. Try again clearly.");
        }
    };

    // 🧾 Buyer select
    const handleBuyerChange = (e) => {
        const selected = buyers.find((b) => b.businessName === e.target.value);
        if (selected) {
            setInvoice((prev) => ({
                ...prev,
                buyerNTNCNIC: selected.ntn,
                buyerBusinessName: selected.businessName,
                buyerProvince: selected.province,
                buyerAddress: selected.address,
                buyerRegistrationType: selected.registrationType,
            }));
        } else {
            setInvoice((prev) => ({
                ...prev,
                buyerNTNCNIC: "",
                buyerBusinessName: "",
                buyerProvince: "",
                buyerAddress: "",
                buyerRegistrationType: "",
            }));
        }
    };

    // 💡 Format HS Code ####.####
    const formatHSCode = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 8);
        return cleaned.replace(/(\d{4})(\d{0,4})/, (_, a, b) =>
            b ? `${a}.${b}` : a
        );
    };

    // ➕ Add Item
    const addItem = () => {
        const qty = Number(newItem.quantity) || 0;
        const value = Number(newItem.valueSalesExcludingST) || 0;
        const taxRate = Number(newItem.salesTaxApplicable) || 0;
        const further = Number(newItem.furtherTax) || 0;

        const base = qty * value;
        const totalValues = base + (base * (taxRate + further)) / 100;

        const itemToAdd = {
            ...newItem,
            hsCode: formatHSCode(newItem.hsCode),
            quantity: qty,
            valueSalesExcludingST: value,
            salesTaxApplicable: taxRate,
            furtherTax: further,
            totalValues,
        };

        setInvoice((prev) => ({ ...prev, items: [...prev.items, itemToAdd] }));

        // reset new item
        setNewItem({
            hsCode: "",
            productDescription: "",
            rate: "18%",
            uoM: "Numbers, pieces, units",
            quantity: 1,
            totalValues: 0,
            valueSalesExcludingST: 0,
            salesTaxApplicable: 18,
            furtherTax: 0,
        });
    };

    // 🧮 Compute Total Amounts
    const computeItemTotal = (it) => {
        const qty = Number(it.quantity) || 0;
        const value = Number(it.valueSalesExcludingST) || 0;
        const taxRate = Number(it.salesTaxApplicable) || 0;
        const further = Number(it.furtherTax) || 0;

        const base = qty * value;
        const taxAmount = (base * taxRate) / 100;
        const furtherAmount = (base * further) / 100;
        const grand = base + taxAmount + furtherAmount;
        return { base, taxAmount, furtherAmount, grand };
    };

    // 🔁 Reset Invoice
    const resetInvoice = () => {
        if (window.confirm("Are you sure you want to reset the invoice?")) {
            setInvoice({
                invoiceType: "Sale Invoice",
                invoiceDate: "2025-04-21",
                sellerBusinessName: "Company 8",
                sellerProvince: "Sindh",
                sellerAddress: "Karachi",
                sellerNTNCNIC: "3520265288809",
                buyerNTNCNIC: "",
                buyerBusinessName: "",
                buyerProvince: "",
                buyerAddress: "",
                buyerRegistrationType: "",
                invoiceRefNo: "",
                scenarioId: "SN001",
                items: [],
            });
            setNewItem({
                hsCode: "",
                productDescription: "",
                rate: "18%",
                uoM: "Numbers, pieces, units",
                quantity: 1,
                totalValues: 0,
                valueSalesExcludingST: 0,
                salesTaxApplicable: 18,
                furtherTax: 0,
            });
            setSpokenText("");
            window.alert("🧹 Invoice has been reset successfully!");
        }
    };

    const handleSubmit = async () => {
        const finalInvoice = { ...invoice };
        if (!finalInvoice.buyerBusinessName) {
            window.alert("❌ Please select a buyer before submitting.");
            return;
        }
        if (finalInvoice.items.length === 0) {
            window.alert("❌ Please add at least one item.");
            return;
        }

        // Update totals before submitting
        finalInvoice.items = finalInvoice.items.map((it) => {
            const { grand } = computeItemTotal(it);
            return { ...it, totalValues: grand };
        });

        try {
            const response = await fetch(
                "https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "43fa0084-0b0f-3437-a362-662aa46f89a1",
                    },
                    body: JSON.stringify(finalInvoice),
                }
            );

            if (response.ok) {
                const data = await response.json();
                window.alert(
                    "✅ Invoice submitted successfully!\n\n" +
                    JSON.stringify(data, null, 2)
                );
            } else {
                const errorText = await response.text();
                window.alert("❌ Invoice submission failed: " + errorText);
            }
        } catch (err) {
            window.alert("⚠️ Error while submitting: " + err.message);
        }
    };

    // 🧾 Calculate grand total for all items
    const grandTotal = invoice.items.reduce(
        (sum, it) => sum + computeItemTotal(it).grand,
        0
    )
  return (
        <div className="container">
            <h1 className="title">🧾 FBR Invoice Integration</h1>

            {/* 🎤 Voice Input */}
            <div className="voice-section">
                <button onClick={startListening} className="btn small">
                    🎙️ {isListening ? "Listening..." : "Speak to Fill Invoice"}
                </button>
                {spokenText && <p>You said: {spokenText}</p>}
            </div>

            {/* Buyer Info */}
            <div className="seller-buyer-wrapper">
                <div className="card seller">
                    <h2>Seller Information</h2>
                    <p>
                        <strong>Business:</strong> {invoice.sellerBusinessName}
                    </p>
                    <p>
                        <strong>Province:</strong> {invoice.sellerProvince}
                    </p>
                    <p>
                        <strong>Address:</strong> {invoice.sellerAddress}
                    </p>
                </div>

                <div className="card buyer">
                    <h2>Buyer Information</h2>
                    <div className="form-inline">
                        <div className="form-group small-field">
                            <label>Business Name</label>
                            <select
                                value={invoice.buyerBusinessName}
                                onChange={handleBuyerChange}
                            >
                                <option value="">-- Select Buyer --</option>
                                {buyers.map((b) => (
                                    <option key={b.ntn} value={b.businessName}>
                                        {b.businessName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group small-field">
                            <label>NTN / CNIC</label>
                            <input
                                type="text"
                                value={invoice.buyerNTNCNIC}
                                readOnly
                            />
                        </div>
                        <div className="form-group small-field">
                            <label>Address</label>
                            <input
                                type="text"
                                value={invoice.buyerAddress}
                                readOnly
                            />
                        </div>
                        <div className="form-group small-field">
                            <label>Province</label>
                            <select
                                value={invoice.buyerProvince}
                                onChange={(e) =>
                                    setInvoice({
                                        ...invoice,
                                        buyerProvince: e.target.value,
                                    })
                                }
                            >
                                <option value="">-- Select Province --</option>
                                <option value="Khyber Pakhtunkhua">
                                    Khyber Pakhtunkhua
                                </option>
                                <option value="Punjab">Punjab</option>
                                <option value="Balochistan">Balochistan</option>
                                <option value="Sind">Sind</option>
                                <option value="Gilgit Baltistan">
                                    Gilgit Baltistan
                                </option>
                                <option value="FATA">FATA</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Item */}
            <div className="card item">
                <h2>Add Item</h2>
                <div className="item-form-grid">
                    <div className="form-group">
                        <label>HS Code</label>
                        <input
                            type="text"
                            value={newItem.hsCode}
                            onChange={(e) =>
                                setNewItem({
                                    ...newItem,
                                    hsCode: formatHSCode(e.target.value),
                                })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            value={newItem.productDescription}
                            onChange={(e) =>
                                setNewItem({
                                    ...newItem,
                                    productDescription: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            value={newItem.quantity}
                            onChange={(e) =>
                                setNewItem({ ...newItem, quantity: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Value (Excl. ST)</label>
                        <input
                            type="number"
                            value={newItem.valueSalesExcludingST}
                            onChange={(e) =>
                                setNewItem({
                                    ...newItem,
                                    valueSalesExcludingST: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Sales Tax (%)</label>
                        <input
                            type="number"
                            value={newItem.salesTaxApplicable}
                            onChange={(e) =>
                                setNewItem({
                                    ...newItem,
                                    salesTaxApplicable: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Further Tax (%)</label>
                        <input
                            type="number"
                            value={newItem.furtherTax}
                            onChange={(e) =>
                                setNewItem({ ...newItem, furtherTax: e.target.value })
                            }
                        />
                    </div>
                </div>
                <button type="button" className="btn small" onClick={addItem}>
                    ➕ Add Item
                </button>
            </div>

            {/* Items */}
            {/* Items List */}
            {/* Items List */}
            <div className="card">
                <h2>Invoice Items</h2>

                {invoice.items.length === 0 ? (
                    <p>No items added yet.</p>
                ) : (
                    <>
                        <ul>
                            {invoice.items.map((it, index) => {
                                const qty = Number(it.quantity) || 0;
                                const value = Number(it.valueSalesExcludingST) || 0;
                                const st = Number(it.salesTaxApplicable) || 0;
                                const ft = Number(it.furtherTax) || 0;

                                const base = qty * value;
                                const total = base + (base * (st + ft)) / 100;

                                return (
                                    <li key={index}>
                                        {it.hsCode} | {it.productDescription} — Qty: {qty}
                                        , Value: {value.toLocaleString()} Rs, ST: {st}%,
                                        Further: {ft}% →{" "}
                                        <strong>
                                            Total: Rs.{" "}
                                            {total.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </strong>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* 🧾 Grand Total */}
                        <hr />
                        <h3 style={{ textAlign: "right", marginRight: "20px" }}>
                            Grand Total:{" "}
                            <strong
                                style={{ fontSize: "1.3rem", color: "#007bff" }}
                            >
                                Rs.{" "}
                                {invoice.items
                                    .reduce((sum, it) => {
                                        const qty = Number(it.quantity) || 0;
                                        const value =
                                            Number(it.valueSalesExcludingST) || 0;
                                        const st = Number(it.salesTaxApplicable) || 0;
                                        const ft = Number(it.furtherTax) || 0;
                                        const base = qty * value;
                                        const total = base + (base * (st + ft)) / 100;
                                        return sum + total;
                                    }, 0)
                                    .toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                            </strong>
                        </h3>
                    </>
                )}
            </div>

            <div
                style={{ display: "flex", gap: "10px", marginTop: "20px" }}
            >
                <button className="btn btn-primary" onClick={handleSubmit}>
                    🚀 Submit Invoice
                </button>

                <button className="btn btn-danger" onClick={resetInvoice}>
                    🔁 Reset Invoice
                </button>
            </div>
        </div>
  )
}

export default Sales
