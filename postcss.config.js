const cssnano = [
  'cssnano',
  {
    preset: 'advanced',
    discardComments: { removeAll: true },
    zindex: false,
  },
]

module.exports = {
  plugins: [
    // prevent some syntax error
    'postcss-nested',
    ...(process.env.NODE_ENV === 'production'
      ? [
          'postcss-flexbugs-fixes',
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
              features: {
                'custom-properties': false,
              },
            },
          ],
          cssnano,
        ]
      : []),
  ],
}
