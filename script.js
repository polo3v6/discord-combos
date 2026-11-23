// Profiles are generated from the folders in assets/profiles/ by Update profiles.bat.
const grid=document.querySelector("#profiles"),dialog=document.querySelector("#preview"),content=document.querySelector("#preview-content"),intro=document.querySelector("#intro"),site=document.querySelector("#site"),musicToggle=document.querySelector("#music-toggle"),backgroundMusic=document.querySelector("#background-music");
function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function filename(path){return decodeURIComponent(path.split("/").pop())}
function card(p,index){return `<article class="profile-card" role="button" tabindex="0" data-index="${index}" aria-label="Open ${esc(p.name)}"><div class="banner" style="background-image:url('${esc(p.banner)}')"></div><div class="profile-info"><div class="avatar-row"><img class="avatar" src="${esc(p.pfp)}" alt="" loading="lazy"></div><h2 class="name">${esc(p.name)}</h2></div></article>`}
function openProfile(index){const p=profiles[index];content.innerHTML=`<div class="preview-profile"><div class="preview-banner" style="background-image:url('${esc(p.banner)}')"><a class="download" href="${esc(p.banner)}" download="${esc(filename(p.banner))}" aria-label="Download banner" title="Download banner"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg></a></div><div class="preview-body"><div class="preview-avatar-row"><div class="preview-avatar-wrap"><img class="preview-avatar" src="${esc(p.pfp)}" alt="${esc(p.name)} profile picture"><a class="download" href="${esc(p.pfp)}" download="${esc(filename(p.pfp))}" aria-label="Download profile picture" title="Download profile picture"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg></a></div></div><h2>${esc(p.name)}</h2></div></div>`;dialog.showModal()}
backgroundMusic.volume=0.1;
const profiles=window.PROFILES||[];
grid.innerHTML=profiles.map(card).join("");
grid.addEventListener("click",e=>{const c=e.target.closest("[data-index]");if(c)openProfile(+c.dataset.index)});grid.addEventListener("keydown",e=>{const c=e.target.closest("[data-index]");if(c&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openProfile(+c.dataset.index)}});document.querySelector(".close").addEventListener("click",()=>dialog.close());dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
async function startMusic(){backgroundMusic.volume=0.1;try{await backgroundMusic.play();musicToggle.classList.remove("muted");musicToggle.setAttribute("aria-label","Pause background music");musicToggle.title="Pause background music"}catch{musicToggle.classList.add("muted")}}
function stopMusic(){backgroundMusic.pause();musicToggle.classList.add("muted");musicToggle.setAttribute("aria-label","Play background music");musicToggle.title="Play background music"}
function toggleMusic(){if(backgroundMusic.paused)startMusic();else stopMusic()}
function enterSite(){if(intro.classList.contains("leaving"))return;intro.classList.add("leaving");site.classList.add("entered");site.setAttribute("aria-hidden","false");window.setTimeout(()=>{intro.hidden=true},500);startMusic()}
intro.addEventListener("click",enterSite);intro.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();enterSite()}});musicToggle.addEventListener("click",toggleMusic);




