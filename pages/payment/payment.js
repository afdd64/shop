// pages/payment/payment.js
const app = getApp()

Page({
  data: {
    paymentAmount: 0,
    cartItems: [],
    currentProduct: null,
    selectedAddress: null
  },

  onLoad(options) {
    this.initPaymentData(options.type)
    this.loadDefaultAddress()
  },

  async loadDefaultAddress() {
    try {
      const { data } = await wx.request({
        url: 'http://localhost:3000/addresses/default',
        header: { 'X-User-Id': app.globalData.userId }
      })
      if (data) {
        this.setData({ selectedAddress: data })
      }
    } catch (e) {
      console.error('加载地址失败', e)
    }
  },

  async chooseAddress() {
    const { data } = await wx.navigateTo({
      url: '/pages/address/address?selectMode=true'
    })
    if (data) {
      this.setData({ selectedAddress: data })
    }
  },

  initPaymentData(type) {
    if (type === 'cart') {
      const cartItems = app.cart.get()
      if (cartItems.length === 0) {
        wx.showToast({ title: '购物车为空', icon: 'none' })
        return wx.navigateBack()
      }
      const amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      this.setData({ paymentAmount: amount, cartItems })
    } else {
      const product = app.globalData.currentProduct
      if (!product || !product.price) {
        wx.showToast({ title: '商品信息错误', icon: 'none' })
        return wx.navigateBack()
      }
      this.setData({ paymentAmount: product.price, currentProduct: product })
    }
  },

  async handlePayment() {
    try {
      const userId = app.globalData.userId
      const cartItems = app.cart.get()
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const addressId = this.data.selectedAddress.id

      const response = await wx.request({
        url: 'http://localhost:3000/order',
        method: 'POST',
        header: {
          'X-User-Id': userId,
          'Authorization': app.globalData.token,
          'Content-Type': 'application/json'
        },
        data: {
          items: cartItems.map(item => ({
            product_id: item.id, // 假设商品 ID 字段为 id
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount,
          addressId
        }
      })

      if (response.statusCode === 200) {
        console.log('订单创建成功:', response.data)
        // 处理订单创建成功的逻辑
      } else {
        console.error('订单创建失败:', response)
        wx.showToast({ title: '订单创建失败', icon: 'none' })
      }
    } catch (error) {
      console.error('创建订单时出错:', error)
      wx.showToast({ title: '请求出错', icon: 'none' })
    }
  }
})