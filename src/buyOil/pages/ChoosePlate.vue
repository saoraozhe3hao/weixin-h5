<template>
    <div class="choose-plate">
        <div class="station-name">油站名称 : {{station.stationName}}</div>
        <div class="amount">
            <div class="gun-amount">
                <label>{{`${gun.oilGunName}号枪(${gun.oilMachineName})`}}</label>
                <label class="right">¥{{displayMoney($store.state.amount)}}</label>
            </div>
            <div class="total-amount">
                <label>总计 : </label>
                <label class="right">¥{{displayMoney($store.state.amount)}}</label>
            </div>
        </div>
        <div class="plate" @click="openPicker">
            <span class="label">车牌号</span> <span>{{plate}}</span> <span class="placeholder" v-if="!plate">请选择车牌号</span>
            <nut-icon type="right" size="1em" color="#C8C8CD" class="right-icon"></nut-icon>
        </div>
        <nut-picker title="选择车牌号" :is-visible="pickerVisible" @close="pickerVisible = false" :list-data="[plateList]"
                    @confirm="pickPlate">
        </nut-picker>
        <div class="plate-tip">请您确认车牌号，以免影响油站放行！</div>
        <div class="receipt-switch">
            <span class="label">本次是否开发票(默认发票信息如下)</span>
            <nut-switch :active.sync="receiptActive" class="right"></nut-switch>
        </div>
        <div class="receipt" v-if="receiptActive">
            <div v-if="receipt">
                <div>{{receipt.invoiceName}}</div>
                <label>纳税人识别号 :</label>
                <div>
                    <span>{{receipt.taxPayerId}}</span>
                    <label class="change-receipt" @click="moreReceipt">更换发票信息></label>
                </div>
            </div>
            <div v-else class="empty" @click="moreReceipt">
                <nut-icon type="plus" size="1em" color="#A2A2A2" class="left-icon"></nut-icon>
                <label>填写发票信息</label>
            </div>
        </div>
        <div class="receipt-tip">
            <div>
                <nut-icon type="action" size="1em" color="#F33D36" class="left-icon"></nut-icon>
                <label>如需开具发票，请向加油站收银员现场索取，</label>
            </div>
            <label>暂不支持累计开具发票</label>
        </div>
        <div class="footer">
            <label>合计 : ¥{{displayMoney($store.state.amount)}}</label>
            <button class="next-step" @click="next">下一步</button>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                pickerVisible: false,
                plates: [],
                plate: '',
                createLabel: '创建新车牌号',
                receiptActive: false,
                receipt: null
            }
        },
        computed: {
            station: function () {
                return this.$store.state.station;
            },
            gun: function () {
                return this.$store.state.gun;
            },
            plateList: function () {
                return this.plates.map((item)=>{
                    return item.name;
                }).concat(this.createLabel);
            }
        },
        watch: {
            receiptActive: function (val) {
                if (val) {
                    this.fetchReceipts();
                }
            },
            "$store.state.plate": function () {
                this.plate = this.$store.state.plate.name;
            },
            "$store.state.receipt": function (val) {
                this.receipt = this.$store.state.receipt;
            }
        },
        methods: {
            displayMoney(money) {
                return (money / 100).toFixed(2);
            },
            openPicker(){
                this.pickerVisible = true;
            },
            pickPlate(chooseData) {
                if (chooseData[0] == this.createLabel) {
                    this.$router.push({path: "/create-plate"});
                }
                else {
                    this.plate = chooseData[0];
                }
            },
            fetchPlates(init) {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/wx/api/cars"
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        this.plates = response.data || [];
                        if(init){
                            this.plate = this.plates[0] ? this.plates[0].name : '';
                        }
                    }
                });
            },
            fetchReceipts() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/wx/api/invoices"
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        let receipts = response.data || [];
                        this.receipt = receipts[0] || null;
                    }
                });
            },
            moreReceipt() {
                this.$router.push({path: "/choose-receipt"});
            },
            next() {
                if (!this.plate) {
                    this.$dialog({
                        content: "请选择车牌号",
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                if (this.receiptActive && !this.receipt) {
                    this.$dialog({
                        content: "请填写发票信息",
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                this.$store.state.plate = this.plates.find((item)=>{
                    return item.name == this.plate;
                });
                this.$store.state.receipt = this.receipt;
                this.$store.commit("change");
                this.$router.push({path: "/choose-payment"});
            }
        },
        mounted() {
            this.fetchPlates(true);
        },
        activated(){
            document.title = '确定下单';
            this.fetchPlates();
        }
    }
</script>

<style scoped lang="less">
    .choose-plate {
        background-color: #F0EFF3;
        position: relative;
        min-height: 100%;
        padding: 0.5rem 0 50px;
        .station-name {
            padding: 0.3rem;
            background-color: #FFF;
            margin-bottom: 0.6rem;
        }
        .amount {
            margin-bottom: 1rem;
            background-color: #FFF;
            .gun-amount {
                padding: 0.3rem;
                border-bottom: 1px solid #E6E6E6;
            }
            .total-amount {
                padding: 0.3rem;
            }
            .right {
                float: right;
            }
        }
        .plate {
            background-color: #fff;
            margin: 0.5rem 0 0;
            padding: 0.3rem;
            .label {
                padding-right: 1rem;
            }
            .placeholder {
                color: #979797;
            }
            .right-icon {
                float: right;
            }
        }
        .plate-tip {
            color: #CE4756;
            line-height: 1.2rem;
            padding-left: 0.3rem;
        }
        .receipt-switch {
            background-color: #fff;
            padding: 0.5rem 0.3rem;
            color: #A4A4A4;
            .right {
                float: right;
            }
        }
        .receipt {
            padding: 0.3rem;
            margin: 0.2rem 0;
            background-color: #FFF;
            border: 1px dashed #8F8F8F;
            line-height: 1.6;
            label {
                color: #A2A2A2;
            }
            .change-receipt {
                float: right;
            }
            .empty {
                text-align: center;
                padding: 10px 0;
                .left-icon {
                    vertical-align: text-top;
                    padding-right: 10px;
                }
            }
        }
        .receipt-tip {
            color: #717173;
            line-height: 1.8;
            padding: 1rem 0.3rem 1rem;
            text-align: center;
            .left-icon {
                vertical-align: sub;
            }
        }
        .footer {
            position: fixed;
            width: 100%;
            bottom: 0;
            background-color: #FFF;
            line-height: 50px;
            padding-left: 0.3rem;
            .next-step {
                text-align: center;
                background-color: #F13D3D;
                border: 0;
                color: #FFF;
                font-size: 16px;
                float: right;
                padding: 0 0.5rem;
                line-height: 50px;
            }
        }
    }
</style>
<style lang="less">
</style>
