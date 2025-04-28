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
            const res = await wx.request({
                url: 'http://localhost:3000/addresses/default',
                header: { 'X-User-Id': app.globalData.userId }
            });
            if (res.data.code === 200 && res.data.data) {
                this.setData({ selectedAddress: res.data.data });
            }
        } catch (e) {
            console.error('加载地址失败', e);
            wx.showToast({ title: '加载地址失败', icon: 'none' });
        }
    },

    async chooseAddress() {
        const res = await wx.navigateTo({
            url: '/pages/address/address?selectMode=true'
        });
        if (res && res.data) {
            this.setData({ selectedAddress: res.data });
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
            this.setData({ 
                paymentAmount: amount, 
                cartItems: cartItems.map(item => ({
                    ...item,
                    product_id: Number(item.id || item.product_id)
                }))
            })
        } else {
            const product = app.globalData.currentProduct
            if (!product || !product.price) {
                wx.showToast({ title: '商品信息错误', icon: 'none' })
                return wx.navigateBack()
            }
            const singleItem = {
                product_id: Number(product.id),
                name: product.name,
                price: Number(product.price),
                quantity: Number(product.quantity || 1)
            };
            this.setData({ 
                paymentAmount: product.price, 
                currentProduct: product,
                cartItems: [singleItem]
            });
        }
    },

    async handlePayment() {
        try {
            const userId = app.globalData.userId;
            const addressId = this.data.selectedAddress?.id;

            // 验证逻辑
            if (!addressId) {
                return wx.showToast({ title: '请选择收货地址', icon: 'none' });
            }
            if (this.data.cartItems.length === 0) {
                return wx.showToast({ title: '请选择商品', icon: 'none' });
            }
            if (this.data.paymentAmount <= 0) {
                return wx.showToast({ title: '订单金额必须大于0', icon: 'none' });
            }

            // 准备订单数据
            const orderData = {
                items: this.data.cartItems,
                totalAmount: this.data.paymentAmount,
                addressId: addressId
            };

            console.log('提交订单数据:', orderData);

            const res = await new Promise((resolve, reject) => {
                wx.request({
                    url: 'http://localhost:3000/order',
                    method: 'POST',
                    header: {
                        'X-User-Id': userId,
                        'Authorization': app.globalData.token,
                        'Content-Type': 'application/json'
                    },
                    data: orderData,
                    success: resolve,
                    fail: reject
                });
            });

            console.log('订单创建响应:', res);

            if (res.statusCode === 200 && res.data && res.data.code === 200) {
                wx.showToast({ title: '订单创建成功', icon: 'success' });
                wx.redirectTo({
                    url: `/pages/order/order?id=${res.data.data.orderId}`
                });
                // 清空购物车
                if (app.cart) app.cart.clear();
            } else {
                const errMsg = res.data?.message || '订单创建失败';
                console.error('订单创建失败:', errMsg);
                wx.showToast({ title: errMsg, icon: 'none' });
            }
        } catch (error) {
            console.error('创建订单异常:', error);
            wx.showToast({ 
                title: error.message || '网络请求失败', 
                icon: 'none',
                duration: 2000
            });
        }
    }
});