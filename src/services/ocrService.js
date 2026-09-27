export async function preprocessImage(file) {
    const objectUrl = URL.createObjectURL(file);
    try {
        const image = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = objectUrl;
        });

        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth * scale;
        canvas.height = image.naturalHeight * scale;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Could not create image canvas');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = pixels.data;
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            const contrast = Math.max(0, Math.min(255, (gray - 128) * 1.8 + 128));
            data[i] = contrast;
            data[i + 1] = contrast;
            data[i + 2] = contrast;
        }
        ctx.putImageData(pixels, 0, 0);

        return await new Promise((resolve, reject) => {
            canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not encode image')), 'image/png');
        });
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

export async function runTesseract(imageBlob, onProgress) {
    const Tesseract = await import('tesseract.js');
    const result = await Tesseract.recognize(imageBlob, 'eng', {
        logger: (m) => {
            if (m.status === 'recognizing text') {
                const pct = Math.round(m.progress * 100);
                onProgress?.({ status: 'recognizing', progress: pct });
            }
        }
    });
    return { text: result.data.text };
}
