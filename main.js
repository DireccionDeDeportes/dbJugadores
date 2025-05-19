// Variables globales
let stream = null;
let currentTeamForPhoto = null;
let faceDetector = null;
let faceRecognitionModel = null;
let detectionInterval = null;
let processingPhoto = false;

// Datos de ejemplo
const mockTeams = [
    { id: 1, name: '11 REYNAS - B° KENNEDY (SUB-16 F)',coach: 'Quiroga', assistant: 'Garro' },
    { id: 2, name: 'B° AMEP (SUB-13 M)',coach: 'Torres', assistant: 'Flores' },
    { id: 3, name: 'B° AMEP (SUB-15 M)',coach: '', assistant: ''  },
    { id: 4, name: 'B° PUCARA (SUB-13 M)',coach: '', assistant: ''  },
     { id: 5, name: 'B° SANTA RITA (SUB-10 M)',coach: '', assistant: ''  },
    { id: 6, name: 'B° SOLIDARIDAD (SUB-13 F)' ,coach: '', assistant: ''  },
    { id: 7, name: 'B° SOLIDARIDAD (SUB-16 F)' ,coach: '', assistant: ''  },
    { id: 8, name: 'CLUB ATLETICO PUEYRREDON - B° PUEYRREDON (SUB-15 M)',coach: '', assistant: ''  },
     { id: 9, name: 'DEFENSORES 1° DE MAYO (SUB-10 M)' ,coach: '', assistant: '' },
    { id: 10, name: 'DEFENSORES 1° DE MAYO (SUB-13 F)' ,coach: '', assistant: '' },
    { id: 11, name: 'DEFENSORES 1° DE MAYO (SUB-16 F)' ,coach: '', assistant: '' },
    { id: 12, name: 'DOMADORES DE SUEGRA - B° 9 DE JULIO (SUB-13 M)',coach: '', assistant: ''  },
     { id: 13, name: 'DOMADORES DE SUEGRA - B° 9 DE JULIO (SUB-15 M)' ,coach: '', assistant: '' },
    { id: 14, name: 'DOMADORES DE SUEGRA - B° 9 DE JULIO (SUB-16 F)',coach: '', assistant: ''  },
    { id: 15, name: 'EL REJUNTE DEL OESTE - B° SARGENTO CABRAL (SUB-15 M)',coach: '', assistant: ''  },
    { id: 16, name: 'ESTRELLA - B° 140 VIV (SUB-10 M)',coach: '', assistant: ''  },
     { id: 17, name: 'ESTRELLA - B° 140 VIV (SUB-13 M)',coach: '', assistant: ''  },
    { id: 18, name: 'ESTRELLA OESTE - LA CERAMICA (SUB-13 M)',coach: '', assistant: ''  },
    { id: 19, name: 'EUSEBIO FC - B° EUSEBIO CASTAÑO (SUB-10 M)',coach: '', assistant: ''  },
    { id: 20, name: 'EUSEBIO FC - B° EUSEBIO CASTAÑO (SUB-13 F)',coach: '', assistant: ''  },
     { id: 21, name: 'EUSEBIO FC - B° EUSEBIO CASTAÑO (SUB-13 M)' ,coach: '', assistant: '' },
    { id: 22, name: 'EUSEBIO FC - B° EUSEBIO CASTAÑO (SUB-15 M)' ,coach: '', assistant: '' },
    { id: 23, name: 'FUSION - B° GOBERNADOR ALRIC (SUB-13 F)',coach: '', assistant: ''  },
    { id: 24, name: 'FUSION - B° GOBERNADOR ALRIC (SUB-16 F)',coach: '', assistant: ''  },
     { id: 25, name: 'LA PASION - B° 148 VIV (SUB-13 M)' ,coach: '', assistant: '' },
    { id: 26, name: 'LAS BANCARIAS AMARILLAS - B° LOS RANQUELES (SUB-13 F)' ,coach: '', assistant: '' },
    { id: 27, name: 'LAS BANCARIAS VERDES - B° LOS RANQUELES (SUB-13 F)',coach: '', assistant: ''  },
    { id: 28, name: 'LAS LEONAS DEL EVA - EVA PERON ANEXO (SUB-16 F)' ,coach: '', assistant: '' },
     { id: 29, name: 'LAS PRINCES - LA CERAMICA B° 400 SUR (SUB-13 F)',coach: '', assistant: '' },
    { id: 30, name: 'LEALES - B° 9 DE JULIO (SUB-13 F)',coach: '', assistant: '' },
    { id: 31, name: 'LEALES - B° 9 DE JULIO (SUB-13 M)',coach: '', assistant: '' },
    { id: 32, name: 'LEALES - B° 9 DE JULIO (SUB-16 F)',coach: '', assistant: '' },
     { id: 33, name: 'LOS BANCARIOS - B° PARQUE DE LAS NACIONES (SUB-13 M)' ,coach: '', assistant: ''},
    { id: 34, name: 'LOS BANCARIOS - B° PARQUE DE LAS NACIONES (SUB-15 M)' ,coach: '', assistant: ''},
    { id: 35, name: 'LOS CALDENES DEL OESTE - B° LOS CALDENES (SUB-13 M)' ,coach: '', assistant: ''},
    { id: 36, name: 'LOS CALDENES DEL OESTE - B° LOS CALDENES (SUB-15 M)' ,coach: '', assistant: ''},
     { id: 37, name: 'LOS CUERVOS - B° FAECAP (SUB-15 M)' ,coach: '', assistant: ''},
    { id: 38, name: 'LOS GIGANTES - B° 400 SUR (SUB-15 M)',coach: '', assistant: '' },
    { id: 39, name: 'LOS GUERREROS - B° 400 SUR (SUB-13 M)',coach: '', assistant: '' },
    { id: 40, name: 'LOS MARGINALES FC - B° SANTA ROSA (SUB-13 M)',coach: '', assistant: '' },
    { id: 41, name: 'LOS PIBES DEL REPUBLICA - B° LA REPUBLICA (SUB-13 M)',coach: '', assistant: '' },
    { id: 42, name: 'OESTE UNITED - B° LIBERTAD (SUB-10 M)',coach: '', assistant: '' },
    { id: 43, name: 'OESTE UNITED - B° LIBERTAD (SUB-13 M)',coach: '', assistant: '' },
    { id: 44, name: 'PUEYRREDON - B° PUEYRREDON (SUB-15 M)',coach: '', assistant: '' },
    { id: 45, name: 'SANTA ROSA - B° SANTA ROSA (SUB-15 M)',coach: '', assistant: '' },
    { id: 46, name: 'SEMILLEROS - B° SAN MARTIN (SUB-10 M)',coach: '', assistant: '' },
    { id: 47, name: 'SOLIDARIDAD SUR - B° SOLIDARIDAD SUR (SUB-10 M)',coach: '', assistant: '' },
    { id: 48, name: 'SOLIDARIDAD SUR - B° SOLIDARIDAD SUR (SUB-13 M)' ,coach: '', assistant: ''},
    { id: 49, name: 'SOLIDARIDAD SUR - B° SOLIDARIDAD SUR (SUB-15 M)',coach: '', assistant: '' },
    { id: 50, name: 'TRICOLOR - B° JOSE HERNANDEZ (SUB-10 M)' ,coach: '', assistant: ''},
    { id: 51, name: 'TRICOLOR - B° JOSE HERNANDEZ (SUB-13 M)' ,coach: '', assistant: ''},
    { id: 52, name: 'TRICOLOR - B° JOSE HERNANDEZ (SUB-15 M)' ,coach: '', assistant: ''},
    { id: 53, name: 'UNION VECINAL - 1° DE MAYO (SUB-10 M)' ,coach: '', assistant: ''},
    { id: 54, name: 'UNION VECINAL - 1° DE MAYO (SUB-13 M)',coach: '', assistant: '' },
    { id: 55, name: 'UNION VECINAL - 1° DE MAYO (SUB-15 M)' ,coach: '', assistant: ''},
    { id: 56, name: 'VERDE AMARELLA - B° PARQUE DE LAS NACIONES (SUB-10 M)' ,coach: '', assistant: ''},
    { id: 57, name: 'VIDAD FC - B° IGNACIO VIDAL (SUB-10 M)' ,coach: '', assistant: ''},
    { id: 58, name: 'VILLA DEPORTIVA - B° 208 VIV (SUB-10 M)',coach: '', assistant: '' },
    { id: 59, name: 'VILLA DEPORTIVA - B° 208 VIV (SUB-13 M)',coach: '', assistant: '' },
    { id: 60, name: 'VILLA DEPORTIVA - B° 208 VIV (SUB-15 M)',coach: '', assistant: '' }
];

 async function cargarJSON(url) {
            const respuesta = await fetch(url); // Realiza una solicitud HTTP para el archivo JSON
            const datos = await respuesta.json(); // Analiza la respuesta como JSON
            return datos;
        }  
