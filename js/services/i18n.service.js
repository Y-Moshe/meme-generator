var gCurrLang = 'en'
var gTrans = {
  'gallery': {
    en: 'Gallery',
    he: 'גלריה'
  },
  'myMemes': {
    en: 'My Memes',
    he: 'הממים שלי'
  },
  'about': {
    en: 'About',
    he: 'עלי'
  },
  'imFlexible': {
    en: 'I\'m flexible',
    he: 'גמיש'
  },
  'backToGallery': {
    en: 'Back To Gallery',
    he: 'חזרה לגלריה'
  },
  'typeToStartEdit': {
    en: 'Type To Start Edit!',
    he: 'הקלד והתחל לערוך'
  },
  'share': {
    en: 'Share',
    he: 'שתף'
  },
  'save': {
    en: 'Save',
    he: 'שמור'
  },
  'download': {
    en: 'Download',
    he: 'הורד'
  },
  // KEYWORDS, required to start at UpperCase
  'Funny': {
    en: 'Funny',
    he: 'מצחיק'
  },
  'Animal': {
    en: 'Animal',
    he: 'בעלי חיים'
  },
  'Men': {
    en: 'Men',
    he: 'גברים'
  },
  'Women': {
    en: 'Women',
    he: 'נשים'
  },
  'Comic': {
    en: 'Comic',
    he: 'קומיקס'
  },
  'Smile': {
    en: 'Smile',
    he: 'חיוך'
  }
}

function getTrans(transKey) {
  const transMap = gTrans[transKey]
  if (!transMap) return 'UNKNOWN'

  let trans = transMap[gCurrLang]
  if (!trans) trans = transMap.en
  return trans
}

function doTrans(el = null) {
  let els = document.querySelectorAll('[data-trans]')
  if (el) els = el.querySelectorAll('[data-trans]')

  els.forEach(el => {
      const transKey = el.dataset.trans
      const trans = getTrans(transKey)
      el.innerText = trans
      if (el.placeholder) el.placeholder = trans
  })
}

function setLang(lang) {
  gCurrLang = lang
  _setDirection(lang)
}

function _setDirection(lang) {
  if (lang === 'he') document.body.classList.add('rtl')
  else document.body.classList.remove('rtl')
}
