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

  const { lines } = getMeme()
  lines.forEach((line, idx) => {
    const { txt, txtWidth, fontSize, fontFamily,
      color, stroke, pos, textAlign } = line
    
    gCtx.font = `${fontSize}px ${fontFamily}`
    setTextAlignment(textAlign, lines[idx])
    
    const txtStartHeight = pos.y + fontSize
    gCtx.strokeStyle = stroke
    gCtx.strokeText(txt, pos.x, txtStartHeight)
    gCtx.fillStyle = color
    gCtx.fillText(txt, pos.x, txtStartHeight)

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
    setTextAlignment('dragged')
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
    'center', 'black', 'black', getCenterPos(txtWidth))
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

function getCenterPos(lineWidth) {
  return {
    x: (gCanvas.width / 2) - (lineWidth / 2),
    y: gCanvas.height / 2
  }
}

// CONTROLS EVENTS

function onFontSizeChange(isIncrease) {
  const line = getSelectedLine()
  isIncrease ? line.fontSize++ : line.fontSize--
  renderCanvas()
  onTextChange(line.txt)
}

// left, center, right
function onAlignText(align) {
  setTextAlignment(align)
  renderCanvas()
}

function setTextAlignment(align, line = null) {
  if (getIsDrag() && align !== 'dragged') return
  if (!line) line = getSelectedLine()
  let x = line.pos.x
  switch (align) {
    case 'left':
      x = 0
      break;
    case 'center':
      x = getCenterPos(line.txtWidth).x
      break;
    case 'right':
      x = gCanvas.width - line.txtWidth
      break;
  }
  setLineAlignment(line, x, align)
}

function onFontFamilyChange(fontFamily) {
  const line = getSelectedLine()
  line.fontFamily = fontFamily
  renderCanvas()
  onTextChange(line.txt)
}

function onColorPick(type) {
  const colorPicker = document.querySelector('.color-picker')
  colorPicker.click()
  colorPicker.dataset.type = type
}

function onColorChange(elColor, color) {
  const type = elColor.dataset.type

  const line = getSelectedLine()
  line[type] = color
  renderCanvas()
  onTextChange(line.txt)
}

// DOWNLOAD & SHARE

function onShare(event) {
  const imgDataUrl = gCanvas.toDataURL('image/jpeg')
  event.preventDefault()

  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`, '_black')
  }
  // Send the image to the server
  doUploadImg(imgDataUrl, onSuccess)
}

function onDownload(elDownload) {
  const url = gCanvas.toDataURL()
  elDownload.href = url
  elDownload.setAttribute('download', 'meme-generated')
}

