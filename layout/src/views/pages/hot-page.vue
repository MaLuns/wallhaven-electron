<template>
    <div>
        <search-list :total="meta.total" @search="handleSearch" :purity="search.purity" :sorting="search.sorting"></search-list>
        <img-list ref="imglist" :skeleton="skeleton" @loadMore="next"></img-list>
    </div>
</template>

<script>
    import imgpage from "@/libs/mixins"

    export default {
        name: "HotPage",
        mixins: [imgpage],
        data() {
            return {
                search: {
                    categories: '111',
                    purity: ['SFW'],
                    sorting: "hot"
                }
            };
        }
    };
</script>