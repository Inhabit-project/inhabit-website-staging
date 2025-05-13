import React from 'react';

const ProductTable: React.FC = () => {
  return (
    <div className="product-table-container">
      {/* TODO: Implement the product comparison table here */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Premium Package</th>
            <th>Full Package</th>
            <th>Limited Package</th>
          </tr>
        </thead>
        <tbody>
          {/* Example row */}
          <tr>
            <td>Asset Rights</td>
            <td>✔️</td>
            <td>✔️</td>
            <td>✔️</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable; 