<template>
    <div>
        <search-list :total="meta.total" @search="handleSearch" :purity="search.purity" :sorting="search.sorting"></search-list>
        <img-list :list="list" :skeleton="skeleton" @next="next"></img-list>
    </div>
</template>

<script>
    import imgpage from "@/libs/mixins";

    export default {
        name: "PeoplePage",
        mixins: [imgpage],
        data() {
            return {
                search: {
                    categories: '001',
                    purity: ['SFW']
                }
            };
        }
    };
</script>