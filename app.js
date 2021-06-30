const c256 = "█";
const c224 = "▇";
const c192 = "▆";
const c160 = "▅";
const c128 = "▄";
const c96 = "▃";
const c64 = "▂";
const c32 = "▁";

function selectChar(height) {
  if (height < 32) return c32;
  else if (height < 64) return c64;
  else if (height < 96) return c96;
  else if (height < 128) return c128;
  else if (height < 160) return c160;
  else if (height < 192) return c192;
  else if (height < 224) return c224;
  else if (height < 256) return c256;
}

window.onload = function () {
  const file = document.getElementById("file");
  const audio = document.getElementById("audio");
  const wave = document.getElementById("wave");

  file.onchange = function () {
    const files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    let height;

    const step = Math.floor(bufferLength / 16);
    function renderWave() {
      requestAnimationFrame(renderWave);
      analyser.getByteFrequencyData(dataArray);

      let waveContent = "";
      for (let i = 0; i < bufferLength; i += step) {
        height = dataArray[i];
        const selectedChar = selectChar(height);
        waveContent += selectedChar;
      }
      wave.innerHTML = waveContent;
      window.parent.location.hash = `#~${waveContent}`;
      document.title = waveContent;
    }

    audio.play();
    renderWave();
  };
};
