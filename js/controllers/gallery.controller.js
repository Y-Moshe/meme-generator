function renderGallery() {
  const gallery = getImgs().map(renderGalleryItem)

  document.querySelector('.gallery')
    .innerHTML = gallery.join('')
}

function renderGalleryItem({ id, url, keywords }) {
  const badges = keywords.map(key => `<span class="gallery-badge">${key}</span>`)

  return `
    <div class="gallery-item" onclick="onImgSelect('${id}')">
      <img src="${url}" alt="${id} img" class="gallery-item-img" />
      <div class="gallery-item-keywords">${badges.join('')}</div>
    </div>
  `
}

function onImgSelect(id) {
  setSelectedImgId(id)
  renderMeme()
}
