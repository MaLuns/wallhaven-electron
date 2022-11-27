<template>
    <div class="search">
        <form-checkbox v-model="search.purity" :list="purityList" class="mr10"></form-checkbox>
        <form-popover class="mr10">
            <div class="popover-btn" slot="reference">分辨率</div>
            <div class="dropdown-extended">
                <form-radio v-model="resolution.type" :list="stypeList"></form-radio>
                <div class="mb20 mt20"> {{ tooltip }} </div>
                <form-check-panel v-model="resolution.value" :list="resolutionList"
                    :type="resolution.type === 'atleast' ? 'radio' : 'checkbox'">
                </form-check-panel>
                <div class="respicker-custom mt10">
                    <div class="respicker-custom-lable"> 自定义分辨率 </div>
                    <el-input placeholder="宽度" v-model.trim="resolution.custom.width" class="input"></el-input>
                    <span class="respicker-custom-separator"> x </span>
                    <el-input placeholder="高度" v-model.trim="resolution.custom.height" class="input"></el-input>
                </div>
            </div>
        </form-popover>
        <form-popover class="mr10" width="300">
            <div class="popover-btn" slot="reference">比例</div>
            <div class="dropdown-extended">
                <form-check-panel v-model="search.ratios" :list="ratiosList"></form-check-panel>
            </div>
        </form-popover>
        <form-popover class="mr10">
            <div class="popover-btn" slot="reference" :style="colorStyle">颜色</div>
            <div class="dropdown-extended colors">
                <div @click="handleSetColor(color)" class="color-item" v-for="color in colorsList"
                    :style="{ backgroundColor: '#' + color }"></div>
                <div @click="handleSetColor('')" class="color-item transparent"></div>
            </div>
        </form-popover>
        <el-select v-model="search.sorting" placeholder="排序" class="mr10 w80">
            <el-option v-for="item in sortList" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <form-radio v-model="search.order" :list="orderList" class="mr10"></form-radio>
        <el-select v-model="search.topRange" placeholder="排序" class="mr10 w80" v-show="search.sorting === 'toplist'">
            <el-option v-for="item in topRangeList" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
        </el-select>
        <el-input placeholder="搜索..." v-model.trim="search.q" class="input">
            <div slot="append" @click="handleSearch" class="search-btn">搜索</div>
        </el-input>
        <span class="numner">
            <slot></slot>
        </span>
    </div>
</template>

<script>
import { purityList, stypeList, resolutionList, ratiosList, colorsList, sortList, orderList, topRangeList } from "./data";

export default {
    name: "SearchList",
    data() {
        return {
            search: {
                q: "",
                order: "desc",
                purity: ["SFW"],
                sorting: "date_added",
                colors: "",
                ratios: [],
                topRange: ""
            },
            resolution: {
                value: '',
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
            topRangeList
        };
    },
    computed: {
        tooltip() {
            return `您的屏幕分辨率是 ${window.screen.width} x ${window.screen.height}。`;
        },
        colorStyle() {
            return this.search.colors ? {
                backgroundColor: '#' + this.search.colors,
                color: '#' + this.search.colors
            } : {}
        }
    },
    props: {
        purity: {
            type: Array,
            default: () => (["SFW"])
        },
        sorting: {
            type: String,
            default: 'date_added',
            validator: (value) => ['date_added', 'hot', 'random', 'toplist', 'favorites', 'views'].includes(value)
        }
    },
    watch: {
        purity: {
            immediate: true,
            handler(val) {
                this.search.purity = val;
            }
        },
        sorting: {
            immediate: true,
            handler(val) {
                this.search.sorting = val;
            }
        }
    },
    mounted() {

    },
    methods: {
        handleSetColor(val) {
            this.search.colors = val
        },
        handleSearch() {
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

            this.$emit("search", { ...search });
        }
    }
};
</script>

<style lang="less" scoped>
.search {
    height: 60px;
    padding: 0 30px;
    position: relative;
    display: flex;
    align-items: center;

    >div {
        flex-shrink: 0;
    }

    .w80 {
        width: 80px;
    }

    .w100 {
        width: 100px;
    }

    .numner {
        position: absolute;
        right: 20px;
        color: #fff;
    }

    .input {
        width: 200px;

        /deep/ .el-input-group__append {
            padding: 0;

            .search-btn {
                width: 50px;
                line-height: 28px;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;

                &:hover {
                    color: #e4e4e4;
                }
            }
        }
    }

    .popover-btn {
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 500;
        background: #323135;
        color: #a0a0a0;
        cursor: pointer;
        border-radius: 4px;
        box-shadow: 0 0 10px 0 #07182b5e;
        white-space: nowrap;
    }
}

.dropdown-extended {
    text-align: center;

    .respicker-custom {
        display: flex;
        padding: 4px;
        background-color: #464545;
        align-items: center;
        border-radius: 2px;

        .respicker-custom-lable {
            flex: 1;
        }

        .respicker-custom-separator {
            padding: 0 .25em;
            width: 1.5em;
        }

        .el-input {
            width: 120px;
            text-align: center;
        }
    }

    &.colors {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        height: 150px;
        align-content: space-between;
        width: 400px;


        .color-item {
            width: 60px;
            height: 24px;
            border-radius: 2px;
            box-shadow: 2px 2px 6px 0px #07182bd1;
            cursor: pointer;

            &.transparent {
                background: linear-gradient(18deg, rgba(255, 255, 255, 1) 42%, rgba(255, 0, 0, 1) 45%, rgba(255, 0, 0, 1) 55%, rgba(255, 255, 255, 1) 58%);
            }
        }
    }
}
</style>
