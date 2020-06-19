export interface Collection {
  admin_graphql_api_id: string;
  body_html: string;
  handle: string;
  id: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    created_at: string;
  };
  published_at: string;
  published_scope: string;
  sort_order: string;
  template_suffix: string;
  title: string;
  updated_at: string;
}

export interface PromotionalPage {
  slug: string;
  page_type: 'promotional_page';
  fields: {
    seo: { title: string; meta_description: string };
    twitter_card: {
      title: string;
      Description: string;
      image: string;
    };
    products: [
      {
        product_name: string;
        product_image: string;
        product_description: string;
      }
    ];
  };
}
