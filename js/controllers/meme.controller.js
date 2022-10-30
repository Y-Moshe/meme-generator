const CANVAS_WIDTH = 500
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
  gCanvas.addEventListener('dragover', e => e.preventDefault())
  gCanvas.addEventListener('drop', onStickerDrop)
  // gCanvas.addEventListener('click')

  gCtx = gCanvas.getContext('2d')
}

function renderMeme(onInitMeme = null) {
  const { selectedImgId } = getMeme()
  const { url } = getImgById(selectedImgId)
  const img = new Image(200, 200)
  img.onload = () => {
    drawImageActualSize(img)
    onInitMeme && onInitMeme()
  }
  img.src = url
  gCanvasBgImg = img
}

function drawImageActualSize(img) {
  gCanvas.width = CANVAS_WIDTH
  gCanvas.height = img.naturalHeight * gCanvas.width / img.naturalWidth
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
  renderCanvas()
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function renderCanvas() {
  clearCanvas()
  gCtx.drawImage(gCanvasBgImg, 0, 0, gCanvas.width, gCanvas.height)

  const { lines, stickers } = getMeme()
  lines.forEach((line, idx) => {
    const { txt, txtWidth, fontSize, fontFamily,
      color, stroke, pos, textAlign } = line
    
    gCtx.font = `${fontSize}px ${fontFamily}`
    gCtx.textBaseline = 'alphabetic' // default
    gCtx.textAlign = 'start' // default
    setTextAlignment(textAlign, lines[idx])
    
    const txtStartHeight = pos.y + fontSize
    gCtx.strokeStyle = stroke
    gCtx.strokeText(txt, pos.x, txtStartHeight)
    gCtx.fillStyle = color
    gCtx.fillText(txt, pos.x, txtStartHeight)

    gCtx.rect(pos.x, pos.y, txtWidth, fontSize)
  })

  stickers.forEach(_ => {
    const { sticker, fontSize, pos, radius, fontFamily } = _
    
    gCtx.font = `${fontSize}px ${fontFamily}`
    gCtx.textBaseline = 'middle'
    gCtx.textAlign = 'center'
    gCtx.fillText(sticker, pos.x, pos.y)

    gCtx.beginPath()
    gCtx.arc(pos.x, pos.y, radius, 0, 360)
    gCtx.closePath()
  })
}

// MOUSE EVENTS

function onMouseDown(event) {
  event.preventDefault() // to allow loadLineFocus
  const { x, y } = getEventPos(event)

  const lineIdx = getLineIdxByCoords(x, y)
  if (lineIdx >= 0) {
    setSelectedLineIdx(lineIdx)
    setLineMark(true, true)
    setTextAlignment('dragged')
    loadLineTxt()
  }

  const stickerIdx = getStickerIdxByCoords(x, y)
  if (stickerIdx >= 0) {
    setSelectedStickerIdx(stickerIdx)
  }

  if (stickerIdx >= 0 || lineIdx >= 0) {
    setUserCursor('grabbing')
    setIsDrag(true)
  }

  gLastPos = { x, y }
}

function loadLineTxt() {
  const elTxt = document.querySelector('.editor-textbox')
  const { txt } = getSelectedLine()
  elTxt.value = txt
  elTxt.focus()
}

function setLineMark(isMark, isAllLine = false) {
  let { txtWidth, fontSize, pos } = getSelectedLine()
  let { x, y } = pos
  const margin = 10
  const txtHeight = fontSize + 10

  if (isAllLine) {
    txtWidth = gCanvas.width - margin * 2
    x = margin
  }

  gCtx.lineJoin = 'round'
  gCtx.fillStyle = 'rgba(255, 255, 255, 0.25)'
  gCtx.fillRect(x, y, txtWidth, txtHeight)
  gCtx.strokeStyle = isMark ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
  gCtx.strokeRect(x, y, txtWidth, txtHeight)
}

function onMouseMove(event) {
  const { x, y } = getEventPos(event)

  if (getIsDrag()) {
    const dx = x - gLastPos.x
    const dy = y - gLastPos.y

    if (isTextLinePos(x, y)) moveTextLine(dx, dy)
    else if (isStickerPos(x, y)) moveSticker(dx, dy)

    gLastPos = { x, y }
    renderCanvas()
    return
  }

  if (isTextLinePos(x, y) || isStickerPos(x, y)) setUserCursor('grab')
  else setUserCursor('unset')
}

function onMouseUp(event) {
  setIsDrag(false)
  setLineMark(false, false)
  setUserCursor('unset')
}

function onStickerDrop(event) {
  event.preventDefault()

  const { x, y } = getEventPos(event)
  const sticker = getStickerCharByIdx(getSelectedStickerIdx())
  const radius = gCtx.measureText(sticker).width / 2
  addSticker(sticker, { x, y, }, radius)
  renderCanvas()
}

function onStickerDragStart(stickerIdx) {
  setSelectedStickerIdx(stickerIdx)
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
  gCtx.font = '20px Impact'
  const txt = 'New Text'
  const txtWidth = gCtx.measureText(txt).width

  addTextLine(txt, txtWidth, 20, 'Impact', 'center',
    getRandomColor(), getRandomColor(), getCenterPos(txtWidth))

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
  renderCanvas()
  setLineMark(true, true)
}

function getCenterPos(lineWidth) {
  return {
    x: (gCanvas.width / 2) - (lineWidth / 2),
    y: gCanvas.height / 2
  }
}

// CONTROLS EVENTS

function onFontSizeChange(isIncrease) {
  if (getLastSelectedItem() === SELECTED_ITEMS.LINE) {
    const line = getSelectedLine()
    isIncrease ? line.fontSize++ : line.fontSize--
    onTextChange(line.txt)
  } else if (getLastSelectedItem() === SELECTED_ITEMS.STICKER) {
    const sticker = getSelectedSticker()
    isIncrease ? sticker.fontSize++ : sticker.fontSize--
    const radius = gCtx.measureText(sticker.sticker).width / 2
    sticker.radius = radius
  }

  renderCanvas()
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
  if (getLastSelectedItem() === SELECTED_ITEMS.LINE) {
    const line = getSelectedLine()
    line.fontFamily = fontFamily
    onTextChange(line.txt)
  } else if (getLastSelectedItem() === SELECTED_ITEMS.STICKER) {
    const sticker = getSelectedSticker()
    sticker.fontFamily = fontFamily
    const radius = gCtx.measureText(sticker.sticker).width / 2
    sticker.radius = radius
  }

  renderCanvas()
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
  event.preventDefault()
  const imgDataUrl = gCanvas.toDataURL('image/jpeg')

  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`, '_black')
  }

  doUploadImg(imgDataUrl, onSuccess)
}

function onSave(event) {
  event.preventDefault()
  const previewUrl = gCanvas.toDataURL()

  const { selectedImgId } = getMeme()
  const { url } = getImgById(selectedImgId)

  const id = generateImgId()
  addImg(id, url, previewUrl)
  setSelectedImgId(id)
  saveMeme()
}

function onDownload(elDownload) {
  const url = gCanvas.toDataURL()
  elDownload.href = url
  elDownload.setAttribute('download', 'meme-generated')
}
