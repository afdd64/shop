// app.js
App({
  globalData: {
      userInfo: null,
      userId: null,
      token: null
  },

  // 登录方法
  login(code, userInfo) {
      if (!userInfo) {
          console.error('传递给 login 方法的 userInfo 参数未定义');
          return Promise.reject(new Error('传递给 login 方法的 userInfo 参数未定义'));
      }

      return new Promise((resolve, reject) => {
          wx.request({
              url: 'http://localhost:3000/login',
              method: 'POST',
              data: {
                  code,
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl
              },
              success: (res) => {
                  const data = res.data;
                  if (data && data.code === 200) {
                      this.globalData.userId = data.userId;
                      this.globalData.token = data.token;
                      this.globalData.userInfo = userInfo;
                      resolve();
                  } else {
                      wx.showToast({
                          title: `登录失败，后端返回信息: ${data.message || '未知错误'}`,
                          icon: 'none'
                      });
                      reject(new Error(data.message || '登录失败'));
                  }
              },
              fail: (err) => {
                  wx.showToast({
                      title: `请求后端登录接口失败: ${err.errMsg}`,
                      icon: 'none'
                  });
                  reject(err);
              }
          });
      });
  },

  // 购物车操作方法
  cart: {
      getKey() {
          const userId = getApp().globalData.userId || 'guest';
          return `cart_${userId}`;
      },

      get() {
          try {
              return wx.getStorageSync(this.getKey()) || [];
          } catch (e) {
              return [];
          }
      },

      save(items) {
          wx.setStorageSync(this.getKey(), items);
      },

      add(item) {
          const cart = this.get();
          const existing = cart.find(i => i.product_id === item.product_id);
          if (existing) {
              existing.quantity += item.quantity;
          } else {
              cart.push(item);
          }
          this.save(cart);
          return cart;
      },

      update(productId, quantity) {
          const cart = this.get();
          const item = cart.find(i => i.product_id === productId);
          if (item) {
              item.quantity = quantity;
              this.save(cart);
          }
          return cart;
      },

      remove(productId) {
          const cart = this.get().filter(i => i.product_id !== productId);
          this.save(cart);
          return cart;
      },

      clear() {
          this.save([]);
      }
  }
});