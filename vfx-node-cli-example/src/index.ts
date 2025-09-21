import inquirer from 'inquirer';
import chalk from 'chalk';
import { VfxClient } from 'vfx-web-sdk';

async function main() {
    console.log(chalk.blue.bold('\n🚀 VFX CLI - VerifiedX Blockchain Tool\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                {
                    name: '🔑 Create New VFX Account',
                    value: 'create_account'
                },
                {
                    name: '🔍 Check Address Details',
                    value: 'check_address'
                },
                {
                    name: '📋 List Transactions',
                    value: 'list_transactions'
                },
                {
                    name: '🌐 Domain Operations',
                    value: 'domain_ops'
                },
                {
                    name: '❌ Exit',
                    value: 'exit'
                }
            ]
        }
    ]);

    switch (action) {
        case 'create_account':
            await createAccount();
            break;
        case 'check_address':
            await checkAddress();
            break;
        case 'list_transactions':
            await listTransactions();
            break;
        case 'domain_ops':
            await domainOperations();
            break;
        case 'exit':
            console.log(chalk.yellow('👋 Goodbye!'));
            process.exit(0);
            break;
        default:
            console.log(chalk.red('Invalid option'));
            break;
    }

    // Show menu again after completing an action
    setTimeout(() => main(), 1000);
}

async function createAccount() {
    console.log(chalk.blue('\n📝 Creating New VFX Account...\n'));

    const { network, mnemonicWords } = await inquirer.prompt([
        {
            type: 'list',
            name: 'network',
            message: 'Select network:',
            choices: [
                { name: 'Testnet (recommended for testing)', value: 'testnet' },
                { name: 'Mainnet', value: 'mainnet' }
            ]
        },
        {
            type: 'list',
            name: 'mnemonicWords',
            message: 'Mnemonic phrase length:',
            choices: [
                { name: '12 words (standard)', value: 12 },
                { name: '24 words (more secure)', value: 24 }
            ]
        }
    ]);

    try {
        const client = new VfxClient(network);

        // Generate mnemonic and derive account
        const mnemonic = client.generateMnemonic(mnemonicWords);
        const privateKey = client.privateKeyFromMneumonic(mnemonic, 0);
        const publicKey = client.publicFromPrivate(privateKey);
        const address = client.addressFromPrivate(privateKey);

        console.log(chalk.green('\n✅ Account Created Successfully!\n'));
        console.log(chalk.cyan('Network:'), network);
        console.log(chalk.cyan('Mnemonic:'), chalk.yellow(mnemonic));
        console.log(chalk.cyan('Private Key:'), chalk.yellow(privateKey));
        console.log(chalk.cyan('Public Key:'), chalk.yellow(publicKey));
        console.log(chalk.cyan('Address:'), chalk.yellow(address));

        console.log(chalk.red('\n⚠️  IMPORTANT: Save your mnemonic phrase securely!'));
        console.log(chalk.red('⚠️  Never share your private key with anyone!'));

        const { saveToFile } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'saveToFile',
                message: 'Would you like to save this account info to a file?',
                default: false
            }
        ]);

        if (saveToFile) {
            const fs = await import('fs');
            const accountData = {
                network,
                mnemonic,
                privateKey,
                publicKey,
                address,
                createdAt: new Date().toISOString()
            };

            const filename = `vfx-account-${address.slice(0, 8)}-${Date.now()}.json`;
            fs.writeFileSync(filename, JSON.stringify(accountData, null, 2));
            console.log(chalk.green(`💾 Account saved to: ${filename}`));
        }

    } catch (error) {
        console.log(chalk.red('❌ Error creating account:'), error);
    }
}

async function checkAddress() {
    console.log(chalk.blue('\n🔍 Check Address Details\n'));

    const { address, network } = await inquirer.prompt([
        {
            type: 'input',
            name: 'address',
            message: 'Enter VFX address to check:',
            validate: (input) => input.length > 0 || 'Address is required'
        },
        {
            type: 'list',
            name: 'network',
            message: 'Select network:',
            choices: [
                { name: 'Testnet', value: 'testnet' },
                { name: 'Mainnet', value: 'mainnet' }
            ]
        }
    ]);

    try {
        const client = new VfxClient(network);
        const details = await client.getAddressDetails(address);

        if (details) {
            console.log(chalk.green('\n✅ Address Details:\n'));
            console.log(chalk.cyan('Address:'), details.address);
            console.log(chalk.cyan('Balance:'), details.balance);
            console.log(chalk.cyan('Balance Total:'), details.balanceTotal);
            console.log(chalk.cyan('Balance Locked:'), details.balanceLocked);
            console.log(chalk.cyan('ADNR:'), details.adnr || 'None');
            console.log(chalk.cyan('Activated:'), details.activated);
        } else {
            console.log(chalk.yellow('⚠️  Address not found or has no activity'));
        }
    } catch (error) {
        console.log(chalk.red('❌ Error checking address:'), error);
    }
}

