<template>
    <div class="receipt-list">
        <div v-for="(item,index) in receipts" class="receipt">
            <span class="default" v-if="item.isDefault">默认</span>
            <div class="left">
                <nut-radio v-model="receiptId" :label="item.invoiceId"></nut-radio>
            </div>
            <div class="middle">
                <div>{{item.invoiceName}}</div>
                <label>纳税人识别号:</label>
                <div>{{item.taxPayerId}}</div>
            </div>
            <div class="right">
                <button @click="edit(item)">编辑</button>
            </div>
        </div>
        <button class="next-step" @click="add">添加发票信息</button>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                receiptId: '',
                receipt: '',
                receipts: []
            }
        },
        watch: {
            receiptId: function (val) {
                if(val){
                    this.$store.state.receipt = this.receipts.find((item)=>{
                        return item.invoiceId == val;
                    });
                    this.$store.commit("change");
                    this.$router.back();
                }
            }
        },
        methods: {
            add() {
                this.$router.push({path: "/create-receipt"});
            },
            edit(item) {
                this.$router.push({path: "/create-receipt", query: item});
            },
            fetchReceipts() {
                this.$axios({
                    method: "get",
                    url: this.$basePath + "/wx/api/invoices"
                }).then((response) => {
                    response = response.data;
                    if (response.code == '0') {
                        this.receipts = response.data || [];
                    }
                });
            }
        },
        mounted() {
        },
        activated() {
            document.title = '发票列表';
            this.receiptId = '';
            this.fetchReceipts();
        }
    }
</script>

<style scoped lang="less">
    .receipt-list {
        padding-top: 0.3rem;
        background-color: #F0EFF3;
        min-height: 100%;
        .receipt {
            background-color: #FFF;
            margin-bottom: 0.3rem;
            position: relative;
            padding: 0.5rem 80px 0.5rem 50px;
            .default {
                color: #F13D3D;
                border: 1px solid #F13D3D;
                padding: 0 5px;
            }
            .left {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 60px;
                height: 20px;
                margin: auto;
                text-align: center;
                left: 0;
            }
            .middle {
                line-height: 1.6;
                label {
                    color: #9B9B9B;
                }
            }
            .right {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 80px;
                height: 20px;
                margin: auto;
                text-align: center;
                right: 0;
                button {
                    background-color: #E5E5E5;
                    line-height: 2;
                    padding: 0 10px;
                    border: 0;
                    border-radius: 5px;
                }
            }
        }
        .next-step {
            width: 90%;
            text-align: center;
            margin: 50px 5%;
            background-color: #F13D3D;
            border: 0;
            border-radius: 5px;
            color: #FFF;
            line-height: 40px;
            font-size: 16px;
        }
    }

</style>
