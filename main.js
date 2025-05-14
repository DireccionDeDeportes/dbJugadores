// Variables globales
let stream = null;
let currentTeamForPhoto = null;
let faceDetector = null;
let faceRecognitionModel = null;
let detectionInterval = null;

// Datos de ejemplo
const mockTeams = [
    { id: 1, name: '11 REYNAS - B° KENNEDY (SUB-16 F)' },
    { id: 2, name: 'B° AMEP (SUB-13 M)' },
    { id: 3, name: 'B° AMEP (SUB-15 M)' },
    { id: 4, name: 'B° PUCARA (SUB-13 M)' },
     { id: 5, name: 'B° SANTA RITA (SUB-10 M)' },
    { id: 6, name: 'B° SOLIDARIDAD (SUB-13 F)' },
    { id: 7, name: 'B° SOLIDARIDAD (SUB-16 F)' },
    { id: 8, name: 'CLUB ATLETICO PUEYRREDON - B° PUEYRREDON (SUB-15 M)' },
     { id: 9, name: 'DEFENSORES 1° DE MAYO (SUB-10 M)' },
    { id: 10, name: 'DEFENSORES 1° DE MAYO (SUB-13 F)' },
    { id: 11, name: 'DEFENSORES 1° DE MAYO (SUB-16 F)' },
    { id: 12, name: 'DOMADORES DE SUEGRA - B° 9 DE JULIO (SUB-13 M)' },
     { id: 13, name: 'DOMADORES DE SUEGRA - B° 9 DE JULIO (SUB-15 M)' },
    { id: 14, name: 'DOMADORES DE SUEGRA - B° 9 DE JULIO (SUB-16 F)' },
    { id: 15, name: 'EL REJUNTE DEL OESTE - B° SARGENTO CABRAL (SUB-15 M)' },
    { id: 16, name: 'ESTRELLA - B° 140 VIV (SUB-10 M)' },
     { id: 17, name: 'ESTRELLA - B° 140 VIV (SUB-13 M)' },
    { id: 18, name: 'ESTRELLA OESTE - LA CERAMICA (SUB-13 M)' },
    { id: 19, name: 'EUSEBIO FC - B° EUSEBIO CASTAÑO (SUB-10 M)' },
    { id: 20, name: 'EUSEBIO FC - B° EUSEBIO CASTAÑO (SUB-13 F)' },
     { id: 21, name: 'EUSEBIO FC - B° EUSEBIO CASTAÑO (SUB-13 M)' },
    { id: 22, name: 'EUSEBIO FC - B° EUSEBIO CASTAÑO (SUB-15 M)' },
    { id: 23, name: 'FUSION - B° GOBERNADOR ALRIC (SUB-13 F)' },
    { id: 24, name: 'FUSION - B° GOBERNADOR ALRIC (SUB-16 F)' },
     { id: 25, name: 'LA PASION - B° 148 VIV (SUB-13 M)' },
    { id: 26, name: 'LAS BANCARIAS AMARILLAS - B° LOS RANQUELES (SUB-13 F)' },
    { id: 27, name: 'LAS BANCARIAS VERDES - B° LOS RANQUELES (SUB-13 F)' },
    { id: 28, name: 'LAS LEONAS DEL EVA - EVA PERON ANEXO (SUB-16 F)' },
     { id: 29, name: 'LAS PRINCES - LA CERAMICA B° 400 SUR (SUB-13 F)' },
    { id: 30, name: 'LEALES - B° 9 DE JULIO (SUB-13 F)' },
    { id: 31, name: 'LEALES - B° 9 DE JULIO (SUB-13 M)' },
    { id: 32, name: 'LEALES - B° 9 DE JULIO (SUB-16 F)' },
     { id: 33, name: 'LOS BANCARIOS - B° PARQUE DE LAS NACIONES (SUB-13 M)' },
    { id: 34, name: 'LOS BANCARIOS - B° PARQUE DE LAS NACIONES (SUB-15 M)' },
    { id: 35, name: 'LOS CALDENES DEL OESTE - B° LOS CALDENES (SUB-13 M)' },
    { id: 36, name: 'LOS CALDENES DEL OESTE - B° LOS CALDENES (SUB-15 M)' },
     { id: 37, name: 'LOS CUERVOS - B° FAECAP (SUB-15 M)' },
    { id: 38, name: 'LOS GIGANTES - B° 400 SUR (SUB-15 M)' },
    { id: 39, name: 'LOS GUERREROS - B° 400 SUR (SUB-13 M)' },
    { id: 40, name: 'LOS MARGINALES FC - B° SANTA ROSA (SUB-13 M)' },
    { id: 41, name: 'LOS PIBES DEL REPUBLICA - B° LA REPUBLICA (SUB-13 M)' },
    { id: 42, name: 'OESTE UNITED - B° LIBERTAD (SUB-10 M)' },
    { id: 43, name: 'OESTE UNITED - B° LIBERTAD (SUB-13 M)' },
    { id: 44, name: 'PUEYRREDON - B° PUEYRREDON (SUB-15 M)' },
    { id: 45, name: 'SANTA ROSA - B° SANTA ROSA (SUB-15 M)' },
    { id: 46, name: 'SEMILLEROS - B° SAN MARTIN (SUB-10 M)' },
    { id: 47, name: 'SOLIDARIDAD SUR - B° SOLIDARIDAD SUR (SUB-10 M)' },
    { id: 48, name: 'SOLIDARIDAD SUR - B° SOLIDARIDAD SUR (SUB-13 M)' },
    { id: 49, name: 'SOLIDARIDAD SUR - B° SOLIDARIDAD SUR (SUB-15 M)' },
    { id: 50, name: 'TRICOLOR - B° JOSE HERNANDEZ (SUB-10 M)' },
    { id: 51, name: 'TRICOLOR - B° JOSE HERNANDEZ (SUB-13 M)' },
    { id: 52, name: 'TRICOLOR - B° JOSE HERNANDEZ (SUB-15 M)' },
    { id: 53, name: 'UNION VECINAL - 1° DE MAYO (SUB-10 M)' },
    { id: 54, name: 'UNION VECINAL - 1° DE MAYO (SUB-13 M)' },
    { id: 55, name: 'UNION VECINAL - 1° DE MAYO (SUB-15 M)' },
    { id: 56, name: 'VERDE AMARELLA - B° PARQUE DE LAS NACIONES (SUB-10 M)' },
    { id: 57, name: 'VIDAD FC - B° IGNACIO VIDAL (SUB-10 M)' },
    { id: 58, name: 'VILLA DEPORTIVA - B° 208 VIV (SUB-10 M)' },
    { id: 59, name: 'VILLA DEPORTIVA - B° 208 VIV (SUB-13 M)' },
    { id: 60, name: 'VILLA DEPORTIVA - B° 208 VIV (SUB-15 M)' }
];

