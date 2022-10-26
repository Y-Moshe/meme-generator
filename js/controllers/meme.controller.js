let gCanvas = document.createElement('canvas')
let gCtx = gCanvas.getContext('2d')
let gCanvasBgImg
let gLastPos

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
    const { txt, txtWidth, fontSize, fontFamily,
      color, stroke, pos, textAlign } = line
    
    gCtx.font = `${fontSize}px ${fontFamily} ${color}`
    gCtx.textAlign = textAlign
    
    const txtStartHeight = pos.y + fontSize
    gCtx.strokeStyle = stroke
    gCtx.strokeText(txt, pos.x, txtStartHeight)
    gCtx.fillStyle = color
    gCtx.fillText(txt, pos.x, txtStartHeight)

    // if (idx === selectedLineIdx) txtWidth = gCanvas.width
    gCtx.rect(pos.x, pos.y, txtWidth, fontSize)
  })
}

// MOUSE EVENTS

function onMouseDown(event) {
  const { x, y } = getEventPos(event)

  const lineIdx = getLineIdxByCoords(x, y)
  if (lineIdx >= 0) {
    setIsDrag(true)
    setSelectedLineIdx(lineIdx)
    setUserCursor('grabbing')
    setLineMark(true, true)
  }

  gLastPos = { x, y }
}

function setLineMark(isMark, isAllLine = false) {
  let { stroke, txtWidth, fontSize: txtHeight, pos } = getSelectedLine()
  let { x, y } = pos
  if (isAllLine) {
    txtWidth = gCanvas.width
    x = 0
  }

  gCtx.strokeStyle = isMark ? stroke : 'transparent'
  gCtx.strokeRect(x, y, txtWidth, txtHeight)
}

function onMouseMove(event) {
  const { x, y } = getEventPos(event)

  if (getIsDrag()) {
    const dx = x - gLastPos.x
    const dy = y - gLastPos.y
    moveTextLine(dx, dy)
    gLastPos = { x, y }
    renderCanvas()
    return
  }

  if (isTextLinePos(x, y)) setUserCursor('grab')
  else setUserCursor('unset')
}

function onMouseUp(event) {
  setIsDrag(false)
  setLineMark(false, false)
  setUserCursor('unset')
}

function setUserCursor(cursor) {
  document.body.style.cursor = cursor
}

// INPUT EVENTS

function onTextChange(txt) {
  setLineTxt(txt, gCtx.measureText(txt).width)
  renderCanvas()
}

function onAddText() {
  const txt = 'New Text'
  const txtWidth = gCtx.measureText(txt).width
  addTextLine(txt, txtWidth, 16, 'Impact',
    'left', 'black', 'black', getCenterPos())
  renderCanvas()
}

function onRemoveText() {
  const txt = getSelectedLine().txt
  if (confirm(`Are you sure to delete "${txt}"`)) {
    removeTextLine()
    renderCanvas()
  }
}

function onNextText() {
  selectNextLine()
  setInputFocus()
  renderCanvas()
  setLineMark(true, true)
}

function setInputFocus() {
  document.querySelector('.editor-textbox').focus()
}

function getCenterPos() {
  return {
    x: gCanvas.width / 2,
    y: gCanvas.height / 2
  }
}

// CONTROLS EVENTS

function onFontSizeChange(isIncrease) {

}

// left, center, right
function onAlignText(align) {

}

function onFontFamilyChange(fontFamily) {

}

function onColorPick() {

}

function onColorChange(event) {
  console.log('color event', event)
}
