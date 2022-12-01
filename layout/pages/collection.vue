<template>
    <div class="page-component">
        <img-list ref="imglist" mode="tile"></img-list>
    </div>
</template>

<script>
export default {
    activated() {
        this.$refs.imglist.add(Object.values(this.$store.collections.store), true)
        this.$refs.imglist.updateVisibleList()
    }
};
</script>

<style>
.page-component {
    width: 100%;
    height: 100%;
}
</style>