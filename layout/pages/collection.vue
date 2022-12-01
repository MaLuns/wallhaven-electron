<template>
    <div class="page-component">
        <template v-if="show">
            <img-list ref="imglist" mode="tile"></img-list>
        </template>
        <template v-else>
            <one-result height="600" title="收藏夹空空如也 ~"></one-result>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false
        }
    },
    activated() {
        let list = Object.values(this.$store.collections.store)
        this.show = list.length
        if (this.show) {
            this.$refs.imglist.add(list, true)
            this.$refs.imglist.updateVisibleList()
        }
    }
};
</script>

<style>
.page-component {
    width: 100%;
    height: 100%;
}
</style>