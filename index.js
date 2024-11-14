import { getTask, saveSong, updateSongFirebase } from "./firebase.js";

new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        songs: [],
        selectedSong: null,
        sidebarVisible: false,
        editingSong: null,
        showForm: false,
        showTable: false,
        filterTitle: '',
        filterArtist: '',
        filterTone: '',
        filterTag: '',
        sortColumn: 'title', // Columna que se está ordenando
        sortDirection: 'asc', // Dirección de la ordenación ('asc' o 'desc')
        newSong: {
            title: '',
            artist: '',
            tone: '',
            bpm: '',
            description: '',
            lyrics: '',
            spotify: '',
            youtube: '',
            tag: ''
        }
    },
    computed: {
        filteredSongs() {
            // Si no hay búsqueda, ordenar alfabéticamente por título
            if (!this.searchQuery) {
                return [...this.songs].sort((a, b) => {
                    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                });
            }
    
            // Si hay búsqueda, filtrar por título
            return this.songs.filter(song =>
                song.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        filteredSongsTable() {
            // Filtrar canciones según los criterios de filtro
            let filtered = this.songs.filter(song => {
                return (
                    song.title.toLowerCase().includes(this.filterTitle.toLowerCase()) &&
                    song.tag.toLowerCase().includes(this.filterTag.toLowerCase()) &&
                    song.tone.toLowerCase().includes(this.filterTone.toLowerCase())
                );
            });

            // Ordenar canciones según la columna seleccionada y la dirección
            filtered.sort((a, b) => {
                let result = 0;
                if (a[this.sortColumn] > b[this.sortColumn]) result = 1;
                if (a[this.sortColumn] < b[this.sortColumn]) result = -1;
                return this.sortDirection === 'asc' ? result : -result;
            });

            return filtered;
        },
        formattedLyrics() {
            return this.selectedSong ? this.selectedSong.lyrics.replace(/\\n/g, '<br>') : '';
        },
    },
    methods: {
        selectSong(song) {
            this.selectedSong = song;
            this.sidebarVisible = false; // Ocultar menú
            this.showTable = false;
        },
        toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible;
        },
        goToHome() {
            this.selectedSong = null;
            this.sidebarVisible = false;
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

                await saveSong(this.newSong.title, this.newSong.artist, this.newSong.tone, this.newSong.bpm, this.newSong.description, this.newSong.lyrics, this.newSong.spotify, this.newSong.youtube, this.newSong.tag);
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
                    youtube: '',
                    tag: ''
                };
                alert('Canción guardada exitosamente');
            } catch (error) {
                console.error("Error al agregar la canción:", error);
                alert('Error al agregar la canción');
            }
        },
        editSong(song) {
            this.editingSong = { ...song };
            if (this.editingSong.lyrics) {
                this.editingSong.lyrics = this.editingSong.lyrics.replace(/\\n/g, '\n'); // Convierte \\n a saltos de línea reales
            }
        },
        async updateSong() {
            try {
                const { title, artist, tone, bpm, description, lyrics, spotify, youtube, tag } = this.editingSong;
                const updatedSong = {
                    title: title || "",
                    artist: artist || "",
                    tone: tone || "",
                    bpm: bpm || "",
                    description: description || "",
                    lyrics: lyrics.replace(/\n/g, '\\n') || "",
                    spotify: spotify || "",
                    youtube: youtube || "",
                    tag: tag || ""
                };

                await updateSongFirebase(this.editingSong.id, updatedSong);
                this.fetchSongs(); // Actualiza la lista después de la edición
                this.editingSong = null; // Limpia el modo de edición
                alert('Canción actualizada exitosamente');
            } catch (error) {
                console.error("Error al actualizar la canción:", error);
                alert('Error al actualizar la canción');
            }
        },
        cancelEdit() {
            this.editingSong = null;
        },
        sortBy(column) {
            // Si ya estamos ordenando por esta columna, alternamos la dirección
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                // Si es una columna nueva, establecemos la dirección ascendente
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
        }
    },
    created() {
        this.fetchSongs();
    }
});