const mockPlayers = [
    { dni: '30123456', name: 'Juan Pérez', team_id: 2, photo: 'https://robohash.org/player1',descriptor:[] },
    { dni: '31234567', name: 'Carlos García', team_id: 2, photo: 'https://robohash.org/player2',descriptor: [] },
    { dni: '32345678', name: 'Luis Rodríguez', team_id: 2, photo: 'https://robohash.org/player3',descriptor: []},
    { dni: '33456789', name: 'Miguel González', team_id: 2, photo: 'https://robohash.org/player4',descriptor:[] },
    { dni: '34567890', name: 'Roberto Martínez', team_id: 2, photo: 'https://robohash.org/player5',descriptor:[] },
    { dni: '33766125', name: 'Quiroga William', team_id: 2, photo: 'https://robohash.org/player6', descriptor:[-0.10591339319944382,0.13265354931354523,0.09102523326873779,-0.019383355975151062,-0.02892124094069004,0.012014917097985744,-0.006810316815972328,-0.0933004692196846,0.1939668506383896,-0.1363959163427353,0.23990289866924286,0.011735349893569946,-0.20274396240711212,-0.037284716963768005,0.03840310499072075,0.18277785181999207,-0.2375466376543045,-0.0874810516834259,-0.12421686202287674,-0.04427391290664673,0.11121208965778351,-0.0085850665345788,0.05392124876379967,0.059496086090803146,-0.1561354100704193,-0.349834680557251,-0.09385436773300171,-0.05569871887564659,0.06460946053266525,-0.07037269324064255,-0.041177086532115936,-0.06719588488340378,-0.17805278301239014,-0.07085776329040527,-0.002488936996087432,0.050101388245821,-0.06096874922513962,-0.0798705443739891,0.13270604610443115,-0.031125370413064957,-0.18414582312107086,0.028685789555311203,0.06569612771272659,0.23811060190200806,0.1910162717103958,0.12741917371749878,0.011910010129213333,-0.004758906550705433,0.09438039362430573,-0.2668827772140503,0.07409588992595673,0.07510770857334137,0.16989263892173767,0.04109553247690201,0.14884600043296814,-0.13015490770339966,-0.00913189072161913,0.08803585916757584,-0.1344064623117447,0.060857582837343216,0.09596830606460571,-0.04071305692195892,0.05275363475084305,-0.03505343571305275,0.20440009236335754,0.1019122302532196,-0.1443583220243454,-0.061648890376091,0.13569383323192596,-0.1040106937289238,-0.045597437769174576,-0.04617420956492424,-0.10200169682502747,-0.18171927332878113,-0.32898834347724915,-0.001910582883283496,0.4461836516857147,0.1682480275630951,-0.15282563865184784,-0.009405439719557762,-0.06667741388082504,0.05066484585404396,0.05584242194890976,0.06172136589884758,-0.10909545421600342,-0.010842511430382729,-0.10654503852128983,0.04423129931092262,0.14994975924491882,-0.005007639527320862,-0.045126549899578094,0.24117614328861237,-0.012184609659016132,-0.010840870440006256,-0.012235547415912151,0.0015981192700564861,-0.13137352466583252,0.007810435723513365,-0.12593218684196472,0.0079625453799963,0.001854844857007265,-0.025166848674416542,0.04043857753276825,0.13023912906646729,-0.17087124288082123,0.11389566957950592,-0.007360000628978014,0.02760114148259163,0.03686869516968727,0.16919302940368652,-0.24460755288600922,-0.08194312453269958,0.07092399150133133,-0.24200548231601715,0.12984570860862732,0.2303907573223114,-0.01456823106855154,0.09657725691795349,0.10385148972272873,0.08651348948478699,0.04398578777909279,0.06099570170044899,-0.1597442775964737,-0.10202258825302124,0.05635259300470352,-0.04231937602162361,0.09195533394813538,0.06690889596939087] },
    { dni: '50820671', name: 'BECERRA ROCIO ESMERALDA', team_id: 1, photo: 'https://robohash.org/player7',descriptor:[] },
    { dni: '51467400', name: 'ZOPPIS MANUELA ANIA', team_id: 1, photo: 'https://robohash.org/player8',descriptor: [] },
    { dni: '50668417', name: 'GELABERT CELESTE CAMILA', team_id: 1, photo: 'https://robohash.org/player9',descriptor: []},
    { dni: '52049451', name: 'BERON RITA CIELO NICOL', team_id: 1, photo: 'https://robohash.org/player10',descriptor:[] },
    { dni: '50820662', name: 'OJEDA TELLO PAULA EMILIA', team_id: 1, photo: 'https://robohash.org/player11',descriptor:[] },
    { dni: '52356485', name: 'PEREZ GUADALUPE AITANA', team_id: 1, photo: 'https://robohash.org/player12',descriptor:[] },
    { dni: '50916304', name: 'PEREZ VALENTINA HERMENEGILDA', team_id: 1, photo: 'https://robohash.org/player13',descriptor: [] },
    { dni: '51349875', name: 'SUAREZ AGUSTINA AIMAR GUADALUPE', team_id: 1, photo: 'https://robohash.org/player14',descriptor: []},
    { dni: '50668244', name: 'GIMENEZ OJEDA UMA ABIGAIL', team_id: 1, photo: 'https://robohash.org/player15',descriptor:[] },
    { dni: '50479814', name: 'ZARATE PEREIRA MALANY AYLEN', team_id: 1, photo: 'https://robohash.org/player16',descriptor:[] }, 
    { dni: '53179601', name: 'MOYANO NATASHA ANTONELA', team_id: 27, photo: 'https://robohash.org/player17',descriptor:[] },
    { dni: '53177576', name: 'SOSA ZAMARBIDE CAMILA', team_id: 27, photo: 'https://robohash.org/player18',descriptor: [] },
    { dni: '52356993', name: 'CAPREITO OLIVIA', team_id: 27, photo: 'https://robohash.org/player19',descriptor: []},
    { dni: '52700041', name: 'ANA ISABELLA FLORES RAMOS MEJIA', team_id: 27, photo: 'https://robohash.org/player20',descriptor:[] },
    { dni: '52355242', name: 'FERNANDEZ ALMA LUHE', team_id: 27, photo: 'https://robohash.org/player21',descriptor:[] },
    { dni: '53571322', name: 'CASTRO JULIETA DEL VALLE', team_id: 27, photo: 'https://robohash.org/player17',descriptor:[] },
    { dni: '52358277', name: 'SCHIAVI JULIA', team_id: 27, photo: 'https://robohash.org/player18',descriptor: [] },
    { dni: '51025903', name: 'RAMOS GOMEZ SOFIA VALENTINA', team_id: 27, photo: 'https://robohash.org/player19',descriptor: []},
    { dni: '52553709', name: 'PERCINCULA PRISCILA NAOMI', team_id: 27, photo: 'https://robohash.org/player20',descriptor:[] },
    { dni: '34567890', name: 'Roberto Martínez', team_id: 2, photo: 'https://robohash.org/player21',descriptor:[] },
];

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar Select2 para los equipos
    $('.team-select').select2({
        placeholder: 'Seleccione un equipo',
        data: mockTeams.map(team => ({
            id: team.id,
            text: team.name
        }))
    });

    // Restaurar datos guardados
    restoreFromLocalStorage();

    // Event listeners para cambios en los equipos
    $('#homeTeam, #awayTeam').on('change', function() {
        updateLoadPlayersButtons();
        saveToLocalStorage();
    });

    // Inicializar formulario
    document.getElementById('matchForm').addEventListener('submit', guardarPlanilla);

    // Load face-api.js models
    await loadFaceDetectionModels();
});

