import React, { forwardRef } from 'react';

const Invoice = forwardRef(({ customerName, items, subtotal, gst, total, invoiceNumber }, ref) => {
  const date = new Date().toLocaleDateString();

  return (
    <div ref={ref} className="p-10 bg-white" style={{ width: '210mm', minHeight: '297mm', color: 'black', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-wider">INVOICE</h1>
          <p className="text-gray-500 mt-2 font-mono">Invoice #: INV-{invoiceNumber}</p>
          <p className="text-gray-500">Date: {date}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">My Inventory Co.</h2>
          <p className="text-gray-500">123 Business Road</p>
          <p className="text-gray-500">Tech City, TX 75001</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-gray-500 font-semibold mb-2 uppercase tracking-wide text-sm">Bill To:</h3>
        <p className="text-xl font-bold text-gray-800">{customerName || "Walk-in Customer"}</p>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-gray-600 text-sm uppercase tracking-wide">
            <th className="py-3 px-2">Item Description</th>
            <th className="py-3 text-center">Qty</th>
            <th className="py-3 text-right">Price</th>
            <th className="py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-4 px-2 text-gray-800 font-medium">{item.name}</td>
              <td className="py-4 text-center text-gray-600">{item.qty}</td>
              <td className="py-4 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
              <td className="py-4 text-right text-gray-800 font-medium">₹{(item.price * item.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between py-2 text-gray-600 border-b">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-gray-600 border-b">
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4 mt-2 text-2xl font-bold text-gray-800 border-t-2 border-gray-800 bg-gray-50 px-2 rounded">
            <span>Total Due</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-gray-400 text-sm border-t pt-8">
        <p className="font-semibold mb-1">Thank you for your business!</p>
        <p>If you have any questions about this invoice, please contact support@myinventory.com</p>
      </div>
    </div>
  );
});

export default Invoice;
