import { tile } from './tile'

const fileInput = document.querySelector('#input-image') as HTMLInputElement
const widthInput = document.querySelector('#input-width') as HTMLInputElement
const heightInput = document.querySelector('#input-height') as HTMLInputElement
const scaleInput = document.querySelector('#input-scale') as HTMLInputElement
const offsetXInput = document.querySelector('#input-offset-x') as HTMLInputElement
const offsetYInput = document.querySelector('#input-offset-y') as HTMLInputElement
const preview = document.querySelector('#preview') as HTMLCanvasElement
const workItem = document.querySelector('#work-item') as HTMLCanvasElement
const output = document.querySelector('#output') as HTMLElement
const context = preview.getContext('2d')!

for (const el of [widthInput, heightInput, scaleInput, offsetXInput, offsetYInput]) {
  el.addEventListener('input', draw)
}

function clamp() {
  for (const el of [widthInput, heightInput, scaleInput]) {
    el.value = Math.min(+el.value, +el.max).toString()
  }
}
for (const el of [widthInput, heightInput, scaleInput]) {
  el.addEventListener('input', clamp)
}


// Easels can make square or rectangular photos.
// The square paintings make images that are
// 3x3 = 96px
// 2x2 = 64px
// 1x1 = 32px
// in size. The rectangular photos don't get to the edge of
// the block (small/med/large) so cannot be used for tiling
// and can be ignored. Further, the 2x2 paintings don't fit
// exactly with blocks, so any painting made with 2x2 paintings
// must be made entirely of 2x2 paintings... so I only use 3x3
// and 1x1 paintings to form the whole painting.
let image = new Image()

// Previously was input, but change also works on WebKit, Gecko, and older versions of Blink.
fileInput.addEventListener('change', () => {
  const file = fileInput.files![0]
  const reader = new FileReader()

  reader.addEventListener('load', () => {
    image.src = String(reader.result)
  })

  if (file) {
    reader.readAsDataURL(file)
  }
})

image.addEventListener('load', () => {
  widthInput.max = Math.floor(image.width / 32).toString() // FIXME
  heightInput.max = Math.floor(image.height / 32).toString()
  clamp()
  draw()
})

function getPaintingRect() {
  const scale = +scaleInput.value / 100
  const blockPixels = Math.min(
    scale * image.width / +widthInput.value,
    scale * image.height / +heightInput.value
  )

  const paintingWidth = blockPixels * +widthInput.value
  const paintingHeight = blockPixels * +heightInput.value

  const offsetX = Math.min(image.width - paintingWidth, +offsetXInput.value)
  const offsetY = Math.min(image.height - paintingHeight, +offsetYInput.value)

  return { blockPixels, paintingHeight, paintingWidth, offsetX, offsetY }
}

function draw() {
  if (!image.width) return
  preview.width = image.width
  preview.height = image.height

  const { blockPixels, offsetX, offsetY } = getPaintingRect()

  context.drawImage(image, 0, 0)
  let count = 0
  for (const { x, y, w, h } of tile(+widthInput.value, +heightInput.value)) {
    context.font = "50px sans-serif"
    context.fillText(
      String(++count),
      x * blockPixels + offsetX,
      y * blockPixels + offsetY + 50
    );
    context.strokeRect(x * blockPixels + offsetX, y * blockPixels + offsetY, w * blockPixels, h * blockPixels);
  }
}



document.querySelector('button')!.addEventListener('click', () => {
  const { blockPixels, offsetX, offsetY } = getPaintingRect()
  while (output.firstChild) output.firstChild.remove()

  const context = workItem.getContext('2d')!

  let count = 0
  for (const { x, y, w, h } of tile(+widthInput.value, +heightInput.value)) {
    workItem.width = w * blockPixels
    workItem.height = h * blockPixels

    context.drawImage(
      image,
      x * blockPixels + offsetX, y * blockPixels + offsetY, w * blockPixels, h * blockPixels,
      0, 0, w * blockPixels, h * blockPixels
    )

    const column = document.createElement('div')
    column.classList.add('column')

    const label = document.createElement('strong')
    label.textContent = `Painting ${++count}`
    column.appendChild(label)

    const item = new Image()
    item.src = workItem.toDataURL()
    item.classList.add('output-image')
    column.appendChild(item)

    output.appendChild(column)
  }

})