let mockPlayers = null;

const mockReferees = [
    { id: 1, name: 'Juan Martinez', dni: '25456789' },
    { id: 2, name: 'Pedro Gonzalez', dni: '26789123' },
    { id: 3, name: 'Carlos Lopez', dni: '27891234' },
    { id: 4, name: 'Miguel Rodriguez', dni: '28912345' },
    { id: 5, name: 'Roberto Perez', dni: '29123456' }
];

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar Select2 para los equipos
    $('.team-select').select2({
        placeholder: 'Seleccione un equipo',
        data: mockTeams.map(team => ({
            id: team.id,
            text: team.name,
            coach: team.coach,
            assistant: team.assistant

        }))
    });

    // Restaurar datos guardados
    restoreFromLocalStorage();
     cargarJSON('dbJugadores.json')
            .then(datos => {
                // Aquí puedes acceder a los datos del archivo JSON
                try {
                    mockPlayers = JSON.parse(JSON.stringify(datos));
                    //console.log(mockPlayers);
                } catch (error) {
                    console.error('Error al importar datos:', error);
                    alert('Error al importar datos: ' + error.message);
                }
            })
            .catch(error => {
                console.error('Error cargando el JSON:', error);
            });

    // Event listeners para cambios en los equipos
    $('#homeTeam, #awayTeam').on('change', function() {
        updateLoadPlayersButtons();
        saveToLocalStorage();
    });

    // Inicializar formulario
    document.getElementById('matchForm').addEventListener('submit', guardarPlanilla);

    // Inicializar autocompletado de árbitros
    inicializarAutocompletadoArbitros();

    // Load face-api.js models
    await loadFaceDetectionModels();
});





