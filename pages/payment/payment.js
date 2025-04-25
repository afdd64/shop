// pages/payment/payment.js
const app = getApp();

Page({
  data: {
    paymentAmount: 0,
    cartItems: [],
    currentProduct: null,
    selectedAddress: null
  },

  onLoad(options) {
    this.initPaymentData(options.type);
  },

  async loadDefaultAddress() {
    try {
      const { data: responseData } = await wx.request({
        url: 'http://localhost:3000/addresses/default',
        header: { 'X-User-Id': app.globalData.userId }
      });
      if (responseData) {
        this.setData({ selectedAddress: responseData });
      }
    } catch (e) {
      console.error('加载地址失败', e);
    }
  },

  async chooseAddress() {
    return new Promise((resolve) => {
      wx.navigateTo({
        url: '/pages/address/address?selectMode=true',
        success: (res) => {
          const eventChannel = res.eventChannel;
          eventChannel.on('chooseAddress', (data) => {
            this.setData({ selectedAddress: data });
            resolve(data);
          });
        }
      });
    });
  },

  initPaymentData(type) {
    if (type === 'cart') {
      const cartItems = app.cart.get();
      if (cartItems.length === 0) {
        wx.showToast({ title: '购物车为空', icon: 'none' });
        return wx.navigateBack();
      }
      const amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      this.setData({ paymentAmount: amount, cartItems });
    } else {
      const product = app.globalData.currentProduct;
      if (!product || !product.price) {
        wx.showToast({ title: '商品信息错误', icon: 'none' });
        return wx.navigateBack();
      }
      this.setData({ paymentAmount: product.price, currentProduct: product });
    }
  },

  async handlePayment() {
    if (!this.data.selectedAddress) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }

    try {
      const addressId = this.data.selectedAddress.id;
      let items = [];
      let totalAmount = 0;

      if (this.data.cartItems) {
        items = this.data.cartItems;
        totalAmount = this.data.paymentAmount;
      } else if (this.data.currentProduct) {
        items = [
          {
            product_id: this.data.currentProduct.id,
            quantity: 1,
            price: this.data.currentProduct.price
          }
        ];
        totalAmount = this.data.paymentAmount;
      }

      // 创建订单
      const { data: orderData } = await wx.request({
        url: 'http://localhost:3000/orders',
        method: 'POST',
        header: {
          'X-User-Id': app.globalData.userId,
          'Authorization': app.globalData.token
        },
        data: {
          items,
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