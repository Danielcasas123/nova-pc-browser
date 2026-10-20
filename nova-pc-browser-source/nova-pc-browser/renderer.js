const browser = document.getElementById('browser');
const address = document.getElementById('address');
const addressForm = document.getElementById('addressForm');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const welcome = document.getElementById('welcome');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const tabTitle = document.getElementById('tabTitle');
const statusText = document.getElementById('statusText');
let started = false;

function normalizeInput(value) {
  const text = value.trim();
  if (!text) return 'https://duckduckgo.com/';
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(text)) return text;
  if (text.includes('.') && !text.includes(' ')) return `https://${text}`;
  return `https://duckduckgo.com/?q=${encodeURIComponent(text)}`;
}

function navigate(value) {
  const target = normalizeInput(value);
  welcome.classList.add('hidden');
  address.value = target;
  if (browser.getAttribute('src') === target && !started) return;
  if (!started) {
    browser.setAttribute('src', target);
  } else {
    browser.loadURL(target).catch(() => {});
  }
}

addressForm.addEventListener('submit', (event) => {
  event.preventDefault();
  navigate(address.value);
});
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  navigate(searchInput.value);
});
backBtn.addEventListener('click', () => { if (browser.canGoBack()) browser.goBack(); });
forwardBtn.addEventListener('click', () => { if (browser.canGoForward()) browser.goForward(); });
reloadBtn.addEventListener('click', () => browser.reload());
document.getElementById('homeBtn').addEventListener('click', () => {
  welcome.classList.remove('hidden');
  address.value = 'https://duckduckgo.com/';
});
document.getElementById('newTabBtn').addEventListener('click', () => {
  welcome.classList.remove('hidden');
  address.value = '';
  searchInput.focus();
});
document.querySelectorAll('[data-url]').forEach((button) => {
  button.addEventListener('click', () => navigate(button.dataset.url));
});
document.getElementById('browserNav').addEventListener('click', () => {
  welcome.classList.remove('hidden');
  address.value = 'https://duckduckgo.com/';
});

browser.addEventListener('did-start-loading', () => {
  statusText.textContent = 'Cargando página…';
});
browser.addEventListener('did-stop-loading', () => {
  started = true;
  backBtn.disabled = !browser.canGoBack();
  forwardBtn.disabled = !browser.canGoForward();
  try {
    const current = new URL(browser.getURL());
    address.value = current.href;
    tabTitle.textContent = browser.getTitle() || current.hostname;
  } catch (_) {}
  statusText.textContent = 'Nova PC · 1.0.0';
});
browser.addEventListener('page-title-updated', (event) => {
  tabTitle.textContent = event.title || 'Nueva pestaña';
});
browser.addEventListener('did-navigate', () => {
  backBtn.disabled = !browser.canGoBack();
  forwardBtn.disabled = !browser.canGoForward();
  address.value = browser.getURL();
});
browser.addEventListener('new-window', (event) => {
  if (event.url) navigate(event.url);
});

window.novaAPI?.getVersion().then((version) => {
  statusText.textContent = `Nova PC · ${version}`;
}).catch(() => {});
