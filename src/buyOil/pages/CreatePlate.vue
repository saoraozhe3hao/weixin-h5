<template>
    <div class="create-plate">
        <div class="plate">
            <span class="label">车牌号</span> <span class="province" @click="switchPicker">{{province}}</span>
            <div class="input">
                <nut-textinput v-model="plate" label="" placeholder="请输入车牌号码" :hasBorder="false" :clearBtn="false"/>
            </div>
        </div>
        <nut-picker title="请选择省份" :is-visible="pickerVisible" @close="switchPicker" :list-data="[provinces]"
                    @confirm="pickProvince">
        </nut-picker>
        <button class="next-step" @click="next">下一步</button>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                pickerVisible: false,
                provinces: ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁',
                    '豫', '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新', '台'],
                province: '京',
                plate: ''
            }
        },
        computed: {},
        methods: {
            switchPicker() {
                this.pickerVisible = !this.pickerVisible;
            },
            pickProvince(chooseData) {
                this.province = chooseData[0];
            },
            next() {
                if (!this.plate) {
                    this.$dialog({
                        content: "请输入车牌号",
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                let reg = /^[a-zA-Z]{1}[a-zA-Z_0-9]{3,5}[a-zA-Z_0-9_\u4e00-\u9fa5]$/;
                if (!reg.test(this.plate)) {
                    this.$dialog({
                        content: "请输入正确的车牌号码",
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                this.createPlate();
            },
            createPlate() {
                this.$axios({
                    method: "post",
                    url: this.$basePath + "/wx/api/car",
                    data: {
                        carNo: this.province + this.plate
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        this.$store.state.plate = this.province + this.plate;
                        this.$store.commit("change");
                        this.$router.back();
                    }
                });
            }
        },
        mounted() {
        },
        activated(){
            document.title = '创建新车牌';
            this.pickerVisible = false;
            this.province= '京';
            this.plate= '';
        }
    }
</script>

<style scoped lang="less">
    .create-plate {
        background-color: #F0EFF3;
        position: relative;
        min-height: 100%;
        padding: 0.5rem 0 50px;
        .plate {
            background-color: #fff;
            padding: 0.3rem;
            .province {
                color: #797979;
                padding: 0 0.5rem 0 1rem;
            }
            .input {
                display: inline-block;
            }
        }
        .next-step {
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
</style>
