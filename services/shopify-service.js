var shopifyAuthAPI = require("shopify-node-api");
var shopifyAPI = require("shopify-api-node");

var ShopifyService = {
  shops: {},
  install: function (shopOptions) {
    var shop = this.shops[shopOptions.shop];

    if (!shop) {
      shop = new shopifyAuthAPI({
        shop: shopOptions.shop,
        shopify_api_key: shopOptions.shopify_api_key,
        shopify_shared_secret: shopOptions.shopify_shared_secret,
        shopify_scope: shopOptions.shopify_scope,
        redirect_uri: shopOptions.redirect_uri,
        nonce: "",
        verbose: false,
      });
      this.shops[shopOptions.shop] = shop;
    }

    return shop;
  },
  uninstall: function (shopName) {
    delete this.shops[shopName];
  },
  getShop: function (shopName) {
    return this.shops[shopName];
  },
  getCollections: function (shop) {
    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });

    return shopify.customCollection.list();
  },
  getCollection: function (shop, collectionId) {
    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });

    return shopify.customCollection.get(collectionId);
  },
  getCollectionProducts: function (shop, collectionId) {
    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });

    return shopify.product.list({ collection_id: collectionId });
  },
  getProducts: function (shop) {
    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });

    return shopify.product.list();
  },
  createPage: function (shop, pageOptions) {
    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });
    return shopify.page.create(pageOptions);
  },
  subscribeToProductUpdateWebhook: function (shop, address) {
    var params = {
      topic: "products/update",
      address: address,
      format: "json",
    };

    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });
    console.log(params);
    return shopify.webhook.create(params);
  },
  subscribeToUninstallWebHook: function (shop, address) {
    var params = {
      topic: "app/uninstalled",
      address: address,
      format: "json",
    };
    console.log("subscribeToUninstallWebHook", { config: shop.config });
    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });
    console.log(params);
    return shopify.webhook.create(params);
  },
};

module.exports = ShopifyService;
