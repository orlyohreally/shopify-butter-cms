var shopifyAuthAPI = require("shopify-node-api");
var shopifyAPI = require("shopify-api-node");

var ShopifyService = {
  shops: {},
  install: function (shopOptions) {
    var shop = this.shops[shopOptions.shop];

    if (!shop) {
      shop = new shopifyAuthAPI({ ...shopOptions, verbose: false });
      this.shops[shopOptions.shop] = shop;
    }

    return shop;
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
  subscribeToWebHook: function (shop, address) {
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
};

module.exports = ShopifyService;
