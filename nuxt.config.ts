// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: '薪资跳动 - 实时收入计算器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '实时显示你的工作收入，将抽象的月薪转化为具体的数字跳动' }
      ]
    }
  },
  css: ['~/assets/css/main.css']
}) 