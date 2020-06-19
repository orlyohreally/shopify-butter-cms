var mustache = require("mustache");

var utils = {
  fillTemplate: function (template, data) {
    return mustache.render(template, data);
  },
};

module.exports = utils;

/*

 `{{#products}}
    <div class="grid-view-item grid-view-item--sold-out product-card">
    <a class="grid-view-item__link grid-view-item__image-container full-width-link" href="/collections/all/products/{{product_name}}">
    <span class="visually-hidden">{{product_description}}</span>
    <span class="visually-hidden">{{product_name}}</span>
    <img class="visually-hidden" src='{{product_name}}' />
    </a>{{/products}}
          `
          
          
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
            
            
            { slug: 'brand-new-dog-socks',
     page_type: 'promotional_page',
     fields:
      { seo: {
          title: '',
          meta_description: ''
      },
        twitter_card: {
            title: '',
            Description: '',
            image: ''
        },
        product_promo_banner:  {
            product: {
                name: '',
                image: '',
                description: ''
            },
            headline: '
        } } } }
        

        {{#fields.product_promo_banner.products}}
      <div class="grid-view-item grid-view-item--sold-out product-card">
      <a class="grid-view-item__link grid-view-item__image-container full-width-link" href="/collections/all/products/{{name}}">
      <span class="visually-hidden">{{description}}</span>
      <span class="visually-hidden">{{name}}</span>
      <img class="visually-hidden" src='{{name}}' />
      </a>{{/products}}
        */
