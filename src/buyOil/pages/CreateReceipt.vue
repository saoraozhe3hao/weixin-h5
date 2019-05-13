<template>
    <div class="create-receipt">
        <div class="form-item">
            <nut-textinput v-model="invoiceName" label="公司名称" placeholder="请输入公司名称" :hasBorder="false"
                           :clearBtn="false" class="invoice-name"/>
        </div>
        <div class="form-item">
            <nut-textinput v-model="taxPayerId" label="纳税人识别号" placeholder="请输入纳税人识别号" :hasBorder="false"
                           :clearBtn="false"/>
        </div>
        <button class="next-step" @click="save">保存</button>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                invoiceName: '',
                taxPayerId: ''
            }
        },
        computed: {},
        methods: {
            save() {
                if (!this.invoiceName) {
                    this.$dialog({
                        content: "请输入公司名称",
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                if (!this.taxPayerId) {
                    this.$dialog({
                        content: "请输入纳税人识别号",
                        noOkBtn: true,
                        cancelBtnTxt: '确定'
                    });
                    return;
                }
                this.createReceipt();
            },
            createReceipt() {
                let url = this.$route.query.invoiceId ? "/wx/api/invoice/edit" : "/wx/api/invoice/save";
                this.$axios({
                    method: "post",
                    url: this.$basePath + url,
                    data: {
                        id: this.$route.query.invoiceId || null,
                        invoiceName: this.invoiceName,
                        taxPayerId: this.taxPayerId
                    }
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        this.$router.back();
                    }
                });
            }
        },
        mounted() {
        },
        activated() {
            document.title = '添加发票信息';
            this.invoiceName = this.$route.query.invoiceName;
            this.taxPayerId = this.$route.query.taxPayerId;
        }
    }
</script>

<style scoped lang="less">
    .create-receipt {
        background-color: #F0EFF3;
        position: relative;
        min-height: 100%;
        padding: 0.5rem 0 50px;
        .form-item {
            background-color: #fff;
            padding: 0.3rem;
            .invoice-name{
                border-bottom: 1px solid #DBDBDB;
                padding-bottom: 0.3rem;
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
