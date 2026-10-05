import * as pdfjsLib from '../assets/vendor/pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('../assets/vendor/pdfjs/pdf.worker.mjs', import.meta.url).href;

const defaultOutputScale = 3;

async function renderPdfStrip(strip) {
  const status = strip.querySelector('.pdf-render-status');
  const source = strip.dataset.pdfSrc;
  const outputScale = Math.min(4, Math.max(defaultOutputScale, Number(strip.dataset.pdfRenderScale) || defaultOutputScale));

  try {
    const pdf = await pdfjsLib.getDocument(source).promise;
    const firstPage = await pdf.getPage(1);
    const sourceViewport = firstPage.getViewport({ scale: 1 });
    const aspectRatio = `${sourceViewport.width} / ${sourceViewport.height}`;
    const frames = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const frame = document.createElement('div');
      frame.className = 'pdf-page-frame';
      frame.style.aspectRatio = aspectRatio;
      frame.setAttribute('aria-label', `设计文本第 ${pageNumber} 页`);
      strip.append(frame);
      frames.push(frame);
    }

    async function renderPage(pageNumber, suppliedPage) {
      const frame = frames[pageNumber - 1];
      if (!frame || frame.dataset.rendered || frame.dataset.rendering) return;
      frame.dataset.rendering = 'true';

      try {
        const page = suppliedPage || await pdf.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const cssScale = frame.clientWidth / baseViewport.width;
        const renderViewport = page.getViewport({ scale: cssScale * outputScale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { alpha: false });

        canvas.width = Math.ceil(renderViewport.width);
        canvas.height = Math.ceil(renderViewport.height);
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.setAttribute('aria-label', `设计文本第 ${pageNumber} 页`);

        await page.render({ canvasContext: context, viewport: renderViewport }).promise;
        frame.replaceChildren(canvas);
        frame.dataset.rendered = 'true';
      } catch (error) {
        frame.textContent = `第 ${pageNumber} 页加载失败，请刷新页面重试。`;
        frame.classList.add('pdf-page-error');
        console.error(`Unable to render PDF page ${pageNumber}`, error);
      } finally {
        delete frame.dataset.rendering;
      }
    }

    await renderPage(1, firstPage);
    status?.remove();
    renderPage(2);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = frames.indexOf(entry.target) + 1;
          renderPage(pageNumber);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '1400px 0px', threshold: 0 });

    frames.forEach((frame) => observer.observe(frame));
  } catch (error) {
    status.textContent = '高清设计文本加载失败，请刷新页面后重试。';
    console.error('Unable to load PDF', error);
  }
}

document.querySelectorAll('[data-pdf-src]').forEach(renderPdfStrip);
