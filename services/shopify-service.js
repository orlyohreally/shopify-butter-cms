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
  getProducts: function (shop) {
    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });

    return shopify.product.list();
  },
  createPage(shop, pageOptions) {
    var shopify = new shopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token,
    });
    return shopify.page.create(pageOptions);
  },
};

module.exports = ShopifyService;
