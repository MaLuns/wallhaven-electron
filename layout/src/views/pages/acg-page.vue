/* 动漫精选
 * @Author: 白云苍狗 
 * @Date: 2020-09-21 18:57:41 
 * @Last Modified by: 白云苍狗
 * @Last Modified time: 2020-09-27 23:02:44
 */
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