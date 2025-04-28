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
        this.initPaymentData(options.type);
        this.loadDefaultAddress();
    },

    async loadDefaultAddress() {
        try {
            const { data } = await wx.request({
                url: 'http://localhost:3000/addresses/default',
                header: { 'X-User-Id': app.globalData.userId }
            });
            if (data) {
                this.setData({ selectedAddress: data });
            }
        } catch (e) {
            console.error('加载地址失败', e);
        }
    },

    async chooseAddress() {
        const { data } = await wx.navigateTo({
            url: '/pages/address/address?selectMode=true'
        });
        if (data) {
            this.setData({ selectedAddress: data });
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
            // 添加检测代码，输出接收到的商品信息到控制台
            console.log('从商品页面接收到的商品信息:', product);
            if (!product || !product.price) {
                wx.showToast({ title: '商品信息错误', icon: 'none' })
                return wx.navigateBack()
            }
            // 确保商品信息包含必要的字段
            const { id, name, price, quantity = 1 } = product;
            const singleItem = {
                product_id: Number(id), // 转换为数值
                name,
                price: Number(price),
                quantity: Number(quantity || 1)
            };
            this.setData({ 
                paymentAmount: price, 
                currentProduct: product,
                cartItems: [singleItem] // 模拟单个商品的购物车数据
            });
        }
    },

    async handlePayment() {
        try {
            const userId = app.globalData.userId;
            let items = [];
            let totalAmount = 0;
            const addressId = this.data.selectedAddress?.id;

            if (!addressId) {
                wx.showToast({ title: '请选择收货地址', icon: 'none' });
                return;
            }

            if (this.data.cartItems.length > 0) {
                items = this.data.cartItems;
                totalAmount = this.data.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            } else if (this.data.currentProduct) {
                items = [this.data.currentProduct];
                totalAmount = this.data.currentProduct.price;
            } else {
                wx.showToast({ title: '请选择商品', icon: 'none' });
                return;
            }

            const hasMissingProductId = items.some(item =>!item.product_id);
            if (hasMissingProductId) {
                wx.showToast({ title: '部分商品信息不完整，请检查', icon: 'none' });
                return;
            }

            if (totalAmount <= 0) {
                wx.showToast({ title: '订单金额必须大于 0', icon: 'none' });
                return;
            }

            const response = await new Promise((resolve, reject) => {
                wx.request({
                    url: 'http://localhost:3000/order',
                    method: 'POST',
                    header: {
                        'X-User-Id': userId,
                        'Authorization': app.globalData.token,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        items,
                        totalAmount,
                        addressId
                    },
                    success: (res) => {
                        resolve(res);
                    },
                    fail: (err) => {
                        reject(err);
                    }
                });
            });

            console.log('完整响应对象:', response);

            if (response && response.statusCode === 200) {
                console.log('订单创建成功:', response.data)
                // 处理订单创建成功的逻辑
                wx.showToast({ title: '订单创建成功', icon: 'success' });
                // 跳转到订单详情页面
                wx.navigateTo({
                    url: `/pages/order/order?id=${response.data.data.orderId}`
                });
            } else {
                console.error('订单创建失败:', response)
                wx.showToast({ title: `订单创建失败: ${response.errMsg || '未知错误'}`, icon: 'none' })
            }
        } catch (error) {
            console.error('创建订单时出错:', error)
            wx.showToast({ title: '请求出错', icon: 'none' })
        }
    }
});