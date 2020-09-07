import Link from './x-router-link';
import View from './x-router-view';

// 全局保存Vue对象，方便使用。
let Vue;

class XVueRouter {
  constructor(options) {
    this.$options = options;
    console.log('[XVueRouter constructor]', this.$options);
    // 响应式方法1：使用vue工具方法，将current配置成响应式属性，一旦修改，所以依赖的地方就会自动更新。使用：this.current
    Vue.util.defineReactive(this, 'current', location.hash.slice(1) || '/');
    // 响应式方法2：使用vue实例方法, 使用：this.app.current
    // this.app = new Vue({
    //   data() {
    //     return {
    //       current: location.hash.slice(1) || '/'
    //     };
    //   }
    // });
    this.registerHashChange();

    // routes配置项转成map形式，方便获取。
    this.routeMap = {};
    options.routes.forEach(route => {
      this.routeMap[route.path] = route;
    });
  }
  registerHashChange() {
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1);
      console.log(hash);
      this.current = hash;
    });
  }
}

// Vue插件实现install方法，接收Vue实例_Vue和插件参数options
XVueRouter.install = _Vue => {
  Vue = _Vue;
  console.log('[XVueRouter install]');

  //! 如何拿到用户传进来的routes配置（组件）？执行顺序：install > constructor > new Vue
  // 获取用户配置的XVueRouter实例
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    }
  });

  // 实现两个自定义组件：router-link、router-view
  /** 实现router-link组件 */
  Vue.component('router-link', Link);

  /** 实现router-view组件 */
  Vue.component('router-view', View);
};

export default XVueRouter;
