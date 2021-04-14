const initStreamingMedia = require('./init-media-sources.js')
const initHydra = require('./init-hydra.js')
const html = require('nanohtml')

const flokURL = "https://flok.clic.cf/s/NjUxMWM2MjUtOTFlZi00NzNiLWJhNTUtMzVhNWIwY2U0MmFm?layout=hydra,hydra&noHydra=1&bgOpacity=0"

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const edit = urlParams.get('edit')
const readOnly = edit == 1 ? false : true


initHydra()

// create ui elements
const intro = html`<div class="pa4 i f3"> <h1 class="f1 i"> flujos </h1>
    <p class="f3"> web_site_specific performance</p>
    <p class="f3">by Celeste Betancur and Olivia Jack </p>
    <div onclick=${start} class="pointer dim"> ${">>>"} enter ${"<<<<"} </div>
    </div>`

const uiContainer = html`<div class="w-100 h-100 absolute top-0 left-0 overflow-y-auto">${intro}</div>`

const editor = html`<div class="absolute mb5 bottom-0 left-0 w-100 skewY" style="height:40%">
<iframe src="${flokURL}${readOnly?'&readonly=1':''}" frameborder="0" class="w-100 h-100"></iframe>
</div>`

// execute editor events on global context
window.addEventListener("message", function(event) {
  //console.log('received message', event)
  if(event.data) {
    if(event.data.cmd === "evaluateCode") {
      //  console.log('evaluate', event.data.args.body)
      eval(event.data.args.body)
    }
  }
})

function start() {
  uiContainer.innerHTML = ''
  uiContainer.appendChild(editor)
  initStreamingMedia()
}
document.body.appendChild(uiContainer)
//  document.body.appendChild(editor)
//}