import { openDB } from 'idb';

class JugadoresDB {
    constructor() {
        this.dbPromise = this.initDB();
    }

    async initDB() {
        return openDB('jugadoresDB', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('jugadores')) {
                    db.createObjectStore('jugadores', { keyPath: 'dni' });
                }
            }
        });
    }

    async guardarJugador(jugador) {
        const db = await this.dbPromise;
        await db.put('jugadores', jugador);
    }

    async obtenerTodosJugadores() {
        const db = await this.dbPromise;
        return await db.getAll('jugadores');
    }

    async importarJugadores(jugadores) {
        const db = await this.dbPromise;
        const tx = db.transaction('jugadores', 'readwrite');
        const store = tx.objectStore('jugadores');
        
        // Limpiar datos existentes
        await store.clear();
        
        // Importar nuevos datos
        for (const jugador of jugadores) {
            await store.add(jugador);
        }
        
        await tx.done;
    }
}

class FaceRecognitionManager {
    constructor() {
        this.modelosListo = false;
        this.inicializarModelos();
    }

    async inicializarModelos() {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        this.modelosListo = true;
    }

    async obtenerDescriptor(videoElement) {
        if (!this.modelosListo) {
            throw new Error('Los modelos no están listos');
        }

        const detections = await faceapi.detectSingleFace(videoElement)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detections) {
            throw new Error('No se detectó ningún rostro');
        }

        return detections.descriptor;
    }

    async compararRostros(descriptor1, descriptor2) {
        const distancia = faceapi.euclideanDistance(descriptor1, descriptor2);
        return distancia < 0.6; // umbral de similitud
    }
}

class App {
    constructor() {
        this.db = new JugadoresDB();
        this.faceManager = new FaceRecognitionManager();
        this.setupEventListeners();
        this.descriptorActual = null;
        this.iniciarCamaras();
        this.iniciarIndexDB();
    }

    iniciarIndexDB(){
        async function cargarJSON(url) {
            const respuesta = await fetch(url); // Realiza una solicitud HTTP para el archivo JSON
            const datos = await respuesta.json(); // Analiza la respuesta como JSON
            return datos;
        }
        
        cargarJSON('data/db.json')
            .then(datos => {
                // Aquí puedes acceder a los datos del archivo JSON
                console.log(datos);
                try {
            
                    const jugadores = JSON.parse(JSON.stringify(datos));
                    
                    // Validar estructura básica de los datos
                    if (!Array.isArray(jugadores)) {
                        throw new Error('Formato de archivo inválido');
                    }
                    
                    this.db.importarJugadores(jugadores);
                    console.log('Datos importados exitosamente');
                } catch (error) {
                    console.error('Error al importar datos:', error);
                    alert('Error al importar datos: ' + error.message);
                }
            })
            .catch(error => {
                console.error('Error cargando el JSON:', error);
            });
    }

