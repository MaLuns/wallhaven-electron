<template>
    <div class="search-wrapper-placeholder">
        <div class="search-wrapper" :class="{ hide: !more }">
            <div class="search-more-wrapper">
                <div class="search-input">
                    <form-input type="text" placeholder="搜索..." v-model="search.q">
                        <div slot="append" @click="handleSearch" class="search-btn pl10 pr10">
                            <i class="iconfont icon-mohuchaxun"></i>
                        </div>
                    </form-input>
                </div>
                <div class="more-icon" @click="more = !more;">
                    <i class="iconfont icon-shouqi" v-if="more"></i>
                    <i class="iconfont icon-shaixuan-zhankai" v-else></i>
                </div>
            </div>
            <form-checkbox-radio label="分类" v-model="search.categories" :list="categoriesList" type="radio"
                width="60px">
            </form-checkbox-radio>
            <div v-show="more">
                <form-checkbox-radio label="场景" v-model="search.purity" :list="purityList" width="60px">
                </form-checkbox-radio>
                <form-checkbox-radio label="分辨率" v-model="resolution.type" :list="stypeList" type="radio" width="60px">
                </form-checkbox-radio>
                <form-checkbox-radio label="" v-for="item in resolutionList" v-model="resolution.value" :list="item"
                    :type="resolution.type === 'atleast' ? 'radio' : 'checkbox'" width="60px"></form-checkbox-radio>
                <form-checkbox-radio :label="index === 0 ? '比例' : ''" v-for="(item, index) in ratiosList"
                    v-model="search.ratios" :list="item" width="60px">
                </form-checkbox-radio>
                <form-checkbox-radio label="颜色" v-model="search.colors" :list="colorsList" type="radio">
                    <template #default="{ color }">
                        <template v-if="color === ''">
                            <div class="color-item transparent"></div>
                        </template>
                        <template v-else>
                            <div class="color-item" :class="{ active: color === search.colors }"
                                :style="{ backgroundColor: '#' + color }">
                            </div>
                        </template>
                    </template>
                </form-checkbox-radio>
                <form-checkbox-radio label="排序" v-model="search.order" :list="orderList" type="radio" width="60px">
                </form-checkbox-radio>
                <form-checkbox-radio label="" v-model="search.sorting" :list="sortList" type="radio" width="60px">
                </form-checkbox-radio>
                <form-checkbox-radio label="时间" v-model="search.topRange" :list="topRangeList"
                    v-show="search.sorting === 'toplist'" type="radio" width="60px">
                </form-checkbox-radio>
            </div>
        </div>
    </div>
</template>
<script>
import { purityList, stypeList, resolutionList, ratiosList, colorsList, sortList, orderList, topRangeList, categoriesList, defSearch } from "./data";

export default {
    data() {
        return {
            more: false,
            search: { ...defSearch },
            resolution: {
                value: [],
                type: "atleast",
                custom: {
                    width: '',
                    height: ''
                },
            },
            purityList,
            stypeList,
            resolutionList,
            ratiosList,
            colorsList,
            sortList,
            orderList,
            topRangeList,
            categoriesList
        }
    },
    /* watch: {
        search: {
            deep: true,
            handler() {
                this.handleSearch()
            }
        }
    }, */
    methods: {
        handleReset() {
            this.search = { ...defSearch }
            this.resolution.value = []
        },
        handleSearch() {
            this.$emit("search");
            this.more = false
        },
        getSearch() {
            let { purity, ratios, ...search } = this.search

            if (purity.length === 0) purity = ["SFW"];
            search.purity = purity

            let { value, type, custom: { width, height } } = this.resolution
            if (type === 'atleast') {
                search.atleast = value
                if (/^[0-9]{1,}$/.test(width) && /^[0-9]{1,}$/.test(height)) {
                    search.atleast = `${width}x${height}`
                }
            } else if (type === 'resolutions') {
                search.resolutions = ''
                if (/^[0-9]{1,}$/.test(width) && /^[0-9]{1,}$/.test(height)) {
                    search.resolutions = `${width}x${height},`
                }
                search.resolutions += value.join(',')
            }

            search.ratios = ratios.join(',')

            return { ...search }
        }
    }
}
</script>
<style lang="less" scoped>
.search-wrapper-placeholder {
    height: 80px;
    margin: 0 20px;
    position: relative;

    .search-wrapper {
        background-color: var(--searh-bg-color);
        width: calc(100% - 40px);
        padding: 14px;
        border-radius: 10px;
        position: absolute;
        z-index: 1;
        box-shadow: 5px 7px 7px 0px #00000047;

        .more-icon {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            margin-left: 10px;
            opacity: .6;

            i {
                font-size: 22px;
            }

            &:hover {
                color: var(--hover-font-color);
            }
        }

        &.hide {
            box-shadow: none;

            .search-more-wrapper {
                margin-bottom: 0;
            }

            /deep/ .checkbox-radio-group.view .checkbox-radio-item {
                margin-bottom: 0;
            }
        }

        .search-more-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            margin-left: 20px;
            position: absolute;
            right: 20px;
            top: 14px;
        }
    }

    .color-item {
        width: 60px;
        height: 30px;
        border-radius: 4px;

        &.active {
            background-image: url(../../../assets/check.png);
            background-repeat: no-repeat;
            background-position: bottom right;
        }

        &.transparent {
            background: linear-gradient(18deg, rgba(255, 255, 255, 1) 42%, rgba(255, 0, 0, 1) 45%, rgba(255, 0, 0, 1) 55%, rgba(255, 255, 255, 1) 58%);
        }
    }
}
</style>