const app = getApp();

Page({
  data: {
    addressList: [],
    formData: {
      id: null,
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      is_default: false
    },
    isEditing: false,
    showForm: false // 控制弹窗显示
  },

  onLoad() {
    this.loadAddressList();
  },

  // 加载地址列表
  loadAddressList() {
    wx.request({
      url: 'http://localhost:3000/addresses',
      method: 'GET',
      header: {
        'X-User-Id': app.globalData.userId,
        'Authorization': app.globalData.token
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ addressList: res.data.data });
        } else {
          console.error('加载地址列表失败，状态码:', res.statusCode, '响应数据:', res.data);
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('加载地址列表请求失败:', err);
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    });
  },

  // 点击“新增地址”按钮
  showEditForm() {
    this.setData({
      showForm: true,
      isEditing: false,
      formData: {
        id: null,
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        is_default: false
      }
    });
  },

  // 关闭表单弹窗
  hideForm() {
    this.setData({ showForm: false });
  },

  // 输入框更新
  handleInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      ['formData.' + field]: e.detail.value
    });
  },

  // 选择默认地址
  handleDefaultChange(e) {
    this.setData({
      'formData.is_default': e.detail.value
    });
  },

  // 进入编辑模式
  editAddress(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.addressList[index];

    this.setData({
      formData: { ...address },
      isEditing: true,
      showForm: true
    });
  },

  // 添加或更新地址
  saveAddress() {
    if (!this.validateForm()) return;

    const method = this.data.isEditing ? 'PUT' : 'POST';
    const url = this.data.isEditing
      ? `http://localhost:3000/addresses/${this.data.formData.id}`
      : 'http://localhost:3000/addresses';

    console.log('即将发送的请求信息：', {
      url,
      method,
      header: {
        'X-User-Id': app.globalData.userId,
        'Authorization': app.globalData.token,
        'Content-Type': 'application/json'
      },
      data: this.data.formData
    });

    wx.request({
      url,
      method,
      header: {
        'X-User-Id': app.globalData.userId,
        'Authorization': app.globalData.token,
        'Content-Type': 'application/json'
      },
      data: this.data.formData,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({ title: this.data.isEditing ? '更新成功' : '添加成功', icon: 'success' });
          this.setData({
            isEditing: false,
            showForm: false,
            formData: { id: null, name: '', phone: '', province: '', city: '', district: '', detail: '', is_default: false }
          });
          this.loadAddressList();
        } else {
          console.error('保存地址失败，状态码:', res.statusCode, '响应数据:', res.data);
          wx.showToast({ title: '操作失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('保存地址请求失败:', err);
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    });
  },

  // 绑定输入框的值到 formData
  bindNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    });
  },

  bindPhoneInput(e) {
    this.setData({
      'formData.phone': e.detail.value
    });
  },

  bindDetailInput(e) {
    this.setData({
      'formData.detail': e.detail.value
    });
  },

  bindRegionChange(e) {
    const [province, city, district] = e.detail.value;
    this.setData({
      'formData.province': province,
      'formData.city': city,
      'formData.district': district
    });
  },

  bindDefaultChange(e) {
    this.setData({
      'formData.is_default': e.detail.value
    });
  },

  submitForm() {
    if (!this.validateForm()) return;

    const method = this.data.isEditing ? 'PUT' : 'POST';
    const url = this.data.isEditing
      ? `http://localhost:3000/addresses/${this.data.formData.id}`
      : 'http://localhost:3000/addresses';

    wx.request({
      url,
      method,
      header: {
        'X-User-Id': app.globalData.userId,
        'Authorization': app.globalData.token,
        'Content-Type': 'application/json'
      },
      data: this.data.formData,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({ title: this.data.isEditing ? '更新成功' : '添加成功', icon: 'success' });
          this.setData({
            showForm: false, // 关闭表单弹窗
            isEditing: false,
            formData: { id: null, name: '', phone: '', province: '', city: '', district: '', detail: '', is_default: false }
          });
          this.loadAddressList(); // 重新加载地址列表
        } else {
          console.error('提交表单失败，状态码:', res.statusCode, '响应数据:', res.data);
          wx.showToast({ title: '操作失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('提交表单请求失败:', err);
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    });
  },

  // 删除地址
  deleteAddress(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `http://localhost:3000/addresses/${id}`,
            method: 'DELETE',
            header: {
              'X-User-Id': app.globalData.userId,
              'Authorization': app.globalData.token
            },
            success: (res) => {
              if (res.statusCode === 200) {
                wx.showToast({ title: '删除成功', icon: 'success' });
                this.loadAddressList();
              } else {
                console.error('删除地址失败，状态码:', res.statusCode, '响应数据:', res.data);
                wx.showToast({ title: '删除失败', icon: 'none' });
              }
            },
            fail: (err) => {
              console.error('删除地址请求失败:', err);
              wx.showToast({ title: '请求失败', icon: 'none' });
            }
          });
        }
      }
    });
  },

  // 选择地址并返回给调用页面
  chooseAddress(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.addressList[index];

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage.route === 'pages/payment/payment') {
        const eventChannel = prevPage.getOpenerEventChannel();
        eventChannel.emit('chooseAddress', address);
        wx.navigateBack();
    }
  },
  // 校验表单
  validateForm() {
    const { name, phone, province, city, district, detail } = this.data.formData;
    if (!name || !phone || !province || !city || !district || !detail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return false;
    }
    return true;
  }
});    