function onInit() {
  initImgs()
  renderGallery()
}

function initImgs() {
  gImgs = []
  for (let i = 1; i <= 18; i++) {
    gImgs.push(createMemeImg(`img/${i}.jpg`, ['test', 'gol']))
  }
}