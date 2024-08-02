import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Terminal } from 'lucide-react';

const fetchCryptoData = async () => {
  const response = await axios.get('https://api.coincap.io/v2/assets?limit=10');
  return response.data.data;
};

const Index = () => {
  const { data: cryptoData, isLoading, isError } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
    refetchInterval: 60000, // Refetch every minute
  });

  const [selectedCrypto, setSelectedCrypto] = useState(null);

  useEffect(() => {
    if (cryptoData && cryptoData.length > 0) {
      setSelectedCrypto(cryptoData[0]);
    }
  }, [cryptoData]);

  if (isLoading) return <div className="text-green-500 font-mono">Loading...</div>;
  if (isError) return <div className="text-red-500 font-mono">Error fetching data</div>;

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      <h1 className="text-4xl mb-8 flex items-center">
        <Terminal className="mr-2" />
        Crypto Tracker
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 bg-gray-900 p-4 rounded-lg">
          <h2 className="text-2xl mb-4">Top 10 Cryptocurrencies</h2>
          <ul>
            {cryptoData.map((crypto) => (
              <li
                key={crypto.id}
                className={`cursor-pointer hover:bg-gray-800 p-2 rounded ${
                  selectedCrypto && selectedCrypto.id === crypto.id ? 'bg-gray-800' : ''
                }`}
                onClick={() => setSelectedCrypto(crypto)}
              >
                {crypto.name} ({crypto.symbol})
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 bg-gray-900 p-4 rounded-lg">
          {selectedCrypto && (
            <>
              <h2 className="text-2xl mb-4">{selectedCrypto.name} Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p>Symbol: {selectedCrypto.symbol}</p>
                  <p>Price: ${parseFloat(selectedCrypto.priceUsd).toFixed(2)}</p>
                  <p>Market Cap: ${parseFloat(selectedCrypto.marketCapUsd).toFixed(2)}</p>
                </div>
                <div>
                  <p>24h Change: {parseFloat(selectedCrypto.changePercent24Hr).toFixed(2)}%</p>
                  <p>Volume (24h): ${parseFloat(selectedCrypto.volumeUsd24Hr).toFixed(2)}</p>
                  <p>Supply: {parseFloat(selectedCrypto.supply).toFixed(2)}</p>
                </div>
              </div>
              <h3 className="text-xl mb-4">Price Chart (Last 7 days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { name: 'Day 1', price: selectedCrypto.priceUsd * 0.95 },
                  { name: 'Day 2', price: selectedCrypto.priceUsd * 0.98 },
                  { name: 'Day 3', price: selectedCrypto.priceUsd * 1.02 },
                  { name: 'Day 4', price: selectedCrypto.priceUsd * 1.01 },
                  { name: 'Day 5', price: selectedCrypto.priceUsd * 1.03 },
                  { name: 'Day 6', price: selectedCrypto.priceUsd * 0.99 },
                  { name: 'Day 7', price: selectedCrypto.priceUsd * 1 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#22c55e" />
                  <YAxis stroke="#22c55e" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
