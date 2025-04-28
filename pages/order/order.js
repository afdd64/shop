// pages/order/order.js
const app = getApp();

Page({
    data: {
        order: null,
        loading: true,
        paymentMethods: [
            { value: 'wechat', name: '微信支付' },
            { value: 'wallet', name: '钱包支付' }
        ]
    },

    onLoad(options) {
        if (!options.id) {
            wx.showToast({ title: '订单ID缺失', icon: 'none' });
            return wx.navigateBack();
        }
        this.loadOrderDetail(options.id);
    },

    async loadOrderDetail(orderId) {
      this.setData({ loading: true });
      try {
          const res = await wx.request({
              url: `http://localhost:3000/order/${orderId}`,
              header: { 
                  'X-User-Id': app.globalData.userId,
                  'Authorization': app.globalData.token
              }
          });
  
          console.log('订单详情响应:', res);
  
          // 增加响应结构验证
          if (res.statusCode === 404) {
              throw new Error('订单不存在');
          }
          
          if (res.statusCode === 200 && res.data && res.data.code === 200) {
              this.setData({ 
                  order: res.data.data,
                  loading: false 
              });
          } else {
              const errMsg = res.data?.message || 
                           `请求失败 (${res.statusCode})` || 
                           '未知错误';
              throw new Error(errMsg);
          }
      } catch (error) {
          console.error('加载订单失败:', error);
          this.setData({ loading: false });
          
          wx.showToast({ 
              title: error.message || '加载订单失败',
              icon: 'none',
              duration: 2000,
              complete: () => {
                  setTimeout(() => wx.navigateBack(), 1500);
              }
          });
      }
  },

    async cancelOrder() {
        try {
            const res = await wx.request({
                url: `http://localhost:3000/order/${this.data.order.id}/cancel`,
                method: 'POST',
                header: { 
                    'X-User-Id': app.globalData.userId,
                    'Authorization': app.globalData.token
                }
            });

            if (res.statusCode === 200 && res.data.code === 200) {
                wx.showToast({ title: '订单已取消', icon: 'success' });
                this.loadOrderDetail(this.data.order.id); // 刷新订单状态
            } else {
                throw new Error(res.data?.message || '取消订单失败');
            }
        } catch (error) {
            console.error('取消订单失败:', error);
            wx.showToast({ 
                title: error.message || '取消订单失败',
                icon: 'none',
                duration: 2000
            });
        }
    },

    handlePayment() {
        wx.showActionSheet({
            itemList: this.data.paymentMethods.map(m => m.name),
            success: async (res) => {
                const method = this.data.paymentMethods[res.tapIndex].value;
                if (method === 'wechat') {
                    await this.wechatPayment();
                } else if (method === 'wallet') {
                    await this.walletPayment();
                }
            },
            fail: () => wx.showToast({ title: '取消支付', icon: 'none' })
        });
    },

    async wechatPayment() {
        try {
            await this.updateOrderStatus('paid');
            wx.showToast({ title: '支付成功', icon: 'success' });
            this.loadOrderDetail(this.data.order.id);
        } catch (error) {
            wx.showToast({ 
                title: error.message || '支付失败',
                icon: 'none',
                duration: 2000
            });
        }
    },

    async walletPayment() {
        try {
            // 检查余额
            const balanceRes = await wx.request({
                url: 'http://localhost:3000/wallet',
                header: { 
                    'X-User-Id': app.globalData.userId,
                    'Authorization': app.globalData.token
                }
            });

            const balance = balanceRes.data?.data?.balance || 0;
            const amount = this.data.order.total_amount;

            if (balance < amount) {
                return wx.showToast({ 
                    title: `余额不足 (当前: ¥${balance})`,
                    icon: 'none',
                    duration: 2000
                });
            }

            // 确认支付
            const confirmRes = await wx.showModal({
                title: '确认支付',
                content: `将从钱包扣除 ¥${amount}，确认支付？`,
                confirmText: '确认支付'
            });

            if (confirmRes.confirm) {
                await wx.request({
                    url: 'http://localhost:3000/wallet/pay',
                    method: 'POST',
                    header: { 
                        'X-User-Id': app.globalData.userId,
                        'Authorization': app.globalData.token
                    },
                    data: { amount }
                });
                await this.updateOrderStatus('paid');
                wx.showToast({ title: '支付成功', icon: 'success' });
                this.loadOrderDetail(this.data.order.id);
            }
        } catch (error) {
            console.error('钱包支付失败:', error);
            wx.showToast({ 
                title: error.message || '支付失败',
                icon: 'none',
                duration: 2000
            });
        } 
    },

    async updateOrderStatus(status) {
        const res = await wx.request({
            url: `http://localhost:3000/order/${this.data.order.id}/status`,
            method: 'POST',
            header: { 
                'X-User-Id': app.globalData.userId,
                'Authorization': app.globalData.token
            },
            data: { status }
        });

        if (!(res.statusCode === 200 && res.data.code === 200)) {
            throw new Error(res.data?.message || '更新订单状态失败');
        }
    }
});