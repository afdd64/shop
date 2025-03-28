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

    // 手动调用 wx.getUserProfile
    manualGetUserProfile() {
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
                console.log('获取到的用户信息:', res.userInfo);
                this.setData({
                    userInfo: {
                        nickName: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl
                    }
                });
                app.globalData.userInfo = res.userInfo;

                // 调用登录接口
                this.login(res.userInfo);
            },
            fail: (err) => {
                console.error('用户拒绝授权:', err);
                wx.showModal({
                    title: '授权失败',
                    content: '请重新点击登录，并允许授权。',
                    showCancel: false
                });
            }
        });
    },

    // 登录方法
    async login(userInfo) {
        // 获取微信登录凭证
        try {
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
            wx.showModal({
                title: '登录失败',
                content: '微信接口调用出现问题，请稍后重试。',
                showCancel: false
            });
        }
    }
});
