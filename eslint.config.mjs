// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt().overrideRules({
  // Your custom configs here
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
});
