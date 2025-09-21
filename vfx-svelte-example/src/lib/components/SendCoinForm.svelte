<script lang="ts">
	import { VfxClient, type Keypair } from 'vfx-web-sdk';

	interface Props {
		client: VfxClient;
		keypair: Keypair;
	}

	let { client, keypair }: Props = $props();

	let toAddress = $state('');
	let amount = $state('');
	let status = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!toAddress || !amount) {
			status = 'Please fill in all fields';
			return;
		}

		loading = true;
		status = 'Sending transaction...';

		try {
			// This is where you would use your VFX SDK to send the coin
			// Simulate the process
			await new Promise(resolve => setTimeout(resolve, 2000));

			const hash = await client.sendCoin(keypair, toAddress, Number(amount));

			status = `✅ Transaction sent successfully!`;
			toAddress = '';
			amount = '';
		} catch (error) {
			status = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
		} finally {
			loading = false;
		}
	}
</script>

<div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8">
	<h2 class="text-2xl font-semibold mb-6">Send Coin</h2>

	<form onsubmit={handleSubmit} class="space-y-6">
		<div>
			<label for="recipient-address" class="block text-sm font-medium text-gray-300 mb-2">
				Recipient Address
			</label>
			<input
				id="recipient-address"
				type="text"
				bind:value={toAddress}
				placeholder="Enter recipient address"
				disabled={loading}
				class="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
			/>
		</div>

		<div>
			<label for="amount" class="block text-sm font-medium text-gray-300 mb-2">
				Amount
			</label>
			<input
				id="amount"
				type="number"
				bind:value={amount}
				placeholder="Enter amount"
				min="0"
				step="0.000001"
				disabled={loading}
				class="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
			/>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:hover:scale-100 disabled:hover:shadow-none"
		>
			{#if loading}
				<div class="flex items-center justify-center">
					<svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Sending...
				</div>
			{:else}
				Send Coin
			{/if}
		</button>
	</form>

	{#if status}
		<div class="mt-6 p-4 rounded-xl border {status.includes('❌') ? 'bg-red-900/20 border-red-500/50 text-red-300' : 'bg-green-900/20 border-green-500/50 text-green-300'}">
			<div class="flex items-center">
				{#if status.includes('❌')}
					<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
					</svg>
				{:else if status.includes('✅')}
					<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
					</svg>
				{:else}
					<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				{/if}
				{status}
			</div>
		</div>
	{/if}
</div>