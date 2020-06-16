<template>
    <section class="section-video-player">
        <div class="container section-video-player__container">
            <div class="section-video-player__content">
                <div class="heading section-video-player__heading">Découvrez l'expérience</div>
                <VideoPlayer />
            </div>
        </div>
    </section>
</template>

<script>
import VideoPlayer from '~/components/partials/VideoPlayer';

export default {
    components: {
        VideoPlayer
    },
    mounted() {
    }
}
</script>