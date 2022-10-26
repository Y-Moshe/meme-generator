let gCanvas = document.createElement('canvas')
let gCtx = gCanvas.getContext('2d')

const CANVAS_SIZE = 200

function renderMeme() {
  // Hide Gallery
  document.querySelector('.gallery-container')
    .setAttribute('hidden', true)

  const { selectedImgId } = getMeme()
  const { url } = getImgById(selectedImgId)
  renderImgToCanvas(url)
}

function renderImgToCanvas(url) {
  const img = new Image(CANVAS_SIZE, CANVAS_SIZE)
  img.onload = drawImg
  img.src = url
  gCanvas = document.querySelector('.meme-editor')
  gCtx = gCanvas.getContext('2d')
}

function drawImg() {
  gCtx.drawImage(this, 0, 0, gCanvas.width, gCanvas.height)
}
