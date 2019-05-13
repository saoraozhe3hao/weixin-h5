<template>
    <div class="pay-success">
        <div class="line green">
            <img class="icon-gou" src="../../assets/font/勾.png"/>
            <label>加油成功</label>
        </div>
        <div class="line">
            <label class="left">油站 :</label>
            <label class="right">{{$store.state.station.stationName}}</label>
        </div>
        <div class="line">
            <label class="left">油号 :</label>
            <label class="right">{{$store.state.gun.oilMachineName}}</label>
        </div>
        <div class="line">
            <label class="left">加油金额 :</label>
            <label class="right">¥ {{($store.state.amount/100).toFixed(2)}}</label>
        </div>
        <div class="line">
            <label class="left">实付金额 :</label>
            <span class="right">
                <label>¥ {{($store.state.pay/100).toFixed(2)}}</label>
                <label class="red" v-if="$store.state.amount > $store.state.pay"> (省 {{(($store.state.amount - $store.state.pay)/100).toFixed(2)}} 元)</label>
            </span>
        </div>
        <div class="goods clearfix">
            <div class="good" v-for="item in goods" @click="buy(item)">
                <img :src="item.thumbnail"/>
                <div class="good-name">{{item.goodname}}</div>
                <label class="sale-price">¥ {{item.saleprice}}</label> <label class="origin-price">¥
                {{item.originalprice}}</label>
            </div>
        </div>
        <div class="advert" @click="advert" ref="advert">
            <div><img class="icon-liwu" src="../../assets/font/礼物.png"/><label v-html="successAdDesc"></label></div>
        </div>
        <div class="service-phone">客服电话 : 400-806-8008</div>
        <div class="award-plate-dialog" v-if="awards.length">
            <div class="modal"></div>
            <div class="award-plate" v-if="!showCoupon">
                <img class="icon-guanbi" @click="closePlate" src="../../assets/font/关闭.png"/>
                <ul class="awards">
                    <li class="cell award" :class="{active: (drawOrder[activeIndex %  8]) === 0}">
                        <div class="award-amount">
                            <label class="pre">{{awardAmountPre(0)}}</label>
                            <label>{{awardAmount(0)}}</label>
                        </div>
                        <label class="award-type">{{awardName(0)}}</label>
                    </li>
                    <li class="cell award center" :class="{active: (drawOrder[activeIndex %  8]) === 1}">
                        <div class="award-amount">
                            <label class="pre">{{awardAmountPre(1)}}</label>
                            <label>{{awardAmount(1)}}</label>
                        </div>
                        <label class="award-type">{{awardName(1)}}</label>
                    </li>
                    <li class="cell award" :class="{active: (drawOrder[activeIndex %  8]) === 2}">
                        <div class="award-amount">
                            <label class="pre">{{awardAmountPre(2)}}</label>
                            <label>{{awardAmount(2)}}</label>
                        </div>
                        <label class="award-type">{{awardName(2)}}</label>
                    </li>
                    <li class="cell award" :class="{active: (drawOrder[activeIndex %  8]) === 3}">
                        <div class="award-amount">
                            <label class="pre">{{awardAmountPre(3)}}</label>
                            <label>{{awardAmount(3)}}</label>
                        </div>
                        <label class="award-type">{{awardName(3)}}</label>
                    </li>
                    <li class="cell draw center" @click="draw"></li>
                    <li class="cell award" :class="{active: (drawOrder[activeIndex %  8]) === 4}">
                        <div class="award-amount">
                            <label class="pre">{{awardAmountPre(4)}}</label>
                            <label>{{awardAmount(4)}}</label>
                        </div>
                        <label class="award-type">{{awardName(4)}}</label>
                    </li>
                    <li class="cell award" :class="{active: (drawOrder[activeIndex %  8]) === 5}">
                        <div class="award-amount">
                            <label class="pre">{{awardAmountPre(5)}}</label>
                            <label>{{awardAmount(5)}}</label>
                        </div>
                        <label class="award-type">{{awardName(5)}}</label>
                    </li>
                    <li class="cell miss center" :class="{active: (drawOrder[activeIndex %  8]) === 6}">
                        <label>再接再厉</label>
                    </li>
                    <li class="cell award" :class="{active: (drawOrder[activeIndex %  8]) === 7}">
                        <div class="award-amount">
                            <label class="pre">{{awardAmountPre(7)}}</label>
                            <label>{{awardAmount(7)}}</label>
                        </div>
                        <label class="award-type">{{awardName(7)}}</label>
                    </li>
                </ul>
            </div>
            <div class="coupon-plate" v-if="showCoupon">
                <div class="coupon">
                    <img class="icon-guanbi" @click="closePlate" src="../../assets/font/关闭.png"/>
                    <div class="ticket">
                        <div class="box">
                            <div class="line-1">
                                <label class="pre">
                                    {{coupon.deductType==1?this.coupon.deductAmount/100:Math.floor(this.coupon.deductAmount/10)}}
                                </label>
                                <label class="post">
                                    {{coupon.deductType==1?'元':`.${coupon.deductAmount % 10}折`}}
                                </label>
                            </div>
                            <div class="line-2">车到{{this.coupon.name}}</div>
                        </div>
                    </div>
                    <div class="i-know" @click="closePlate">我知道了</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                successAdDesc: '',
                successAdUrl: '',
                goods: [],
                activeIndex: 0,  // 记录转动的步数
                drawOrder: [0, 1, 2, 4, 7, 6, 5, 3], // 顺时针转动时，奖品实际的跳动顺序
                drawState: 0, // 0-未抽，1-正在抽，2-已抽
                showCoupon: false,
                coupon: {} // 抽中的优惠券
            }
        },
        computed: {
            awards: function () {
                return this.$store.state.awards;
            }
        },
        methods: {
            awardAmountPre(index) {
                let award = this.awards[index] || {};
                switch (award.deductType) {
                    // 抵扣券（定额券）
                    case 1:
                        return `${award.deductAmount / 100}`;
                    // 折扣券
                    case 2:
                        return `${Math.floor(award.deductAmount / 10)}`;
                    // 折扣券
                    case 3:
                        return `${Math.floor(award.deductAmount / 10)}`;
                    default:
                        return '';
                }
            },
            awardAmount(index) {
                let award = this.awards[index] || {};
                switch (award.deductType) {
                    // 抵扣券（定额券）
                    case 1:
                        return `元`;
                    // 折扣券
                    case 2:
                        return `.${award.deductAmount % 10}折`;
                    // 折扣券
                    case 3:
                        return `.${award.deductAmount % 10}折`;
                    default:
                        return '';
                }
            },
            awardName(index) {
                let award = this.awards[index] || {};
                return award.itemName;
            },
            advert() {
                window.location.href = this.successAdUrl;
            },
            fetchGoods() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/wx/api/pay/success"
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        let data = response.data;
                        this.successAdDesc = data.successAdDesc;
                        this.successAdUrl = data.SuccessAdUrl;
                        this.goods = data.convenienttobuy.group;
                    }
                });
            },
            buy(item) {
                window.location.href = '/wx/goods/detail/' + item.stationgoodsid;
            },
            closePlate() {
                this.$store.state.awards = [];
                this.$store.commit("change");
            },
            draw() {
                if (this.drawState || !this.awards.length) {
                    return;
                }
                this.drawState = 1;
                this.roll();
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/wx/api/draw",
                    params: {
                        serialCode: this.$store.state.serialCode
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code === '0') {
                        this.drawState = 2;
                        this.coupon = response.data;
                    }
                    else {
                        this.drawState = 0;
                    }
                }).catch(() => {
                    this.drawState = 0;
                });
            },
            roll() {
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    // 转不够3圈 或者 请求未结束，继续转
                    if (this.activeIndex < 24 || this.drawState === 1) {
                        this.activeIndex++;
                        return;
                    }
                    let targetIndex = 0;
                    if (this.drawState === 2) {
                        let drawAward = this.awards.find((item) => {
                            return item.templateId == this.coupon.templateId;
                        });
                        targetIndex = drawAward ? this.awards.indexOf(drawAward) : 6;
                    }
                    // 转到目标位置才停止
                    if (this.drawOrder[this.activeIndex % 8] === targetIndex) {
                        clearInterval(this.interval);
                        this.showResult();
                    }
                    else {
                        this.activeIndex++;
                    }
                }, 50);
            },
            showResult() {
                if (this.activeIndex % 8 === 5) {
                    this.$dialog({
                        content: '很遗憾，未抽中奖品',
                        noOkBtn: true,
                        cancelBtnTxt: '确定',
                    });
                    return;
                }
                this.showCoupon = true;
            }
        },
        mounted: function () {
        },
        activated() {
            document.title = '支付成功';
            this.fetchGoods();
        }
    }
