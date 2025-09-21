import React, { useState } from 'react';
import { VfxClient, Network, Keypair } from 'vfx-web-sdk';
import SendCoinForm from './components/SendCoinForm';
import BalanceDisplay from './components/BalanceDisplay';

function App() {

  const [accountExists, setAccountExists] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [keypair, setKeypair] = useState<Keypair | null>(null);

  const client = new VfxClient(Network.Testnet);

  const setDetailsFromPrivateKey = (privateKey: string) => {

    const publicKey = client.publicFromPrivate(privateKey);
    const address = client.addressFromPrivate(privateKey);

    setKeypair({
      privateKey: privateKey,
      publicKey: publicKey,
      address: address,
    })

    setAccountExists(true);

  }

  const handleImportPrivateKey = () => {

    const pkey = prompt("Private Key")?.trim();
    if (pkey) {
      setDetailsFromPrivateKey(pkey)
    }

  }

  const handleGenerateAccount = () => {
    try {

      const pkey = client.generatePrivateKey();
      setDetailsFromPrivateKey(pkey)

    } catch (error) {
      console.error('Error with VfxClient:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
    }
  };

  const handleGenerateHdWallet = () => {
    try {

      const mnemonic = client.generateMnemonic(24);
      const pKey = client.privateKeyFromMneumonic(mnemonic, 0);
      setDetailsFromPrivateKey(pKey)
      setMnemonic(mnemonic);

    } catch (error) {
      console.error('Error with VfxClient:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
    }
  }

  const restoreHdWallet = () => {
    try {

      const phrase = prompt("Import Recovery Phrase")?.trim();
      if (phrase) {
        const pKey = client.privateKeyFromMneumonic(phrase, 0);
        setDetailsFromPrivateKey(pKey)
        setMnemonic(phrase)
      }
    } catch (error) {
      console.error('Error with VfxClient:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
    }
  }

  const handleLogout = () => {
    setMnemonic(null);
    setAccountExists(false);
    setKeypair(null);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>VFX Web SDK Browser Test</h1>
      <p>This example uses the browser-optimized build with no webpack configuration needed!</p>

      {!accountExists &&
        (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handleGenerateAccount}
            >
              Generate Private Key
            </button>
            <button
              onClick={handleImportPrivateKey}
            >
              Import Private Key
            </button>
            <button
              onClick={handleGenerateHdWallet}
            >
              Generate HD Wallet
            </button>
            <button
              onClick={restoreHdWallet}
            >
              Restore HD Wallet
            </button>
          </div>
        )
      }

      {accountExists &&
        <button
          onClick={handleLogout}
        >
          Logout
        </button>
      }

      <hr />
      {keypair?.address && <><label>Your Address: </label><pre>{keypair.address}</pre></>}
      {keypair?.privateKey && <><label>Your Private Key: </label><pre>{keypair.privateKey}</pre></>}
      {keypair?.publicKey && <><label>Your Public Key: </label><pre>{keypair.publicKey}</pre></>}
      {mnemonic && <><label>Your Recovery Phrase: </label><pre>{mnemonic}</pre></>}

      {accountExists && keypair?.address &&
        <BalanceDisplay client={client} address={keypair.address} />
      }

      {keypair &&
        <SendCoinForm client={client} keypair={keypair} />
      }

    </div>
  );
}

export default App;