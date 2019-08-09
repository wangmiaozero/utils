//const API_URL = "http://192.168.2.173:8360";
const API_URL = "https://zhanzhile.ukidgo.cn";
//const API_URL = "https://zhanzhiledev.ukidgo.cn";


function Get(url, params) {
    var token = wx.getStorageSync('token') ? wx.getStorageSync('token') : [];
    let promise = new Promise(function(resolve, reject) {

        wx.request({

            url: API_URL + url,

            data: params,

            method: 'GET',

            header: {
                'Content-Type': 'application/json',
                'third_session': token
            },

            success: res => {

                resolve(res.data);

            },

            fail: res => {

                reject(res.data)

            }

        })

    });

    return promise

}

function Post(url, params) {
    var token = wx.getStorageSync('token') ? wx.getStorageSync('token') : [];
    let promise = new Promise(function(resolve, reject) {

        wx.request({

            url: API_URL + url,

            data: params,

            method: 'POST',

            header: {
                'Content-Type': 'application/json',
                'third_session': token
            },

            success: res => {

                resolve(res.data);

            },

            fail: res => {

                reject(res.data)

            }

        })

    });

    return promise

}

function JsonPost(url, params) {
    var token = wx.getStorageSync('token') ? wx.getStorageSync('token') : [];
    let promise = new Promise(function(resolve, reject, token) {

        wx.request({

            url: API_URL + url,

            data: JSON.stringify(params),

            method: 'POST',

            header: {
                'Content-Type': 'application/json',
                'third_session': token
            },

            success: res => {

                resolve(res.data);

            },

            fail: res => {

                reject(res.data);

            }

        })

    });

    return promise

}

module.exports = {

    Get,

    Post,

    JsonPost

}