<template>
    <img @error="handleError" draggable="false" :src="src" fit="cover" style="fi" />
</template>
<script>
import errimg from "@/assets/edit--editWallpaper.png"
export default {
    name: "ImgPlus",
    props: {
        src: String,
    },
    methods: {
        handleError(e) {
            e.target.src = errimg
            e.target.style.objectFit = "cover"
        },
    }
}
</script>