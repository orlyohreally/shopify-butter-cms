require("dotenv").config();
var requestPromise = require("request-promise");
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
  scopes: "read_products,read_product_listings,write_content",
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
    return res.status(401).send("Unauthorized");
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
      subscribeToWebHook(shop)
        .then(function () {
          res.redirect(
            "https://" + shop.config.shop + "/admin/apps/" + appConfig.appName
          );
        })
        .catch(function (error) {
          console.log(error);
          return res.status(400).send("Server error");
        });
    });
  } catch (e) {
    return res.status(400).send("Something went wrong");
  }
});

app.post("/app/butter-cms/config", verifyRequest, function (req, res) {
  try {
    var writeToken = req.body.config.butterCMSWriteToken;

    if (!writeToken) {
      return res.status(404).send("butterCMSWriteToken is missing");
    }
    butterCMSService.init(res.locals.shop.config.shop, {
      writeToken: writeToken,
    });
    res
      .status(200)
      .json({ message: "Configurations have been successfully saved" });
  } catch (e) {
    console.log(e);
    return res.status(400).send("Something went wrong");
  }
});

app.get("/app/collections", verifyRequest, function (req, res) {
  try {
    var shop = res.locals.shop;
    shopifyService.getCollections(shop).then(function (collections) {
      return res.status(200).json(collections);
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.get(
  "/app/butter-cms/promotional-pages/page/:page",
  verifyRequest,
  function (req, res) {
    try {
      var shop = res.locals.shop;
      var shopName = shop.config.shop;
      return butterCMSService
        .getPages(shopName, "promotional_page", req.params.page || 1)
        .then(function (pages) {
          console.log(pages);
          return res.status(200).json(pages.data);
        })
        .catch(function (error) {
          console.log(error);
          return res.status(400).send("Server error");
        });
    } catch (e) {
      console.log(e);
      res.status(400).send("Server error");
    }
  }
);

app.post("/app/butter-cms/promotional-page", verifyRequest, function (
  req,
  res
) {
  try {
    var slug = req.body.slug;
    if (!slug) {
      return res.status(400).send("slug is missing");
    }
    var shop = res.locals.shop;
    var shopName = shop.config.shop;
    return butterCMSService
      .getPage(shopName, "promotional_page", slug)
      .then(function (response) {
        return response.data;
      })
      .then(function (page) {
        if (!page.data) {
          throw Error("Page not found");
        }
        return shopifyService.createPage(shop, {
          title: page.data.fields.seo.title,
          body_html:
            "<h1>" +
            page.data.fields.twitter_card.title +
            "</h1>" +
            "<p>" +
            page.data.fields.twitter_card.Description +
            "</p>" +
            "<img src='" +
            page.data.fields.twitter_card.image +
            "' />" +
            generatePageFromProducts(page.data.fields.products),
          slug: page.data.slug,
        });
      })
      .then(function (response) {
        console.log("response form shopify", response);
        res.status(200).json(response);
      })
      .catch(function (error) {
        console.log(error);
        return res.status(400).send("Server error");
      });
  } catch (e) {
    console.log(e);
    res.status(400).send("Server error");
  }
});

app.post("/app/butter-cms/collections/page", verifyRequest, function (
  req,
  res
) {
  try {
    var shop = res.locals.shop;
    var shopName = shop.config.shop;
    var collectionId = req.body.collectionId;
    Promise.all([
      shopifyService.getCollectionProducts(shop, collectionId),
      shopifyService.getCollection(shop, collectionId),
    ])
      .then(function (response) {
        var products = response[0];
        var collection = response[1];

        return butterCMSService.createPage(shopName, {
          title: collection.title,
          slug: collection.handle,
          "page-type": "promotional_page",
          fields: {
            en: {
              seo: {
                title: collection.title,
                meta_description: "meta description",
              },
              twitter_card: {
                title: collection.title,
                Description: collection.body_html,
                image: collection.image.src,
              },
              products: [] /*products.map(function (product) {
                  return [
                    {
                      product_image: product.image.src,
                      product_description: product.body_html,
                    },
                  ];
                }),*/,
            },
          },
        });
      })
      .then(function (result) {
        console.log({ result });
        if (result.status === "pending") {
          return "Successfully created page";
          // return butterCMSService.getPages(shopName, "promotional_page");
        }
        throw Error("Error occurred during page creation");
      })
      // .then(function (pages) {
      //   console.log(pages.data);
      //   return res.status(200).send(pages.data);
      // })
      .catch(function (e) {
        console.log(e, "error here-1");
        return res.status(400).send("Server error");
      });
  } catch (e) {
    console.log(e, "error here");
    res.status(400).send("Server error");
  }
});

app.post("/app/subscription", function (req, res) {
  try {
    console.log("Subscription fired!!!", req.body, req.headers);
    // TODO: add request verification
    console.log("item", {
      name: req.body.title,
      image: req.body.image.src,
      description: req.body.body_html,
    });
    return butterCMSService
      .addItemToCollection(req.headers["x-shopify-shop-domain"], "products", {
        name: req.body.title,
        image: req.body.image.src,
        description: req.body.body_html,
      })
      .then(function (response) {
        console.log("res", response);
        res.status(200).send(response);
      })
      .catch(function (error) {
        console.log(error);
        return res.status(400).send("Server error");
      });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Server error");
  }
  // return res.status(200).send("Great!");
});

app.use(express.static(path.join(__dirname, "/dist/app-ui")));

app.get("/*", verifyRequest, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/app-ui/index.html"));
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

function generatePageFromProducts(products) {
  return products.reduce(function (res, product) {
    var str =
      "<h4>" +
      product.product_name +
      "<h4>" +
      "<img src='" +
      product.product_image +
      "'/>" +
      "<p>" +
      product.product_description +
      "</p>";
    return res + str;
  }, "");
}

function subscribeToWebHook(shop) {
  return shopifyService.subscribeToWebHook(
    shop,
    forwardingAddress + "/app/subscription/"
  );
}
