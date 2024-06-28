import { CoinbaseClient, KeyFileConfig, loadKeyfile }from 'coinbase-advanced-node-ts';
import { ListAccountsParams } from 'coinbase-advanced-node-ts/dist/rest/types/accounts';
import { getAllKeyFilePaths } from './config';

async function demo() {
  const firstKeyFile = getAllKeyFilePaths()[0];
  const config = loadKeyfile(firstKeyFile);
  const client = new CoinbaseClient(
    KeyFileConfig.getInstance(config.name, config.privateKey)
  );

  const params: ListAccountsParams = {
    limit: 5,
    cursor: undefined,
    retailPortfolioId: undefined
  };

  try {
    const accountsData = await client.accounts?.listAccounts(params);
    console.log('Fetched accounts data:', JSON.stringify(accountsData, null, 2));

    if (!accountsData?.accounts || accountsData.accounts.length === 0) {
      throw new Error("No accounts found");
    }

    const accountUUID = accountsData.accounts[0].uuid;
    const accountData = await client.accounts?.getAccount(accountUUID);
    console.log('Fetched account data:', accountData);
  } catch (error) {
    console.error('Error calling Coinbase API:', error instanceof Error ? error.message : error);
  }
}

demo().catch(console.error);
