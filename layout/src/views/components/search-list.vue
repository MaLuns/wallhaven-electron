<template>
    <div class="search">
        <el-checkbox-group v-model="search.purity" class="mgr10">
            <el-checkbox-button label="SFW">SFW</el-checkbox-button>
            <el-checkbox-button label="Sketchy">Sketchy</el-checkbox-button>
        </el-checkbox-group>
        <el-select v-model="search.sorting" placeholder="请选择" style="width:100px" class="mgr10">
            <el-option label="最新" value="date_added"></el-option>
            <el-option label="最热" value="hot"></el-option>
            <el-option label="随机" value="random"></el-option>
            <el-option label="热门列表" value="toplist"></el-option>
            <el-option label="最多收藏" value="favorites"></el-option>
        </el-select>
        <el-select v-model="search.atleast" placeholder="分辨率" style="width:100px" class="mgr10">
            <el-option label="不限" value></el-option>
            <el-option label="1080p+" value="1920x1080"></el-option>
            <el-option label="2k+" value="2560x1080"></el-option>
            <el-option label="4k+" value="3840x2160"></el-option>
            <el-option label="8k+" value="7680x4320"></el-option>
        </el-select>
        <el-input placeholder="搜索..." v-model.trim="search.q" style class="input">
            <div slot="append" @click="handleSearch" class="search-btn">搜索</div>
        </el-input>
        <span class="numner">共 {{total}} 张壁纸</span>
    </div>
</template>

<script>
    export default {
        name: "SearchList",
        data() {
            return {
                search: {
                    purity: ["SFW"],
                    sorting: "date_added",
                    atleast: "",
                    q: ""
                }
            };
        },
        props: {
            total: {
                type: Number,
                default: 0
            },
            purity: {
                type: Array,
                default() {
                    return ["SFW"]
                }
            },
            sorting: {
                type: String,
                default: 'date_added',
                validator: function (value) {
                    return ['date_added', 'hot', 'random', 'toplist', 'favorites', 'views'].includes(value)
                }
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
        methods: {
            handleSearch() {
                if (this.search.purity.length === 0) {
                    this.search.purity = ["SFW"]
                }
                this.$emit("search", { ...this.search });
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

                    &:hover {
                        color: #e4e4e4;
                    }
                }
            }
        }
    }
</style>