<template>
    <div class="choose-payment">
        <div class="reduction-tip" v-if="reduction.subtractId">
            {{reduction.productId}}油品<label class="least-cost">满{{displayMoney(reduction.leastCost)}}元</label>立减{{reduction.tip}}元/升
        </div>
        <div class="payment-list">
            <div class="payment" v-for="(item,index) in payments" :class="{first: index == 0}"
                 @click="payment = item">
                <img :src="item.firstIcon"/>
                <label>{{item.payName}}</label>
                <label v-if="item.balance" class="balance">余额: ¥{{displayMoney(item.balance)}}</label>
                <img class="icon-duigou" src="../../assets/font/对勾.png" v-if="item.payType == payment.payType"/>
            </div>
        </div>
        <div class="balance-first">
            <label>优先使用钱包余额</label>
            <nut-switch :active.sync="balanceFirst" class="switch"></nut-switch>
        </div>
        <div class="coupon">
            <label class="coupon-tip">优惠券默认最大优惠</label>
            <div class="coupon-card clearfix" v-if="coupon.id"
                 :class="{blue: [2,3].includes(coupon.deductType), yellow: coupon.deductType === 1}">
                <div class="left">
                    <div class="deduct-amount" v-if="[2,3].includes(coupon.deductType)">
                        <label class="integer">{{Math.floor(coupon.deductAmount / 10)}}</label>
                        <label class="decimal">.{{coupon.deductAmount % 10}}折</label>
                    </div>
                    <div class="deduct-amount" v-if="coupon.deductType === 1">
                        <label class="integer">{{Math.floor(coupon.deductAmount / 100)}}</label>
                        <label class="decimal">.{{coupon.deductAmount % 100}}元</label>
                    </div>
                    <div class="least-cost">满{{displayMoney(coupon.leastCost)}}元可用</div>
                </div>
                <div class="right">
                    <div class="name text-overflow">{{coupon.name}}</div>
                    <div class="short-title">• {{coupon.shortTitle}}</div>
                    <div class="time">• {{coupon.strBeginTime}}-{{coupon.strEndTime}}</div>
                </div>
            </div>
            <div class="none-coupon" v-if="!coupon.id && $store.state.coupons.length">
                当前未选择优惠券
            </div>
            <div class="none-coupon" v-if="!$store.state.coupons.length">
                当前无可用优惠券
            </div>
            <div class="other-coupon" @click="otherCoupon" v-if="$store.state.coupons.length">其他优惠券>></div>
        </div>
        <div class="amount">
            <div class="oil-amount">
                <label>油品价格</label>
                <label class="right">¥{{displayMoney($store.state.amount)}}</label>
            </div>
            <div class="reduction-amount" v-if="['reduction','all'].includes(discountType)">
                <label>立减优惠 : </label>
                <label class="right">-¥{{displayMoney(reduction.subtractMoney)}}</label>
            </div>
            <div class="coupon-amount" v-if="['coupon','all'].includes(discountType)">
                <label>优惠券 : </label>
                <label class="right">-¥{{displayMoney(coupon.deductMoney)}}</label>
            </div>
        </div>
        <div class="amount-tip" v-if="coupon.id && reduction.subtractId && !reduction.useCoupon">
            <label>优惠券与立减优惠不同享</label>
            <a href="javascript:void(0)" v-if="discountType === 'coupon'"
               @click="discountType = 'reduction'">切换为立减优惠</a>
            <a href="javascript:void(0)" v-if="discountType === 'reduction'" @click="discountType = 'coupon'">切换为优惠券</a>
            <label>(-¥{{discountType === 'coupon'?
                displayMoney(reduction.subtractMoney):displayMoney(coupon.deductMoney)}})</label>
        </div>
        <div class="footer">
            <span>合计 : <label>¥{{displayMoney(summary)}}</label></span>
            <button class="next-step" @click="payConfirm" :class="{disabled: loading}">立即支付</button>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                loading: false,
                payments: [],
                payment: {},
                oilCardId: '',
                balanceFirst: true, // 优先使用钱包余额
                reduction: {},  // 立减信息
                discountType: ''  // 使用折扣类型，coupon\reduction\all
            }
        },
        computed: {
            coupon: function () {
                return this.$store.state.coupon;
            },
            summary: function () {
                let summary = this.$store.state.amount;
                if (this.discountType === 'coupon') {
                    summary = summary - this.coupon.deductMoney;
                }
                else if (this.discountType === 'reduction') {
                    summary = summary - this.reduction.subtractMoney;
                }
                else if (this.discountType === 'all') {
                    return summary - this.coupon.deductMoney - this.reduction.subtractMoney;
                }
                return summary > 0 ? summary : 0;
            }
        },
        watch: {
            "$store.state.coupon": function (val) {
                this.initDiscountType();
            }
        },
        methods: {
            displayMoney(money) {
                return (money / 100).toFixed(2);
            },
            otherCoupon() {
                this.$router.push({path: "/choose-coupon"});
            },
            initDiscountType() {
                if (!this.coupon.id && !this.reduction.subtractId) {
                    this.discountType = '';
                }
                else if (this.coupon.id && !this.reduction.subtractId) {
                    this.discountType = 'coupon';
                }
                else if (!this.coupon.id && this.reduction.subtractId) {
                    this.discountType = 'reduction';
                }
                else if (this.reduction.useCoupon) {
                    this.discountType = 'all';
                }
                else if (this.coupon.deductMoney > this.reduction.subtractMoney) {
                    this.discountType = 'coupon';
                }
                else {
                    this.discountType = 'reduction';
                }
            },
            fetchPayments() {
                let state = this.$store.state;
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/wx/api/oil/order/foroilpay",
                    data: {
                        stationId: state.station.stationId,
                        gunId: state.gun.id,
                        octanerating: state.gun.oilMachineName,  // 油品名称
                        orderMoney: state.amount,
                        licenseplateId: state.plate.id,  // 车牌ID
                        invoiceId: state.receipt && state.receipt.invoiceId   // 发票信息ID
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        let data = response.data;
                        this.payments = data.payTypes || [];
                        this.payment = this.payments.find((item) => {
                            return item.default;
                        });
                        this.oilCardId = data.oilCardId;
                        this.reduction = data.subtractMap || {};
                        this.$store.state.coupon = data.selectCoupon || {};
                        this.$store.state.coupons = data.couponList || [];
                        this.$store.commit("change");
                        this.initDiscountType();
                    }
                });
            },
            payConfirm() {
                if (this.loading) {
                    return;
                }
                let that = this;
                this.$dialog({
                    title: "确认支付到 :",
                    content: this.$store.state.station.stationName,
                    cancelBtnTxt: '取消支付',
                    okBtnTxt: '确认支付',
                    onOkBtn() {
                        this.close();
                        that.pay();
                    }
                });
            },
            pay() {
                this.loading = true;
                let state = this.$store.state;
                let payType = this.payment.payType;
                if (this.balanceFirst) {
                    let wallet = this.payments.find((item) => {
                        return item.payType == 1;
                    });
                    if (wallet.balance >= this.summary) {
                        payType = 1; // 开启钱包优先，并且钱包余额足够，支付方式为钱包
                    }
                }
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/wx/api/oil/order/pay",
                    data: {
                        payType: payType,
                        orderMoney: state.amount,
                        payMoney: this.summary,
                        licensePlateId: state.plate.id,
                        octaneRating: state.gun.oilMachineName,
                        gunId: state.gun.id,
                        invoiceId: state.receipt && state.receipt.invoiceId,
                        couponId: state.coupon.id,
                        subtractId: this.reduction.subtractId,
                        cardId: this.oilCardId,  // 加油卡ID
                        balanceDeduct: this.balanceFirst
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        let data = response.data;
                        this.$store.state.pay = data.payMoney;
                        this.$store.state.serialCode = data.serialCode;
                        this.$store.state.awards = data.platesDishes || [];
                        this.$store.commit("change");
                        if (payType == 4) {
                            this.wxPay(data.wechatPayMsg);
                        }
                        else if (payType == 3) {
                            this.alipay(data.aliPayMsg);
                        }
                        else {
                            this.paySuccess();
                        }
                    }
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            },
            wxPay(wechatPayMsg) {
                this.$wx.chooseWXPay({
                    timestamp: wechatPayMsg.timeStamp,
                    nonceStr: wechatPayMsg.nonceStr,
                    package: wechatPayMsg.package,
                    signType: wechatPayMsg.signType,
                    paySign: wechatPayMsg.paySign,
                    success: (res) => {
                        this.paySuccess();
                    }
                });
            },
            alipay(aliPayMsg) {
                this.$alipayReady(()=>{
                    AlipayJSBridge.call("tradePay", {
                        tradeNO: aliPayMsg
                    }, (data)=> {
                        if ("9000" == data.resultCode) {
                            this.paySuccess();
                        }
                    });
                });
            },
            paySuccess() {
                this.$router.push({path: "/pay-success"});
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path === '/choose-coupon') {
                to.meta.isBack = true;
            }
            next();
        },
        activated() {
            document.title = '选择支付方式';
            if (!this.$route.meta.isBack) {
                this.fetchPayments();
            }
            this.$route.meta.isBack = false;
        }
    }
