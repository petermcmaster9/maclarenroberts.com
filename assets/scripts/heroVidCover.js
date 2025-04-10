document.addEventListener('DOMContentLoaded', () => {
    const videoCover = document.querySelector('.hero__video-cover');
    const videoContainer = document.querySelector('.hero__video-container');
    const videoIframe = document.querySelector('.hero__video');
    
    videoCover.addEventListener('click', () => {
        videoCover.classList.add('hidden');
        // Update the iframe src to include autoplay
        videoIframe.src = "https://player.vimeo.com/video/841753667?autoplay=1";
    });
});