async function listTransactions() {
    console.log(chalk.blue('\n📋 List Transactions\n'));

    const { address, network, limit } = await inquirer.prompt([
        {
            type: 'input',
            name: 'address',
            message: 'Enter VFX address:',
            validate: (input) => input.length > 0 || 'Address is required'
        },
        {
            type: 'list',
            name: 'network',
            message: 'Select network:',
            choices: [
                { name: 'Testnet', value: 'testnet' },
                { name: 'Mainnet', value: 'mainnet' }
            ]
        },
        {
            type: 'number',
            name: 'limit',
            message: 'Number of transactions to show:',
            default: 10
        }
    ]);

    try {
        const client = new VfxClient(network);
        const transactions = await client.listTransactionsForAddress(address, 1, limit);

        if (transactions && transactions.results.length > 0) {
            console.log(chalk.green(`\n✅ Found ${transactions.results.length} transactions:\n`));

            transactions.results.forEach((tx: any, index: number) => {
                console.log(chalk.cyan(`${index + 1}. Transaction Hash:`), tx.hash);
                console.log(chalk.cyan('   Type:'), tx.type_label || tx.type);
                console.log(chalk.cyan('   Amount:'), tx.total_amount);
                console.log(chalk.cyan('   From:'), tx.from_address);
                console.log(chalk.cyan('   To:'), tx.to_address);
                console.log(chalk.cyan('   Date:'), new Date(tx.date_crafted).toLocaleString());
                console.log('');
            });
        } else {
            console.log(chalk.yellow('⚠️  No transactions found for this address'));
        }
    } catch (error) {
        console.log(chalk.red('❌ Error fetching transactions:'), error);
    }
}

async function domainOperations() {
    console.log(chalk.blue('\n🌐 Domain Operations\n'));

    const { operation } = await inquirer.prompt([
        {
            type: 'list',
            name: 'operation',
            message: 'Select domain operation:',
            choices: [
                { name: 'Check domain availability', value: 'check' },
                { name: 'Lookup domain address', value: 'lookup' },
                { name: 'Buy VFX domain', value: 'buy' },
                { name: 'Back to main menu', value: 'back' }
            ]
        }
    ]);

    if (operation === 'back') return;

    const { domain, network } = await inquirer.prompt([
        {
            type: 'input',
            name: 'domain',
            message: 'Enter domain name:',
            validate: (input) => input.length > 0 || 'Domain is required'
        },
        {
            type: 'list',
            name: 'network',
            message: 'Select network:',
            choices: [
                { name: 'Testnet', value: 'testnet' },
                { name: 'Mainnet', value: 'mainnet' }
            ]
        }
    ]);

    try {
        const client = new VfxClient(network);

        switch (operation) {
            case 'check':
                const available = await client.domainAvailable(domain);
                console.log(chalk.green('\n✅ Domain Status:'));
                console.log(chalk.cyan('Domain:'), domain);
                console.log(chalk.cyan('Available:'), available ? chalk.green('Yes') : chalk.red('No'));
                break;

            case 'lookup':
                const address = await client.lookupDomain(domain);
                console.log(chalk.green('\n✅ Domain Lookup:'));
                console.log(chalk.cyan('Domain:'), domain);
                console.log(chalk.cyan('Address:'), address || chalk.yellow('Not found'));
                break;

            case 'buy':
                console.log(chalk.yellow('\n⚠️  Domain purchase requires a private key/account'));
                console.log(chalk.yellow('This feature would need additional implementation for secure key handling'));
                break;
        }
    } catch (error) {
        console.log(chalk.red('❌ Error with domain operation:'), error);
    }
}

// Start the CLI
main().catch(console.error);