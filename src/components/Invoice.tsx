import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface InvoiceProps {
    orderData: {
        orderId: string;
        items: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
        subTotal: number;
        tax: number;
        discount: number;
        total: number;
        paymentMethod: string;
        cashierName?: string;
        customerName?: string;
        date: Date;
    };
}

export default function Invoice({ orderData }: InvoiceProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Print Button - Hidden when printing */}
            <div className="mb-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg"
                >
                    🖨️ Print Invoice
                </button>
            </div>

            {/* Invoice */}
            <div className="bg-white text-black p-8 rounded-lg shadow-lg">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                    <h1 className="text-4xl font-bold mb-2">MGYPOS</h1>
                    <p className="text-sm text-gray-600">Modern Point of Sale System</p>
                    <p className="text-xs text-gray-500 mt-2">
                        123 Business Street, City, State 12345 | Phone: (555) 123-4567
                    </p>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                        <p className="font-semibold">Invoice #:</p>
                        <p className="text-gray-600">{orderData.orderId.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Date:</p>
                        <p className="text-gray-600">{format(orderData.date, 'PPP p')}</p>
                    </div>
                    {orderData.customerName && (
                        <div>
                            <p className="font-semibold">Customer:</p>
                            <p className="text-gray-600">{orderData.customerName}</p>
                        </div>
                    )}
                    <div className={orderData.customerName ? '' : 'col-span-2'}>
                        <p className="font-semibold">Cashier:</p>
                        <p className="text-gray-600">{orderData.cashierName || 'Staff'}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-6">
                    <thead>
                        <tr className="border-b-2 border-gray-800">
                            <th className="text-left py-2">Item</th>
                            <th className="text-center py-2">Qty</th>
                            <th className="text-right py-2">Price</th>
                            <th className="text-right py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderData.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-3">{item.name}</td>
                                <td className="text-center py-3">{item.quantity}</td>
                                <td className="text-right py-3">{formatCurrency(item.price)}</td>
                                <td className="text-right py-3 font-semibold">
                                    {formatCurrency(item.price * item.quantity)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="border-t-2 border-gray-800 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(orderData.subTotal)}</span>
                    </div>
                    {orderData.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Discount:</span>
                            <span>-{formatCurrency(orderData.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span>Tax (10%):</span>
                        <span>{formatCurrency(orderData.tax)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t-2 border-gray-800 pt-2 mt-2">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(orderData.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-4">
                        <span>Payment Method:</span>
                        <span className="font-semibold">{orderData.paymentMethod}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
                    <p className="mb-2">Thank you for your business!</p>
                    <p className="text-xs">This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-invoice,
          .print-invoice * {
            visibility: visible;
          }
          .print-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
        </div>
    );
}
