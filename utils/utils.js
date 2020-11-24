// eslint-disable-next-line @typescript-eslint/no-var-requires
const merge = require('lodash.merge');

const desktopAssets = {
  scripts: [
    'https://www.clickbus.com.br/static/js/vendors.min.js?v=1.0-639',
    'https://www.clickbus.com.br/static/js/desktop_main.min.js?v=1.0-639',
    'https://www.clickbus.com.br/static/js/components.min.js?v=1.0-639',
    'https://www.clickbus.com.br/static/js/datalayer.min.js?v=1.0-639',
  ],
  links: [
    {
      rel: 'stylesheet',
      href:
        'https://www.clickbus.com.br/static/css/brazil_main.min.css?v=1.0-622',
    },
  ],
};

const mobileAssets = {
  scripts: [
    'https://www.clickbus.com.br/static/js/vendors.min.js?v=0.1-721',
    'https://www.clickbus.com.br/static/js/commons.min.js?v=0.1-721',
    'https://www.clickbus.com.br/static/js/home.min.js?v=0.1-721',
  ],
  links: [
    {
      rel: 'stylesheet',
      href:
        'https://www.clickbus.com.br/static/css/brazil-first-render.min.css?v=0.1-721',
    },
    {
      rel: 'stylesheet',
      href: 'https://www.clickbus.com.br/static/css/brazil.min.css?v=0.1-721',
    },
  ],
};

const generateDevHTMLWebpackAssets = (config) => {
  const environment = process.env.CB_ENVIRONMENT;
  return environment === 'desktop'
    ? merge(config, desktopAssets)
    : merge(config, mobileAssets);
};

module.exports = generateDevHTMLWebpackAssets;
