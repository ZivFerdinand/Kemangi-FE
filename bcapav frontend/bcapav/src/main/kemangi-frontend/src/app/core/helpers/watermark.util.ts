
export function setWatermark(userName: string) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const watermarkText = `${userName} ${yyyy}-${mm}-${dd}`;

  const reportAreas = document.querySelectorAll('.report-area');
  const reportArea = reportAreas[reportAreas.length - 1] as HTMLElement;
  let container = reportArea.querySelector('.watermark-container') as HTMLElement;
  if (!container) {
    container = document.createElement('div');
    container.className = 'watermark-container';
    reportArea.appendChild(container);
  }
  container.innerHTML = '';

  const areaHeight = reportArea.offsetHeight;
  const areaWidth = reportArea.offsetWidth;
  const stepY = 400;
  const stepX = 600;

  const rows = Math.ceil(areaHeight / stepY);
  const cols = Math.ceil(areaWidth / stepX);
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const wm = document.createElement('div');
      wm.className = 'watermark-clock';
      wm.textContent = watermarkText;
      wm.style.top = `${r * stepY}px`;
      wm.style.left = `${c * stepX}px`;
      container.appendChild(wm);
    }
  }
}