    async iniciarCamaras() {
        try {
            const constraints = {
                video: {
                    facingMode: { exact: "environment" }, // Usar cámara trasera
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };

            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                document.getElementById('videoRegistro').srcObject = stream;
                document.getElementById('videoVerificacion').srcObject = stream.clone();
            } catch (error) {
                // Si falla la cámara trasera, intentar con cualquier cámara disponible
                console.log('Fallback a cámara frontal:', error);
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    } 
                });
                document.getElementById('videoRegistro').srcObject = stream;
                document.getElementById('videoVerificacion').srcObject = stream.clone();
            }
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            alert('No se pudo acceder a la cámara');
        }
    }

    setupEventListeners() {
        document.getElementById('btnRegistro').addEventListener('click', () => this.cambiarTab('Registro'));
        document.getElementById('btnVerificacion').addEventListener('click', () => this.cambiarTab('Verificacion'));
        document.getElementById('btnTomarFoto').addEventListener('click', () => this.tomarFoto());
        document.getElementById('formRegistro').addEventListener('submit', (e) => this.registrarJugador(e));
        document.getElementById('btnVerificarRostro').addEventListener('click', () => this.verificarRostro());
        document.getElementById('btnDatos').addEventListener('click', () => this.cambiarTab('Datos'));
        document.getElementById('btnExportar').addEventListener('click', () => this.exportarDatos());
        //document.getElementById('btnImportar').addEventListener('click', () => this.importarDatos());
    }

    cambiarTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));

        document.getElementById(`btn${tab}`).classList.add('active');
        document.getElementById(`seccion${tab}`).classList.add('active');
    }

    async tomarFoto() {
        try {
            const estadoFoto = document.getElementById('estadoFoto');
            estadoFoto.textContent = 'Procesando...';
            
            const video = document.getElementById('videoRegistro');
            this.descriptorActual = await this.faceManager.obtenerDescriptor(video);
            
            estadoFoto.textContent = 'Foto capturada correctamente';
            estadoFoto.style.color = 'green';
        } catch (error) {
            document.getElementById('estadoFoto').textContent = 'Error al capturar la foto';
            console.error(error);
        }
    }

    async registrarJugador(e) {
        e.preventDefault();
        
        if (!this.descriptorActual) {
            alert('Por favor tome una foto antes de registrar');
            return;
        }

        const jugador = {
            apellido: document.getElementById('apellido').value,
            nombres: document.getElementById('nombres').value,
            dni: document.getElementById('dni').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            club: document.getElementById('club').value,
            descriptorFacial: Array.from(this.descriptorActual)
        };

        try {
            await this.db.guardarJugador(jugador);
            alert('Jugador registrado exitosamente');
            e.target.reset();
            this.descriptorActual = null;
            document.getElementById('estadoFoto').textContent = 'No se ha tomado la foto';
        } catch (error) {
            alert('Error al registrar jugador');
            console.error(error);
        }
    }

    async verificarRostro() {
        try {
            const resultadoDiv = document.getElementById('resultadoVerificacion');
            resultadoDiv.textContent = 'Procesando...';

            const video = document.getElementById('videoVerificacion');
            const descriptorVerificacion = await this.faceManager.obtenerDescriptor(video);
            
            const jugadores = await this.db.obtenerTodosJugadores();
            let jugadorEncontrado = null;

            for (const jugador of jugadores) {
                const descriptorGuardado = new Float32Array(jugador.descriptorFacial);
                if (await this.faceManager.compararRostros(descriptorVerificacion, descriptorGuardado)) {
                    jugadorEncontrado = jugador;
                    break;
                }
            }

            if (jugadorEncontrado) {
                resultadoDiv.innerHTML = `
                    <h3 style="color: green">¡Jugador Encontrado!</h3>
                    <p>Nombre: ${jugadorEncontrado.nombres} ${jugadorEncontrado.apellido}</p>
                    <p>DNI: ${jugadorEncontrado.dni}</p>
                    <p>Fecha de Nacimiento: ${new Date(jugadorEncontrado.fechaNacimiento).toLocaleDateString()}</p>
                    <p>Club: ${jugadorEncontrado.club}</p>
                `;
            } else {
                resultadoDiv.innerHTML = `
                    <h3 style="color: red">Jugador No Encontrado</h3>
                    <p>El rostro no está registrado en el sistema</p>
                `;
            }
        } catch (error) {
            document.getElementById('resultadoVerificacion').textContent = 'Error al verificar rostro';
            console.error(error);
        }
    }

    async exportarDatos() {
        try {
            const jugadores = await this.db.obtenerTodosJugadores();
            const dataStr = JSON.stringify(jugadores, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `jugadores_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al exportar datos:', error);
            alert('Error al exportar datos');
        }
    }

    async importarDatos() {
        const fileInput = document.getElementById('fileImport');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Por favor seleccione un archivo');
            return;
        }

        try {
            const text = await file.text();
            const jugadores = JSON.parse(text);
            
            // Validar estructura básica de los datos
            if (!Array.isArray(jugadores)) {
                throw new Error('Formato de archivo inválido');
            }
            
            await this.db.importarJugadores(jugadores);
            alert('Datos importados exitosamente');
            fileInput.value = ''; // Limpiar input
        } catch (error) {
            console.error('Error al importar datos:', error);
            alert('Error al importar datos: ' + error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});