function cargarTecEquipo(tipo,teamId){
    let Equipo = mockTeams.filter(team => team.id === parseInt(teamId));
    //.log(Equipo);
    if(tipo==='local'){
        document.getElementById('localCoach').value = Equipo[0].coach;
        document.getElementById('localAssistant').value = Equipo[0].assistant;
    }
    if(tipo==='visitante'){
        document.getElementById('awayCoach').value = Equipo[0].coach;
        document.getElementById('awayAssistant').value = Equipo[0].assistant;
    }
}

async function loadFaceDetectionModels() {
    try {
       // faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        //faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        //faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        /*await faceapi.nets.faceRecognitionNet.loadFromUri('https://sprightly-bonbon-527be1.netlify.app/');
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://sprightly-bonbon-527be1.netlify.app/');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://sprightly-bonbon-527be1.netlify.app/');*/
        await faceapi.nets.ssdMobilenetv1.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        console.log('Face detection models loaded successfully');
    } catch (error) {
        console.error('Error loading face detection models:', error);
    }
}

// Funciones para manejo de jugadores
function agregarBotonCargarJugadores() {
    const homeTeamId = $('#homeTeam').val();
    const awayTeamId = $('#awayTeam').val();

    // Agregar botón para equipo local
    const localButtonContainer = document.createElement('div');
    localButtonContainer.className = 'mb-3';
    localButtonContainer.innerHTML = `
        <button type="button" class="btn btn-info" onclick="cargarJugadoresEquipo('local', ${homeTeamId})" 
                ${!homeTeamId ? 'disabled' : ''}>
            Cargar Jugadores Local
        </button>
    `;
    document.querySelector('#localTeamPlayers').before(localButtonContainer);

    // Agregar botón para equipo visitante
    const visitanteButtonContainer = document.createElement('div');
    visitanteButtonContainer.className = 'mb-3';
    visitanteButtonContainer.innerHTML = `
        <button type="button" class="btn btn-info" onclick="cargarJugadoresEquipo('visitante', ${awayTeamId})"
                ${!awayTeamId ? 'disabled' : ''}>
            Cargar Jugadores Visitante
        </button>
    `;
    document.querySelector('#visitanteTeamPlayers').before(visitanteButtonContainer);
}

function updateLoadPlayersButtons() {
    // Remover botones existentes
    document.querySelectorAll('.btn-info').forEach(btn => btn.closest('.mb-3').remove());
    // Agregar nuevos botones
    agregarBotonCargarJugadores();
}

function cargarJugadoresEquipo(tipo, teamId) {
    // Limpiar lista actual
    cargarTecEquipo(tipo,teamId);
    const container = document.getElementById(`${tipo}TeamPlayers`);
    container.innerHTML = '';

    // Filtrar y agregar jugadores del equipo seleccionado
    const jugadoresEquipo = mockPlayers.filter(player => player.team_id === parseInt(teamId));
    jugadoresEquipo.forEach(jugador => {
        agregarJugador(tipo, jugador);
    });

    saveToLocalStorage();
}

// Funciones para persistencia local
function saveToLocalStorage() {
    const matchData = {
        homeTeam: $('#homeTeam').val(),
        awayTeam: $('#awayTeam').val(),
        homePlayers: getTeamPlayersData('localTeamPlayers'),
        awayPlayers: getTeamPlayersData('visitanteTeamPlayers'),
        matchDateTime: $('#matchDateTime').val(),
        fieldNumber: $('#fieldNumber').val(),
        technicalStaff: {
            local: {
                coach: $('#localCoach').val(),
                assistant: $('#localAssistant').val()
            },
            away: {
                coach: $('#awayCoach').val(),
                assistant: $('#awayAssistant').val()
            }
        },
        referees: Array.from(document.querySelectorAll('.referee-group')).map(group => ({
            name: group.querySelector('.referee-input').value,
            dni: group.querySelector('.referee-dni').value
        }))
    };
    localStorage.setItem('matchData', JSON.stringify(matchData));
}

function getTeamPlayersData(containerId) {
    const players = [];
    
    document.querySelectorAll(`#${containerId} .player-item`).forEach(playerElement => {
        console.log(playerElement.getAttribute('class'));
        let noDescritor = false;
        if(playerElement.getAttribute('class')==='player-item no-descriptor'){noDescritor = true;}
        const [nombre, numeroRaw] = playerElement.querySelector('.player-name').textContent.split(" (");
        const numero = numeroRaw.replace(")", ""); // "10093"
        players.push({
            number: playerElement.querySelector('.player-number').value,
            name: nombre,
            photo: '',
            dni: playerElement.getAttribute('data-dni'),
            captain: playerElement.querySelector('.captain-select').checked,
            birthYear: numero,
            noDescriptor: noDescritor
        });
    });
    return players;
}

