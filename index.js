import { getTask, saveSong } from "./firebase.js";

new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        songs: [],
        selectedSong: null,
        sidebarVisible: false,
        showForm: false,
        newSong: {
            title: '',
            artist: '',
            tone: '',
            bpm: '',
            description: '',
            lyrics: '',
            spotify: '',
            youtube: ''
        }
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
        },
        async addSong() {
            try {
                this.newSong.lyrics = this.newSong.lyrics.replace(/\n/g, '\\n');
                
                await saveSong(this.newSong.title, this.newSong.artist, this.newSong.tone, this.newSong.bpm, this.newSong.description, this.newSong.lyrics, this.newSong.spotify, this.newSong.youtube);
                this.fetchSongs(); // Actualiza la lista después de agregar
                // Limpia el formulario
                this.newSong = {
                    title: '',
                    artist: '',
                    tone: '',
                    bpm: '',
                    description: '',
                    lyrics: '',
                    spotify: '',
                    youtube: ''
                };
                alert('Canción agregada exitosamente');
            } catch (error) {
                console.error("Error al agregar la canción:", error);
                alert('Error al agregar la canción');
            }
        }
    },
    created() {
        this.fetchSongs();
    }
});