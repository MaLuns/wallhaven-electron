<template>
    <div>
        <img-list ref="imglist"></img-list>
    </div>
</template>

<script>
export default {
    name: "CollectionPage",
    activated() {
        this.$refs.imglist.add(this.$root.collections, true)
    }
};
</script>

<style>

</style>