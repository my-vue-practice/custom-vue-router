let Vue;
// let current = location.hash.slice(1);

class XVueRouter {
  constructor(options) {
    this.$options = options;
    console.log('[XVueRouter constructor]', this.$options);
    Vue.util.defineReactive(this, 'current', location.hash.slice(1) || '/');
    this.registerHashChange();
  }
  registerHashChange() {
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1);
      console.log(hash);
      // Vue.set(this.$data, 'current', hash);
      this.current = hash;
    });
  }
}

// Vue插件实现install方法，接收Vue实例_Vue和插件参数options
XVueRouter.install = _Vue => {
  // console.log(_Vue);
  Vue = _Vue;

  // Vue.prototype.$router = XVueRouter;

  console.log('[XVueRouter install]');

  // window.addEventListener('hashchange', () => {
  //   const hash = location.hash.slice(1);
  //   console.log(hash);
  //   //! 如何拿到用户传进来的routes配置（组件）？执行顺序：install > constructor > new Vue

  // });

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
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        default: '/'
      }
    },
    beforeUpdate() {
      console.log('router-link beforeUpdate');
    },
    updated() {
      console.log('router-link updated');
    },
    render(h) {
      return h(
        'a',
        {
          attrs: {
            href: '#' + this.to
          }
        },
        this.$slots.default
      );
    }
  });

  /** 实现router-view组件 */
  Vue.component('router-view', {
    render(h) {
      let component = null;
      // console.log(this.$router);
      const routes = this.$router.$options.routes;
      console.log(this.$router);
      for (const comp of routes) {
        // 如果配置的路由等于当前hash，就将配置中component取出放入router-view组件中。
        if (comp.path === this.$router.current) {
          component = comp.component;
          // console.log(component);
          break;
        }
      }
      return h(component);
    }
  });
};

export default XVueRouter;
