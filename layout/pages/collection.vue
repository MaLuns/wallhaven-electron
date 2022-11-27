<template>
    <div>
        <img-list ref="imglist"></img-list>
    </div>
</template>

<script>
export default {
    name: "CollectionPage",
    activated() {
        this.$refs.imglist.add(Object.values(this.$store.collections.store), true)
    }
};
</script>

<style>

</style>