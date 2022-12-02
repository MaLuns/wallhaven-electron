<template>
    <div class="page-component ">
        <div class="search-category__wrapper mb10">
            <div class="search-category">
                <div @click="changeCategories(item)" v-for="item in categoriesList"
                    :class="{ active: item.value === search.categories }" class="search-category-item">
                    {{ item.label }}
                </div>
            </div>
            <div class="search-result">
                §(*￣▽￣*)§ 为您筛选出<span>{{ meta.total }}</span>张壁纸
            </div>
        </div>
        <search-area :purity="search.purity" :sorting="search.sorting" @search="handleSearch"></search-area>
        <img-list ref="imglist" :skeleton="skeleton" @loadMore="next"> </img-list>
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
            categoriesList: [
                { label: "全部", value: "111" },
                { label: "通用", value: "100" },
                { label: "动漫", value: "010" },
                { label: "人物", value: "001" },
            ],
            search: {
                categories: '111',
                purity: ['SFW'],
                sorting: "hot"
            },
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
            this.search.categories = '111'
            this.search.purity = ['SFW']
            this.search.sorting = "hot"
            this.handleSearch(this.search)
        },
        changeCategories(item) {
            this.search.categories = item.value
            this.handleSearch(this.search)
        },
        next() {
            if (!this.isLoading) {
                this.isLoading = true
                this.getlist().then(() => {
                    this.isLoading = false
                });
            }
        },
        handleSearch(data) {
            this.page = 1
            this.search = { ...this.search, ...data }
            this.getlist(true)
        },
        getlist(reset = false) {
            return ajax(`search?${objToUrl(this.search)}&page=${this.page++}`)
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

    .search-category__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;

        .search-category {
            flex: 1;
            display: flex;
            font-size: 14px;

            .search-category-item {
                cursor: pointer;
                text-align: center;
                line-height: 36px;
                width: 60px;

                +.search-category-item {
                    margin-left: 10px;
                }

                &:hover {
                    color: var(--hover-font-color);
                }

                &.active {
                    font-size: 16px;
                    background-image: url(../../assets/mini.png);
                    background-repeat: no-repeat;
                    background-position: bottom center;
                    font-weight: 600;
                    color: var(--checkbox-view-active-color);
                }
            }
        }

        .search-result {
            span {
                margin: 0 5px;
                color: var(--primary);
            }
        }
    }

    .search__wrapper {
        background-color: var(--searh-bg-color);
        margin: 0 20px 10px;
        padding: 20px;
        border-radius: 10px;
    }
}
</style>