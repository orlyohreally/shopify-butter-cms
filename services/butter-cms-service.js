var butterCMS = require("buttercms");
var requestPromise = require("request-promise");

var ButterCMSService = {
  configs: {},
  butter: {},
  init: function (shopName, configs) {
    this.configs[shopName] = configs;
  },
  createPage: function (shopName, pageBody) {
    var options = {
      method: "POST",
      uri: "https://api.buttercms.com/v2/pages/",
      body: pageBody,
      json: true,
      headers: {
        authorization: "Token " + this.configs[shopName].writeToken,
      },
    };

    return requestPromise(options)
      .then(function (parsedBody) {
        return parsedBody;
      })
      .catch(function (err) {
        console.log(err);
        throw err;
      });
  },
  getPages: function (shopName, type, pageNumber) {
    if (!this.configs[shopName] || !this.configs[shopName].writeToken) {
      throw Error("No token");
    }
    var butter = butterCMS(this.configs[shopName].writeToken);
    var params = {
      preview: 1,
      page: pageNumber,
      page_size: 10,
      locale: "en",
      levels: 2,
    };

    return butter.page.list(type, params);
  },
  getPage: function (shopName, type, slug) {
    if (!this.configs[shopName] || !this.configs[shopName].writeToken) {
      throw Error("No token");
    }
    var butter = butterCMS(this.configs[shopName].writeToken);
    return butter.page.retrieve(type, slug, {
      locale: "en",
      preview: 1,
    });
  },
  addItemToCollection: function (shopName, collectionName, item) {
    var butter = butterCMS(this.configs[shopName].writeToken);
    var body = {
      key: "products",
      status: "published",
      fields: [
        {
          en: item,
        },
      ],
    };
    var options = {
      method: "POST",
      uri: "https://api.buttercms.com/v2/content/",
      body: body,
      json: true,
      headers: {
        authorization: "Token " + this.configs[shopName].writeToken,
      },
    };

    return butter.content
      .retrieve([collectionName])
      .then(function (resp) {
        console.log("resp", resp.data);
        if (resp.data) {
          return requestPromise(options).then(function (parsedBody) {
            console.log({ parsedBody: parsedBody });
            return parsedBody;
          });
        }
        return;
      })
      .catch(function (resp) {
        console.log("error", resp);
      });
  },
};

module.exports = ButterCMSService;