function restoreFromLocalStorage() {
    const savedData = localStorage.getItem('matchData');
    if (savedData) {
        const matchData = JSON.parse(savedData);
        
        // Restaurar equipos seleccionados
        $('#homeTeam').val(matchData.homeTeam).trigger('change');
        $('#awayTeam').val(matchData.awayTeam).trigger('change');
        
        // Restaurar fecha y número de cancha
        $('#matchDateTime').val(matchData.matchDateTime);
        $('#fieldNumber').val(matchData.fieldNumber);

        // Restaurar jugadores
        setTimeout(() => {
            // Esperar a que Select2 termine de inicializarse
           //console.log(matchData.homePlayers);
            if (matchData.homePlayers) {
                matchData.homePlayers.forEach(player => {
                    const playerElement = createPlayerElement(player);
                    document.getElementById('localTeamPlayers').appendChild(playerElement);
                });
            }

            if (matchData.awayPlayers) {
                matchData.awayPlayers.forEach(player => {
                    const playerElement = createPlayerElement(player);
                    document.getElementById('visitanteTeamPlayers').appendChild(playerElement);
                });
            }
        }, 100);

        // Restaurar cuerpo técnico
        if (matchData.technicalStaff) {
            $('#localCoach').val(matchData.technicalStaff.local.coach);
            $('#localAssistant').val(matchData.technicalStaff.local.assistant);
            $('#awayCoach').val(matchData.technicalStaff.away.coach);
            $('#awayAssistant').val(matchData.technicalStaff.away.assistant);
        }
        // Restaurar árbitros
        if (matchData.referees) {
            matchData.referees.forEach((referee, index) => {
                const inputs = document.querySelectorAll(`#referee${index + 1} input`);
                if (inputs.length >= 2) {
                    inputs[0].value = referee.name;
                    inputs[1].value = referee.dni;
                }
            });
        }
    }

    // Agregar botones de carga inicial
    agregarBotonCargarJugadores();
}

function createPlayerElement(playerData) {
    
    const playerItem = document.createElement('div');
    playerItem.className = 'player-item';
    if (playerData.noDescriptor) 
        playerItem.classList.add('no-descriptor');
    playerItem.setAttribute('data-dni', playerData.dni || '');
    playerItem.innerHTML = `
        <input type="number" class="form-control player-number" placeholder="N°" value="${playerData.number || ''}" style="width: 70px;">
        <div class="player-info">
            <div class="player-name">${playerData.name} <span class="birth-year">(${playerData.birthYear || 'N/A'})</span></div>
            <div class="player-dni">DNI: ${playerData.dni}</div>
        </div>
        <input type="checkbox" class="captain-select" onchange="setCaptain(this, 'local')" title="Marcar como capitán" ${playerData.captain ? 'checked' : ''}>
        <span class="captain-badge" style="display: ${playerData.captain ? 'inline' : 'none'};">C</span>
        <i class="bi bi-check-circle-fill verification-status" title="Jugador verificado"></i>
        <button type="button" class="btn btn-sm btn-danger ms-auto" onclick="this.parentElement.remove(); saveToLocalStorage()">
            <i class="bi bi-trash"></i>
        </button>
    `;
    return playerItem;
}

function agregarJugador(equipo, jugador) {
    const containerId = `${equipo}TeamPlayers`;
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Contenedor ${containerId} no encontrado`);
        return;
    }
    console.log(jugador);
    const playerItem = document.createElement('div'); 
    playerItem.className = 'player-item';
    playerItem.setAttribute('data-dni', jugador.dni);
      if (0 == jugador.descriptor.length) {
        console.log("entro");
        playerItem.classList.add('no-descriptor');
    }
    playerItem.innerHTML = `
         <input type="number" class="form-control player-number" placeholder="N°" style="width: 70px;">
        <div class="player-info">
            <div class="player-name">${jugador.name} <span class="birth-year">(${jugador.birthYear})</span></div>
            <div class="player-dni">DNI: ${jugador.dni}</div>
        </div>
        <input type="checkbox" class="captain-select" onchange="setCaptain(this, '${equipo}')" title="Marcar como capitán">
        <span class="captain-badge" style="display: none;">C</span>
        <i class="bi bi-check-circle-fill verification-status" title="Jugador verificado"></i>
        <button type="button" class="btn btn-sm btn-danger ms-auto" onclick="this.parentElement.remove(); saveToLocalStorage()">
            <i class="bi bi-trash"></i>
        </button>
    `;
    container.appendChild(playerItem);
    console.log(playerItem);
    saveToLocalStorage();
}

function setCaptain(checkbox, equipo) {
    const container = document.getElementById(`${equipo}TeamPlayers`);
    const players = container.getElementsByClassName('player-item');
    
    // Desmarcar otros capitanes del mismo equipo
    Array.from(players).forEach(player => {
        const otherCheckbox = player.querySelector('.captain-select');
        const captainBadge = player.querySelector('.captain-badge');
        
        if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
            captainBadge.style.display = 'none';
        }
    });
    
    // Mostrar/ocultar la insignia de capitán
    const currentBadge = checkbox.parentElement.querySelector('.captain-badge');
    currentBadge.style.display = checkbox.checked ? 'inline' : 'none';
    
    saveToLocalStorage();
}

function buscarJugador(equipo) {
    const dniInput = document.getElementById(`${equipo}PlayerDNI`);
    const dni = dniInput.value.trim();
    const container = document.getElementById(`${equipo}TeamPlayers`);

    if (!dni) {
        mostrarMensaje('Por favor, ingrese un DNI', 'warning');
        return;
    }

    // Buscar el jugador en los datos mock
    const jugador = mockPlayers.find(player => player.dni === dni);

    if (jugador) {
        // Verificar si el jugador ya está en la lista
        const jugadorExistente = document.querySelector(`#${equipo}TeamPlayers [data-dni="${dni}"]`);
        
        if (jugadorExistente) {
            jugadorExistente.classList.add('jugador-verificado');
            setTimeout(() => jugadorExistente.classList.remove('jugador-verificado'), 3000);
            mostrarMensaje('Jugador ya está en la lista', 'info');
            return;
        }

        // Mostrar información del jugador encontrado
        const equipoJugador = mockTeams.find(team => team.id === jugador.team_id);
        const infoContainer = document.createElement('div');
        infoContainer.className = 'alert alert-info mt-2';
        infoContainer.id = `info-${dni}`;
        infoContainer.innerHTML = `
            <div class="d-flex align-items-center">
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                
                <div>
                    <strong>Nombre:</strong> ${jugador.name} <strong> <span class="birth-year">(${jugador.birthYear})</span></strong><br>
                    <strong>DNI:</strong> ${jugador.dni}<br>
                    <strong>Equipo:</strong> ${equipoJugador.name}
                </div>
                <button class="btn btn-success ms-auto" onclick="confirmarAgregarJugador('${equipo}', '${dni}')">
                    Agregar Jugador
                </button>
                 
            </div>
        `;

        // Remover información previa si existe
        const prevInfo = document.getElementById(`info-${dni}`);
        if (prevInfo) prevInfo.remove();
        
        // Insertar nueva información
        dniInput.parentElement.after(infoContainer);
    } else {
        mostrarMensaje('Jugador no encontrado en la base de datos', 'danger');
    }
}

