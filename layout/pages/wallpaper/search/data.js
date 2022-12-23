// 分类
export const categoriesList = [
    { label: "全部", value: "111" },
    { label: "通用", value: "100" },
    { label: "动漫", value: "010" },
    { label: "人物", value: "001" },
]

// 图片纯度
export const purityList = [
    { label: 'SFW', value: 'SFW' },
    { label: 'Sketchy', value: 'Sketchy' },
    { label: 'NSFW', value: 'NSFW' }
]

// 分辨率
export const stypeList = [
    { label: '至少', value: 'atleast' },
    { label: '相等', value: 'resolutions' }
]

export const resolutionList = [
    ["2560x1080", "3440x1440", "3840x1600"],
    ["1280x720", "1600x900", "1920x1080", "2560x1440", "3840x2160"],
    ["1280x800", "1600x1000", "1920x1200", "2560x1600", "3840x2400"],
    ["1280x960", "1600x1200", "1920x1440", "2560x1920", "3840x2880"],
    ["1280x1024", "1600x1280", "1920x1536", "2560x2048", "3840x3072"],
]

// 比例
export const ratiosList = [
    [{ label: '所有横屏', value: 'landscape' }, "16x9", "16x10", "21x9", "32x9", "48x9"],
    [{ label: '所有竖屏', value: 'portrait' }, "9x16", "10x16", "9x18"],
    ["1x1", "3x2", "4x3", "5x4"]
]

// 颜色
export const colorsList = ["660000", "990000", "cc0000", "cc3333", "ea4c88", "993399", "663399", "333399", "0066cc", "0099cc", "66cccc", "77cc33", "669900", "336600", "666600", "999900", "cccc33", "ffff00", "ffcc33", "ff9900", "ff6600", "cc6633", "996633", "663300", "000000", "999999", "cccccc", "ffffff", "424153", ""]

// 排序规则
export const sortList = [
    { label: "最新", value: "date_added" },
    { label: "热度", value: "hot" },
    { label: "查看", value: "views" },
    { label: "收藏", value: "favorites" },
    { label: "随机", value: "random" },
    { label: "排行榜", value: "toplist" },
]

// 排序方式
export const orderList = [
    { label: "降序", value: "desc" },
    { label: "升序", value: "asc" },
]

// 排行榜范围
export const topRangeList = [
    { label: "近一天", value: "1d" },
    { label: "近三天", value: "3d" },
    { label: "近一周", value: "1w" },
    { label: "近一月", value: "1M" },
    { label: "近三月", value: "3M" },
    { label: "近半年", value: "6M" },
    { label: "近一年", value: "1y " },
]

export const defSearch = {
    categories: "111",
    q: "",
    order: "desc",
    purity: ["SFW"],
    sorting: "date_added",
    colors: "",
    ratios: [],
    topRange: ""
}