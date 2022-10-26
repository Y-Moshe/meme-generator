const MEME_KEYWORDS = ['Funny', 'Animal', 'Men', 'Women', 'Comic', 'Smile']

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

let gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }];
let gMeme = {
  selectedImgId: 5,
  selectedLineIdx: -1,
  lines: [
    {
      txt: 'I sometimes eat Falafel',
      fontSize: 20,
      fontFamily: 'Impact',
      textAlign: 'left',
      stroke: 'black',
      color: 'red',
      pos: { x: 0, y: 0 }
    }
  ]
}

function getImgs() {
  return gImgs
}

function getMeme() {
  return gMeme
}

function setSelectedImgId(id) {
  gMeme.selectedImgId = id
}

function setSelectedLineIdx(idx) {
  gMeme.selectedLineIdx = idx
}

function setLineTxt(txt) {
  const idx = gMeme.selectedLineIdx
  gMeme.lines[idx].txt = txt
}

function getImgById(id) {
  return gImgs.find(img => img.id === id)
}

function addLine(txt, fontSize, fontFamily, textAlign, stroke, color, pos) {
  gMeme.lines.push({
    txt, fontSize, fontFamily,
    textAlign, stroke, color, pos
  })
}

function moveLine(dx, dy) {
  const idx = gMeme.selectedLineIdx
  gMeme.lines[idx].pos.x += dx
  gMeme.lines[idx].pos.y += dy
}

function removeLine() {
  const idx = gMeme.selectedLineIdx
  setSelectedLineIdx(-1)
  return gMeme.lines.splice(idx, 1)[0]
}

function createMemeImg(url, keywords) {
  return {
    id: makeId(),
    url,
    keywords
  }
}
