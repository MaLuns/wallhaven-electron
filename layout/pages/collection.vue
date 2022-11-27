<template>
    <div>
        <img-list ref="imglist" mode="tile"></img-list>
    </div>
</template>

<script>
export default {
    name: "CollectionPage",
    activated() {
        this.$refs.imglist.add(Object.values(this.$store.collections.store), true)
        this.$refs.imglist.updateVisibleList()
    }
};
</script>

<style>

</style>