let gCanvas = document.createElement('canvas')
let gCtx = gCanvas.getContext('2d')
let gCanvasBgImg

function initCanvas() {
  gCanvas = document.querySelector('.meme-editor')
  gCanvas.addEventListener('touchstart', onMouseDown)
  gCanvas.addEventListener('touchmove', onMouseMove)
  gCanvas.addEventListener('touchend', onMouseUp)
  gCanvas.addEventListener('mousedown', onMouseDown)
  gCanvas.addEventListener('mousemove', onMouseMove)
  gCanvas.addEventListener('mouseup', onMouseUp)
  // gCanvas.addEventListener('click')

  gCtx = gCanvas.getContext('2d')
}

function renderMeme() {
  const { selectedImgId } = getMeme()
  const { url } = getImgById(selectedImgId)
  const img = new Image(200, 200)
  img.onload = drawImageActualSize
  img.src = url
  gCanvasBgImg = img

  renderCanvas()
}

function drawImageActualSize() {
  gCanvas.width = this.naturalWidth
  gCanvas.height = this.naturalHeight
  gCtx.drawImage(this, 0, 0, gCanvas.width, gCanvas.height)
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function renderCanvas() {
  clearCanvas()
  gCtx.drawImage(gCanvasBgImg, 0, 0, gCanvas.width, gCanvas.height)

  const { selectedLineIdx, lines } = getMeme()
  lines.forEach((line, idx) => {
    gCtx.font = `${line.fontSize}px ${line.fontFamily}`
    gCtx.textAlign = line.textAlign
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = line.stroke
    gCtx.strokeText(line.txt, line.pos.x, line.pos.y + line.fontSize)

    let txtWidth = gCtx.measureText(line.txt).width
    if (idx === selectedLineIdx) txtWidth = gCanvas.width
    gCtx.strokeRect(line.pos.x, line.pos.y, txtWidth, line.size)
  })
}

function onTextChange(txt) {
  setLineTxt(txt)
  renderCanvas()
}

function onMouseDown(event) {

}

function onMouseMove(event) {

}

function onMouseUp(event) {

}

