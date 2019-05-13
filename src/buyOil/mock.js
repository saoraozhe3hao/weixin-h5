import Mock from 'mockjs'

let Random = Mock.Random;

function mock() {
    // 获取授权地址
    Mock.mock(/foreground\/config\/js/, {
        "code": "0",
        "data": '/buyOil.html?sessionId=' + Random.integer()
    });
    // 签名信息
    Mock.mock(/wxconfig/, {
        "code": "0",
        "data": {
            appId: Random.integer(),
            timestamp: Random.integer(),
            nonceStr: Random.integer(),
            signature: Random.integer(),
        }
    });
    // 油站列表
    Mock.mock(/oil\/buyoil\/stations/, function () {
        let stations = [];
        for (let i = 0; i < 10; i++) {
            stations.push({
                "stationId": Random.integer(),
                "stationName": '油站' + Random.integer(0, 100),
                "logo": "http://stations.oss-cn-beijing.aliyuncs.com/xianqiaopailogo.jpg",
                "city": Random.integer(0, 1000000),
                "distance": Random.integer(100, 3000),
                maxSubtract: ["92# ↓0.05 ", "95# ↓0.06 "],
                "oilGunMapList": [
                    {
                        "oilMachineName": "92#",
                        "code": "1",
                        "oilGunName": "1",
                        "id": "e9326f0ca76b4eeca28b542076902404"
                    },
                    {
                        "oilMachineName": "95#",
                        "code": "2",
                        "oilGunName": "2",
                        "id": "e9326f0ca76b4eeca28b542076902405"
                    }],
                "maxPayMoney": 5000,
                "minPayMoney": 10,
                "gasStationAddress": '地址' + Random.integer(0, 100),
                "longitude": Random.integer(0, 180),
                "latitude": Random.integer(0, 180),
            })
        }
        return {
            "code": "0",
            "data": stations
        }
    });
    // 扫码进入指定油站
    Mock.mock(/oil\/scan\/buyoil/, function () {
        return {
            "code": "0",
            "data": {
                "stationId": Random.integer(),
                "stationName": '油站' + Random.integer(0, 100),
                "logo": "http://stations.oss-cn-beijing.aliyuncs.com/xianqiaopailogo.jpg",
                "city": Random.integer(0, 1000000),
                "distance": Random.integer(100, 3000),
                maxSubtract: ["92# ↓0.05 ", "95# ↓0.06 "],
                "oilGunMapList": [
                    {
                        "oilMachineName": "92#",
                        "code": "1",
                        "oilGunName": "1",
                        "id": "e9326f0ca76b4eeca28b542076902404"
                    },
                    {
                        "oilMachineName": "95#",
                        "code": "2",
                        "oilGunName": "2",
                        "id": "e9326f0ca76b4eeca28b542076902405"
                    }],
                "maxPayMoney": 5000,
                "minPayMoney": 10,
                "gasStationAddress": '地址' + Random.integer(0, 100),
                "longitude": Random.integer(0, 180),
                "latitude": Random.integer(0, 180),
            }
        }
    });
    // 车牌列表
    Mock.mock(/cars/, function () {
        return {
            "code": "0",
            "data": [
                {
                    id: Random.integer(),
                    name: "陕A12333"
                },
                {
                    id: Random.integer(),
                    name: "陕B12333"
                }
            ]
        }
    });
    // 发票信息列表
    Mock.mock(/invoices/, function () {
        return {
            "code": "0",
            "data": [
                {
                    invoiceId: Random.integer(),
                    invoiceName: '车到网络',
                    taxPayerId: Random.integer()
                },
                {
                    invoiceId: Random.integer(),
                    invoiceName: '冠德石油',
                    taxPayerId: Random.integer()
                }
            ]
        }
    });
    // 支付方式 和 优惠券 列表
    Mock.mock(/order\/foroilpay/, function () {
        return {
            "code": "0",
            "data": {
                oilCardId: "e96b26aab3fb11e7bd8000163e007221",
                // 支付类型
                "payTypes": [
                    {
                        "payType": 4,
                        "payCode": "weixin",
                        "payName": "微信",
                        "orderIndex": 4,
                        "desc": "",
                        "firstIcon": "http://cdimages.oss-cn-beijing.aliyuncs.com/pay%2Fweixinpay.png",
                        "lastIcon": "",
                        "balance": null,
                        "default": true
                    },
                    {
                        "payType": 1,
                        "payCode": "chedao",
                        "payName": "车到钱包",
                        "orderIndex": 15,
                        "desc": "",
                        "firstIcon": "http://cdimages.oss-cn-beijing.aliyuncs.com/pay/chedaopay.jpg",
                        "lastIcon": "",
                        "balance": "10000",
                        "default": false
                    },
                    {
                        balance: "418200",
                        default: false,
                        desc: "",
                        firstIcon: "http://cdimages.oss-cn-beijing.aliyuncs.com/pay%2Foilcardpay.png",
                        lastIcon: "",
                        orderIndex: 6,
                        payCode: "oilcard",
                        payName: "加油卡",
                        payType: 7
                    }
                ],
                // 默认优惠券
                "selectCoupon": {
                    "id": "bea6091f6a5211e9bb7700163e100c28",
                    "shortTitle": "测试2",
                    "name": "西安i都会消费返券无门槛",
                    "strBeginTime": "2019-04-11",
                    "strEndTime": "2019-05-11",
                    "deductType": 2,
                    "deductAmount": 76,
                    "deductMaxAmount": 5000,
                    "leastCost": 10000,
                    "deductMoney": 2400
                },
                // 立减
                subtractMap: {
                    discount: 15,  // 折扣 15%
                    leastCost: 10000,
                    productId: "92#",
                    subtractId: "c49d1e4d5b6811e9bb7700163e100c28",
                    subtractMoney: 1500,
                    tip: "0.77",   // 折扣 0.77元每升，只用于显示，后台计算以discount为准
                    useCoupon: 0
                },
                // 优惠券列表
                "couponList": [
                    {
                        "id": "7f539c176ae811e9bb7700163e100c28",
                        "shortTitle": "测试1",
                        "name": "西安i都会消费返券无门槛",
                        "strBeginTime": "2019-04-11",
                        "strEndTime": "2019-05-11",
                        "deductType": 1,
                        "deductAmount": 76,
                        "deductMaxAmount": 5000,
                        "leastCost": 10000,
                        "deductMoney": 2400
                    },
                    {
                        "id": "bea6091f6a5211e9bb7700163e100c28",
                        "shortTitle": "测试2",
                        "name": "西安i都会消费返券无门槛",
                        "strBeginTime": "2019-04-11",
                        "strEndTime": "2019-05-11",
                        "deductType": 2,
                        "deductAmount": 76,
                        "deductMaxAmount": 5000,
                        "leastCost": 10000,
                        "deductMoney": 2400
                    },
                    {
                        "id": "13dcc2d7672611e9bb7700163e100c28",
                        "shortTitle": "测试3",
                        "name": "西安i都会消费返券无门槛",
                        "strBeginTime": "2019-04-11",
                        "strEndTime": "2019-05-11",
                        "deductType": 3,
                        "deductAmount": 76,
                        "deductMaxAmount": 5000,
                        "leastCost": 10000,
                        "deductMoney": 2400
                    }
                ]
            }
        }
    });
    // 支付
    Mock.mock(/order\/pay/, function () {
        return {
            "code": "0",
            "data": {
                "payMoney": 222,
                "wechatPayMsg": {
                    "appId": "wxff16bad60946563c",
                    "nonceStr": "23",
                    "package": "prepay_id=wx30173243712920584ea0fa920354828083",
                    "paySign": "CD5A03A43C2C1B92910E59D36789F24F",
                    "pay_info": null,
                    "signType": "MD5",
                    "timeStamp": "878"
                },
                aliPayMsg: 'F01_JYZF0260565677878',
                "hasCoupons": null,
                "balanceDeductMoney": 0,
                "stationName": "车到旺座国际加油站",
                "serialCode": "JYZF26005317401707065",
                platesDishes: [{
                    "templateId": "8f11e30a709a11e9bb7700163e100c28",
                    "activityId": "fa8f24de70a311e9bb7700163e100c28",
                    "templateName": "测试app满120可抽奖",
                    "itemName": "车到抵用券",
                    "activityName": "测试app抽奖活动",
                    "drawId": "fa94cf2470a311e9bb7700163e100c28",
                    "deductAmount": 800,
                    "drawCode": 4,
                    "weight": 80,
                    "count": 17,
                    "deductType": 1
                }, {
                    "templateId": "770ff522709d11e9bb7700163e100c28",
                    "activityId": "fa8f24de70a311e9bb7700163e100c28",
                    "templateName": "测试app满130元可抽奖",
                    "itemName": "车到抵用券",
                    "activityName": "测试app抽奖活动",
                    "drawId": "fa9680ba70a311e9bb7700163e100c28",
                    "deductAmount": 500,
                    "drawCode": 5,
                    "weight": 90,
                    "count": 4,
                    "deductType": 1
                }, {
                    "templateId": "7e3a268f709b11e9bb7700163e100c28",
                    "activityId": "fa8f24de70a311e9bb7700163e100c28",
                    "templateName": "测试app满110元可抽奖",
                    "itemName": "车到抵用券",
                    "activityName": "测试app抽奖活动",
                    "drawId": "fa90dc8370a311e9bb7700163e100c28",
                    "deductAmount": 20000,
                    "drawCode": 1,
                    "weight": 90,
                    "count": 5,
                    "deductType": 1
                }, {
                    "templateId": "9f75d4af709c11e9bb7700163e100c28",
                    "activityId": "fa8f24de70a311e9bb7700163e100c28",
                    "templateName": "测试app满150元可抽奖",
                    "itemName": "车到抵用券",
                    "activityName": "测试app抽奖活动",
                    "drawId": "fa922e7e70a311e9bb7700163e100c28",
                    "deductAmount": 20000,
                    "drawCode": 2,
                    "weight": 90,
                    "count": 5,
                    "deductType": 1
                }, {
                    "templateId": "ad65be2d709b11e9bb7700163e100c28",
                    "activityId": "fa8f24de70a311e9bb7700163e100c28",
                    "templateName": "测试app满140元可抽奖",
                    "itemName": "车到抵用券",
                    "activityName": "测试app抽奖活动",
                    "drawId": "fa937e6c70a311e9bb7700163e100c28",
                    "deductAmount": 1000,
                    "drawCode": 3,
                    "weight": 95,
                    "count": 10,
                    "deductType": 1
                }, {
                    "templateId": "d2478313709e11e9bb7700163e100c28",
                    "activityId": "fa8f24de70a311e9bb7700163e100c28",
                    "templateName": "测试app满160元可抽奖",
                    "itemName": "车到抵用券",
                    "activityName": "测试app抽奖活动",
                    "drawId": "fa97ca9970a311e9bb7700163e100c28",
                    "deductAmount": 20000,
                    "drawCode": 6,
                    "weight": 96,
                    "count": 10,
                    "deductType": 1
                }, {
                    "templateId": "bad_luck",
                    "activityId": "bad_luck",
                    "templateName": "0",
                    "itemName": "再接再厉",
                    "activityName": "再接再厉",
                    "drawId": "bad_luck",
                    "deductAmount": 0,
                    "drawCode": 0,
                    "weight": 20,
                    "count": 0,
                    "deductType": 4
                }, {
                    "templateId": "ece74acb709911e9bb7700163e100c28",
                    "activityId": "fa8f24de70a311e9bb7700163e100c28",
                    "templateName": "测试app满100元可抽奖",
                    "itemName": "车到抵用券",
                    "activityName": "测试app抽奖活动",
                    "drawId": "fa990f9670a311e9bb7700163e100c28",
                    "deductAmount": 2000,
                    "drawCode": 7,
                    "weight": 98,
                    "count": 10,
                    "deductType": 1
                }]
            }
        }
    });
    // 支付成功
    Mock.mock(/pay\/success/, function () {
        return {
            "code": "0",
            "data": {
                "successAdDesc": "感谢您使用车到加油，送你一次抽奖机会，点我！<br/>      （活动由第三方支持，最终解释权归第三方所有）",
                "SuccessAdUrl": "http://cdjy.1369qp.com/",
                "convenienttobuy": {
                    "distance": 0,
                    "size": 1,
                    "gasstationaddress": "高新区唐延路一号(近颐和酒店)",
                    "stationname": "车到旺座国际加油站",
                    "stationlogo": "http://stations.oss-cn-beijing.aliyuncs.com/e015a85d360e47be82d5e2a56946f05a.PNG",
                    "stationid": "61573516d7094f33972b53f0df90f03a",
                    "group": [{
                        "thumbnail": "http://imgnew.51autogo.com/c074c556d04746368df65b3cd6ee34f8.jpg",
                        "goodname": "清风抽纸",
                        "buynum": 15,
                        "originalprice": 800,
                        "stationgoodsid": "27dd95e1099d47b0b134a0df93f061f6",
                        "saleprice": 998,
                        "memo": {"site": "现场取货", "privilege": "车到旺座加油站,车到返金豆0个"},
                        "endtime": "2019-11-15 17:29:00",
                        "goodspics": "http://imgnew.51autogo.com/ee1bac78d262462eb587aafb22b358b6.jpg",
                        "discountamount": 0,
                        "limitamount": 500,
                        "goodspropertylist": null,
                        "perAmount": 0,
                        "saledamount": 0,
                        "onceamount": 0
                    }]
                }
            }
        }
    });
    // 抽奖
    Mock.mock(/wx\/api\/draw/, function () {
        return {
            "code": "0",
            data: {
                "deductType": 1,
                "leastCost": 10000,
                "deductAmount": 1000,
                "name": "抵用券",
                "beginTime": 1555862400000,
                "endTime": 2219846399000,
                "shortTitle": "西安测试",
                "templateId": "ece74acb709911e9bb7700163e100c28"
            }
        }
    });
    // 其他
    Mock.mock(/wx\/api/, function () {
        return {
            "code": "0"
        }
    });
}

// 本地才加载桩数据
if (location.hostname == 'localhost') {
    mock();
}

export default mock;
