Page({
  data: {
    categories: [], // 分类数据
    products: []   // 商品数据
  },
  onLoad() {
    this.loadCategories();
    this.loadProducts();
  },
  loadCategories() {
    wx.request({
      url: 'http://localhost:3000/categories',
      method: 'GET',
      header: {
        'X-User-Id': getApp().globalData.userId,
        'X-Session-Key': getApp().globalData.sessionKey
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ categories: res.data.categories });
        } else {
          console.error('加载分类失败:', res.data.message);
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
      }
    });
  },
  loadProducts() {
    wx.request({
      url: 'http://localhost:3000/products',
      success: (res) => {
        this.setData({ products: res.data });
      },
      fail: (err) => {
        console.error('加载商品失败:', err);
      }
    });
  },
  onBack() {
    wx.navigateBack();
  },
  // ----------------- 新增以下两个方法 -----------------
  onCategoryTap(e) {
    // 跳转到分类商品列表页
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/category/category?id=${categoryId}`
    });
  },
  onProductTap(e) {
    // 跳转到商品详情页
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/product?id=${productId}`
    });
  }
});