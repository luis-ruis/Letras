import os
import json

def convert_txt_to_json(txt_directory, json_directory):
    # Cargar la lista de canciones existente o crear una nueva si no existe
    songs_list_path = os.path.join(json_directory, '_songs-list.json')
    if os.path.exists(songs_list_path):
        with open(songs_list_path, 'r') as file:
            songs_list = json.load(file)
    else:
        songs_list = []

    existing_songs = set(songs_list)

    for txt_filename in os.listdir(txt_directory):
        if txt_filename.endswith('.txt'):
            txt_path = os.path.join(txt_directory, txt_filename)
            try:
                with open(txt_path, 'r', encoding='utf-8') as file:
                    lines = file.readlines()
                
                # Comprobamos que haya suficientes líneas en el archivo
                if len(lines) < 6:
                    print(f"Archivo {txt_filename} no sigue el formato esperado.")
                    continue

                # Extraer la información del archivo de texto
                title = lines[0].strip()
                artist = ""
                description = ""
                tone = ""
                bpm = ""
                lyrics = ''.join(lines[2:]).strip()

                # Crear el nombre del archivo JSON
                json_filename = f"{txt_filename.replace('.txt', '')}.json"
                json_path = os.path.join(json_directory, json_filename)

                # Crear el contenido del archivo JSON
                song_data = {
                    "id": len(existing_songs) + 1,
                    "title": title,
                    "artist": artist,
                    "description": description,
                    "tone": tone,
                    "bpm": bpm,
                    "lyrics": lyrics.replace("\n", "\\n")
                }

                # Guardar el archivo JSON
                with open(json_path, 'w', encoding='utf-8') as json_file:
                    json.dump(song_data, json_file, ensure_ascii=False, indent=4)

                # Si la canción no estaba en la lista, agregarla
                if json_filename not in existing_songs:
                    songs_list.append(json_filename)
                    existing_songs.add(json_filename)

                print(f"Archivo {txt_filename} convertido y guardado como {json_filename}")

            except Exception as e:
                print(f"Error al procesar {txt_filename}: {str(e)}")

    # Actualizar la lista de canciones
    with open(songs_list_path, 'w', encoding='utf-8') as file:
        json.dump(songs_list, file, ensure_ascii=False, indent=4)

    print("Conversión completada y songs-list.json actualizado.")

# Directorios de entrada y salida
txt_directory = 'notas'  # Directorio donde están los archivos .txt
json_directory = 'songs'  # Directorio donde se guardarán los archivos .json

# Asegúrate de que los directorios existan
os.makedirs(txt_directory, exist_ok=True)
os.makedirs(json_directory, exist_ok=True)

# Ejecutar la conversión
convert_txt_to_json(txt_directory, json_directory)
