<template>
    <div class="page-component ">
        <search-area ref="searchArea" @search="handleSearch"></search-area>
        <img-list ref="imglist" :skeleton="skeleton" @loadMore="next"> </img-list>
        <div class="search-result">
            §(*￣▽￣*)§ 为您筛选出<span>{{ meta.total }}</span>张壁纸
        </div>
    </div>
</template>

<script>
import ajax from "@/libs/ajax";
import { objToUrl } from "@/libs/util";
import SearchArea from "./search/search-area"

export default {
    components: {
        SearchArea
    },
    data() {
        return {
            skeleton: true,
            page: 1,
            meta: {
                total: 0
            },
        };
    },
    mounted() {
        this.getlist();
    },
    methods: {
        onRefresh() {
            this.$refs.searchArea.handleReset()
        },
        next() {
            if (!this.isLoading) {
                this.isLoading = true
                this.getlist().then(() => {
                    this.isLoading = false
                });
            }
        },
        handleSearch() {
            this.page = 1
            this.getlist(true)
        },
        getlist(reset = false) {
            let search = this.$refs.searchArea.getSearch()
            let url = `search?${objToUrl(search)}&page=${this.page++}`
            let apikey = this.$store.appConfig.get('apiKey')
            if (apikey) url += `&apikey=${apikey}`
            return ajax(url)
                .then(res => {
                    let { data, meta } = res;
                    if (this.page === 2) {
                        this.getlist()
                    }
                    this.$refs.imglist.add(data, reset)
                    this.meta = meta;
                    this.skeleton = false;
                }).catch(() => {
                    this.skeleton = false;
                });
        }
    }
};
</script>
<style lang="less" scoped>
.page-component {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .search-result {
        text-align: center;
        margin-bottom: 10px;

        span {
            margin: 0 5px;
            color: var(--primary);
        }
    }
}
</style>