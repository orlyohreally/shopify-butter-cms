var butterCMS = require("buttercms");

var ButterCMSService = {
  butter: {},
  init: function (apiToken) {
    this.butter = butterCMS(apiToken);
  },
  createPosts: function () {
    return this.butter.post.list({ page: 1, page_size: 10 });
    //   .then(function (response) {
    //     console.log(response);
    //   });
  },
};

module.exports = ButterCMSService;
