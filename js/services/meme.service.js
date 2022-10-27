const MEMES_STORAGE_KEY = 'memesDB'
const MEME_KEYWORDS = ['Funny', 'Animal', 'Men', 'Women', 'Comic', 'Smile']

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

const initialMemeState = {
  id: makeId(),
  selectedImgId: 5,
  selectedLineIdx: 0,
  isDrag: false,
  lines: [
    {
      txt: 'Type to Edit',
      fontSize: 20,
      fontFamily: 'Impact',
      textAlign: 'left',
      stroke: 'black',
      color: 'red',
      pos: { x: 100, y: 50 },
      txtWidth: 300
    }
  ]
}
let gSavedMemes = []
let gMeme = initialMemeState

function initialMeme() {
  gMeme = JSON.parse(JSON.stringify(initialMemeState))
}

function setIsDrag(drag) {
  gMeme.isDrag = drag
}

function getIsDrag() {
  return gMeme.isDrag
}

function getMeme() {
  return gMeme
}

function setMeme(meme) {
  gMeme = meme
}

function getMemeById(id) {
  return gSavedMemes.find(meme => meme.id === id)
}

function setSelectedImgId(id) {
  gMeme.selectedImgId = id
}

function setSelectedLineIdx(idx) {
  gMeme.selectedLineIdx = idx
}

function selectNextLine() {
  gMeme.selectedLineIdx += 1
  if (gMeme.selectedLineIdx === gMeme.lines.length)
    gMeme.selectedLineIdx = 0
}

function getSelectedLine() {
  const { selectedLineIdx, lines } = gMeme
  return lines[selectedLineIdx]
}

function setLineTxt(txt, txtWidth) {
  const idx = gMeme.selectedLineIdx
  gMeme.lines[idx].txt = txt
  gMeme.lines[idx].txtWidth = txtWidth
}

function setLineAlignment(line, x, align) {
  line.pos.x = x
  line.textAlign = align
}

function getRandomMemeWords() {
  const words = []
  const rndWordCount = getRandomIntInclusive(0, 5)
  for (let i = 0; i < rndWordCount; i++) {
    const rndIdx = getRandomIntInclusive(0, MEME_KEYWORDS.length - 1)
    words.push(MEME_KEYWORDS[rndIdx])
  }

  return words
}

function getLineIdxByCoords(x, y) {
  return gMeme.lines.findIndex(({ txtWidth, fontSize: txtHeight, pos }) =>
    isRectClicked(x, y, pos.x, pos.y, txtWidth, txtHeight))
}

function isTextLinePos(x, y) {
  return gMeme.lines.some(({ txtWidth, fontSize: txtHeight, pos }) =>
    isRectClicked(x, y, pos.x, pos.y, txtWidth, txtHeight))
}

function addTextLine(txt, txtWidth, fontSize, fontFamily,
    textAlign, stroke, color, pos) {

  const newIdx = gMeme.lines.push({
    txt, txtWidth, fontSize,
    fontFamily, textAlign, stroke,
    color, pos,
  })
  setSelectedLineIdx(newIdx - 1)
}

function moveTextLine(dx, dy) {
  const idx = gMeme.selectedLineIdx
  gMeme.lines[idx].pos.x += dx
  gMeme.lines[idx].pos.y += dy
}

function removeTextLine() {
  const idx = gMeme.selectedLineIdx
  setSelectedLineIdx(-1)
  return gMeme.lines.splice(idx, 1)[0]
}

// STORAGE

function saveMeme() {
  const savedMeme = gSavedMemes.find(meme => meme.id === gMeme.id)
  if (!savedMeme) gSavedMemes.push(gMeme)

  saveToLocaStorage(MEMES_STORAGE_KEY, gSavedMemes)
}

function loadSavedMemes() {
  const memes = loadFromLocaStorage(MEMES_STORAGE_KEY) || []
  gSavedMemes = memes
}

function getSavedMemes() {
  return gSavedMemes
}
