<template>
    <div class="main">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>

    export default {
        data(){
            return {
                authUrl: ''
            }
        },
        methods: {
            wxConfig(){
                this.$wx.error(function (res) {
                    console.log(JSON.stringify(res));
                });
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/wx/api/wxconfig"
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        let data = response.data;
                        this.$wx.config({
                            debug: false,
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.nonceStr,
                            signature: data.signature,
                            jsApiList: ["getLocation","openLocation","chooseWXPay"]
                        });
                    }
                });
            },
            authRedirect(){
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/foreground/config/js"
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        // 认证地址
                        this.authUrl = response.data;
                        let url = location.origin + location.pathname;
                        // 从微信调回到后台接口__auth，再调回到backUri，backUri里不能有#号
                        location.href = this.authUrl.replace("backUri", encodeURIComponent(url));
                    }
                });
            }
        },
        beforeCreate(){
            // 请求拦截器
            this.$axios.interceptors.request.use(function (config) {
                config.params = config.params || {};
                return config;
            });
            // 响应拦截器
            this.$axios.interceptors.response.use((response) => {
                if(response.data.code == '-4' ){
                    this.authRedirect();  // 会话失效，从新认证
                }
                else if (response.data.code != '0') {
                    this.$dialog({
                        content:  response.data.devMsg || response.data.msg,
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                }
                return response;
            }, (error) => {
                if (error.request.status) {
                    this.$dialog({
                        content:  '网络错误，请稍后重试',
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                }
                return Promise.reject(error);
            });
        },
        created () {
            // 支付宝
            if(/Alipay/.test(navigator.userAgent)){
                this.$store.state.environment = 'alipay';
                this.$store.commit("change");
            }
            // 微信
            else{
                this.wxConfig();
            }
        }
    }
</script>

<style scoped>
    .main {
        font-size: 14px;
    }

</style>
