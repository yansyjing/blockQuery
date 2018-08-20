<template>
    <div id="app">
        <img src="./assets/images/logo.png" class="logoImg">
        <div class="tab">
            <span class="no-select-text" :class="{active:isBlock}" @click="blockClick">区块查询</span>
            <span class="no-select-text" :class="{active:!isBlock}" @click="transactionClick">交易查询</span>
        </div>
        <router-view></router-view>
        <language class="language"></language>
    </div>
</template>

<script>
    import language from './components/language/language'

    export default {
        name: 'App',
        components: {
            language
        },
        data() {
            return {
                isBlock:true,
            }
        },
        methods:{
            blockClick() {
                this.isBlock = true
                this.$router.replace("blocksList")
            },
            transactionClick() {
                this.isBlock = false
                this.$router.replace("transactionList")
            },
        },
        mounted() {
            let name = this.$route.name;
           if(name === "blocksList") {
               this.isBlock = true
           } else if (name === "transactionList") {
               this.isBlock = false
           }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "assets/scss/global";
</style>
