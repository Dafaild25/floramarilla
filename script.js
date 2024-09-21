document.addEventListener('DOMContentLoaded', () => {
    // Selecciona los dos videos
    const videoOriginal = document.getElementById('video-original');
    const videoAlternativo = document.getElementById('video-alternativo');

    // Selecciona el contenedor de texto
    const containerTexto = document.querySelector('.container-texto');

    // Verifica si los videos y el contenedor existen antes de añadir los eventos
    if (containerTexto && videoOriginal && videoAlternativo) {
        // Cambia al video alternativo cuando el mouse entra en el contenedor de texto
        containerTexto.addEventListener('mouseenter', () => {
            videoAlternativo.style.opacity = 1; // Muestra el video alternativo
            videoOriginal.style.opacity = 0;    // Oculta el video original
        });

        // Vuelve al video original cuando el mouse sale del contenedor de texto
        containerTexto.addEventListener('mouseleave', () => {
            videoAlternativo.style.opacity = 0; // Oculta el video alternativo
            videoOriginal.style.opacity = 1;    // Muestra el video original
        });
    } else {
        console.error('Uno o más elementos no se encuentran en el DOM.');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-control');
    const btnAudio = document.getElementById('btn-audio');
    const canvas = document.getElementById('audio-visualizer');
    const canvasCtx = canvas.getContext('2d');

    let audioContext;
    let analyser;
    let dataArray;
    let bufferLength;

    // Inicializa el contexto de audio y el analizador
    function setupAudioContext() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audio);

        analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256; // Cambia el tamaño de la FFT para controlar el detalle
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }

    // Función para dibujar las frecuencias
    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            const r = barHeight + 25 * (i / bufferLength);
            const g = 250 * (i / bufferLength);
            const b = 50;

            canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    // Controla la reproducción del audio y el análisis de frecuencia
    btnAudio.addEventListener('click', () => {
        if (!audioContext) {
            setupAudioContext();
        }

        if (audio.paused) {
            audio.play();
            audioContext.resume();
            btnAudio.textContent = 'Pausar'; // Cambia el texto a "Pausar"
            draw(); // Inicia el efecto de frecuencia
        } else {
            audio.pause();
            btnAudio.textContent = 'Reproducir'; // Cambia el texto a "Reproducir"
        }
    });
});