function seo(title, desc, image, route, store) {

  return {
    title: title,
    meta: [
      {
        hid: 'og-title',
        name: 'title',
        property: 'og:title',
        content: title
      },
      {
        hid: 'description',
        name: 'description',
        content: desc
      },
      {
        hid: 'og-image',
        name: 'image',
        property: 'og:image',
        content: image
      },
      {
        hid: 'twitter-card',
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        hid: 'twitter-site',
        name: 'twitter:site',
        content: 'SITENAME'
      },
      {
        hid: 'twitter-title',
        name: 'twitter:title',
        content: title
      },
      {
        hid: 'twitter-description',
        name: 'twitter:description',
        content: desc
      },
      {
        hid: 'twitter-image',
        name: 'twitter:image',
        content: image
      },
      {
        hid: 'author',
        name: 'author',
        content: 'SITENAME'
      },
    ],
    link: [
      {
        rel: 'alternate',
        href: store.state.app.baseUrl + route.path,
        hreflang: route.meta.lang,
      },
      {
        rel: 'alternate',
        href: store.state.app.baseUrl + route.meta.translation,
        hreflang: route.meta.lang == 'fr' ? 'en' : 'fr',
      },
      {
        rel: 'alternate',
        href: route.meta.lang == 'fr' ?
              store.state.app.baseUrl + route.meta.translation :
              store.state.app.baseUrl + route.path,
        hreflang: 'x-default',
      }
    ]
  }
}

export default seo