</script>

<style scoped lang="less">
    .pay-success {
        background-color: #F0EFF3;
        position: relative;
        min-height: 100%;
        .line {
            background-color: #FFF;
            padding: 10px 0.3rem;
            border-bottom: 1px solid #E4E4E4;
            font-size: 16px;
            &.green {
                font-size: 22px;
                color: #A8BE71;
                .icon-gou {
                    vertical-align: text-bottom;
                }
            }
            .left {
                color: #949494;
            }
            .right {
                float: right;
                .red {
                    color: #D66455;
                }
            }
        }
        .goods {
            .good {
                background-color: #FFF;
                float: left;
                margin: 0 10px 10px 0;
                .good-name {
                    color: #797979;
                    font-size: 16px;
                    padding: 10px 0 20px 10px;
                }
                .sale-price {
                    color: #C15749;
                    font-size: 16px;
                    padding-left: 0.3rem;
                }
                .origin-price {
                    float: right;
                    color: #6C6C6C;
                    font-size: 12px;
                    padding-right: 0.3rem;
                    text-decoration: line-through;
                }
            }
        }
        .advert {
            background-color: #FFF;
            line-height: 1.5;
            padding: 0.3rem 10px;
            .icon-liwu {
                color: #FF0000;
                padding-right: 5px;
            }
        }
        .service-phone {
            text-align: center;
        }
        .award-plate-dialog {
            .modal {
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: #000;
                opacity: 0.3;
            }
            .coupon-plate {
                position: fixed;
                z-index: 2;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                width: 9rem;
                height: 9rem;
                .coupon {
                    background: url("../../assets/images/success-inf.png") no-repeat;
                    background-size: 100% 100%;
                    height: 100%;
                    padding-top: 4rem;
                    .icon-guanbi {
                        position: absolute;
                        top: -20px;
                        left: 50%;
                        margin: 0 -20px;
                    }
                    .ticket {
                        width: 6rem;
                        height: 3rem;
                        margin: 0 auto;
                        background: url("../../assets/images/success-text.png") no-repeat;
                        background-size: 100% 100%;
                        color: #FFF;
                        padding-top: 5px;
                        .box{
                            width: 80%;
                            height: 90%;
                            border: 2px solid #FFF;
                            margin: 0 auto;
                            border-radius: 8px;
                            text-align: center;
                            .line-1{
                                border-bottom: 2px dashed #FFF;
                                .pre{
                                    font-size: 40px;
                                }
                                .post{
                                    font-size: 20px;
                                }
                            }
                            .line-2{
                                font-size: 20px;
                                line-height: 30px;
                            }
                        }
                    }
                    .i-know {
                        color: #FFF;
                        border: 2px solid #FFF;
                        border-radius: 24px;
                        font-size: 24px;
                        line-height: 48px;
                        text-align: center;
                        width: 160px;
                        margin: 10px auto;
                    }
                }
            }
            .award-plate {
                position: fixed;
                z-index: 2;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                padding: 1rem 0.5rem;
                .icon-guanbi {
                    position: absolute;
                    right: 0.5rem;
                    top: 0.5rem;
                }
                .awards {
                    background: url("../../assets/images/draw_view2_bg.png") no-repeat;
                    background-size: 100% 100%;
                    height: 16rem;
                    padding: 4.5rem 1rem;
                    .cell {
                        height: 2.2rem;
                        width: 2.2rem;
                        float: left;
                        margin-bottom: 0.2rem;
                        color: #FFF;
                        position: relative;
                        text-align: center;
                    }
                    .center {
                        margin: 0 0.2rem;
                    }
                    .active {
                        border: 2px solid #F4FB06;
                        border-radius: 6px;
                    }
                    .award {
                        background: url("../../assets/images/li-bg.png") no-repeat;
                        background-size: 100% 100%;
                        padding-top: 0.3rem;
                        font-size: 12px;
                        &.active {
                            background-color: #F4FB06;
                        }
                        .award-amount {
                            .pre {
                                font-size: 24px;
                            }
                        }
                        .award-type {
                            font-weight: bold;
                            position: absolute;
                            left: 0;
                            bottom: 0.3rem;
                            width: 100%;
                        }
                    }
                    .draw {
                        background: url("../../assets/images/btn-bg.png") no-repeat;
                        background-size: 100% 100%;
                        &.active {
                            background-color: #F4FB06;
                        }
                    }
                    .miss {
                        background: url("../../assets/images/bad-luck.png") no-repeat;
                        background-size: 100% 100%;
                        &.active {
                            background-color: #F4FB06;
                        }
                        label {
                            font-weight: bold;
                            position: absolute;
                            left: 0;
                            bottom: 0.3rem;
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
</style>
