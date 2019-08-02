// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-write-svg": {
			"utf8": false
		},
    // to edit target browsers: use "browserslist" field in package.json
  },
  "postcss-px-to-viewport": {
    viewportHeight: 1334,
      viewportWidth: 750,     // (Number) 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      unitPrecision: 3,       // (Number) 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw',     // (String) Expected units.
      selectorBlackList: ['.ignore', '.hairlines'],  // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1,       // (Number) Set the minimum pixel value to replace.
      mediaQuery: false       // (Boolean)允许在媒体查询中转换`px
  }, 
  "cssnano": {
    preset: "advanced",
    // autoprefixer: false,
    "postcss-zindex": false
  },
  // "postcss-viewport-units":{},
}
