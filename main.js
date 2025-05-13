// Variables globales
let stream = null;
let currentTeamForPhoto = null;

// Datos de ejemplo
const mockTeams = [
    { id: 1, name: 'River Plate' },
    { id: 2, name: 'Boca Juniors' },
    { id: 3, name: 'Racing Club' },
    { id: 4, name: 'Independiente' },
    { id: 5, name: 'San Lorenzo' }
];

const mockPlayers = [
    { dni: '30123456', name: 'Juan Pérez', team_id: 1, photo: 'https://robohash.org/player1' },
    { dni: '31234567', name: 'Carlos García', team_id: 1, photo: 'https://robohash.org/player2' },
    { dni: '32345678', name: 'Luis Rodríguez', team_id: 2, photo: 'https://robohash.org/player3' },
    { dni: '33456789', name: 'Miguel González', team_id: 2, photo: 'https://robohash.org/player4' },
    { dni: '34567890', name: 'Roberto Martínez', team_id: 3, photo: 'https://robohash.org/player5' },
    { dni: '35678901', name: 'Diego Fernández', team_id: 4, photo: 'https://robohash.org/player6' },
    { dni: '33766125', name: 'Quiroga William', team_id: 4, photo: '[-0.1071605384349823,0.09197666496038437,0.055093757808208466,-0.028606336563825607,-0.026037782430648804,0.023847419768571854,-0.023213747888803482,-0.05436262860894203,0.16798175871372223,-0.17063376307487488,0.20501215755939484,0.03434307500720024,-0.17065387964248657,-0.03990509733557701,0.024721000343561172,0.17414447665214539,-0.19716019928455353,-0.10728809982538223,-0.14065741002559662,-0.058350011706352234,0.11090380698442459,0.05092408508062363,-0.0037721283733844757,0.007205471862107515,-0.183523491024971,-0.3473680317401886,-0.09513409435749054,-0.07689905166625977,0.042784433811903,-0.056903738528490067,-0.03262578323483467,-0.07136078178882599,-0.191293865442276,-0.05533364415168762,0.0029786499217152596,0.09275691211223602,-0.05424456670880318,-0.07382801920175552,0.12074384093284607,0.029616646468639374,-0.21929453313350677,0.09398216009140015,0.03903818130493164,0.26529690623283386,0.1291857212781906,0.09745053946971893,0.0001248437911272049,-0.03721463307738304,0.1027466356754303,-0.2486954927444458,0.09188014268875122,0.09638967365026474,0.13092997670173645,0.049059271812438965,0.13652803003787994,-0.09173829108476639,0.054601944983005524,0.08495666086673737,-0.18406492471694946,0.03489162400364876,0.10274751484394073,-0.03128618746995926,0.06035839021205902,-0.04633578658103943,0.16930247843265533,0.08998804539442062,-0.12358708679676056,-0.06874307990074158,0.10968052595853806,-0.12069188803434372,-0.02617163397371769,-0.02754810079932213,-0.10418255627155304,-0.19218696653842926,-0.3421156704425812,0.05994570255279541,0.4945956766605377,0.18954139947891235,-0.113192118704319,0.024225741624832153,-0.03681723773479462,-0.00028989091515541077,0.11878213286399841,0.09660770744085312,-0.08483648300170898,-0.004527621902525425,-0.05979286879301071,0.09240152686834335,0.1689286082983017,0.012803815305233002,-0.04058871418237686,0.20100152492523193,-0.011046050116419792,-0.002431715838611126,-0.011305365711450577,0.002688012085855007,-0.14425604045391083,-0.004635029938071966,-0.06467539072036743,0.036072250455617905,-0.0027934862300753593,-0.05089009553194046,0.027131712064146996,0.15096476674079895,-0.14379745721817017,0.12530630826950073,-0.018627699464559555,-0.017084671184420586,0.043955881148576736,0.16588862240314484,-0.19290930032730103,-0.09767967462539673,0.050910770893096924,-0.21027256548404694,0.12993016839027405,0.22608506679534912,-0.01855245605111122,0.10256261378526688,0.11844959110021591,0.08369298279285431,-0.0020026471465826035,0.06907659024000168,-0.2400539368391037,-0.09060102701187134,0.05656192824244499,-0.02629493921995163,0.1001736968755722,0.04015481472015381]' }
];

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

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
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
    faceManager = new FaceRecognitionManager();
    // Inicializar formulario
    document.getElementById('matchForm').addEventListener('submit', guardarPlanilla);
});

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

