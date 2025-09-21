<script lang="ts">
	import { VfxClient, type Keypair } from 'vfx-web-sdk';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-svelte';

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

<Card class="border-slate-800 bg-slate-950/50 backdrop-blur">
	<CardHeader>
		<CardTitle class="flex items-center gap-2 text-slate-100">
			<Send class="h-5 w-5 text-blue-400" />
			Send Transaction
		</CardTitle>
		<CardDescription class="text-slate-400">
			Transfer VFX tokens to another wallet address
		</CardDescription>
	</CardHeader>
	<CardContent>
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="space-y-2">
				<Label for="recipient-address" class="text-slate-300">Recipient Address</Label>
				<Input
					id="recipient-address"
					type="text"
					bind:value={toAddress}
					placeholder="Enter recipient wallet address"
					disabled={loading}
					class="border-slate-700 bg-slate-900/50 text-slate-200 placeholder:text-slate-500"
				/>
			</div>

			<div class="space-y-2">
				<Label for="amount" class="text-slate-300">Amount (VFX)</Label>
				<Input
					id="amount"
					type="number"
					bind:value={amount}
					placeholder="0.000000"
					min="0"
					step="0.000001"
					disabled={loading}
					class="border-slate-700 bg-slate-900/50 text-slate-200 placeholder:text-slate-500"
				/>
			</div>

			<Button type="submit" disabled={loading} class="w-full" size="lg">
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Processing Transaction...
				{:else}
					<Send class="mr-2 h-4 w-4" />
					Send VFX
				{/if}
			</Button>
		</form>

		{#if status}
			<div class="mt-6">
				{#if status.includes('❌')}
					<Alert variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<AlertDescription>
							{status.replace('❌ Error: ', '')}
						</AlertDescription>
					</Alert>
				{:else if status.includes('✅')}
					<Alert class="border-green-500/50 bg-green-950/20">
						<CheckCircle class="h-4 w-4 text-green-400" />
						<AlertDescription class="text-green-300">
							{status.replace('✅ ', '')}
						</AlertDescription>
					</Alert>
				{:else}
					<Alert>
						<Loader2 class="h-4 w-4 animate-spin" />
						<AlertDescription>
							{status}
						</AlertDescription>
					</Alert>
				{/if}
			</div>
		{/if}
	</CardContent>
</Card>
