import { getTask } from "./firebase.js";

new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        songs: [],
        selectedSong: null,
        sidebarVisible: false
    },
    computed: {
        filteredSongs() {
            return this.songs.filter(song =>
                song.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        formattedLyrics() {
            return this.selectedSong ? this.selectedSong.lyrics.replace(/\\n/g, '<br>') : '';
        }
    },
    methods: {
        selectSong(song) {
            this.selectedSong = song;
            this.sidebarVisible = false; // Ocultar menú
        },
        toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible;
        },
        goToHome() {
            this.selectedSong = null;
        },
        async fetchSongs() {
            try {
                const fetchedSongs = await getTask();
                this.songs = fetchedSongs;
            } catch (error) {
                console.error("Error al obtener las canciones:", error);
            }
        }
    },
    created() {
        this.fetchSongs();
    }
});