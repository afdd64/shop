// pages/order/order.js
const app = getApp();

Page({
  data: {
    order: null,
    paymentMethods: [
      { value: 'wechat', name: '微信支付' },
      { value: 'wallet', name: '钱包支付' }
    ]
  },

  onLoad(options) {
    const orderId = options.id;
    this.loadOrder(orderId);
  },

  async loadOrder(orderId) {
    try {
      const { data } = await wx.request({
        url: `http://localhost:3000/order/${orderId}`,
        header: { 'X-User-Id': app.globalData.userId }
      });
      this.setData({ order: data });
    } catch (e) {
      wx.showToast({ title: '加载订单失败', icon: 'none' });
    }
  },

  async cancelOrder() {
    const orderId = this.data.order.id;
    try {
      await wx.request({
        url: `http://localhost:3000/order/${orderId}/cancel`,
        method: 'POST',
        header: { 'X-User-Id': app.globalData.userId }
      });
      wx.navigateBack();
    } catch (e) {
      wx.showToast({ title: '取消订单失败', icon: 'none' });
    }
  },

  async handlePayment() {
    wx.showActionSheet({
      itemList: this.data.paymentMethods.map(method => method.name),
      success: async (res) => {
        const selectedMethod = this.data.paymentMethods[res.tapIndex].value;
        if (selectedMethod === 'wechat') {
          await this.wechatPayment();
        } else if (selectedMethod === 'wallet') {
          await this.walletPayment();
        }
      }
    });
  },

  async wechatPayment() {
    wx.showToast({ title: '支付完成', icon: 'success' });
    await this.updateOrdertatus('paid');
    wx.navigateTo({ url: `/pages/order/order?id=${this.data.order.id}` });
  },

  async walletPayment() {
    const { data } = await wx.request({
      url: 'http://localhost:3000/wallet',
      header: { 'X-User-Id': app.globalData.userId }
    });
    const walletBalance = data.balance;
    const orderAmount = this.data.order.product_price;

    if (walletBalance < orderAmount) {
      wx.showToast({ title: '金额不足，请充值', icon: 'none' });
    } else {
      wx.showModal({
        title: '确认支付',
        content: `当前余额：${walletBalance} 元，支付后余额：${walletBalance - orderAmount} 元，是否确认支付？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await wx.request({
                url: 'http://localhost:3000/wallet/pay',
                method: 'POST',
                header: { 'X-User-Id': app.globalData.userId },
                data: { amount: orderAmount }
              });
              await this.updateOrdertatus('paid');
              wx.showToast({ title: '支付成功', icon: 'success' });
              wx.navigateTo({ url: `/pages/order/order?id=${this.data.order.id}` });
            } catch (e) {
              wx.showToast({ title: '支付失败', icon: 'none' });
            }
          }
        }
      });
    }
  },

  async updateOrdertatus(status) {
    const orderId = this.data.order.id;
    await wx.request({
      url: `http://localhost:3000/order/${orderId}/status`,
      method: 'POST',
      header: { 'X-User-Id': app.globalData.userId },
      data: { status }
    });
  }
});