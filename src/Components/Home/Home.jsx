import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await axios.get('http://localhost:3000/data');
        setCustomers(data.customers);
        setTransactions(data.transaction);
        setFilteredTransactions(data.transaction); // Initialize filteredTransactions with all transactions
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    getData();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    // Filter transactions based on search input
    const filtered = transactions.filter(transaction => {
      const customer = customers.find(c => c.id === transaction.customer_id);
      const customerName = customer ? customer.name.toLowerCase() : '';
      const amountMatch = transaction.amount.toString().includes(searchTerm);
      return customerName.includes(searchTerm) || amountMatch;
    });

    setFilteredTransactions(filtered);
  };

  // Function to calculate data for PieChart based on filteredTransactions
  const getPieChartData = () => {
    const groupedData = {};

    // Group transactions by customer name
    filteredTransactions.forEach(transaction => {
      const customer = customers.find(c => c.id === transaction.customer_id);
      const customerName = customer ? customer.name : 'Unknown';

      if (groupedData[customerName]) {
        groupedData[customerName] += transaction.amount;
      } else {
        groupedData[customerName] = transaction.amount;
      }
    });

    // Format data for PieChart
    const pieData = Object.keys(groupedData).map(name => ({
      name,
      value: groupedData[name],
    }));

    return pieData;
  };

  return (
    <div className='w-10/12 m-auto'>
      <h1>Customers and Transactions</h1>

      
      <form className="mx-auto w-full">   
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input onChange={handleSearchChange} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required />
          
        </div>
      </form>
      <div className="">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={getPieChartData()}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="relative overflow-x-auto w-full mt-4">
      <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Customer Name
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Transaction ID
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Date
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Amount
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
        {filteredTransactions.map(transaction => {
          const customer = customers.find(c => c.id === transaction.customer_id);
          return (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{customer ? customer.name : 'Unknown'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{transaction.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{transaction.date}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{transaction.amount}</div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
      </div>

      
    </div>
  );
}
