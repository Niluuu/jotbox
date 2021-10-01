if (process.env.NODE_ENV !== 'test') {
  import('!style-loader!css-loader!resolve-url-loader!sass-loader!../src/styles/index.scss');
} 

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}