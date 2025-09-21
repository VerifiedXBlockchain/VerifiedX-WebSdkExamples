<script lang="ts">
	import { VfxClient } from 'vfx-web-sdk';
	import { onMount } from 'svelte';

	interface Props {
		client: VfxClient;
		address: string;
	}

	let { client, address }: Props = $props();

	let balance = $state<number | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function fetchBalance() {
		if (!client || !address) return;

		loading = true;
		error = null;

		try {
			const account = await client.getAddressDetails(address);

			if (account) {
				balance = account.balance;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchBalance();

		const interval = setInterval(fetchBalance, 30000);

		return () => clearInterval(interval);
	});

	// Re-fetch when address changes
	$effect(() => {
		if (address) {
			fetchBalance();
		}
	});
</script>

{#if address}
	<div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8 mb-8">
		<h2 class="text-2xl font-semibold mb-6">Balance</h2>

		<div class="flex items-center gap-4">
			{#if loading}
				<div class="flex items-center text-gray-400">
					<svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Loading...
				</div>
			{:else if error}
				<span class="text-red-400 flex items-center">
					<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
					</svg>
					Error: {error}
				</span>
			{:else}
				<span class="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
					{balance} VFX
				</span>
			{/if}

			<button
				onclick={fetchBalance}
				disabled={loading}
				class="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 text-sm"
			>
				{#if loading}
					<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				{:else}
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
					</svg>
				{/if}
			</button>
		</div>

		<div class="text-sm text-gray-400 mt-4">
			Auto-refreshes every 30 seconds
		</div>
	</div>
{/if}