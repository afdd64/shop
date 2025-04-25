// shop/pages/cart/cart.js
const app = getApp();

Page({
    data: {
        cartItems: [],
        totalPrice: 0
    },

    onShow() {
        this.loadCart();
        if (app.globalData.userId) {
            this.syncWithServer();
        }
    },

    // 加载购物车数据
    loadCart() {
        const cartItems = app.cart.get();
        this.calculateTotal(cartItems);
        this.setData({ cartItems });
    },

    // 计算总价
    calculateTotal(cartItems) {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.setData({ totalPrice: total.toFixed(2) });
    },

    // 同步服务端购物车
    async syncWithServer() {
        wx.showLoading({ title: '同步中...' });
        try {
            // 1. 上传本地购物车
            const localCart = app.cart.get();
            await wxRequest({
                url: 'http://localhost:3000/cart/sync',
                method: 'POST',
                header: {
                    'X-User-Id': app.globalData.userId,
                    'Authorization': app.globalData.token
                },
                data: { cartItems: localCart }
            });

            // 2. 下载服务端购物车
            const { data } = await wxRequest({
                url: 'http://localhost:3000/cart',
                header: {
                    'X-User-Id': app.globalData.userId,
                    'Authorization': app.globalData.token
                }
            });

            // 3. 合并数据
            const mergedCart = this.mergeCarts(localCart, data.data);
            app.cart.save(mergedCart);
            this.loadCart();
        } catch (e) {
            console.error('购物车同步失败', e);
        } finally {
            wx.hideLoading();
        }
    },

    // 合并本地和服务端购物车
    mergeCarts(localCart, serverCart) {
        const cartMap = new Map();
        serverCart.forEach(item => cartMap.set(item.product_id, item));
        localCart.forEach(item => {
            if (!cartMap.has(item.product_id)) {
                cartMap.set(item.product_id, item);
            }
        });
        return Array.from(cartMap.values());
    },

    // 增加数量
    increaseQuantity(e) {
        const productId = e.currentTarget.dataset.id;
        const cartItems = app.cart.update(productId, this.getQuantity(productId) + 1);
        this.calculateTotal(cartItems);
        this.setData({ cartItems });
    },

    // 减少数量
    decreaseQuantity(e) {
        const productId = e.currentTarget.dataset.id;
        const quantity = this.getQuantity(productId) - 1;
        if (quantity > 0) {
            const cartItems = app.cart.update(productId, quantity);
            this.calculateTotal(cartItems);
            this.setData({ cartItems });
        }
    },

    // 获取商品数量
    getQuantity(productId) {
        const item = this.data.cartItems.find(i => i.product_id === productId);
        return item ? item.quantity : 0;
    },

    // 删除商品
    removeItem(e) {
        const productId = e.currentTarget.dataset.id;
        const cartItems = app.cart.remove(productId);
        this.calculateTotal(cartItems);
        this.setData({ cartItems });
    },

    // 跳转支付
    async gotoPayment() {
      if (this.data.totalPrice <= 0) {
          wx.showToast({ title: '请选择商品', icon: 'none' });
          return;
      }
  
      try {
          // 获取收货地址
          const { data: addressData } = await wx.request({
              url: 'http://localhost:3000/addresses/default',
              header: { 'X-User-Id': app.globalData.userId }
          });
          if (!addressData) {
              wx.showToast({ title: '请添加收货地址', icon: 'none' });
              return;
          }
          const addressId = addressData.id;
  
          // 创建订单
          const cartItems = app.cart.get();
          const totalAmount = this.data.totalPrice;
          const { data: orderData } = await wx.request({
              url: 'http://localhost:3000/orders',
              method: 'POST',
              header: {
                  'X-User-Id': app.globalData.userId,
                  'Authorization': app.globalData.token
              },
              data: {
                  items: cartItems,
                  totalAmount,
                  addressId
              }
          });
  
          // 跳转到订单详情页面
          wx.navigateTo({
              url: `/pages/order/order?id=${orderData.data.orderId}`
          });
      } catch (e) {
          console.error('创建订单失败', e);
          wx.showToast({ title: '创建订单失败', icon: 'none' });
      }
    }
    });

// 封装 wx.request 为 Promise
function wxRequest(options) {
    return new Promise((resolve, reject) => {
        wx.request({
            ...options,
            success: resolve,
            fail: reject
        });
    });
}