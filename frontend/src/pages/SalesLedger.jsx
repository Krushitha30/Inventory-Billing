import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Invoice from "../components/Invoice";
import API_URL from "../apiConfig";

function SalesLedger() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [printingSale, setPrintingSale] = useState(null);
  
  const invoiceRef = useRef();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const res = await axios.get(`${API_URL}/api/sales`);
    // Sort so newest are first
    const sorted = res.data.sort((a,b) => new Date(b.date) - new Date(a.date));
    setSales(sorted);
  };

  const filteredSales = sales.filter(s => 
    s.customerName.toLowerCase().includes(search.toLowerCase()) || 
    s.invoiceNumber.toString().includes(search)
  );

  const triggerPrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice_${printingSale?.invoiceNumber || "History"}`,
  });

  const handleReprint = (sale) => {
    setPrintingSale(sale);
    setTimeout(() => {
      triggerPrint();
    }, 100);
  };

  return (
    <div className="dark:text-gray-200 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Sales Ledger & History</h2>

      <input 
        placeholder="Search by Customer or Invoice #..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-colors" 
      />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Invoice #</th>
              <th className="py-3 px-6">Customer</th>
              <th className="py-3 px-6 text-center">Items</th>
              <th className="py-3 px-6 font-bold text-green-600 dark:text-green-400">Total (₹)</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
            {filteredSales.map(s => (
              <tr key={s._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="py-3 px-6">{new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString()}</td>
                <td className="py-3 px-6 font-mono text-blue-500">INV-{s.invoiceNumber}</td>
                <td className="py-3 px-6 font-bold">{s.customerName}</td>
                <td className="py-3 px-6 text-center">{s.items.length} units</td>
                <td className="py-3 px-6 font-bold text-green-600 dark:text-green-400">₹{s.total.toFixed(2)}</td>
                <td className="py-3 px-6 text-center border-l dark:border-gray-700">
                  <button 
                    onClick={() => handleReprint(s)}
                    className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 px-4 py-1 rounded-full font-semibold transition shadow-sm"
                  >
                    Reprint PDF
                  </button>
                </td>
              </tr>
            ))}
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500 text-lg">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hidden Invoice Component for backend rendering */}
      <div className="hidden">
        {printingSale && (
          <Invoice 
            ref={invoiceRef}
            customerName={printingSale.customerName}
            items={printingSale.items}
            subtotal={printingSale.subtotal}
            gst={printingSale.gst}
            total={printingSale.total}
            invoiceNumber={printingSale.invoiceNumber}
          />
        )}
      </div>
    </div>
  );
}

export default SalesLedger;
