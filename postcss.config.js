const cssnano = [
  'cssnano',
  {
    preset: 'advanced',
    discardComments: { removeAll: true },
    zindex: false,
  },
]

module.exports = {
  plugins: ['postcss-nested', cssnano],
}
