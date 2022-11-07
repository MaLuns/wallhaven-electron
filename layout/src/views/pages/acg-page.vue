<template>
    <div>
        <search-list :total="meta.total" @search="handleSearch" :purity="search.purity" :sorting="search.sorting"></search-list>
        <img-list :skeleton="skeleton" :list="list" @next="next"></img-list>
    </div>
</template>

<script>
    import imgpage from "@/libs/mixins";
    
    export default {
        name: "AcgPage",
        mixins: [imgpage],
        data() {
            return {
                search: {
                    categories: '010',
                    purity: ['SFW']
                }
            };
        }
    };
</script>