<template>
    <video v-if="video" autoplay playsinline loop muted class="video-image-renderer__video">
        <source v-if="video[0]" :src="video[0].fields.file.url" type="video/mp4">
        <source v-if="video[1]" :src="video[1].fields.file.url" type="video/webm">
    </video>
    <img v-else class="video-image-renderer__image" 
        :src="image.fields.file.url" 
        alt=""
        :width="image.fields.file.details.image.width"
        :height="image.fields.file.details.image.height"
    >
</template>

<script>
export default {
    props: {
        video: {
            type: Array,
            required: false,
        },
        image: {
            type: Object,
            required: false,
        },
    },
    mounted() {
        // url : this.video.fields.file.url
    }
}
</script>