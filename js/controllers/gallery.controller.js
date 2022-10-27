const RENDER_COMPONENTS = {
  GALLERY: '.gallery-container',
  EDITOR: '.meme-generator',
  MY_MEMES: '.my-memes',
  ABOUT: '.about'
}

function onInit() {
  initImgs()
  renderKeywordsList()
  initCanvas()
  render(RENDER_COMPONENTS.GALLERY)
}

function initImgs() {
  gImgs = []
  for (let i = 1; i <= 18; i++) {
    gImgs.push(createMemeImg(`assets/img/${i}.jpg`, ['test', 'gol']))
  }
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

function renderGalleryItem({ id, url, keywords }) {
  const badges = keywords.map(key => `<span class="gallery-badge">${key}</span>`)

  return `
    <div class="gallery-item" onclick="onImgSelect('${id}')">
      <img src="${url}" alt="${id} img" class="gallery-item-img" />
      <div class="gallery-item-keywords">${badges.join('')}</div>
    </div>
  `
}

function onImgSelect(id) {
  setSelectedImgId(id)
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
      // TO-DO
      break;
    case RENDER_COMPONENTS.ABOUT:
        const elAbout = document.querySelector('.main-nav ul a.about-lnk')
        setActiveNavLink(elAbout)
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
