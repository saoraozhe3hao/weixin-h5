<template>
    <div class="choose-coupon">
        <div class="use-coupon">
            <label>使用优惠券</label>
            <nut-switch :active.sync="useCoupon" class="switch" @change="useChange"></nut-switch>
        </div>
        <div class="coupon-tip">有 <label>{{coupons.length}}</label> 张优惠券可用用</div>
        <div class="coupon-list">
            <div class="coupon-card clearfix" v-for="(item,index) in coupons"
                 :class="{blue: [2,3].includes(item.deductType), yellow: item.deductType === 1}">
                <div class="left">
                    <nut-radio v-model="couponId" :label="item.id" :disabled="!useCoupon"></nut-radio>
                </div>
                <div class="middle">
                    <div class="deduct-amount" v-if="[2,3].includes(item.deductType)">
                        <label class="integer">{{Math.floor(item.deductAmount / 10)}}</label>
                        <label class="decimal">.{{item.deductAmount % 10}}折</label>
                    </div>
                    <div class="deduct-amount" v-if="item.deductType === 1">
                        <label class="integer">{{Math.floor(item.deductAmount / 100)}}</label>
                        <label class="decimal">.{{item.deductAmount % 100}}元</label>
                    </div>
                    <div class="least-cost">满{{(item.leastCost/100).toFixed(2)}}元可用</div>
                </div>
                <div class="right">
                    <div class="name text-overflow">{{item.name}}</div>
                    <div class="short-title">• {{item.shortTitle}}</div>
                    <div class="time">• {{item.strBeginTime}}-{{item.strEndTime}}</div>
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
                useCoupon: true,
                couponId: ''
            }
        },
        watch: {
            couponId: function (val) {
                if(val){
                    this.$store.state.coupon = this.coupons.find((item)=>{
                        return item.id == val;
                    });
                    this.$store.commit("change");
                    this.$router.back();
                }
            }
        },
        computed: {
            coupons: function () {
                return this.$store.state.coupons
            }
        },
        methods: {
            useChange(val){
                if(!val){
                    this.$store.state.coupon = {};
                    this.$store.commit("change");
                    this.$router.back();
                }
            }
        },
        mounted() {
        },
        activated() {
            document.title = '选择优惠券';
        },
        deactivated(){
            this.couponId = '';
        }
    }
</script>

<style scoped lang="less">
    .choose-coupon {
        background-color: #F0EFF3;
        min-height: 100%;
        padding: 0.1rem 0;
        .use-coupon {
            background-color: #FFF;
            border-top: 1px solid #E4E4E4;
            padding: 0.3rem;
            font-size: 16px;
            .switch {
                vertical-align: middle;
                margin-left: 10px;
                float: right;
            }
        }
        .coupon-tip{
            padding: 0.3rem;
            color: #A7A7A9;
            label{
                color: #DD3F3E;
            }
        }
        .coupon-list {
            padding: 0.3rem 0.3rem;
            .coupon-card {
                border-radius: 5px;
                padding: 20px;
                margin-bottom: 20px;
                position: relative;
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
                    position: absolute;
                    height: fit-content;
                    top: 0;
                    bottom: 0;
                    margin: auto 0;
                }
                .middle{
                    margin-left: 10%;
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
                    width: 50%;
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
        }
    }
</style>
