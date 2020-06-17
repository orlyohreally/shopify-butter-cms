require("dotenv").config();
var nonce = require("nonce")();
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var checkHmacValidity = require("shopify-hmac-validation").checkHmacValidity;
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
    if (!checkHmacValidity(appConfig.apiSecret, req.query)) {
      throw "Unauthorized";
    }

    var shop = shopifyService.getShop(req.query.shop);
    if (!shop) {
      throw new Error("Shop not found");
    }
    res.locals.shop = shop;
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).send("Unauthorized");
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

app.use(express.static(path.join(__dirname, "/dist/app-ui")));

app.get("/*", verifyRequest, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/app-ui/index.html"));
});

app.post("/app/butter-cms/config", verifyRequest, function (req, res) {
  try {
    var butterCMSId = req.body.config.butterCMSWriteToken;
    // var shop = res.locals.shop;

    if (!butterCMSId) {
      return res.status(404).send("butterCMSId is missing");
    }
    butterCMSService.init(butterCMSId);
    res
      .status(200)
      .json({ message: "Configurations have been successfully saved" });
    // shopifyService.getProducts(shop).then(function (result1) {
    //   shopifyService
    //     .createPage(shop, {
    //       title: "Warranty information",
    //       body_html:
    //         "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>",
    //     })
    //     .then(function (result) {
    //       console.log({ res: result });
    //       return res.status(200).json("Created!");
    //     });
    // });
  } catch (e) {
    console.log(e);
    return res.status(400).send("Something went wrong");
  }
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
