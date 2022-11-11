import ajax from "@/libs/ajax";
import { objToUrl } from "@/libs/util";
//数据查询
export default {
    data() {
        return {
            skeleton: true,
            page: 1,
            isLoading: false,
            meta: {
                total: 0
            }
        };
    },
    mounted() {
        this.getlist();
    },
    methods: {
        next() {
            this.getlist();
        },
        handleSearch(data) {
            if (!this.isLoading) {
                this.page = 1
                this.search = { ...this.search, ...data }
                this.getlist(true)
            }
        },
        getlist(reset = false) {
            if (!this.isLoading) {
                this.isLoading = true;
                ajax(`search?${objToUrl(this.search)}&page=${this.page++}`)
                    .then(res => {
                        this.isLoading = false;
                        let { data, meta } = res;
                       /*  let list = data.map(item => {
                            item.thumbs_width = 300;
                            item.thumbs_height = 300 / item.ratio;
                            return item
                        })
                        if (this.page === 2) {
                            this.list = Object.freeze(list)
                            this.getlist()
                        } else {
                            this.list = Object.freeze(this.list.concat(...list));
                        } */
                       
                        if (this.page === 2) {
                            this.getlist()
                        } 
                        this.$refs.imglist.add(data, reset)
                        this.meta = meta;
                        this.skeleton = false;
                    }).catch(() => {
                        this.isLoading = false;
                        this.skeleton = false;
                    });
            }
        }
    }
}