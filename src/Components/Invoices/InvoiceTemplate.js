 const invoiceData = {
    number: "INV-280324-0072",
    invoiceDate: "28/03/2024",
    dueDate: "28/03/2024",
    customerCode: "CUST123",
    fbrPosId: "932940",
    from: {
      name: "Demo Company",
      address: "Islamabad",
      phone: "051-8351907",
      email: "info@tier3.pk",
      ntn: "1234567"
    },
    to: {
      name: "FBR GST Customer",
      address: "Lahore",
      ntn: "1234567"
    },
    items: [
      {
        description: "Apple iPhone",
        gst: "25%",
        unitPrice: "8000",
        qty: 1,
        unit: "U",
        totalExcl: "8000",
        totalIncl: "10000"
      }
    ],
    summary: {
      totalExcl: "8254.24",
      gst25: "2000",
      gst18: "254.24",
      fed: "17",
      totalIncl: "10328.84"
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const html = document.getElementById("invoice").innerHTML;

    printWindow.document.write(`
      <html>
      <head><title>Invoice</title></head>
      <body>${html}
        <script>window.onload = () => window.print();<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  export {invoiceData , handlePrint}