</script>

<style scoped lang="less">
    .choose-payment {
        background-color: #F0EFF3;
        position: relative;
        min-height: 100%;
        padding: 0 0 50px;
        .reduction-tip {
            padding: 0.3rem;
            color: #8D9192;
            .least-cost {
                color: #DD3F3E;
            }
        }
        .payment-list {
            background-color: #FFF;
            .payment {
                padding: 0.3rem 0;
                margin: 0 0.3rem;
                border-top: 1px solid #E4E4E4;
                position: relative;
                &.first {
                    border-top: 0;
                }
                img {
                    vertical-align: middle;
                }
                label {
                    vertical-align: middle;
                    padding-left: 10px;
                }
                .balance {
                    color: #929292;
                }
                .icon-duigou {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: -8px;
                }
            }
        }
        .balance-first {
            background-color: #FFF;
            border-top: 1px solid #E4E4E4;
            color: #969696;
            padding: 0.3rem;
            text-align: right;
            .switch {
                vertical-align: middle;
                margin-left: 10px;
            }
        }
        .coupon {
            padding: 0 0.3rem;
            margin-bottom: 0.3rem;
            .coupon-tip {
                color: #A4A4A6;
                line-height: 50px;
            }
            .none-coupon {
                background: url("../../assets/images/couponsHeaderIcon4.png") #FFF no-repeat;
                background-size: 100% auto;
                text-align: center;
                line-height: 120px;
                border-radius: 5px;
                color: #9F9F9F;
            }
            .coupon-card {
                border-radius: 5px;
                padding: 20px;
                &.blue {
                    background: url("../../assets/images/couponsHeaderIcon.png") #FFF no-repeat;
                    background-size: 100% auto;
                    .deduct-amount {
                        color: #5C8EFF;
                    }
                }
                &.yellow {
                    background: url("../../assets/images/couponsHeaderIcon2.png") #FFF no-repeat;
                    background-size: 100% auto;
                    .deduct-amount {
                        color: #FFCF5C;
                    }
                }
                .left {
                    width: 40%;
                    float: left;
                    text-align: center;
                    .deduct-amount {
                        font-weight: bold;
                        padding: 0 0 10px;
                        .integer {
                            font-size: 40px;
                        }
                        .decimal {
                            font-size: 16px;
                        }
                    }
                    .least-cost {
                        font-size: 14px;
                    }
                }
                .right {
                    width: 60%;
                    float: right;
                    .name {
                        font-size: 16px;
                        line-height: 2;
                    }
                    .short-title {
                        font-size: 12px;
                        line-height: 2;
                    }
                    .time {
                        font-size: 12px;
                        line-height: 2;
                    }
                }
            }
            .other-coupon {
                color: #DD3F3E;
                text-align: right;
                font-weight: bold;
                font-size: 16px;
                line-height: 45px;
            }
        }
        .amount {
            background-color: #FFF;
            padding: 0 0.3rem;
            .oil-amount {
                padding: 0.3rem 0;
            }
            .coupon-amount {
                padding: 0.3rem 0;
                border-top: 1px solid #E6E6E6;
            }
            .reduction-amount {
                padding: 0.3rem 0;
                border-top: 1px solid #E6E6E6;
            }
            .right {
                float: right;
                color: #DD3F3E;
            }
        }
        .amount-tip {
            padding: 0.5rem 0.3rem;
            a {
                text-decoration: underline;
            }
        }
        .footer {
            position: fixed;
            width: 100%;
            bottom: 0;
            background-color: #FFF;
            line-height: 50px;
            padding-left: 0.3rem;
            label {
                color: #DD3F3E;
            }
            .next-step {
                text-align: center;
                background-color: #F13D3D;
                border: 0;
                color: #FFF;
                font-size: 16px;
                float: right;
                padding: 0 0.5rem;
                line-height: 50px;
                &.disabled {
                    background-color: #BBB;
                }
            }
        }
    }
</style>
<style lang="less">
</style>
