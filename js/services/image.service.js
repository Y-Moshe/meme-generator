const IMGS_STORAGE_KEY = 'imgsDB'

let gImgs = []
let gStickers = ['😆', '😎', '😢', '😁', '😉', '😒', '😍', '😂', '🤣','😜']
let gFilter = ''

function getStickersChars() {
  return gStickers
}

function getStickerCharByIdx(idx) {
  return gStickers[idx]
}

function getImgs() {
  return gFilter.trim() ?
    gImgs.filter(img => img.keywords.some(word => word.includes(gFilter))) :
    gImgs
}

function setFilter(filter) {
  gFilter = filter
}

function getFilter() {
  return gFilter
}

function getSavedImgs() {
  return getSavedMemes().map(meme =>
    ({ memeId: meme.id, img: getImgById(meme.selectedImgId)}))
}

function setImgs(imgs) {
  gImgs = imgs
}

function addImg(id, url, previewUrl = '') {
  gImgs.push({ ...createImg(id, url, []), previewUrl })
  saveImgs()
}

function generateImgId() {
  return gImgs.length + 1
}

function getImgById(id) {
  return gImgs.find(img => img.id === id)
}

function createImg(id, url, keywords) {
  return { id, url, keywords }
}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData()
  formData.append('img', imgDataUrl)

  const XHR = new XMLHttpRequest()
  XHR.onreadystatechange = () => {
    if (XHR.readyState !== XMLHttpRequest.DONE) return
    if (XHR.status !== 200) return console.error('Error uploading image')
    const { responseText: url } = XHR
    onSuccess(url)
  }
  XHR.onerror = (req, ev) => {
    console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
  }
  XHR.open('POST', 'https://ca-upload.com/here/upload.php')
  XHR.send(formData)
}

// STORAGE

function saveImgs() {
  saveToLocaStorage(IMGS_STORAGE_KEY, gImgs)
}

function loadImgs() {
  gImgs = loadFromLocaStorage(IMGS_STORAGE_KEY) || []
}
