<template>
    <div class="choose-gun">
        <div class="tip-1">请在车内使用，体验效果更佳</div>
        <div class="station" :style="{backgroundImage:'url(' + station.logo + ')'}">
            <div class="station-info">
                <div class="station-name">{{station.stationName}}</div>
                <div class="station-address">{{station.gasStationAddress}}</div>
            </div>
        </div>
        <div class="gun" @click="switchPicker">
            <span class="label">选择油枪号</span> <span>{{gun}}</span> <span class="placeholder" v-if="!gun">请选择油枪号</span>
            <nut-icon type="right" size="1em" color="#C8C8CD" class="right-icon"></nut-icon>
        </div>
        <nut-picker title="选择油枪号" :is-visible="pickerVisible" @close="switchPicker" :list-data="[guns]"
                    @confirm="pickGun">
        </nut-picker>
        <div class="amount">
            <nut-textinput type="number" v-model="amount" label="加油金额(元)" placeholder="请输入加油金额" :hasBorder="false"
                           :clearBtn="false"/>
        </div>
        <button class="next-step" @click="next">下一步</button>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                pickerVisible: false,
                gun: '',
                amount: ''
            }
        },
        computed: {
            station: function () {
                return this.$store.state.station;
            },
            guns: function () {
                let guns = this.station.oilGunMapList || [];
                return guns.map((item) => {
                    return `${item.oilGunName}号枪(${item.oilMachineName})`;
                });
            }
        },
        methods: {
            switchPicker() {
                this.pickerVisible = !this.pickerVisible;
            },
            pickGun(chooseData) {
                this.gun = chooseData[0];
            },
            next(){
                if(!this.gun){
                    this.$dialog({
                        content: "请选择油枪",
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                if(!/^[0-9]+(\.[0-9]{1,2})?$/.test(this.amount)){
                    this.$dialog({
                        content: "请输入正确的金额",
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                if(this.amount < this.station.minPayMoney){
                    this.$dialog({
                        content: `输入金额必须大于${this.station.minPayMoney}元`,
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                if(this.amount > this.station.maxPayMoney){
                    this.$dialog({
                        content: `输入金额必须小于${this.station.maxPayMoney}元`,
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                let oilGunName = this.gun.split('号枪')[0];
                this.$store.state.gun = this.station.oilGunMapList.find((item)=>{
                    return item.oilGunName == oilGunName;
                });
                this.$store.state.amount = Math.round(this.amount * 100); // 以分为单位
                this.$store.commit("change");
                this.$router.push({path: "/choose-plate"});
            }
        },
        activated() {
            document.title = '一键加油';
        }
    }
</script>

<style scoped lang="less">
    .choose-gun {
        background-color: #F0EFF3;
        min-height: 100%;
        .tip-1 {
            color: #999;
            padding: 0.3rem;
        }
        .station {
            padding: 0.3rem;
            background-repeat: no-repeat;
            background-size: 1.4rem 1.4rem;
            background-color: #fff;
            background-position: 0.3rem 0.3rem;
            min-height: 2rem;
            .station-info {
                margin-left: 2rem;
                .station-name {
                    font-size: 16px;
                    line-height: 30px;
                }
                .station-address {
                    color: #979797;
                }
            }
        }
        .gun {
            background-color: #fff;
            margin: 0.5rem 0;
            padding: 0.3rem;
            font-size: 16px;
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
        .amount {
            background-color: #fff;
            padding: 0.1rem 0.3rem;
            font-size: 16px;
        }
        .next-step{
            width: 90%;
            text-align: center;
            margin: 30px 5%;
            background-color: #F13D3D;
            border: 0;
            border-radius: 5px;
            color: #FFF;
            line-height: 40px;
            font-size: 16px;
        }
    }

</style>
<style lang="less">
    .nut-textinput-label{
        padding-right: 0.6rem;
    }
</style>
