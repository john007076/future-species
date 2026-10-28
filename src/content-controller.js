export function createContentController({screens, originals, loadTexture, makeTexture}) {
  const versions = new Map(), owned = new Map(), external = new WeakSet();

  function begin(id) {
    const screen = screens.get(id);
    if (!screen) throw new Error('Unknown screen: ' + id);
    const version = (versions.get(id) || 0) + 1;
    versions.set(id, version);
    return {screen, version};
  }

  function release(texture) {
    if (!texture || external.has(texture)) return;
    if ([...originals.values()].includes(texture)) return;
    if ([...screens.values()].some(screen => screen.material.map === texture)) return;
    texture.dispose();
  }

  function apply(id, screen, texture, isOwned) {
    const previous = owned.get(id);
    owned.delete(id);
    if (isOwned) owned.set(id, texture);
    screen.material.map = texture;
    screen.material.emissiveMap = texture;
    screen.material.needsUpdate = true;
    if (previous !== texture) release(previous);
  }

  async function setScreenContent(id, source) {
    const {screen, version} = begin(id);
    const result = typeof source === 'string'
      ? {texture: await loadTexture(source), owned: true}
      : makeTexture(source);
    if (!result?.texture?.isTexture) throw new TypeError('Screen content must produce a texture.');
    const {texture, owned: isOwned} = result;
    if (!isOwned) external.add(texture);
    if (versions.get(id) !== version) {
      if (isOwned) release(texture);
      return null;
    }
    apply(id, screen, texture, isOwned);
    return texture;
  }

  function restoreScreenContent(id) {
    const {screen} = begin(id);
    apply(id, screen, originals.get(id), false);
  }

  return {setScreenContent, restoreScreenContent};
}
