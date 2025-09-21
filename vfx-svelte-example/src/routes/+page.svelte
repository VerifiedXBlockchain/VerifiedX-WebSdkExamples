<script lang="ts">
	import { VfxClient, Network, type Keypair } from 'vfx-web-sdk';
	import SendCoinForm from '$lib/components/SendCoinForm.svelte';
	import BalanceDisplay from '$lib/components/BalanceDisplay.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Wallet, Key, Download, LogOut, Sparkles } from 'lucide-svelte';

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
			address: address
		};

		accountExists = true;
	}

	function handleImportPrivateKey() {
		const pkey = prompt('Private Key')?.trim();
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
			const phrase = prompt('Import Recovery Phrase')?.trim();
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

<div class="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
	<div class="container mx-auto px-4 py-8">
		<div class="mx-auto max-w-6xl">
			<!-- Header -->
			<div class="mb-12 text-center">
				<div class="mb-4 flex items-center justify-center gap-3">
					<h1
						class="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-5xl font-bold text-transparent"
					>
						VFX Wallet
					</h1>
				</div>
				<p class="mx-auto max-w-2xl text-lg text-slate-400">
					Cryptocurrency wallet interface powered by the VFX Web SDK. Manage your digital assets
					with enterprise-grade security.
				</p>
				<Badge variant="secondary" class="mt-4">Testnet Environment</Badge>
			</div>

			<!-- Account Actions -->
			{#if !accountExists}
				<Card class="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur">
					<CardHeader class="text-center">
						<CardTitle class="text-2xl text-slate-100">Welcome to VFX Wallet</CardTitle>
						<CardDescription class="text-slate-400">
							Choose how you'd like to get started with your wallet
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Button
								onclick={handleGenerateAccount}
								variant="outline"
								size="lg"
								class="h-16 flex-col gap-2"
							>
								<Key class="h-5 w-5" />
								Generate Private Key
							</Button>
							<Button
								onclick={handleImportPrivateKey}
								variant="outline"
								size="lg"
								class="h-16 flex-col gap-2"
							>
								<Download class="h-5 w-5" />
								Import Private Key
							</Button>
							<Button
								onclick={handleGenerateHdWallet}
								variant="secondary"
								size="lg"
								class="h-16 flex-col gap-2"
							>
								<Wallet class="h-5 w-5" />
								Generate HD Wallet
							</Button>
							<Button
								onclick={restoreHdWallet}
								variant="outline"
								size="lg"
								class="h-16 flex-col gap-2"
							>
								<Download class="h-5 w-5" />
								Restore HD Wallet
							</Button>
						</div>
					</CardContent>
				</Card>
			{/if}

			{#if accountExists}
				<div class="mb-8 flex justify-center">
					<Button onclick={handleLogout} variant="destructive" size="lg" class="gap-2">
						<LogOut class="h-4 w-4" />
						Logout
					</Button>
				</div>
			{/if}

			<!-- Account Details -->
			{#if keypair}
				<Card class="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur">
					<CardHeader>
						<CardTitle class="flex items-center gap-2 text-slate-100">
							<Wallet class="h-5 w-5" />
							Account Details
						</CardTitle>
						<CardDescription class="text-slate-400">
							Your wallet credentials and account information
						</CardDescription>
					</CardHeader>
					<CardContent class="space-y-6">
						{#if keypair.address}
							<div class="space-y-2">
								<label class="text-sm font-medium text-slate-300">Wallet Address</label>
								<div
									class="break-all rounded-lg border border-slate-700 bg-slate-900/50 p-4 font-mono text-sm text-slate-200"
								>
									{keypair.address}
								</div>
							</div>
						{/if}
						{#if keypair.privateKey}
							<div class="space-y-2">
								<label class="text-sm font-medium text-slate-300">Private Key</label>
								<div
									class="break-all rounded-lg border border-slate-700 bg-slate-900/50 p-4 font-mono text-sm text-slate-200"
								>
									{keypair.privateKey}
								</div>
							</div>
						{/if}
						{#if keypair.publicKey}
							<div class="space-y-2">
								<label class="text-sm font-medium text-slate-300">Public Key</label>
								<div
									class="break-all rounded-lg border border-slate-700 bg-slate-900/50 p-4 font-mono text-sm text-slate-200"
								>
									{keypair.publicKey}
								</div>
							</div>
						{/if}
						{#if mnemonic}
							<Separator class="bg-slate-700" />
							<div class="space-y-2">
								<label class="text-sm font-medium text-slate-300">Recovery Phrase</label>
								<div
									class="break-all rounded-lg border border-amber-800/50 bg-amber-950/20 p-4 font-mono text-sm text-amber-200"
								>
									{mnemonic}
								</div>
								<p class="text-xs text-amber-400/80">
									⚠️ Keep this phrase safe and never share it with anyone
								</p>
							</div>
						{/if}
					</CardContent>
				</Card>
			{/if}

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
</div>