function buscarJugadorPorFoto(photoData, equipo) {
   
    mockPlayers.find(player => { const descriptorGuardado = new Float32Array(player.photo);
        if ( this.faceManager.compararRostros(photoData, descriptorGuardado)) {
            jugadorEncontrado = player;
        }
    });

    // Simular reconocimiento facial seleccionando un jugador aleatorio
    //const jugadorAleatorio = mockPlayers[Math.floor(Math.random() * mockPlayers.length)];
    
    // Obtener el nombre del equipo al que pertenece el jugador
    const equipoJugador = mockTeams.find(team => team.id === jugadorEncontrado.team_id);
    
    // Buscar al jugador en la lista del equipo actual
    const jugadorExistente = document.querySelector(`#${equipo}TeamPlayers [data-dni="${jugadorEncontrado.dni}"]`);
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
        infoContainer.id = `foto-info-${jugadorEncontrado.dni}`;
        infoContainer.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${jugadorEncontrado.photo}" alt="Foto jugador" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                <div>
                    <strong>Jugador Identificado:</strong><br>
                    Nombre: ${jugadorEncontrado.name}<br>
                    DNI: ${jugadorEncontrado.dni}<br>
                    Equipo actual: ${equipoJugador.name}
                </div>
                <div class="ms-auto">
                    <button class="btn btn-success" onclick="agregarJugadorVerificado('${equipo}', '${jugadorEncontrado.dni}')">
                        Agregar como Verificado
                    </button>
                </div>
            </div>
        `;

        // Remover información previa si existe
        const prevInfo = document.getElementById(`foto-info-${jugadorEncontrado.dni}`);
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


function activarCamara(equipo) {
    currentTeamForPhoto = equipo;
    const modal = new bootstrap.Modal(document.getElementById('cameraModal'));
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(videoStream => {
            stream = videoStream;
            const video = document.getElementById('video');
            video.srcObject = stream;
            modal.show();
        })
        .catch(error => alert('Error al acceder a la cámara'));
}

function capturarFoto() {

    const video = document.getElementById('video');
    const descriptorVerificacion =  this.faceManager.obtenerDescriptor(video);
 
    // Simular búsqueda facial
    buscarJugadorPorFoto(descriptorVerificacion, currentTeamForPhoto);

    // Cerrar cámara y modal
    if(stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    bootstrap.Modal.getInstance(document.getElementById('cameraModal')).hide();
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
    const lineHeight = 8;

    // Función helper para agregar texto y actualizar posición Y
    function addText(text, y, options = {}) {
        doc.text(text, margin, y, options);
        return y + lineHeight;
    }

    // Función para agregar sección
    function addSection(title, y) {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin - 5, y - 5, 170, 8, 'F');
        doc.setFont(undefined, 'bold');
        doc.text(title, margin, y);
        doc.setFont(undefined, 'normal');
        return y + lineHeight + 2;
    }

    // Título
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('PLANILLA DE PARTIDO', 105, yPos, { align: 'center' });
    yPos += lineHeight * 2;
    doc.setFontSize(12);

    // Datos básicos
    yPos = addSection('Datos Básicos', yPos);
    yPos = addText(`Fecha y Hora: ${document.getElementById('matchDateTime').value}`, yPos);
    yPos = addText(`Cancha N°: ${document.getElementById('fieldNumber').value}`, yPos);
    yPos += lineHeight;

    // Equipos
    yPos = addSection('Equipos', yPos);
    const homeTeam = document.getElementById('homeTeam');
    const awayTeam = document.getElementById('awayTeam');
    yPos = addText(`Equipo Local: ${homeTeam.options[homeTeam.selectedIndex]?.text || ''}`, yPos);
    yPos = addText(`Equipo Visitante: ${awayTeam.options[awayTeam.selectedIndex]?.text || ''}`, yPos);
    yPos += lineHeight;

    // Cuerpo técnico
    yPos = addSection('Cuerpo Técnico', yPos);
    yPos = addText('Equipo Local:', yPos);
    yPos = addText(`   DT: ${document.getElementById('localCoach').value}`, yPos);
    yPos = addText(`   Ayudante: ${document.getElementById('localAssistant').value}`, yPos);
    yPos = addText('Equipo Visitante:', yPos);
    yPos = addText(`   DT: ${document.getElementById('awayCoach').value}`, yPos);
    yPos = addText(`   Ayudante: ${document.getElementById('awayAssistant').value}`, yPos);
    yPos += lineHeight;

    // Jugadores
    yPos = addSection('Jugadores', yPos);
    yPos = addText('Equipo Local:', yPos);
    document.querySelectorAll('#localTeamPlayers .player-item').forEach(player => {
        const number = player.querySelector('.player-number').value;
        const name = player.querySelector('span').textContent;
        const isCaptain = player.querySelector('.captain-select').checked;
        yPos = addText(`   ${number} - ${name}${isCaptain ? ' (C)' : ''}`, yPos);
    });
    yPos += lineHeight/2;
    yPos = addText('Equipo Visitante:', yPos);
    document.querySelectorAll('#visitanteTeamPlayers .player-item').forEach(player => {
        const number = player.querySelector('.player-number').value;
        const name = player.querySelector('span').textContent;
        const isCaptain = player.querySelector('.captain-select').checked;
        yPos = addText(`   ${number} - ${name}${isCaptain ? ' (C)' : ''}`, yPos);
    });
    yPos += lineHeight;

    // Goles
    yPos = addSection('Goles', yPos);
    document.querySelectorAll('#goalsList .input-group').forEach(goal => {
        const team = goal.querySelector('select').value;
        const number = goal.querySelector('input[placeholder="N° Camiseta"]').value;
        const goals = goal.querySelector('input[placeholder="Cantidad de goles"]').value;
        yPos = addText(`${team === 'local' ? 'Local' : 'Visitante'} - N° ${number}: ${goals} goles`, yPos);
    });
    yPos += lineHeight;

    // Sanciones
    yPos = addSection('Sanciones', yPos);
    document.querySelectorAll('#sanctionsList .input-group').forEach(sanction => {
        const team = sanction.querySelector('select').value;
        const number = sanction.querySelector('input[placeholder="N° Camiseta"]').value;
        const type = sanction.querySelector('select:nth-child(3)').value;
        const desc = sanction.querySelector('input[placeholder="Descripción"]').value;
        yPos = addText(`${team === 'local' ? 'Local' : 'Visitante'} - N° ${number}: ${type} - ${desc}`, yPos);
    });
    yPos += lineHeight;

    // Árbitros
    yPos = addSection('Árbitros', yPos);
    const referees = document.querySelectorAll('#refereesList .input-group');
    referees.forEach((referee, index) => {
        const apellido = referee.querySelector('input[placeholder="Apellido"]').value;
        const dni = referee.querySelector('input[placeholder="DNI"]').value;
        yPos = addText(`${index === 0 ? 'Principal' : `Asistente ${index}`}: ${apellido} - DNI: ${dni}`, yPos);
    });
    yPos += lineHeight;

    // Si la página está llena, agregar nueva página
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }

    // Observaciones
    yPos = addSection('Observaciones', yPos);
    const observations = document.getElementById('observations').value;
    const hasProtest = document.getElementById('hasProtest').checked;
    
    // Dividir observaciones en líneas para que no se salgan del PDF
    const observationLines = doc.splitTextToSize(observations, 170);
    observationLines.forEach(line => {
        yPos = addText(line, yPos);
    });
    
    if (hasProtest) {
        yPos += lineHeight/2;
        doc.setFont(undefined, 'bold');
        yPos = addText('** PLANILLA SUJETA A PROTESTA **', yPos);
    }

    // Agregar pie de página con la fecha de generación
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(8);
    doc.text(`Generado el: ${currentDate}`, margin, 290);

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