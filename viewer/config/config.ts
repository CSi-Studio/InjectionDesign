import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import routes from './routes';

export default defineConfig({
  define: {
    // API_URL: 'http://192.168.1.91:8080'
    // API_URL: 'http://192.168.1.171:8080',
    API_URL: 'http://localhost:8080/api',
    // API_URL: 'http://47.242.18.69:80',
  },

  hash: true,
  antd: {},
  request: {},
  initialState: {},
  model: {},
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 150,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.langzuage` overwrite default
    baseNavigator: true,
  },

  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },

  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: true,
  presets: ['umi-presets-pro'],
});
