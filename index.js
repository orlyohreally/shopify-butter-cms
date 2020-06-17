require("dotenv").config();
var nonce = require("nonce")();
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var shopifyService = require("./services/shopify-service");
var butterCMSService = require("./services/butter-cms-service");

var forwardingAddress = process.env.APP_URL;
var appConfig = {
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: "read_orders,read_products,read_themes,write_themes,write_content",
  appName: process.env.APP_NAME,
};

function verifyRequest(req, res, next) {
  try {
    var shop = shopifyService.getShop(req.query.shop);
    if (!shop) {
      throw new Error("No shop provided");
    }
    res.locals.shop = shop;
    console.log({ shop: shop });
    next();
  } catch (e) {
    return res.status(400).send("Something went wrong");
  }
}

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/shopify", function (req, res) {
  try {
    var shop = shopifyService.install({
      shop: req.query.shop,
      shopify_api_key: appConfig.apiKey,
      shopify_shared_secret: appConfig.apiSecret,
      shopify_scope: appConfig.scopes,
      redirect_uri: forwardingAddress + "/shopify/callback",
      nonce: nonce().toString(),
    });

    var auth_url = shop.buildAuthURL();
    res.redirect(auth_url);
  } catch (e) {
    return res.status(400).send("Something went wrong");
  }
});

app.get("/shopify/callback", function (req, res) {
  try {
    var shop = shopifyService.getShop(req.query.shop);
    if (!shop) {
      throw new Error("No shop provided");
    }
    shop.exchange_temporary_token(req.query, function (err, data) {
      if (err) {
        throw err;
      }
      res.redirect(
        "https://" + shop.config.shop + "/admin/apps/" + appConfig.appName
      );
    });
  } catch (e) {
    return res.status(400).send("Something went wrong");
  }
});

app.get("/", function (req, res) {
  var shop = shopifyService.getShop(req.query.shop);
  if (!shop) {
    throw new Error("No shop provided");
  }

  return res.status(200).sendFile(path.join(__dirname, "/index.html"));
});

app.post("/butter-cms/config", verifyRequest, function (req, res) {
  console.log(req.body);
  try {
    var butterCMSId = req.body.butterCMSId;
    var shop = res.locals.shop;

    if (!butterCMSId) {
      return res.status(404).send("butterCMSId is missing");
    }
    butterCMSService.init(butterCMSId);
    shopifyService.getProducts(shop).then(function (result1) {
      shopifyService
        .createPage(shop, {
          title: "Warranty information",
          body_html:
            "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>",
        })
        .then(function (result) {
          console.log({ res: result });
          return res.status(200).json("Created!");
        });
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send("Something went wrong");
  }
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
