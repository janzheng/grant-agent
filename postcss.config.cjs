const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const config = {
  syntax: 'postcss-scss',
  plugins: [
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailwindcss(),
    require('postcss-nested'),
    require('tailwindcss'),
    require('postcss-import'),
    require('autoprefixer'),
    require('cssnano'),
    //But others, like autoprefixer, need to run after,
    autoprefixer,
  ],
};

module.exports = config;
