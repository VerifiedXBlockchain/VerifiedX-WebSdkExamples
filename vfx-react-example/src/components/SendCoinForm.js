


import { useState } from 'react';

/**
 * @typedef {import('vfx-web-sdk').VfxClient} VfxClient
 * @typedef {import('vfx-web-sdk').Keypair} Keypair
 */

/**
 * Send coin form component
 * @param {Object} props
 * @param {VfxClient} props.client - VFX client instance
 * @param {Keypair} props.keypair - Keypair for signing transactions
 */
function SendCoinForm({ client, keypair }) {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!toAddress || !amount) {
      setStatus('Please fill in all fields');
      return;
    }

    setLoading(true);
    setStatus('Sending transaction...');

    try {
      // This is where you would use your VFX SDK to send the coin
      // Example: const txHash = await client.sendCoin(privateKey, toAddress, amount);

      // For now, just simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const hash = await client.sendCoin(keypair, toAddress, Number(amount));

      setStatus(`✅ Transaction sent successfully!`);
      setToAddress('');
      setAmount('');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Send Coin</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Recipient Address:
          </label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter recipient address"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              fontSize: '14px'
            }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Amount:
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.000001"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              fontSize: '14px'
            }}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? 'Sending...' : 'Send Coin'}
        </button>
      </form>

      {status && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: status.includes('❌') ? '#f8d7da' : '#d4edda',
          border: `1px solid ${status.includes('❌') ? '#f5c6cb' : '#c3e6cb'}`,
          borderRadius: '3px',
          fontSize: '14px'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}

export default SendCoinForm;