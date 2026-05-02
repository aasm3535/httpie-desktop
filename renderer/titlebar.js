const { minimize, maximize, close, isMaximized, onWindowStateChange } = window.electronAPI;

document.getElementById('btn-minimize').addEventListener('click', minimize);
document.getElementById('btn-maximize').addEventListener('click', maximize);
document.getElementById('btn-close').addEventListener('click', close);

const btnMax = document.getElementById('btn-maximize');
const btnRestore = document.getElementById('btn-restore');

btnRestore.addEventListener('click', maximize);

async function updateButtons() {
  const maximized = await isMaximized();
  btnMax.style.display = maximized ? 'none' : 'flex';
  btnRestore.style.display = maximized ? 'flex' : 'none';
}

onWindowStateChange((state) => {
  if (state === 'maximized') {
    btnMax.style.display = 'none';
    btnRestore.style.display = 'flex';
  } else {
    btnMax.style.display = 'flex';
    btnRestore.style.display = 'none';
  }
});

updateButtons();
