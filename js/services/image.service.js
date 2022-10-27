const IMGS_STORAGE_KEY = 'imgsDB'

let gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'], isSaved: false }]

function getImgs(isSaveOnly) {
  return isSaveOnly ?
    gImgs.filter(img => img.isSaved) :
    gImgs.filter(img => !img.isSaved)
}

function getSavedImgs() {
  return getSavedMemes().map(meme =>
    ({ memeId: meme.id, img: getImgById(meme.selectedImgId)}))
}

function setImgs(imgs) {
  gImgs = imgs
}

function addImg(id, url, keywords) {
  gImgs.push({ ...createImg(id, url, keywords), isSaved: true })
  saveImgs()
}

function getImgById(id) {
  return gImgs.find(img => img.id === id)
}

function createImg(id, url, keywords) {
  return {
    id,
    url,
    keywords
  }
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