function confirmarAgregarJugador(equipo, dni) {
    const jugador = mockPlayers.find(player => player.dni === dni);
    if (jugador) {
        agregarJugador(equipo, jugador);
        // Remover el contenedor de información
        document.getElementById(`info-${dni}`).remove();
        // Limpiar el input
        document.getElementById(`${equipo}PlayerDNI`).value = '';
        mostrarMensaje('Jugador agregado exitosamente', 'success');
    }
}

function activarCamara(equipo) {
    currentTeamForPhoto = equipo;
    const modal = new bootstrap.Modal(document.getElementById('cameraModal'));
    
    // Actualizar la interfaz del modal para mostrar el estado del proceso
    document.getElementById('camera-status').textContent = 'Activando cámara...';
    document.getElementById('face-detection-progress').style.display = 'none';

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(videoStream => {
            stream = videoStream;
            const video = document.getElementById('video');
            video.srcObject = stream; 
            document.getElementById('camera-status').textContent = 'Cámara lista. Capture una foto clara del rostro.'; 
            modal.show();
        })
        .catch(error => {
            mostrarMensaje('Error al acceder a la cámara', 'danger');
            console.error('Camera error:', error);
        });
}

 function capturarCerrar() {
    if(stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    bootstrap.Modal.getInstance(document.getElementById('cameraModal')).hide();
    processingPhoto = false;  
 }

async function capturarFoto() {
    if (processingPhoto) return;
    processingPhoto = true;
      // Mostrar progreso
    const progressBar = document.getElementById('face-detection-progress');
    const statusText = document.getElementById('camera-status');
    progressBar.style.display = 'block';
    progressBar.value = 10;
    statusText.textContent = 'Capturando imagen...';
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Capture frame with detected face
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get face descriptor from captured image
    progressBar.value = 30;
    statusText.textContent = 'Detectando rostro...';
    const detections = await faceapi.detectSingleFace(video)
            .withFaceLandmarks()
            .withFaceDescriptor();

    if (!detections) {
        statusText.textContent = `Error: No se detectó ningún rostro en la imagen.`;
        processingPhoto = false;
        progressBar.value = 0
        throw new Error('No se detectó ningún rostro en la imagen.');
    }

    progressBar.value = 50;
    statusText.textContent = 'Extrayendo características faciales...';
    faceDescriptor = detections.descriptor;
    const photoData = canvas.toDataURL('image/jpeg');
    
    // Store face descriptor and photo
    // storeFaceData(faceDescriptor, photoData);
    
    // Search for matching player
    console.log("Face:" + faceDescriptor);
    progressBar.value = 70;
    statusText.textContent = 'Buscando coincidencias en la base de datos...';
    const matchedPlayer = await findMatchingPlayer(faceDescriptor);
    if (matchedPlayer) {
        buscarJugadorPorFoto(matchedPlayer, currentTeamForPhoto);
    } else {
        mostrarMensaje('No se encontró coincidencia en la base de datos', 'warning');
    }
    

    // Cleanup
    if(stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    bootstrap.Modal.getInstance(document.getElementById('cameraModal')).hide();
    processingPhoto = false;   
 }

function buscarJugadorPorFoto(player, equipo) {

    const equipoJugador = mockTeams.find(team => team.id === player.team_id);
    
    // Buscar al jugador en la lista del equipo actual
    const jugadorExistente = document.querySelector(`#${equipo}TeamPlayers [data-dni="${player.dni}"]`);
    //const jugadorTODOS = document.querySelector(`#${equipo}TeamPlayers`);

  
    if (jugadorExistente) {
        // El jugador está en la lista del equipo - verificarlo
        jugadorExistente.classList.add('verified', 'verification-flash');
        setTimeout(() => {
            jugadorExistente.classList.remove('verification-flash');
        }, 1000);
        mostrarMensaje('Jugador verificado exitosamente', 'success');
    } else {
        // El jugador no está en la lista del equipo
        const equipoId = document.getElementById(`${equipo === 'local' ? 'homeTeam' : 'awayTeam'}`).value;
        
        // Crear contenedor de información del jugador
        const infoContainer = document.createElement('div');
        infoContainer.className = 'alert alert-warning';
        infoContainer.id = `foto-info-${player.dni}`;
        infoContainer.innerHTML = `
            <div class="d-flex align-items-center">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <div>
                    <strong>Jugador Identificado:</strong><br>
                    Nombre: ${player.name}<br><strong> <span class="birth-year">(${player.birthYear})</span></strong><br>
                    DNI: ${player.dni}<br>
                    Equipo actual: ${equipoJugador.name}
                </div>
                <div class="ms-auto">
                    <button class="btn btn-success" onclick="agregarJugadorVerificado('${equipo}', '${player.dni}')">
                        Agregar como Verificado
                    </button>
                </div>
            </div>
        `;

        // Remover información previa si existe
        const prevInfo = document.getElementById(`foto-info-${player.dni}`);
        if (prevInfo) prevInfo.remove();

        // Insertar nueva información después del grupo de botones
        const buttonGroup = document.querySelector(`#${equipo === 'local' ? 'localTeamPlayers' : 'visitanteTeamPlayers'}`).previousElementSibling;
        buttonGroup.after(infoContainer);
    }
}
function agregarJugadorVerificado(equipo, dni) {
    const jugador = mockPlayers.find(player => player.dni === dni);
    if (jugador) {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item verified';
        playerItem.setAttribute('data-dni', jugador.dni);
        playerItem.innerHTML = `
            <input type="number" class="form-control player-number" placeholder="N°" style="width: 70px;">
            <div class="player-info">
                <div class="player-name">${jugador.name}</div> <span class="birth-year">(${jugador.birthYear})</span></div>
                <div class="player-dni">DNI: ${jugador.dni}</div>
            </div>
            <input type="checkbox" class="captain-select" onchange="setCaptain(this, '${equipo}')" title="Marcar como capitán">
            <span class="captain-badge" style="display: none;">C</span>
            <i class="bi bi-check-circle-fill verification-status" title="Jugador verificado"></i>
            <button type="button" class="btn btn-sm btn-danger ms-auto" onclick="this.parentElement.remove(); saveToLocalStorage()">
                <i class="bi bi-trash"></i>
            </button>
        `;
        
        const container = document.getElementById(`${equipo}TeamPlayers`);
        container.appendChild(playerItem);
        
        // Remover el contenedor de información
        const infoContainer = document.getElementById(`foto-info-${dni}`);
        if (infoContainer) infoContainer.remove();
        
        mostrarMensaje('Jugador agregado y verificado exitosamente', 'success');
        saveToLocalStorage();
    }
}


function storeFaceData(faceDescriptor, photoData) {
    // Store face descriptor in localStorage for demo purposes
    // In a real application, this should be stored in a proper database
    const faceData = {
        descriptor: Array.from(faceDescriptor),
        photo: photoData,
        timestamp: new Date().toISOString()
    };
    
    let storedFaces = JSON.parse(localStorage.getItem('faceDescriptors') || '[]');
    storedFaces.push(faceData);
    localStorage.setItem('faceDescriptors', JSON.stringify(storedFaces));
}

async function findMatchingPlayer(faceDescriptor) {
    // Get stored face descriptors
    //const storedFaces = JSON.parse(localStorage.getItem('faceDescriptors') || '[]');
    
    // Find best match
    let bestMatch = null;
    let bestDistance = Infinity;

     mockPlayers.find(player => { const descriptorGuardado = new Float32Array(player.descriptor);
        let distance = 100;
        if(descriptorGuardado.length>0){distance=faceapi.euclideanDistance(
            faceDescriptor,descriptorGuardado
        );}
        
         // Use threshold of 0.6 for face matching
        if (distance < 0.6 && distance < bestDistance) {
            bestDistance = distance;
            bestMatch = player;
        }
    });
    return bestMatch;
}

function agregarGol() {
    const goalsList = document.getElementById('goalsList');
    const goalItem = document.createElement('div');
    goalItem.className = 'mb-3';
    goalItem.innerHTML = `
        <div class="input-group">
            <select class="form-select">
                <option value="local">Equipo Local</option>
                <option value="visitante">Equipo Visitante</option>
            </select>
            <input type="number" class="form-control" placeholder="N° Camiseta">
            <input type="number" class="form-control" placeholder="Cantidad de goles">
            <button type="button" class="btn btn-danger" onclick="this.parentElement.parentElement.remove()">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    goalsList.appendChild(goalItem);
}

function agregarSancion() {
    const sanctionsList = document.getElementById('sanctionsList');
    const sanctionItem = document.createElement('div');
    sanctionItem.className = 'sanction-item';
    sanctionItem.innerHTML = `
        <div class="input-group">
            <select class="form-select">
                <option value="local">Equipo Local</option>
                <option value="visitante">Equipo Visitante</option>
            </select>
            <input type="number" class="form-control" placeholder="N° Camiseta">
            <select class="form-select">
                <option value="yellow">Tarjeta Amarilla</option>
                <option value="red">Tarjeta Roja</option>
                <option value="other">Otra Sanción</option>
            </select>
            <input type="text" class="form-control" placeholder="Descripción">
            <button type="button" class="btn btn-danger" onclick="this.parentElement.parentElement.remove()">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    sanctionsList.appendChild(sanctionItem);
}

// Guardar planilla
function guardarPlanilla(event) {
    event.preventDefault();
    
    // Recopilar todos los datos del formulario
    const matchData = {
        dateTime: document.getElementById('matchDateTime').value,
        fieldNumber: document.getElementById('fieldNumber').value,
        homeTeam: document.getElementById('homeTeam').value,
        awayTeam: document.getElementById('awayTeam').value,
        players: getPlayersData(),
        goals: getGoalsData(),
        sanctions: getSanctionsData(),
        referees: getRefereesData(),
        observations: document.getElementById('observations').value,
        hasProtest: document.getElementById('hasProtest').checked
    };

    // Enviar al backend
    fetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify(matchData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Planilla guardada exitosamente');
    })
    .catch(error => alert('Error al guardar la planilla'));
}

// Generar PDF
function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPos = 20;
    const margin = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;

    // Helper functions
    function addText(text, y, options = {}) {
        if (y >= pageHeight - 20) {
            doc.addPage();
            y = 20;
        }
        doc.text(text, margin, y, options);
        return y + lineHeight;
    }

    function addSection(title, y) {
        if (y >= pageHeight - 25) {
            doc.addPage();
            y = 20;
        }
        doc.setFillColor(220, 220, 220);
        doc.rect(margin - 5, y - 5, 170, 8, 'F');
        doc.setFont(undefined, 'bold');
        doc.text(title, margin, y);
        doc.setFont(undefined, 'normal');
        return y + lineHeight + 2;
    }

    // Encabezado
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('PLANILLA DE PARTIDO', 105, yPos, { align: 'center' });
    yPos += lineHeight * 2;
    doc.setFontSize(12);

    // Datos básicos
    yPos = addSection('DATOS BÁSICOS', yPos);
    const rawDate = document.getElementById('matchDateTime').value;
    const date = new Date(rawDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    yPos = addText(`Fecha y Hora: ${formattedDate}`, yPos);

    //yPos = addText(`Fecha y Hora: ${document.getElementById('matchDateTime').value}`, yPos);
    yPos = addText(`Cancha N°: ${document.getElementById('fieldNumber').value}`, yPos);
    yPos += lineHeight/2;

    // Equipos y resultado
    yPos = addSection('EQUIPOS', yPos);
    const homeTeam = document.getElementById('homeTeam');
    const awayTeam = document.getElementById('awayTeam');
    yPos = addText(`Equipo Local: ${homeTeam.options[homeTeam.selectedIndex]?.text || ''}`, yPos);
    yPos = addText(`Equipo Visitante: ${awayTeam.options[awayTeam.selectedIndex]?.text || ''}`, yPos);
    yPos += lineHeight/2;

    // Cuerpo Técnico
    yPos = addSection('CUERPO TÉCNICO', yPos);
    doc.setFont(undefined, 'bold');
    yPos = addText('Equipo Local:', yPos);
    doc.setFont(undefined, 'normal');
    yPos = addText(`Director Técnico: ${document.getElementById('localCoach').value}`, yPos);
    yPos = addText(`Ayudante de Campo: ${document.getElementById('localAssistant').value}`, yPos);
    yPos += lineHeight/2;
    doc.setFont(undefined, 'bold');
    yPos = addText('Equipo Visitante:', yPos);
    doc.setFont(undefined, 'normal');
    yPos = addText(`Director Técnico: ${document.getElementById('awayCoach').value}`, yPos);
    yPos = addText(`Ayudante de Campo: ${document.getElementById('awayAssistant').value}`, yPos);
    yPos += lineHeight;

    // Jugadores
    yPos = addSection('JUGADORES', yPos);
    
    // Equipo Local
    doc.setFont(undefined, 'bold');
    yPos = addText('Equipo Local:', yPos);
    doc.setFont(undefined, 'normal');
    const localPlayers = document.querySelectorAll('#localTeamPlayers .player-item');
    localPlayers.forEach(player => {
        const number = player.querySelector('.player-number').value;
        const name = player.querySelector('.player-name').textContent;
        const isCaptain = player.querySelector('.captain-select').checked;
        const isVerified = player.classList.contains('verified');
        let playerText = `   ${number.padStart(2, '0')} - ${name}`;
        if (isCaptain) playerText += ' (C)';
        if (isVerified) playerText += ' ✓';
        yPos = addText(playerText, yPos);
    });
    yPos += lineHeight/2;

    // Equipo Visitante
    doc.setFont(undefined, 'bold');
    yPos = addText('Equipo Visitante:', yPos);
    doc.setFont(undefined, 'normal');
    const awayPlayers = document.querySelectorAll('#visitanteTeamPlayers .player-item');
    awayPlayers.forEach(player => {
        const number = player.querySelector('.player-number').value;
        const name = player.querySelector('.player-name').textContent;
        const isCaptain = player.querySelector('.captain-select').checked;
        const isVerified = player.classList.contains('verified');
        let playerText = `   ${number.padStart(2, '0')} - ${name}`;
        if (isCaptain) playerText += ' (C)';
        if (isVerified) playerText += ' ✓';
        yPos = addText(playerText, yPos);
    });
    yPos += lineHeight;

    // Goles
    yPos = addSection('GOLES', yPos);
    document.querySelectorAll('#goalsList .input-group').forEach(goal => {
        const team = goal.querySelector('select').value;
        const number = goal.querySelector('input[placeholder="N° Camiseta"]').value;
        const goals = goal.querySelector('input[placeholder="Cantidad de goles"]').value;
        yPos = addText(`${team === 'local' ? 'Local' : 'Visitante'} - N° ${number.padStart(2, '0')}: ${goals} goles`, yPos);
    });
    yPos += lineHeight/2;

    // Sanciones
    yPos = addSection('SANCIONES', yPos);
    document.querySelectorAll('#sanctionsList .input-group').forEach(sanction => {
        const team = sanction.querySelector('select').value;
        const number = sanction.querySelector('input[placeholder="N° Camiseta"]').value;
        const type = sanction.querySelector('select:nth-child(3)').value;
        const desc = sanction.querySelector('input[placeholder="Descripción"]').value;
        let sanctionType = '';
        switch(type) {
            case 'yellow': sanctionType = 'Tarjeta Amarilla'; break;
            case 'red': sanctionType = 'Tarjeta Roja'; break;
            default: sanctionType = 'Otra Sanción';
        }
        yPos = addText(`${team === 'local' ? 'Local' : 'Visitante'} - N° ${number.padStart(2, '0')}: ${sanctionType} - ${desc}`, yPos);
    });
    yPos += lineHeight/2;

    // Árbitros
    yPos = addSection('ÁRBITROS', yPos);
    const referees = document.querySelectorAll('#refereesList .input-group');
    referees.forEach((referee, index) => {
        const apellido = referee.querySelector('input[placeholder="Apellido"]').value;
        const dni = referee.querySelector('input[placeholder="DNI"]').value;
        const role = index === 0 ? 'Principal' : `Asistente ${index}`;
        yPos = addText(`${role}: ${apellido} - DNI: ${dni}`, yPos);
    });
    yPos += lineHeight;

    // Observaciones
    yPos = addSection('OBSERVACIONES', yPos);
    const observations = document.getElementById('observations').value;
    if (observations.trim()) {
        const observationLines = doc.splitTextToSize(observations, 160);
        observationLines.forEach(line => {
            yPos = addText(line, yPos);
        });
    }

    // Protesta
    const hasProtest = document.getElementById('hasProtest').checked;
    if (hasProtest) {
        yPos += lineHeight/2;
        doc.setFont(undefined, 'bold');
        yPos = addText('** PLANILLA SUJETA A PROTESTA **', yPos);
    }

    // Pie de página en todas las páginas
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(`Generado el: ${currentDate} - Página ${i} de ${pageCount}`, margin, 290);
    }

    doc.save('planilla-partido.pdf');
}

