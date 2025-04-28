const app = getApp(); // 添加这一行来获取全局 App 实例
Page({
  data: {
    product: {
      images: [],
      name: '',
      price: 0,
      description: '',
      originalPrice: 0
    }
  },
  onLoad(options) {
    this.loadProduct(options.id);
  },
  loadProduct(productId) {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: `http://localhost:3000/products/${productId}`,
      success: (res) => {
        this.setData({ 
          product: {
            ...res.data,
            images: res.data.images || [res.data.image] // 兼容单张图片
          }
        });
        wx.setNavigationBarTitle({ title: res.data.name });
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  addToCart() {
    const cartItem = {
      product_id: this.data.product.id,
      name: this.data.product.name,
      price: this.data.product.price,
      image: this.data.product.images[0],
      quantity: 1
    }
    
    getApp().cart.add(cartItem)
    wx.showToast({ title: '已加入购物车' })
  },
  
  buyNow() {
    if (!app.globalData.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    
    // 缓存当前商品
    app.globalData.currentProduct = this.data.product
    // 添加检测代码，输出商品信息到控制台
    console.log('即将传输到支付页面的商品信息:', app.globalData.currentProduct);
    wx.navigateTo({
      url: '/pages/payment/payment?type=single'
    })
  }
});