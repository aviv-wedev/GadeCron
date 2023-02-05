require('dotenv').config();
require('@shopify/shopify-api/adapters/node');
const { shopifyApi, ApiVersion, Session } = require('@shopify/shopify-api');

const shopify = shopifyApi({
	apiKey: process.env.API_KEY,
	apiSecretKey: process.env.SECRET_KEY,
	apiVersion: ApiVersion.January23,
	scopes: ['write_customers', 'read_customers'],
	hostName: process.env.SHOPIFY_DOMAIN,
});

const session = new Session({ accessToken: process.env.ADMIN_API_KEY, shop: process.env.SHOPIFY_DOMAIN });
const client = new shopify.clients.Rest({ session: session, apiVersion: ApiVersion.January23 });

module.exports = client;
