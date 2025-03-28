// pages/profile/profile.js
const app = getApp();

Page({
    data: {
        orderTabs: [
            { label: '全部', value: 'all' },
            { label: '待付款', value: 'unpaid' },
            { label: '待发货', value: 'undelivered' },
            { label: '待评价', value: 'unreviewed' }
        ],
        menuItems: [
            { label: '收货地址管理', url: '/pages/address/address' },
            { label: '钱包管理', url: '/pages/wallet/wallet' }
        ],
        currentTab: 'all',
        userInfo: {
            nickName: '请登录',
            avatarUrl: '/static/icons/default-avatar.png'
        }
    },

    onShow() {
        this.updateUserInfo();
    },

    updateUserInfo() {
        const { userInfo } = app.globalData;
        if (userInfo) {
            this.setData({
                userInfo: {
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl
                }
            });
        } else {
            this.setData({
                userInfo: {
                    nickName: '请登录',
                    avatarUrl: '/static/icons/default-avatar.png'
                }
            });
        }
    },

    switchTab(e) {
        const tab = e.currentTarget.dataset.tab;
        wx.navigateTo({
            url: `/pages/list/list?type=${tab}`
        });
    },

    async onGetUserProfile(e) {
      
        // 检查微信版本是否支持 getUserProfile 接口
        if (!wx.getUserProfile) {
            wx.showModal({
                title: '版本提示',
                content: '您的微信版本过低，无法使用此登录方式，请升级微信版本。',
                showCancel: false,
                confirmText: '知道了'
            });
            return;
        }

        console.log('onGetUserProfile 方法被调用');
        const userInfo = e.detail && e.detail.userInfo;

        if (!userInfo) {
            console.error('获取用户信息失败，可能是用户拒绝了授权');
            wx.showModal({
                title: '授权提示',
                content: '您拒绝了授权，无法登录。请重新点击登录并授权，以便使用完整功能。',
                showCancel: false,
                confirmText: '知道了'
            });
            return;
        }

        console.log('获取到的用户信息:', userInfo);

        try {
            console.log('开始获取微信登录凭证');
            const loginRes = await new Promise((resolve, reject) => {
                wx.login({
                    success: resolve,
                    fail: reject
                });
            });
            const { code } = loginRes;
            console.log('获取到的微信登录凭证:', code);

            console.log('开始调用 app.js 中的登录方法');
            await app.login(code, userInfo);

            console.log('登录成功，更新用户信息');
            this.updateUserInfo();
            wx.showToast({ title: '登录成功' });
        } catch (error) {
            console.error('登录过程中出现错误:', error);
            if (error.message.includes('微信接口返回信息不完整') || error.message.includes('微信接口调用失败')) {
                wx.showModal({
                    title: '登录失败',
                    content: '微信接口调用出现问题，请稍后重试。',
                    showCancel: false,
                    confirmText: '知道了'
                });
            } else if (error.message.includes('数据库查询出错') || error.message.includes('用户信息更新出错') || error.message.includes('用户注册出错')) {
                wx.showModal({
                    title: '登录失败',
                    content: '服务器数据处理出现问题，请稍后重试。',
                    showCancel: false,
                    confirmText: '知道了'
                });
            } else {
                wx.showToast({ title: '登录失败', icon: 'none' });
            }
        }
    }
});