// 内置浏览器
var browser = {};
// 初始化webview相关
function dkwyss(url) {
    var _self = browser;
    // 创建webview
    _self.webview = plus.webview.open(url, 'browser', {
        decelerationRate: 0.5,
        scrollIndicator: "vertical",
        titleNView: {
            titleColor: "#fff",
            backgroundColor: '#1a7ecb',
            progress: { //进度条
                color: '#ff3300',
                height: '1px'
            },
            splitLine: { //底部分割线
                color: '#cccccc',
                height: '1px'
            },
            buttons: [{ //后退按钮  
                'float': 'left',
                type: "back",
                onclick: _self.back.bind(_self) //指定函数的上下文为browser，否则是当前这个对象；  
            }, { //前进箭头  
                'float': 'left',
                type: "forward",
                onclick: _self.forward.bind(_self)
            }, { //关闭按钮  
                'float': 'right',
                type: "close",
                onclick: _self.close.bind(_self)
            }, { //刷新按钮  
                'float': 'right',
                text: '刷',
                onclick: _self.reload.bind(_self)
            }]
        },
    }, "slide-in-right");
};

// 后退  
browser.back = function () {
    var _self = this;
    _self.webview.canBack(function (event) {
        if (event.canBack) {
            _self.webview.back();
        } else {
            _self.webview.hide('pop-out');
            _self.webview.clear();
        }
    });
};
//前进 
browser.forward = function () {
    var _self = this;
    _self.webview.canForward(function (event) {
        if (event.canForward) {
            _self.webview.forward();
        } else {
            plus.nativeUI.toast('没有可前进的地址');
        }
    });
};
// 刷新
browser.reload = function () {
    this.webview.reload(true);
};
// 关闭  
browser.close = function () {
    this.webview.hide('slide-out-right');
    this.webview.clear();
};
new Vue({
    el: "#app",
    data: function () {
        return {
            param: {},
            menuapi: "",
            yanapi: "",
            yanstring: "",
            menucount: 0,
            menulist: [],
            addtip: false,
            addmenu: {
                title: "",
                url: "",
            }
        }
    },
    mounted: function () {
        mui.init({
            swipeBack: true //启用右滑关闭功能
        });
        this.param = {};
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
        });
        this.getmenu();
        this.getyiyan();
    },
    methods: {
        //获取菜单数据
        getmenu: function () {
            var that = this;
            that.menuapi = "https://www.cliwen.com/api/sysdata/mlmenulistbymobile.php";
            that.ajax(true, that.menuapi, null, function (data) {
                if (data.code == 0) {
                    that.menulist = data.data;
                }
            })
        },
        //随机显示一言
        getyiyan: function () {
            var that = this;
            that.yanapi = "https://www.cliwen.com/api/yan/?encode=json";
            that.ajax(true, that.yanapi, null, function (data) {
                if (data.code == 0) {
                    that.yanstring = data.data;
                } else {
                    that.yanstring = "欢迎访问明乐手机版！";
                }
            })
        },
        //扫码
        scan: function () {
            mui.alert("扫码");
        },
        //设置
        set: function () {
            // mui.alert("设置");
            this.openWindow("setting", "page/setting.html");
        },
        //跳转
        tz: function (item) {
            var that = this;
            if (!item.ip) {
                dkwyss(item.url);
            } else {
            if (window.name === '') {
                localStorage.removeItem("mingle.pagetransdata_a");
                window.name = 'isReload';
            }
            that.param.openitem = item;
            localStorage.setItem("mingle.pagetransdata_a", JSON.stringify(that.param))
            // mui.alert(item.title);
            that.openWindow(item.id, "page/parentpage.html")
            }
        },
        tz2: function (item) {
            var that = this;
            if (window.name === '') {
                localStorage.removeItem("mingle.pagetransdata_a");
                window.name = 'isReload';
            }
            var xtitem = {};
            xtitem.id = "xt_" + item;
            xtitem.ip = "";
            if (item == 1) {
                xtitem.title = "登录";
                xtitem.url = "login.html";
            } else if (item == 2) {
                xtitem.title = "天气";
                xtitem.url = "https://widget-page.qweather.net/h5/index.html?md=0123456&bg=1&lc=accu&key=b47d1f25f6d54ce9b70413ad3166572b&v=_1654667466398";
            } else  if (item == 3) {
               
            } else if (item == 99) {
                xtitem.title = "添加菜单";
                xtitem.url = "";
            }
            that.param.openitem = xtitem;
            localStorage.setItem("mingle.pagetransdata_a", JSON.stringify(that.param))
            // mui.alert(item.title);
            if (item == 2) {
                that.openWindow(xtitem.id, "page/parentpage.html")
            } else if (item == 3) {
                //刷新
                location.reload();
            } else if (item == 99) {
                that.addmenu.title = "";
                that.addmenu.url = "";
                that.addtip = true;
            } else {
                mui.toast("暂未开发:" + xtitem.title);
            }
        },

        //打开新页
        openWindow: function (id, url, c) {
            mui.openWindow({
                id: id,
                url: url,
            })
        },
        //默认样式
        defaultcss: function () {
            let cssFix = document.createElement('style');
            let csshtml = " html, body, #app {height:100%;margin:0;padding:0;} #app{background-color: #f0f0f0;}";
            cssFix.innerHTML = csshtml;
            document.getElementsByTagName('head')[0].appendChild(cssFix);
        },
        //ajax
        ajax: function (isget, url, data, fun) {
            if (isget) {
                mui.get(url, function (data) {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    fun(data)
                })
            } else {
                mui.post(url, data, function (data) {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    fun(data);
                })
            }
        },
        closeaddmenu: function () {
            var that = this;
            that.addtip = false;
        },
        saveaddmenu: function () {
            var that = this;
            if (!that.addmenu.title) {
                mui.toast("必填名称");
            } else if (!that.addmenu.url) {
                mui.toast("必填地址");
            } else {
                let regex = /http[s]?:\/\/[\w.]+[\w\/]*[\w.]*\??[\w=&:\-\+\%]*[/]*/;
                var url = that.addmenu.url.match(regex);
                if (url) {
                    that.addmenu.ip = "";
                    that.addmenu.url = url[0];
                } else {
                    that.addmenu.ip = MLIP;
                };
                that.addmenu.info = "网友自建";
                that.addmenu.opt = 0;
                that.addmenu.nid = "";
                that.addmenu.show = 1;
                that.addmenu.click = 0;
                that.addmenu.ismobile = 1;
                that.addmenu.logo = "https://www.cliwen.com/help/images/useradd.jpg";
                that.ajax(false, "https://www.cliwen.com/api/sysdata/mlmenuadd.php", that.addmenu, function (data) {
                    that.getmenu();
                })
            }
        },
    },
});