async function loadFaceDetectionModels() {
    try {
       // faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        //faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        //faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://68241a7c22f113f17a615c1e--sprightly-bonbon-527be1.netlify.app/');
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://68241a7c22f113f17a615c1e--sprightly-bonbon-527be1.netlify.app/');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://68241a7c22f113f17a615c1e--sprightly-bonbon-527be1.netlify.app/');
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
        }
    };
    localStorage.setItem('matchData', JSON.stringify(matchData));
}

function getTeamPlayersData(containerId) {
    const players = [];
    document.querySelectorAll(`#${containerId} .player-item`).forEach(playerElement => {
        players.push({
            number: playerElement.querySelector('.player-number').value,
            name: playerElement.querySelector('span').textContent,
            photo: playerElement.querySelector('img').src,
            dni: playerElement.getAttribute('data-dni'),
            captain: playerElement.querySelector('.captain-select').checked
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
    }

    // Agregar botones de carga inicial
    agregarBotonCargarJugadores();
}

function createPlayerElement(playerData) {
    const playerItem = document.createElement('div');
    playerItem.className = 'player-item';
    playerItem.setAttribute('data-dni', playerData.dni || '');
    playerItem.innerHTML = `
        <img src="${playerData.photo}" alt="Foto jugador">
        <input type="number" class="form-control player-number" placeholder="N°" value="${playerData.number || ''}">
        <span>${playerData.name}</span>
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
    
    const playerItem = document.createElement('div');
    playerItem.className = 'player-item';
    playerItem.setAttribute('data-dni', jugador.dni);
    playerItem.innerHTML = `
        <img src="${jugador.photo || 'https://robohash.org/default'}" alt="Foto jugador">
        <input type="number" class="form-control player-number" placeholder="N°">
        <span>${jugador.name}</span>
        <input type="checkbox" class="captain-select" onchange="setCaptain(this, '${equipo}')" title="Marcar como capitán">
        <span class="captain-badge" style="display: none;">C</span>
        <i class="bi bi-check-circle-fill verification-status" title="Jugador verificado"></i>
        <button type="button" class="btn btn-sm btn-danger ms-auto" onclick="this.parentElement.remove(); saveToLocalStorage()">
            <i class="bi bi-trash"></i>
        </button>
    `;
    container.appendChild(playerItem);
    
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
        const infoContainer = document.createElement('div');
        infoContainer.className = 'alert alert-info mt-2';
        infoContainer.id = `info-${dni}`;
        infoContainer.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${jugador.photo}" alt="Foto jugador" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                <div>
                    <strong>Nombre:</strong> ${jugador.name}<br>
                    <strong>DNI:</strong> ${jugador.dni}
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
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(videoStream => {
            stream = videoStream;
            const video = document.getElementById('video');
            video.srcObject = stream;
            
            // Start face detection when video starts playing
            video.addEventListener('play', () => {
                startFaceDetection(video);
            });
            
            modal.show();
        })
        .catch(error => {
            mostrarMensaje('Error al acceder a la cámara', 'danger');
            console.error('Camera error:', error);
        });
}

async function startFaceDetection(videoElement) {
    if (detectionInterval) clearInterval(detectionInterval);
    
    const canvas = document.getElementById('canvas');
    const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
    
    // Add face detection overlay to modal
    const detectionOverlay = document.createElement('canvas');
    detectionOverlay.id = 'faceDetectionOverlay';
    detectionOverlay.style.position = 'absolute';
    detectionOverlay.style.top = '0';
    detectionOverlay.style.left = '0';
    videoElement.parentElement.appendChild(detectionOverlay);
    
    detectionInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoElement, 
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
            
        if (detections.length > 0) {
            // Draw face detection box
            const context = detectionOverlay.getContext('2d');
            context.clearRect(0, 0, detectionOverlay.width, detectionOverlay.height);
            faceapi.draw.drawDetections(detectionOverlay, detections);
            
            // Enable capture button if face detected
            document.querySelector('#cameraModal .btn-primary').disabled = false;
        } else {
            // Disable capture button if no face detected
            document.querySelector('#cameraModal .btn-primary').disabled = true;
        }
    }, 100);
}

async function capturarFoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Capture frame with detected face
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get face descriptor from captured image
    const detections = await faceapi.detectAllFaces(canvas, 
        new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
    console.log(detections);
    if (detections.length > 0) {
        const faceDescriptor = detections[0].descriptor;
        const photoData = canvas.toDataURL('image/jpeg');
        
        // Store face descriptor and photo
       // storeFaceData(faceDescriptor, photoData);
        
        // Search for matching player
        const matchedPlayer = await findMatchingPlayer(faceDescriptor);
        if (matchedPlayer) {
            buscarJugadorPorFoto(matchedPlayer, currentTeamForPhoto);
        } else {
            mostrarMensaje('No se encontró coincidencia en la base de datos', 'warning');
        }
    }

    // Cleanup
    if (detectionInterval) clearInterval(detectionInterval);
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    const overlay = document.getElementById('faceDetectionOverlay');
    if (overlay) overlay.remove();
    
    bootstrap.Modal.getInstance(document.getElementById('cameraModal')).hide();
}

function buscarJugadorPorFoto(player, equipo) {
   
   
    console.log(player);
    const equipoJugador = mockTeams.find(team => team.id === player.team_id);
    
    // Buscar al jugador en la lista del equipo actual
    const jugadorExistente = document.querySelector(`#${equipo}TeamPlayers [data-dni="${player.dni}"]`);
    const jugadorTODOS = document.querySelector(`#${equipo}TeamPlayers`);
    console.log(jugadorTODOS);
    
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
                <img src="${player.photo}" alt="Foto jugador" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                <div>
                    <strong>Jugador Identificado:</strong><br>
                    Nombre: ${player.name}<br>
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
            <img src="${jugador.photo || 'https://robohash.org/default'}" alt="Foto jugador">
            <input type="number" class="form-control player-number" placeholder="N°">
            <span>${jugador.name}</span>
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
        const name = player.querySelector('span').textContent;
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
        const name = player.querySelector('span').textContent;
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