// Funciones auxiliares para recopilar datos
function getPlayersData() {
    // Implementar recopilación de jugadores
}

function getGoalsData() {
    // Implementar recopilación de goles
}

function getSanctionsData() {
    // Implementar recopilación de sanciones
}

function getRefereesData() {
    // Implementar recopilación de árbitros
}

function mostrarMensaje(mensaje, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar al inicio del contenedor principal
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function inicializarAutocompletadoArbitros() {
    const refereesInputs = document.querySelectorAll('.referee-input');
    
    refereesInputs.forEach(input => {
        // Crear lista de sugerencias
        const datalist = document.createElement('datalist');
        datalist.id = `referees-${input.dataset.index}`;
        
        // Agregar opciones al datalist
        mockReferees.forEach(referee => {
            const option = document.createElement('option');
            option.value = `${referee.name} - ${referee.dni}`;
            datalist.appendChild(option);
        });
        
        // Agregar datalist al documento
        document.body.appendChild(datalist);
        
        // Vincular datalist con input
        input.setAttribute('list', datalist.id);
        
        // Event listener para autocompletar DNI
        input.addEventListener('input', function(e) {
          
            const selectedValue = e.target.value;
            const dniInput = this.parentElement.querySelector('.referee-dni');
            const name = this.parentElement.querySelector('.referee-input');
            
            // Buscar en la lista de árbitros
            const referee = mockReferees.find(ref => 
                `${ref.name} - ${ref.dni}` === selectedValue
            );
            name.value = selectedValue.split(" - ")[0];
            if (referee) {
                dniInput.value = referee.dni;
                dniInput.setAttribute('readonly', true);
            } else {
                dniInput.removeAttribute('readonly');
            }
        });
    });
}