const RENDER_COMPONENTS = {
  GALLERY: '.gallery-container',
  EDITOR: '.meme-generator',
  MY_MEMES: '.my-memes'
}
const GALLERY_SIZE = 18

function onInit() {
  initImgs()
  loadSavedMemes()
  renderKeywordsList()
  renderStickers()
  initCanvas()
  render(RENDER_COMPONENTS.GALLERY)
}

function initImgs() {
  loadImgs()
  let imgs = getImgs()
  if (imgs.length > 0) return // skip incase already exists in localStorage

  imgs = new Array(GALLERY_SIZE).fill().map((_, idx) =>
    createImg(makeId(), `assets/img/${idx + 1}.jpg`, getRandomMemeWords()))

  setImgs(imgs)
}

function renderKeywordsList() {
  const keywords = MEME_KEYWORDS.map(renderKeywordItem)

  document.querySelector('.filters .keywords')
    .innerHTML = keywords.join(' ')
}

function renderKeywordItem(word) {
  return `<span class="word">${word}</span>`
}

function renderGallery() {
  const gallery = getImgs().map(renderGalleryItem)

  document.querySelector('.gallery')
    .innerHTML = gallery.join('')
}

function renderGalleryItem({ id, url }) {
  return `
    <div class="gallery-item" onclick="onImgSelect('${id}')">
      <div class="gallery-item-overlay"></div>
      <img src="${url}" alt="${id} img" class="gallery-item-img" />
    </div>
  `
}

function renderSavedGallery() {
  const gallery = getSavedImgs().map(({ memeId, img }) =>
    renderSavedGalleryItem(memeId, img))

  document.querySelector('.my-memes')
    .innerHTML = gallery.join('')
}

function renderSavedGalleryItem(memeId, { id, url }) {
  return `
    <div class="gallery-item" onclick="onImgSelect('${id}', '${memeId}')">
      <div class="gallery-item-overlay"></div>
      <img src="${url}" alt="${id} img" class="gallery-item-img" />
    </div>
  `
}

function onImgSelect(id, memeId) {
  setSelectedImgId(id)

  initialMeme()
  if (memeId) setMeme(getMemeById(memeId))
  render(RENDER_COMPONENTS.EDITOR)
}

function render(component) {
  switch (component) {
    case RENDER_COMPONENTS.GALLERY:
      const elLink = document.querySelector('.main-nav ul a.gallery-lnk')
      setActiveNavLink(elLink)
      renderGallery()
      break;
    case RENDER_COMPONENTS.EDITOR:
      renderMeme()
      break;
    case RENDER_COMPONENTS.MY_MEMES:
      const elMyMemes = document.querySelector('.main-nav ul a.my-memes-lnk')
      setActiveNavLink(elMyMemes)
      renderSavedGallery()
      break;
  }

  // Display and hide relevent component
  document.querySelector('main > section:not(.hide)')
    ?.classList.add('hide')
  document.querySelector(`main > section${component}`)
    ?.classList.remove('hide')
}

function onNavigateChange(component) {
  render(component)
}

function setActiveNavLink(elActiveLink) {
  document.querySelector('.main-nav ul a.active-link')
    ?.classList.remove('active-link')
  elActiveLink?.classList.add('active-link')
}

function renderStickers() {
  const faces = getStickersChars().map(renderSticker)

  document.querySelector('.meme-faces')
    .innerHTML = faces.join('')
}

function renderSticker(sticker, idx) {
  return `<span class="face" draggable="true"
    ondragstart="onStickerDragStart(${idx})">${sticker}</span>`
}
