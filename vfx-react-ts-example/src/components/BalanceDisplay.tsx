import { useState, useEffect } from 'react';
import { VfxClient } from 'vfx-web-sdk';

interface BalanceDisplayProps {
  client: VfxClient;
  address: string;
}

function BalanceDisplay({ client, address }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!client || !address) return;

    setLoading(true);
    setError(null);

    try {

      const account = await client.getAddressDetails(address);

      if (account) {
        setBalance(account.balance);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [client, address]);

  if (!address) return null;

  return (
    <div style={{
      marginTop: '20px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Balance</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {loading ? (
          <span style={{ color: '#666' }}>Loading...</span>
        ) : error ? (
          <span style={{ color: '#dc3545' }}>Error: {error}</span>
        ) : (
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {balance} VFX
          </span>
        )}

        <button
          onClick={fetchBalance}
          disabled={loading}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '...' : 'Refresh'}
        </button>
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        Auto-refreshes every 30 seconds
      </div>
    </div>
  );
}

export default BalanceDisplay;