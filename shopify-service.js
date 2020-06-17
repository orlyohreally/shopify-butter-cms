var shopifyAuthAPI = require("shopify-node-api");
var shopifyAPI = require("shopify-api-node");

var ShopifyService = {
  shops: {},
  install: function (shopOptions) {
    var shop = this.shops[shopOptions.shop];

    if (!shop) {
      shop = new shopifyAuthAPI(shopOptions);
      this.shops[shopOptions.shop] = shop;
    }

    return shop;
  },
  getShop: function (shopName) {
    console.log(this);
    return this.shops[shopName];
  },
  getOrders: function (shop) {
    return shop;
  },
};

module.exports = ShopifyService;
