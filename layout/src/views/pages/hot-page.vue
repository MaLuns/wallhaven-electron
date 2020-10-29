/* 热门推荐
 * @Author: 白云苍狗 
 * @Date: 2020-09-21 20:10:57 
 * @Last Modified by: 白云苍狗
 * @Last Modified time: 2020-10-01 16:18:12
 */

<template>
    <div>
        <search-list :total="meta.total" @search="handleSearch" :purity="search.purity" :sorting="search.sorting"></search-list>
        <img-list :skeleton="skeleton" :list="list" @next="next"></img-list>
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