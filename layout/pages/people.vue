<template>
    <div>
        <search-list @search="handleSearch" :purity="search.purity" :sorting="search.sorting">
            共 {{ meta.total }} 张壁纸
        </search-list>
        <img-list ref="imglist" :skeleton="skeleton" @loadMore="next"> </img-list>
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