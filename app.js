import { openDB } from 'idb';

const SPREADSHEET_ID = '1le9NYAVt_sV71HmxfDgAfZeT5H9EUsbTL_Aa_ENULmk';
const API_KEY = 'AIzaSyAjbkv8dNSWYM34UlX7P-brMUITNfWiS3g';
const CLIENT_ID = '390383140785-vl787e78slmatulaq5cd0r4kp40lhg4h.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

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

class GoogleSheetsManager {
    constructor() {
        this.isInitialized = false;
        this.initializeGoogleAPI();
    }

    async initializeGoogleAPI() {
        await new Promise((resolve) => gapi.load('client:auth2', resolve));
        await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        });

        this.isInitialized = true;
    }

    async signIn() {
        if (!this.isInitialized) {
            await this.initializeGoogleAPI();
        }
        await gapi.auth2.getAuthInstance().signIn();
    }

    async appendRow(jugador) {
        const values = [
            [
                jugador.apellido,
                jugador.nombres,
                jugador.dni,
                jugador.fechaNacimiento,
                jugador.club,
                JSON.stringify(jugador.descriptorFacial)
            ]
        ];

        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Jugadores!A:F',
            valueInputOption: 'RAW',
            resource: { values }
        });
    }

    async loadAllRows() {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Jugadores!A:F',
        });

        return response.result.values?.slice(1).map(row => ({
            apellido: row[0],
            nombres: row[1],
            dni: row[2],
            fechaNacimiento: row[3],
            club: row[4],
            descriptorFacial: JSON.parse(row[5])
        })) || [];
    }
}

class App {
    constructor() {
        this.db = new JugadoresDB();
        this.faceManager = new FaceRecognitionManager();
        this.sheetsManager = new GoogleSheetsManager();
        this.setupEventListeners();
        this.descriptorActual = null;
        this.iniciarCamaras();
        this.cargarDatosIniciales();
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

    async cargarDatosIniciales() {
        try {
            await this.sheetsManager.signIn();
            const jugadores = await this.sheetsManager.loadAllRows();
            for (const jugador of jugadores) {
                await this.db.guardarJugador(jugador);
            }
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
        }
    }

    async registrarJugador(e) {
        e.preventDefault();
        
        /*if (!this.descriptorActual) {
            alert('Por favor tome una foto antes de registrar');
            return;
        }*/

        const jugador = {
            apellido: document.getElementById('apellido').value,
            nombres: document.getElementById('nombres').value,
            dni: document.getElementById('dni').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            club: document.getElementById('club').value,
           // descriptorFacial: Array.from(this.descriptorActual)
        };

        try {
            await this.db.guardarJugador(jugador);
            await this.sheetsManager.appendRow(jugador);
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
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});