const FONT_OPTIONS = [
  'Impact', 'cursive', 'monospace',
  'fantasy', 'serif', 'sans-serif'
]
const RENDER_COMPONENTS = {
  GALLERY: '.gallery-container',
  EDITOR: '.meme-generator',
  MY_MEMES: '.my-memes'
}
const GALLERY_SIZE = 25

function onInit() {
  initImgs()
  initKeywords()
  loadSavedMemes()

  renderKeywordsList()
  renderStickers()
  renderDataList()
  renderFontOptions()

  initCanvas()
  render(RENDER_COMPONENTS.GALLERY)
}

function initImgs() {
  loadImgs()
  let imgs = getImgs()
  if (imgs.length > 0) return // skip incase already exists in localStorage

  imgs = new Array(GALLERY_SIZE).fill().map((_, idx) =>
    createImg(idx + 1, `assets/img/${idx + 1}.jpg`, getRandomMemeWords()))

  setImgs(imgs)
  saveImgs()
}

function renderDataList() {
  const keywords = MEME_KEYWORDS
    .map(key => `<option value="${key}" />`)
  
  document.getElementById('meme-list')
    .innerHTML = keywords.join('')
}

function renderFontOptions() {
  const fonts = FONT_OPTIONS
    .map(key => `<option value="${key}">${key}</option>`)

  document.querySelector('.meme-controls .font-select')
    .innerHTML = fonts.join('')
}

function renderKeywordsList() {
  const keywords = MEME_KEYWORDS.map(renderKeywordItem)

  document.querySelector('.filters .keywords')
    .innerHTML = keywords.join(' ')
}

function renderKeywordItem(word) {
  return `<span class="word" style="font-size: ${getKeywordVal(word)}px"
    onclick="onKeywordClick('${word}')">${word}</span>`
}

function onKeywordClick(word) {
  increaseKeywordPopularity(word)
  renderKeywordsList()
  setFilter(word)
  renderGallery()
}

function renderGallery() {
  const gallery = getImgs().map(renderGalleryItem)
  gallery.unshift(`
    <div class="gallery-item user-img-select"
      onclick="document.querySelector('.user-img').click()">
      <div class="flex flex-col algin align-center m-auto">
        <i class="fa-solid fa-plus"></i>
        <i class="fa-solid fa-image"></i>
      </div>
    </div>
  `)

  document.querySelector('.gallery')
    .innerHTML = gallery.join('')
}

function loadUserImg(event) {
  const file = event.target.files[0]
  const fileReader = new FileReader()
  fileReader.onload = () => {
    const id = generateImgId()
    addImg(id, fileReader.result)
    onImgSelect(id)
  }

  fileReader.readAsDataURL(file)
}

function renderGalleryItem({ id, url }) {
  return `
    <div class="gallery-item" onclick="onImgSelect(${id})">
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

function renderSavedGalleryItem(memeId, { id, previewUrl }) {
  return `
    <div class="gallery-item" onclick="onImgSelect(${id}, '${memeId}')">
      <div class="gallery-item-overlay"></div>
      <img src="${previewUrl}" alt="${id} img" class="gallery-item-img" />
    </div>
  `
}

function onImgSelect(id, memeId) {
  initialMeme()
  setSelectedImgId(id)

  if (memeId) {
    setMeme(getMemeById(memeId))
    renderMeme()
  } else renderMeme(() => generateStartTxt())

  displayComponent(RENDER_COMPONENTS.EDITOR)
}

function generateStartTxt() {
  const txt = 'Type to start Edit!'
  const txtWidth = gCtx.measureText(txt).width

  addTextLine(txt, txtWidth, 20, 'Impact',
    'center', 'red', 'white', getCenterPos(txtWidth))

  renderCanvas()
}

function render(component) {
  const elMyMemes = document.querySelector('.main-nav ul a.my-memes-lnk')
  const elLink = document.querySelector('.main-nav ul a.gallery-lnk')

  switch (component) {
    case RENDER_COMPONENTS.GALLERY:
      setActiveNavLink(elLink)
      renderGallery()
      break;
    case RENDER_COMPONENTS.EDITOR:
      renderMeme()
      break;
    case RENDER_COMPONENTS.MY_MEMES:
      setActiveNavLink(elMyMemes)
      renderSavedGallery()
      break;
  }

  displayComponent(component)
}

function displayComponent(component) {
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

function onFilterChange(filter) {
  setFilter(filter)
  renderGallery()
}

function generateMeme() {
  initialMeme()
  const rndId = getRandomIntInclusive(1, GALLERY_SIZE)
  setSelectedImgId(rndId)

  const rndLines = getRandomIntInclusive(1, 3)
  renderMeme(() => generateLines(rndLines))

  displayComponent(RENDER_COMPONENTS.EDITOR)
}

function generateLines(linesCount) {
  const maxWidth = gCanvas.width

  for (let i = 0; i < linesCount; i++) {
    const rndWords = getRandomIntInclusive(1, 5)

    let lineTxt = makeLorem(rndWords)
    let lineWidth = gCtx.measureText(lineTxt).width

    const pos = {
      x: getRandomIntInclusive(10, maxWidth),
      y: getRandomIntInclusive(10, gCanvas.height)
    }

    if (lineWidth > maxWidth - pos.x) {
      lineTxt = lineTxt.slice(0, maxWidth)
      lineWidth = gCtx.measureText(lineTxt).width
    }

    const rndFontSize = getRandomIntInclusive(16, 20)
    addTextLine(lineTxt, lineWidth, rndFontSize, 'Impact',
      'center', getRandomColor(), getRandomColor(), pos)
  }

  renderCanvas()
}
