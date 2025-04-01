Page({
  data: {
    categoryId: null,
    products: [],
    categories: [],
    productsByCategory: [],
    searchResults: [],
    fixedCategoryTitle: null,
    currentCategoryName: null
  },
  onLoad(options) {
    const categoryId = options.id;
    this.setData({ categoryId });
    this.loadCategories();
    this.loadProducts(categoryId);
    // 动态设置标题
    wx.setNavigationBarTitle({ title: options.title || '分类商品' });
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
          this.groupProductsByCategory();
        } else {
          console.error('加载分类失败:', res.data.message);
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
      }
    });
  },
  loadProducts(categoryId) {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: `http://localhost:3000/products?category_id=${categoryId}`,
      success: (res) => {
        this.setData({ products: res.data });
        this.groupProductsByCategory();
      },
      fail: (err) => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  groupProductsByCategory() {
    const { categories, products } = this.data;
    const productsByCategory = categories.map(category => {
      const categoryProducts = products.filter(product => product.category_id === category.id);
      return {
        categoryId: category.id,
        categoryName: category.name,
        products: categoryProducts
      };
    });
    this.setData({ productsByCategory });
  },
  onSearchInput(e) {
    const keyword = e.detail.value;
    if (keyword) {
      const { products } = this.data;
      const searchResults = products.filter(product => product.name.includes(keyword));
      this.setData({ searchResults });
    } else {
      this.setData({ searchResults: [] });
    }
  },
  onSearchResultTap(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/product?id=${productId}`
    });
  },
  onCategoryItemTap(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.loadProducts(categoryId);
  },
  onProductTap(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/product?id=${productId}`
    });
  },
  onProductScroll(e) {
    const { scrollTop } = e.detail;
    const { productsByCategory } = this.data;
    let fixedCategoryTitle = null;
    let currentCategoryName = null;
    for (let i = 0; i < productsByCategory.length; i++) {
      const category = productsByCategory[i];
      const categoryTitle = wx.createSelectorQuery().select(`#category-${category.categoryId}`);
      categoryTitle.boundingClientRect(rect => {
        if (rect && rect.top <= 0 && rect.bottom > 0) {
          fixedCategoryTitle = category.categoryName;
          currentCategoryName = category.categoryName;
        }
      }).exec();
    }
    this.setData({ fixedCategoryTitle, currentCategoryName });
    this.highlightCategory(currentCategoryName);
  },
  highlightCategory(categoryName) {
    const { categories } = this.data;
    const updatedCategories = categories.map(category => {
      let className = '';
      if (category.name === categoryName) {
        className = 'highlight-category';
      }
      return {
       ...category,
        className
      };
    });
    this.setData({ categories: updatedCategories });
  }
});