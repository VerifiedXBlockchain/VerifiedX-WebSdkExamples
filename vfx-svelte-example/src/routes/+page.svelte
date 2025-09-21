<script lang="ts">
	import { VfxClient, Network, type Keypair } from 'vfx-web-sdk';
	import SendCoinForm from '$lib/components/SendCoinForm.svelte';
	import BalanceDisplay from '$lib/components/BalanceDisplay.svelte';

	let accountExists = $state(false);
	let mnemonic = $state<string | null>(null);
	let keypair = $state<Keypair | null>(null);

	const client = new VfxClient(Network.Testnet);

	function setDetailsFromPrivateKey(privateKey: string) {
		const publicKey = client.publicFromPrivate(privateKey);
		const address = client.addressFromPrivate(privateKey);

		keypair = {
			privateKey: privateKey,
			publicKey: publicKey,
			address: address,
		};

		accountExists = true;
	}

	function handleImportPrivateKey() {
		const pkey = prompt("Private Key")?.trim();
		if (pkey) {
			setDetailsFromPrivateKey(pkey);
		}
	}

	function handleGenerateAccount() {
		try {
			const pkey = client.generatePrivateKey();
			setDetailsFromPrivateKey(pkey);
		} catch (error) {
			console.error('Error with VfxClient:', error);
			console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
		}
	}

	function handleGenerateHdWallet() {
		try {
			const mnemonicPhrase = client.generateMnemonic(24);
			const pKey = client.privateKeyFromMneumonic(mnemonicPhrase, 0);
			setDetailsFromPrivateKey(pKey);
			mnemonic = mnemonicPhrase;
		} catch (error) {
			console.error('Error with VfxClient:', error);
			console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
		}
	}

	function restoreHdWallet() {
		try {
			const phrase = prompt("Import Recovery Phrase")?.trim();
			if (phrase) {
				const pKey = client.privateKeyFromMneumonic(phrase, 0);
				setDetailsFromPrivateKey(pKey);
				mnemonic = phrase;
			}
		} catch (error) {
			console.error('Error with VfxClient:', error);
			console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
		}
	}

	function handleLogout() {
		mnemonic = null;
		accountExists = false;
		keypair = null;
	}
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<div class="container mx-auto px-6 py-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="text-center mb-12">
				<h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
					VFX Web SDK Browser Test
				</h1>
				<p class="text-gray-400 text-lg">
					This example uses the browser-optimized build with no webpack configuration needed!
				</p>
			</div>

			<!-- Account Actions -->
			{#if !accountExists}
				<div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8 mb-8">
					<h2 class="text-2xl font-semibold mb-6 text-center">Get Started</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<button
							onclick={handleGenerateAccount}
							class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
						>
							Generate Private Key
						</button>
						<button
							onclick={handleImportPrivateKey}
							class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
						>
							Import Private Key
						</button>
						<button
							onclick={handleGenerateHdWallet}
							class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
						>
							Generate HD Wallet
						</button>
						<button
							onclick={restoreHdWallet}
							class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
						>
							Restore HD Wallet
						</button>
					</div>
				</div>
			{/if}

			{#if accountExists}
				<div class="text-center mb-8">
					<button
						onclick={handleLogout}
						class="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
					>
						Logout
					</button>
				</div>
			{/if}

			<!-- Account Details -->
			{#if keypair}
				<div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8 mb-8">
					<h2 class="text-2xl font-semibold mb-6">Account Details</h2>
					<div class="space-y-6">
						{#if keypair.address}
							<div>
								<label class="block text-sm font-medium text-gray-300 mb-2">Your Address:</label>
								<div class="bg-gray-900 border border-gray-600 rounded-xl p-4 font-mono text-sm break-all">
									{keypair.address}
								</div>
							</div>
						{/if}
						{#if keypair.privateKey}
							<div>
								<label class="block text-sm font-medium text-gray-300 mb-2">Your Private Key:</label>
								<div class="bg-gray-900 border border-gray-600 rounded-xl p-4 font-mono text-sm break-all">
									{keypair.privateKey}
								</div>
							</div>
						{/if}
						{#if keypair.publicKey}
							<div>
								<label class="block text-sm font-medium text-gray-300 mb-2">Your Public Key:</label>
								<div class="bg-gray-900 border border-gray-600 rounded-xl p-4 font-mono text-sm break-all">
									{keypair.publicKey}
								</div>
							</div>
						{/if}
						{#if mnemonic}
							<div>
								<label class="block text-sm font-medium text-gray-300 mb-2">Your Recovery Phrase:</label>
								<div class="bg-gray-900 border border-gray-600 rounded-xl p-4 font-mono text-sm break-all">
									{mnemonic}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Balance Display -->
			{#if accountExists && keypair?.address}
				<BalanceDisplay {client} address={keypair.address} />
			{/if}

			<!-- Send Coin Form -->
			{#if keypair}
				<SendCoinForm {client} {keypair} />
			{/if}
		</div>
	</div>
</div>
