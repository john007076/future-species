import * as THREE from 'three';

function waitForMedia(element, events, ready, start, label) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      events.forEach(event => element.removeEventListener(event, loaded));
      element.removeEventListener('error', failed);
    };
    const loaded = () => { if (ready()) { cleanup(); resolve(); } };
    const failed = () => { cleanup(); reject(new Error(`Cannot decode this${label}. Choose a browser-supported format.`)); };
    const timer = setTimeout(() => { cleanup(); reject(new Error(`${label}Loading exceeded 20 seconds. Retry or choose a smaller file.`)); }, 20000);
    events.forEach(event => element.addEventListener(event, loaded));
    element.addEventListener('error', failed);
    try { start(); loaded(); } catch (error) { cleanup(); reject(error); }
  });
}

export async function createLocalMedia(file) {
  if (!(file instanceof File) || file.size === 0) throw new TypeError('Choose a non-empty local image or video.');
  const mime = file.type.toLowerCase(), name = file.name.toLowerCase();
  const isVideo = mime.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogv|ogg)$/.test(name);
  const isImage = mime.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|avif|svg|ico|heic|heif)$/.test(name);
  if (!isVideo && !isImage) throw new TypeError('Unsupported image or video type.');
  const url = URL.createObjectURL(file);
  let texture, video, image, disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    texture?.dispose();
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    image?.removeAttribute('src');
    URL.revokeObjectURL(url);
  };
  try {
    let width, height;
    if (isVideo) {
      video = document.createElement('video');
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      await waitForMedia(video, ['loadeddata', 'canplay'], () => video.readyState >= 2 && video.videoWidth > 0, () => {
        video.src = url;
        video.load();
        video.play().catch(() => {}); // A blocked autoplay still permits displaying the decoded first frame.
      }, 'video');
      texture = new THREE.VideoTexture(video);
      width = video.videoWidth;
      height = video.videoHeight;
    } else {
      image = new Image();
      image.decoding = 'async';
      await waitForMedia(image, ['load'], () => image.complete && image.naturalWidth > 0, () => { image.src = url; }, 'image');
      texture = new THREE.Texture(image);
      width = image.naturalWidth;
      height = image.naturalHeight;
    }
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return {texture, video, url, width, height, aspect: width / height, dispose};
  } catch (error) {
    dispose();
    throw error;
  }
}
