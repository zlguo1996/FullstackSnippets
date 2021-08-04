/**
 * 缩放图片
 */

/**
 * 缩放图片，只提供一个维度后会等比例缩放
 * @param {string} imgSrc 图片链接
 * @param {object} targetDimension 目标图片大小
 * @returns 缩放后图片的canvas 
 */
export async function resizeImage(imgSrc, targetDimension = {}) {
    const img = document.createElement('img');
    img.src = imgSrc;

    // 获取源图片长宽
    const { width: sWidth, height: sHeight } = await new Promise((resolve, reject) => {
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
            });
        };
        img.onerror = () => {
            reject(new Error('Load img error'));
        };
    });

    // 计算新图片长宽
    const { width, height } = targetDimension;
    let dWidth = width, dHeight = height;
    if ((!dWidth) ^ (!dHeight)) { // 只有一者存在，保持aspectRatio
        if (!dWidth) {
            dWidth = height / sHeight * sWidth;
        } else {
            dHeight = dWidth / sWidth * sHeight;
        }
    } else if (!dWidth && !dHeight) { // 两者都不存在，保持原大小
        dWidth = sWidth;
        dHeight = sHeight;
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = dWidth;
    canvas.height = dHeight;
    ctx.drawImage(img, 0, 0, dWidth, dHeight);

    // export
    return canvas;
}

/**
 * 缩放图片文件
 * @param {*} file 图片文件
 * @param {*} targetDimension 目标大小
 * @returns 缩放后的blob
 */
export async function resizeImageFile(file, targetDimension = {}) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const url = await new Promise((resolve, reject) => {
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = () => {
            reject(new Error('Read file error'));
        };
    });

    const canvas = await resizeImage(url, targetDimension);

    const blob = await new Promise((resolve) => {
        canvas.toBlob((b) => { resolve(b); }, file.type);
    });

    return blob;
}
