function makeId(length = 6) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var txt = ''
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function makeLorem(wordCount = 100) {
  const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
  var txt = ''
  while (wordCount > 0) {
    wordCount--
    txt += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return txt
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function updateQueryParam(key, value) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set(key, value);

  history.pushState(null, null, '?' + encodeURI(queryParams.toString()));
}

function isNumberInString(str) {
  return /\d/.test(str)
}

function myFetch(url, cb) {
  const XHR = new XMLHttpRequest()
  XHR.onreadystatechange = () => {
    if (XHR.readyState === XMLHttpRequest.DONE && XHR.status === 200) {
      const res = JSON.parse(XHR.responseText)
      cb(res)
    }
  }

  XHR.open('GET', url)
  XHR.send()
}

const debounce = (func, wait) => {
  let timeout

  return (...args) => {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function capitlaize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function convertArrayToCSVContent(arr) {
  const csvHeader  = Object.keys(arr[0]).join() + '\n'
  const csvContent = arr.map(item => {
    const line = Object.values(item).join()
    return line + '\n'
  })

  return csvHeader + csvContent.join('')
}

function isRectClicked(currX, currY, rectX, rectY, width, height) {
  // Check if the click coordinates are inside the react coordinates
  return currX > rectX && currX < rectX + width &&
    currY > rectY && currY < rectY + height
}

//Check if the click is inside the circle 
function isCircleClicked(currX, currY, circleX, circleY, radius) {
  // Calc the distance between two dots
  const distance = Math.sqrt((circleX - currX) ** 2 + (circleY - currY) ** 2)
  //If its smaller then the radius of the circle we are inside
  return distance <= radius
}

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
function getEventPos(ev) {
  // Gets the offset pos, the default pos
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY
  }

  if (TOUCH_EVS.includes(ev.type)) {
    // soo we will not trigger the mouse ev
    ev.preventDefault()
    // Gets the first touch point
    ev = ev.changedTouches[0]
    // Calc the right pos according to the touch screen
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
    }
  }

  return pos
}
