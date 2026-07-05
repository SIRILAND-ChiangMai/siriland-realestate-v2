const grid = document.getElementById('propertyGrid');
const cityFilter = document.getElementById('cityFilter');
const typeFilter = document.getElementById('typeFilter');
const dealFilter = document.getElementById('dealFilter');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('propertyModal');
const modalClose = document.getElementById('modalClose');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

let currentProperty = null;
let currentImageIndex = 0;

function uniqueValues(key){return [...new Set(properties.map(p => p[key]).filter(Boolean))];}
function fillFilter(select, values){values.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;select.appendChild(o);});}
fillFilter(cityFilter, uniqueValues('city'));
fillFilter(typeFilter, uniqueValues('type'));

function cardTemplate(p, i){
  const img = p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : p.type;
  const count = p.images ? p.images.length : 0;
  return `<article class="card" data-index="${i}">
    <div class="photo">${img}<span class="badge">${p.deal} • ${p.type}</span>${count ? `<span class="count">📷 ${count}</span>` : ''}</div>
    <div class="content">
      <div class="meta">${p.id || ''} • ${p.city} • ${p.type} • ${p.deal}</div>
      <h3>${p.title}</h3>
      <div class="price">${p.price}</div>
      <p class="desc">${p.description}</p>
      <div class="chips"><span>${p.bedrooms || '-'}</span><span>${p.bathrooms || '-'}</span><span>${p.area || '-'}</span></div>
      <div class="actions">
        <a class="smallbtn goldbtn" href="tel:0920056640">Call</a>
        <a class="smallbtn" href="https://line.me/R/ti/p/@realcreamthailand" target="_blank">LINE</a>
      </div>
    </div>
  </article>`;
}

function render(){
  const q = searchInput.value.toLowerCase();
  const filtered = properties.filter(p =>
    (cityFilter.value==='all'||p.city===cityFilter.value) &&
    (typeFilter.value==='all'||p.type===typeFilter.value) &&
    (dealFilter.value==='all'||p.deal===dealFilter.value) &&
    (`${p.id || ''} ${p.title} ${p.city} ${p.type} ${p.description}`.toLowerCase().includes(q))
  );
  grid.innerHTML = filtered.map((p)=>cardTemplate(p, properties.indexOf(p))).join('') || '<p>No properties found.</p>';
}

function updateModalImage(){
  const img = document.getElementById('modalImg');
  const counter = document.getElementById('modalCounter');
  if(!currentProperty || !currentProperty.images || !currentProperty.images.length) return;
  img.src = currentProperty.images[currentImageIndex];
  counter.textContent = `${currentImageIndex + 1} / ${currentProperty.images.length}`;
}

function openModal(p){
  currentProperty = p;
  currentImageIndex = 0;

  document.getElementById('modalMeta').textContent = `${p.id || ''} • ${p.city} • ${p.type} • ${p.deal}`;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalPrice').textContent = p.price;
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalChips').innerHTML = `<span>${p.bedrooms || '-'}</span><span>${p.bathrooms || '-'}</span><span>${p.area || '-'}</span>`;

  updateModalImage();
  modal.classList.remove('hidden');
}

grid.addEventListener('click', e=>{
  const card = e.target.closest('.card');
  if(!card || e.target.closest('a')) return;
  openModal(properties[Number(card.dataset.index)]);
});

modalClose.addEventListener('click',()=>modal.classList.add('hidden'));
modal.addEventListener('click', e=>{if(e.target===modal) modal.classList.add('hidden')});

document.getElementById('modalPrev').addEventListener('click', ()=>{
  if(!currentProperty?.images?.length) return;
  currentImageIndex = (currentImageIndex - 1 + currentProperty.images.length) % currentProperty.images.length;
  updateModalImage();
});

document.getElementById('modalNext').addEventListener('click', ()=>{
  if(!currentProperty?.images?.length) return;
  currentImageIndex = (currentImageIndex + 1) % currentProperty.images.length;
  updateModalImage();
});

[cityFilter,typeFilter,dealFilter,searchInput].forEach(el=>el.addEventListener('input',render));
menuToggle.addEventListener('click',()=>mainNav.classList.toggle('show'));
render();
