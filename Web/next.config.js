const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const withImages = require("next-images");
const withFonts = require("next-fonts");
const withPlugins = require("next-compose-plugins");

const rewriteRules = [
  {
    source: '/robots.txt',
    destination: '/api/robots'
  },
  {
    source: '/ads.txt',
    destination: '/api/ads-txt'
  },
  {
    source: '/sitemap_index.xml',
    destination: '/api/sitemap'
  },
  {
    source: '/page-sitemap.xml',
    destination: '/api/page-sitemap'
  },
  {
    source: '/post-sitemap.xml',
    destination: '/api/post-sitemap'
  },
  {
    source: '/category-sitemap.xml',
    destination: '/api/category-sitemap'
  }
];

module.exports = withPlugins([withImages, withFonts, {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // https://github.com/webpack-contrib/mini-css-extract-plugin#recommended
    // For production builds it's recommended to extract the CSS from your bundle being able to use parallel loading of CSS/JS resources later on.
    // For development mode, using style-loader because it injects CSS into the DOM using multiple <style></style> and works faster.
    if (!dev) {
      config.plugins.push(new MiniCssExtractPlugin({
        filename: 'static/chunks/[name].[fullhash].css',
        ignoreOrder: true
      }));
    }
    config.module.rules.push(
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isServer ? { loader: 'file-loader' } : (dev ? { loader: 'style-loader' } : { loader: MiniCssExtractPlugin.loader }),
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    );
    return config;
  },
  env: {
    REACT_APP_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
    REACT_APP_PREFIX: process.env.NEXT_PUBLIC_PREFIX,
    REACT_APP_SAMESITE: process.env.NEXT_PUBLIC_SAMESITE
  },
  typescript: {
    ignoreBuildErrors: true,

  },
  images: {
    domains: ['storage.googleapis.com'],
  },
  rewrites: async () => rewriteRules,
  // i18n: {
  //   locales: ["vi"],
  //   defaultLocale: 'vi',
  //   localeDetection: false
  // },
  poweredByHeader: false,
  trailingSlash: true,
  distDir: ".next"
}]);
