<template>
    <div class="station-list">
        <div class="tip-1" v-if="nearStations.length">选择当前油站，不确定请求助加油小哥</div>
        <div v-for="(item,index) in nearStations" class="station clearfix" :class="{last: index == nearStations.length - 1}">
            <div class="left" @click="chooseNear(item)">
                <div class="station-name">{{item.stationName}}</div>
                <div class="station-address">{{item.gasStationAddress}}</div>
                <div class="discounts">
                    <span v-for="discount in item.maxSubtract" class="discount">{{discount}}</span>
                </div>
            </div>
            <div class="right" @click="openMap(item)">
                <img class="icon-daohang" src="../../assets/font/导航.png"/>
                <div>{{item.distance}}m</div>
            </div>
        </div>
        <div class="tip-1">附近其他车到油站</div>
        <div v-for="(item,index) in farStations" class="station clearfix" :class="{last: index == farStations.length - 1}">
            <div class="left" @click="chooseFar">
                <div class="station-name">{{item.stationName}}</div>
                <div class="station-address">{{item.gasStationAddress}}</div>
            </div>
            <div class="right" @click="openMap(item)">
                <img class="icon-daohang" src="../../assets/font/导航.png"/>
                <div>{{Math.floor(item.distance / 1000)}}km</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                latitude: '',
                longitude: '',
                nearStations: [],
                farStations: []
            }
        },
        methods: {
            locate() {
                if(this.$store.state.environment === 'alipay'){
                    this.$alipayReady(()=>{
                        AlipayJSBridge.call('getCurrentLocation',{
                        }, (result)=> {
                            this.latitude = result.latitude;
                            this.longitude = result.longitude;
                            this.fetchStations();
                        });
                    });
                }
                else{
                    this.$wx.ready(() => {
                        this.$wx.getLocation({
                            type: 'wgs84',
                            success: (result) => {
                                this.latitude = result.latitude;
                                this.longitude = result.longitude;
                                this.fetchStations();
                            }
                        });
                    });
                }
            },
            fetchStations() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/wx/api/oil/buyoil/stations",
                    params: {
                        latitude: 34.1868244429,//this.latitude,
                        longitude: 108.8867747002, //this.longitude
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        let stations = response.data || [];
                        this.nearStations = stations.filter((item) => {
                            return item.distance <= 1000;
                        });
                        this.farStations = stations.filter((item) => {
                            return item.distance > 1000;
                        });
                    }
                });
            },
            chooseNear(item){
                this.$store.state.station = item;
                this.$store.commit("change");
                this.$router.push({path: "/choose-gun"});
            },
            chooseFar(){
                this.$dialog({
                    content: "当前点击油站不在一公里之内，请重新选择。",
                    noOkBtn: true,
                    cancelBtnTxt: '确定'
                });
            },
            openMap(item){
                if(this.$store.state.environment === 'weixin'){
                    this.$wx.openLocation({
                        latitude: item.latitude, // 纬度
                        longitude: item.longitude, // 经度
                        name: item.stationName,
                        address: item.gasStationAddress,
                        scale: 15, // 地图缩放级别
                        infoUrl: ''
                    });
                }
            },
            fetchStation() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/wx/api/oil/scan/buyoil",
                    params: {
                        stationId: this.$route.query.stationId
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        this.$store.state.station = response.data;
                        this.$store.commit("change");
                        this.$router.push({path: "/choose-gun"});
                    }
                });
            },
        },
        activated: function () {
            document.title = '选择油站';
            // 扫码进入指定油站
            if(this.$route.query.stationId){
                this.fetchStation();
            }
            else if (location.hostname == 'localhost') {
                this.fetchStations();
            }
            else{
                this.locate();
            }
        }
    }
</script>

<style scoped lang="less">
    .station-list {
        .tip-1 {
            background-color: #DDD;
            color: #999;
            padding: 0.3rem;
        }
        .station {
            margin: 0 0.3rem;
            padding: 0.4rem 0;
            border-bottom: 1px solid #DDDDDD;
            &.last{
                border-bottom: 0;
            }
            .left {
                float: left;
                width: 80%;
                padding-right: 0.3rem;
                .station-name{
                    font-size: 16px;
                    line-height: 30px;
                }
                .station-address{
                    color: #979797;
                }
                .discounts{
                    margin-top: 8px;
                    .discount{
                        background-color: #9DBEFF;
                        padding: 3px 5px;
                        color: #FFF;
                        border-radius: 4px;
                        margin: 5px 5px 0 0;
                        display: inline-block;
                    }
                }
            }
            .right {
                float: right;
                width: 20%;
                border-left: 1px solid #E6E6E6;
                text-align: center;
                color: #969696;
                .icon-daohang {
                    padding-bottom: 10px;
                }
            }
        }
    }

</style>
