/* 人物精选
 * @Author: 白云苍狗 
 * @Date: 2020-09-21 19:03:26 
 * @Last Modified by: 白云苍狗
 * @Last Modified time: 2020-09-27 23:04:25
 */
 

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