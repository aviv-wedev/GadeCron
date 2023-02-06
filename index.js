require('dotenv').config();
require('./errorHandlers');
const { DataType } = require('@shopify/shopify-api');
const cron = require('node-cron');
const client = require('./client');

const task = cron.schedule(
	'0 0 1 * *',
	async () => {
		main();
	},
	{ scheduled: true }
);

task.start();

async function shopifyFetch(client, path, queryList = []) {
	let allObjects = [];
	let newObject;
	let nextPageQuery = {
		limit: 250,
	};

	for (const query of queryList) {
		nextPageQuery[query.split('=')[0]] = query.split('=')[1];
	}

	let bodyPath = path;
	if (path.includes('/')) {
		bodyPath = path.split('/')[0];
	}
	while (nextPageQuery) {
		const response = await client.get({
			path: path,
			query: nextPageQuery,
		});
		newObject = response.body[bodyPath];
		allObjects.push(...newObject);
		nextPageQuery = response?.pageInfo?.nextPage?.query;
	}

	return allObjects;
}

function getFakeCustomers(shopifyCustomers) {
	const fakeCustomers = [];

	for (const customer of shopifyCustomers) {
		if (
			customer.first_name === customer.last_name ||
			customer.first_name?.includes('BLOGSPOT') ||
			customer.last_name?.includes('BLOGSPOT')
		) {
			fakeCustomers.push(customer);
		}
	}
	return fakeCustomers;
}

async function deleteCustomer(id) {
	let customer = {
		id: `${id}`,
	};

	const body = { customer };
	const response = await client.delete({
		path: `customers/${id}`,
		data: body,
		type: DataType.JSON,
	});

	const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
	await sleep(1000);
}

async function main() {
	console.log('\x1b[31m%s\x1b[0m', '\n==========================================');
	console.log('\x1b[31m%s\x1b[0m', '============ Customers Program ===========');
	console.log('\x1b[31m%s\x1b[0m', '==========================================');
	console.log('\x1b[36m%s\x1b[0m', '\nProgram started');

	console.log('\x1b[33m%s\x1b[0m', 'ֿ\nFetching Shopify customers...');
	const shopifyCustomers = await shopifyFetch(client, 'customers');
	console.log('\x1b[32m%s\x1b[0m', '\nFetched Shopify customers');

	console.log('\x1b[33m%s\x1b[0m', 'ֿ\nFiltering and deleting...');
	const fakeCustomers = getFakeCustomers(shopifyCustomers);

	for (const customer of fakeCustomers) {
		await deleteCustomer(customer?.id);
	}
	console.log('\x1b[32m%s\x1b[0m', '\nDone');
}
