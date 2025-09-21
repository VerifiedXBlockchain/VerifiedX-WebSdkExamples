<script lang="ts">
	import { VfxClient } from 'vfx-web-sdk';
	import { onMount } from 'svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Coins, RefreshCw, AlertCircle, TrendingUp } from 'lucide-svelte';

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
	<Card class="border-slate-800 bg-slate-950/50 backdrop-blur">
		<CardHeader>
			<CardTitle class="flex items-center justify-between text-slate-100">
				<div class="flex items-center gap-2">
					<Coins class="h-5 w-5 text-green-400" />
					Wallet Balance
				</div>
				<Button onclick={fetchBalance} disabled={loading} variant="ghost" size="sm" class="gap-2">
					<RefreshCw class="h-4 w-4 {loading ? 'animate-spin' : ''}" />
					Refresh
				</Button>
			</CardTitle>
			<CardDescription class="text-slate-400">
				Your current VFX token balance
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if loading}
				<div class="space-y-3">
					<Skeleton class="h-12 w-48 bg-slate-800" />
					<Skeleton class="h-4 w-32 bg-slate-800" />
				</div>
			{:else if error}
				<Alert variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<AlertDescription>
						Failed to load balance: {error}
					</AlertDescription>
				</Alert>
			{:else}
				<div class="space-y-3">
					<div class="flex items-baseline gap-3">
						<span class="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
							{balance?.toLocaleString() || '0'}
						</span>
						<Badge variant="secondary" class="gap-1">
							<TrendingUp class="h-3 w-3" />
							VFX
						</Badge>
					</div>
					<p class="text-sm text-slate-400">
						Auto-refreshes every 30 seconds
					</p>
				</div>
			{/if}
		</CardContent>
	</Card>
{/if}