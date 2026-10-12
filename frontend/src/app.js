// Pure Vanilla HTML/CSS/JS Frontend — No React
const money = n => '₹' + Number(n).toLocaleString('en-IN');
const today = () => new Date().toLocaleDateString('en-CA');

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inline SVG Icons matching Lucide
const icons = {
  car: (size = 24, strokeWidth = 2) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11.1 2 11.5V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  mapPin: (size = 13) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  users: (size = 13) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  fuel: (size = 13) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>`,
  gauge: (size = 13) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  arrowUpRight: (size = 16) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
  search: (size = 18) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  plus: (size = 18) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  logOut: (size = 18) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  calendar: (size = 15) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  shieldCheck: (size = 18) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`
};

const emptyVehicle = {
  name: '',
  brand: '',
  city: '',
  registration: '',
  category: 'Car',
  fuel: 'Petrol',
  transmission: 'Manual',
  price: 1500,
  seats: 5,
  description: '',
  image: '',
  available: true
};

// Global App State
const state = {
  user: null,
  page: 'explore',
  vehicles: [],
  bookings: [],
  filters: {},
  dates: { start: '', end: '' },
  notice: '',
  error: '',
  loading: false,
  busy: false,
  modal: null,
  modalData: {}
};

async function api(path, method = 'GET', data) {
  const token = sessionStorage.getItem('token') || '';
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch('/api' + path, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  });
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error('Server unavailable. Check Flask and Express.');
  }
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

function setNotice(msg) {
  state.notice = msg;
  state.error = '';
  renderNotices();
}

function setError(msg) {
  state.error = msg;
  renderNotices();
}

function clearAlerts() {
  state.notice = '';
  state.error = '';
  renderNotices();
}

function setPage(p) {
  state.page = p;
  clearAlerts();
  renderHeader();
  refresh();
}

function openModal(kind, data = {}) {
  state.error = '';
  state.modal = kind;
  state.modalData = { ...data };
  renderModal();
}

function closeModal() {
  state.modal = null;
  state.modalData = {};
  renderModal();
}

function logout() {
  sessionStorage.removeItem('token');
  state.user = null;
  state.bookings = [];
  setPage('explore');
  setNotice('Signed out');
}

async function refresh() {
  state.loading = true;
  renderMain();
  try {
    if (state.page === 'bookings') {
      state.bookings = await api('/bookings');
    } else if (state.page === 'fleet') {
      state.vehicles = await api('/owner/vehicles');
    } else if (state.page === 'explore') {
      const q = new URLSearchParams(Object.entries(state.filters).filter(([, v]) => v));
      state.vehicles = await api('/vehicles?' + q.toString());
    }
  } catch (e) {
    setError(e.message);
  } finally {
    state.loading = false;
    renderMain();
  }
}

// Header rendering
function renderHeader() {
  const header = document.getElementById('app-header');
  if (!header) return;

  const user = state.user;
  const page = state.page;

  header.innerHTML = `
    <a class="logo" href="#" id="header-logo">
      ${icons.car(24, 2)} roam<span>.</span>
    </a>
    <nav>
      <button class="${page === 'explore' ? 'current' : ''}" id="nav-explore">Explore vehicles</button>
      ${user ? `<button class="${page === 'bookings' ? 'current' : ''}" id="nav-bookings">${user.role === 'owner' ? 'Rental requests' : 'My bookings'}</button>` : ''}
      ${user?.role === 'owner' ? `<button class="${page === 'fleet' ? 'current' : ''}" id="nav-fleet">My fleet</button>` : ''}
    </nav>
    <div class="account">
      ${user ? `
        <button id="nav-profile">${escapeHtml(user.name)} <span class="pill">${escapeHtml(user.role)}</span></button>
        <button aria-label="Sign out" id="nav-logout">${icons.logOut(18)}</button>
      ` : `
        <button id="btn-login-open">Log in</button>
        <button class="dark" id="btn-register-open">Get started ${icons.arrowUpRight(16)}</button>
      `}
    </div>
  `;

  document.getElementById('header-logo').onclick = e => { e.preventDefault(); setPage('explore'); };
  document.getElementById('nav-explore').onclick = () => setPage('explore');
  if (user) {
    document.getElementById('nav-bookings').onclick = () => setPage('bookings');
    if (user.role === 'owner') document.getElementById('nav-fleet').onclick = () => setPage('fleet');
    document.getElementById('nav-profile').onclick = () => {
      state.modalData = { ...user };
      setPage('profile');
    };
    document.getElementById('nav-logout').onclick = logout;
  } else {
    document.getElementById('btn-login-open').onclick = () => openModal('login');
    document.getElementById('btn-register-open').onclick = () => openModal('register', { role: 'customer' });
  }
}

// Notices rendering
function renderNotices() {
  const container = document.getElementById('notices-container');
  if (!container) return;

  let html = '';
  if (state.notice) {
    html += `<div class="notice" role="status"><span>${escapeHtml(state.notice)}</span><button id="btn-close-notice">×</button></div>`;
  }
  if (state.error) {
    html += `<div class="error" role="alert"><span>${escapeHtml(state.error)}</span><button id="btn-close-error">×</button></div>`;
  }
  container.innerHTML = html;

  const btnN = document.getElementById('btn-close-notice');
  if (btnN) btnN.onclick = () => { state.notice = ''; renderNotices(); };
  const btnE = document.getElementById('btn-close-error');
  if (btnE) btnE.onclick = () => { state.error = ''; renderNotices(); };
}

// Main content rendering
function renderMain() {
  const main = document.getElementById('main-content');
  if (!main) return;

  if (state.page === 'explore') {
    renderExplorePage(main);
  } else if (state.page === 'fleet') {
    renderFleetPage(main);
  } else if (state.page === 'bookings') {
    renderBookingsPage(main);
  } else if (state.page === 'profile') {
    renderProfilePage(main);
  }
}

// Page: Explore
function renderExplorePage(main) {
  const filters = state.filters;
  const vehicles = state.vehicles;
  const loading = state.loading;

  main.innerHTML = `
    <section class="hero">
      <div>
        <div class="eyebrow">YOUR NEXT JOURNEY STARTS HERE</div>
        <h1>Good wheels.<br/>Great possibilities<span>.</span></h1>
        <p>From everyday errands to weekend escapes.<br/>Find the right ride, from owners near you.</p>
        <div class="trust">${icons.shieldCheck(18)} Clear daily pricing <span>•</span> Flexible vehicle choices</div>
      </div>
      <div class="hero-art">
        <div class="orbit"></div>
        ${icons.car(240, 1)}
        <div class="float">
          <span>THE ROAD IS YOURS</span>
          <b>Pick a ride. Make a memory.</b>
        </div>
        <div class="tiny">01 / READY TO ROAM</div>
      </div>
    </section>

    <form class="filters" id="filters-form">
      <label>Search
        <input name="q" placeholder="Vehicle or brand" value="${escapeHtml(filters.q || '')}">
      </label>
      <label>City
        <input name="city" placeholder="Any city" value="${escapeHtml(filters.city || '')}">
      </label>
      <label>Type
        <select name="category">
          <option value="">All</option>
          ${['Car', 'Bike', 'Scooter', 'SUV', 'Van'].map(c => `<option value="${c}" ${filters.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </label>
      <label>Fuel
        <select name="fuel">
          <option value="">All</option>
          ${['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => `<option value="${f}" ${filters.fuel === f ? 'selected' : ''}>${f}</option>`).join('')}
        </select>
      </label>
      <label>Gearbox
        <select name="transmission">
          <option value="">All</option>
          ${['Manual', 'Automatic'].map(t => `<option value="${t}" ${filters.transmission === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </label>
      <label>Max ₹ / day
        <input type="number" min="1" name="max_price" placeholder="Any budget" value="${escapeHtml(filters.max_price || '')}">
      </label>
      <label>Pickup
        <input type="date" min="${today()}" name="start" value="${escapeHtml(filters.start || '')}">
      </label>
      <label>Return
        <input type="date" min="${filters.start || today()}" name="end" value="${escapeHtml(filters.end || '')}">
      </label>
      <label>Sort
        <select name="sort">
          <option value="" ${!filters.sort ? 'selected' : ''}>Newest</option>
          <option value="price_asc" ${filters.sort === 'price_asc' ? 'selected' : ''}>Price: low to high</option>
          <option value="price_desc" ${filters.sort === 'price_desc' ? 'selected' : ''}>Price: high to low</option>
          <option value="name" ${filters.sort === 'name' ? 'selected' : ''}>Name</option>
        </select>
      </label>
      <button class="dark" type="submit">${icons.search(18)} Find vehicles</button>
    </form>

    <div class="section-head">
      <div>
        <div class="eyebrow">FIND YOUR FIT</div>
        <h2>A ride for every plan</h2>
        <p>${vehicles.length} vehicles · Rates in INR per day</p>
      </div>
    </div>

    ${loading ? '<p>Loading vehicles…</p>' : `
      <div class="grid">
        ${vehicles.map(v => `
          <article class="card">
            <div class="vehicle-art ${v.category.toLowerCase()}">
              ${v.image ? `<img src="${v.image}" alt="${escapeHtml(v.name)}" onerror="this.style.display='none'">` : icons.car(120, 1)}
              <span class="tag">${escapeHtml(v.category)}</span>
              <span class="availability ${!v.available ? 'off' : ''}">${v.available ? 'Listed' : 'Unavailable'}</span>
            </div>
            <div class="card-body">
              <div class="city">${icons.mapPin(13)} ${escapeHtml(v.city)}</div>
              <h3>${escapeHtml(v.name)}</h3>
              <div class="specs">
                <span>${icons.users(13)} ${v.seats} seats</span>
                <span>${icons.fuel(13)} ${escapeHtml(v.fuel)}</span>
                <span>${icons.gauge(13)} ${escapeHtml(v.transmission)}</span>
              </div>
              <div class="card-bottom">
                <div><strong>${money(v.price)}</strong><small> / day</small></div>
                <button class="dark" data-view-id="${v._id}">View ride ${icons.arrowUpRight(16)}</button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `}

    ${!loading && !vehicles.length ? `
      <div class="empty">
        ${icons.car(44, 2)}
        <h3>No vehicles found</h3>
        <p>Try different filters, or run the included seed command for sample vehicles.</p>
      </div>
    ` : ''}
  `;

  // Attach filters submit
  const fForm = document.getElementById('filters-form');
  fForm.onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(fForm);
    state.filters = {
      q: fd.get('q') || '',
      city: fd.get('city') || '',
      category: fd.get('category') || '',
      fuel: fd.get('fuel') || '',
      transmission: fd.get('transmission') || '',
      max_price: fd.get('max_price') || '',
      start: fd.get('start') || '',
      end: fd.get('end') || '',
      sort: fd.get('sort') || ''
    };
    refresh();
  };

  // View ride click events
  main.querySelectorAll('[data-view-id]').forEach(btn => {
    btn.onclick = () => {
      const vid = btn.getAttribute('data-view-id');
      const v = state.vehicles.find(item => item._id === vid);
      if (v) {
        state.dates = {
          start: state.filters.start || '',
          end: state.filters.end || ''
        };
        openModal('detail', v);
      }
    };
  });
}

// Page: Fleet (Owner)
function renderFleetPage(main) {
  const vehicles = state.vehicles;
  const loading = state.loading;

  main.innerHTML = `
    <div class="section-head">
      <div>
        <div class="eyebrow">OWNER WORKSPACE</div>
        <h2>Manage your fleet</h2>
        <p>${vehicles.length} vehicles · Rates in INR per day</p>
      </div>
      <button class="dark" id="btn-add-vehicle">${icons.plus(18)} Add vehicle</button>
    </div>

    ${loading ? '<p>Loading vehicles…</p>' : `
      <div class="grid">
        ${vehicles.map(v => `
          <article class="card">
            <div class="vehicle-art ${v.category.toLowerCase()}">
              ${v.image ? `<img src="${v.image}" alt="${escapeHtml(v.name)}" onerror="this.style.display='none'">` : icons.car(120, 1)}
              <span class="tag">${escapeHtml(v.category)}</span>
              <span class="availability ${!v.available ? 'off' : ''}">${v.available ? 'Listed' : 'Unavailable'}</span>
            </div>
            <div class="card-body">
              <div class="city">${icons.mapPin(13)} ${escapeHtml(v.city)}</div>
              <h3>${escapeHtml(v.name)}</h3>
              <div class="specs">
                <span>${icons.users(13)} ${v.seats} seats</span>
                <span>${icons.fuel(13)} ${escapeHtml(v.fuel)}</span>
                <span>${icons.gauge(13)} ${escapeHtml(v.transmission)}</span>
              </div>
              <div class="card-bottom">
                <div><strong>${money(v.price)}</strong><small> / day</small></div>
                <div class="actions">
                  <button data-edit-id="${v._id}">Edit</button>
                  <button class="danger" data-delete-id="${v._id}">Delete</button>
                </div>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `}

    ${!loading && !vehicles.length ? `
      <div class="empty">
        ${icons.car(44, 2)}
        <h3>No vehicles found</h3>
        <p>Add your first vehicle to start receiving bookings.</p>
      </div>
    ` : ''}
  `;

  document.getElementById('btn-add-vehicle').onclick = () => openModal('vehicle', { ...emptyVehicle });

  main.querySelectorAll('[data-edit-id]').forEach(btn => {
    btn.onclick = () => {
      const vid = btn.getAttribute('data-edit-id');
      const v = state.vehicles.find(item => item._id === vid);
      if (v) openModal('vehicle', v);
    };
  });

  main.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.onclick = async () => {
      const vid = btn.getAttribute('data-delete-id');
      if (confirm('Delete this vehicle?')) {
        try {
          await api('/vehicles/' + vid, 'DELETE');
          setNotice('Vehicle deleted');
          await refresh();
        } catch (e) {
          setError(e.message);
        }
      }
    };
  });
}

// Page: Bookings
function renderBookingsPage(main) {
  const bookings = state.bookings;
  const user = state.user;
  const loading = state.loading;

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const activeCount = bookings.filter(b => b.status === 'active').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const completedValue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.total || 0), 0);

  main.innerHTML = `
    <div class="section-head">
      <div>
        <div class="eyebrow">YOUR RENTAL WORKSPACE</div>
        <h2>${user?.role === 'owner' ? 'Rental requests' : 'My bookings'}</h2>
      </div>
    </div>

    <div class="stats">
      <div><b>${pendingCount}</b><span>pending</span></div>
      <div><b>${confirmedCount}</b><span>confirmed</span></div>
      <div><b>${activeCount}</b><span>active</span></div>
      <div><b>${completedCount}</b><span>completed</span></div>
      <div><b>${money(completedValue)}</b><span>Completed rental value</span></div>
    </div>

    ${loading ? '<p>Loading…</p>' : bookings.map(b => {
      let allowedActions = [];
      if (user?.role === 'owner') {
        if (b.status === 'pending') allowedActions = ['confirmed', 'rejected'];
        else if (b.status === 'confirmed') allowedActions = ['active'];
        else if (b.status === 'active') allowedActions = ['completed'];
      } else {
        if (['pending', 'confirmed'].includes(b.status)) allowedActions = ['cancelled'];
      }

      const labels = {
        confirmed: 'Approve',
        rejected: 'Reject',
        active: 'Start rental',
        completed: 'Complete',
        cancelled: 'Cancel'
      };

      return `
        <article class="booking">
          <div>
            <span class="status ${b.status}">${b.status}</span>
            <h3>${escapeHtml(b.vehicle_name)}</h3>
            <p>${icons.calendar(15)} ${b.start} → ${b.end} · ${b.days} days</p>
            <small>Reference: ${escapeHtml(b._id.slice(0, 8))}</small>
            ${user?.role === 'owner' ? `<p>${escapeHtml(b.customer_name)} · ${escapeHtml(b.customer_email)}</p>` : ''}
          </div>
          <div class="booking-actions">
            <strong>${money(b.total)}</strong>
            <small>${money(b.daily_price)} / day · Pay at pickup</small>
            <div class="actions">
              ${allowedActions.map(st => `
                <button class="${['cancelled', 'rejected'].includes(st) ? 'danger' : 'dark'}" data-booking-id="${b._id}" data-action="${st}" ${state.busy ? 'disabled' : ''}>
                  ${labels[st] || st}
                </button>
              `).join('')}
            </div>
          </div>
        </article>
      `;
    }).join('')}

    ${!loading && !bookings.length ? '<div class="empty">No bookings yet.</div>' : ''}
  `;

  main.querySelectorAll('[data-booking-id]').forEach(btn => {
    btn.onclick = async () => {
      const bid = btn.getAttribute('data-booking-id');
      const st = btn.getAttribute('data-action');
      state.busy = true;
      try {
        await api('/bookings/' + bid, 'PATCH', { status: st });
        setNotice('Booking updated');
        await refresh();
      } catch (e) {
        setError(e.message);
      } finally {
        state.busy = false;
      }
    };
  });
}

// Page: Profile
function renderProfilePage(main) {
  const user = state.user;
  if (!user) return;

  main.innerHTML = `
    <form class="profile panel" id="profile-form">
      <div class="eyebrow">ACCOUNT SETTINGS</div>
      <h2>My profile</h2>
      <label>Full name
        <input name="name" type="text" required minlength="2" maxlength="80" value="${escapeHtml(user.name || '')}">
      </label>
      <label>Mobile number
        <input name="phone" type="tel" value="${escapeHtml(user.phone || '')}" placeholder="10-digit mobile number">
      </label>
      <label>Email
        <input disabled value="${escapeHtml(user.email || '')}">
      </label>
      <p>Account type: ${escapeHtml(user.role || '')}</p>
      <button class="dark" type="submit" ${state.busy ? 'disabled' : ''}>Save changes</button>
    </form>
  `;

  const pForm = document.getElementById('profile-form');
  pForm.onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(pForm);
    state.busy = true;
    try {
      const updated = await api('/profile', 'PUT', {
        name: fd.get('name'),
        phone: fd.get('phone')
      });
      state.user = updated;
      setNotice('Profile saved');
      renderHeader();
      renderProfilePage(main);
    } catch (err) {
      setError(err.message);
    } finally {
      state.busy = false;
    }
  };
}

// Modal rendering
function renderModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  if (!state.modal) {
    container.innerHTML = '';
    return;
  }

  const kind = state.modal;
  const form = state.modalData || {};

  let modalBody = '';

  if (kind === 'login' || kind === 'register') {
    modalBody = `
      <form id="auth-form">
        <div class="eyebrow">WELCOME TO ROAM</div>
        <h2>${kind === 'login' ? 'Your next ride awaits.' : 'Let’s get you moving.'}</h2>
        ${kind === 'register' ? `
          <label>Full name
            <input name="name" type="text" required minlength="2" maxlength="80">
          </label>
        ` : ''}
        <label>Email
          <input name="email" type="email" required>
        </label>
        <label>Password (minimum 8 characters)
          <input name="password" type="password" minlength="8" required>
        </label>
        ${kind === 'register' ? `
          <label>I want to join as
            <select name="role">
              <option value="customer" ${form.role === 'customer' ? 'selected' : ''}>customer</option>
              <option value="owner" ${form.role === 'owner' ? 'selected' : ''}>owner</option>
            </select>
          </label>
        ` : ''}
        <button class="dark full" type="submit" ${state.busy ? 'disabled' : ''}>
          ${state.busy ? 'Please wait…' : kind === 'login' ? 'Log in' : 'Create account'}
        </button>
        <button type="button" class="full" id="btn-switch-auth">
          ${kind === 'login' ? 'New here? Create an account' : 'Already registered? Log in'}
        </button>
      </form>
    `;
  } else if (kind === 'vehicle') {
    modalBody = `
      <form id="vehicle-form">
        <h2>${form._id ? 'Edit vehicle' : 'Add a vehicle'}</h2>
        <div class="form-grid">
          <label>Vehicle name<input name="name" required value="${escapeHtml(form.name || '')}"></label>
          <label>Brand<input name="brand" required value="${escapeHtml(form.brand || '')}"></label>
          <label>City<input name="city" required value="${escapeHtml(form.city || '')}"></label>
          <label>Registration number<input name="registration" required value="${escapeHtml(form.registration || '')}"></label>
          <label>Category
            <select name="category">
              ${['Car', 'Bike', 'Scooter', 'SUV', 'Van'].map(c => `<option value="${c}" ${form.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </label>
          <label>Fuel
            <select name="fuel">
              ${['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => `<option value="${f}" ${form.fuel === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </label>
          <label>Transmission
            <select name="transmission">
              ${['Manual', 'Automatic'].map(t => `<option value="${t}" ${form.transmission === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </label>
          <label>Seats<input name="seats" type="number" min="1" max="20" required value="${form.seats || 5}"></label>
          <label>Daily rate (₹)<input name="price" type="number" min="1" max="100000" required value="${form.price || 1500}"></label>
        </div>

        <div style="margin: 4px 0 8px;">
          <label style="margin-bottom: 6px;">Vehicle Image (Upload from device or enter image URL/Embedded data)</label>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <input type="file" id="vehicle-file-input" accept="image/*" style="flex:1;">
            <input type="text" id="vehicle-image-input" name="image" placeholder="Image HTTPS URL or Embedded Data URL" value="${escapeHtml(form.image || '')}" style="flex:2;">
          </div>
          <div id="image-preview-container" style="margin-top:12px;${form.image ? '' : 'display:none;'}">
            <div class="vehicle-art" style="height:150px;border-radius:10px;overflow:hidden;position:relative;">
              <img id="image-preview-img" src="${form.image || ''}" alt="Preview" style="width:100%;height:100%;object-fit:cover;">
              <button type="button" id="btn-clear-image" class="danger" style="position:absolute;top:8px;right:8px;padding:6px 10px;font-size:11px;">Remove Image</button>
            </div>
          </div>
        </div>

        <label>Description<textarea name="description">${escapeHtml(form.description || '')}</textarea></label>
        <label class="checkbox"><input type="checkbox" name="available" ${form.available !== false ? 'checked' : ''}> Available for booking</label>
        <button class="dark full" type="submit" ${state.busy ? 'disabled' : ''}>Save vehicle</button>
      </form>
    `;
  } else if (kind === 'detail') {
    const dates = state.dates;
    const days = (dates.start && dates.end && new Date(dates.end) > new Date(dates.start))
      ? Math.round((new Date(dates.end) - new Date(dates.start)) / 86400000)
      : 0;
    const estTotal = days * form.price;

    modalBody = `
      <span class="pill">${escapeHtml(form.category)} · ${escapeHtml(form.city)}</span>
      <h2>${escapeHtml(form.name)}</h2>
      ${form.image ? `
        <div class="vehicle-art ${form.category.toLowerCase()}" style="height:210px;border-radius:10px;overflow:hidden;margin:12px 0;">
          <img src="${form.image}" alt="${escapeHtml(form.name)}" style="width:100%;height:100%;object-fit:cover;">
        </div>
      ` : ''}
      <p>${escapeHtml(form.description || 'A comfortable ride for your next journey.')}</p>
      <div class="specs">
        <span>${icons.users(13)} ${form.seats} seats</span>
        <span>${icons.fuel(13)} ${escapeHtml(form.fuel)}</span>
        <span>${icons.gauge(13)} ${escapeHtml(form.transmission)}</span>
      </div>
      <p>Listed by ${escapeHtml(form.owner_name)}</p>
      <h3>${money(form.price)} <small>/ day</small></h3>

      <form id="detail-booking-form">
        <div class="form-grid">
          <label>Pickup date
            <input type="date" id="book-start-date" name="start" min="${today()}" required value="${escapeHtml(dates.start || '')}">
          </label>
          <label>Return date
            <input type="date" id="book-end-date" name="end" min="${dates.start || today()}" required value="${escapeHtml(dates.end || '')}">
          </label>
        </div>

        <div id="quote-container" class="quote" style="${days > 0 ? '' : 'display:none;'}margin-top:14px;">
          Estimated total <strong id="quote-amount">${money(estTotal)}</strong>
        </div>

        <p class="muted">Charged per day, excluding the return date. Pay at pickup. Requests reserve your selected dates while awaiting owner approval.</p>
        <button class="dark full" type="submit" ${state.busy || !form.available || state.user?.role === 'owner' ? 'disabled' : ''}>
          ${state.user?.role === 'owner'
            ? 'Use a customer account to book'
            : !form.available
              ? 'Currently unavailable'
              : !state.user
                ? 'Log in to book'
                : 'Request booking'}
        </button>
      </form>
    `;
  }

  container.innerHTML = `
    <div class="backdrop" id="modal-backdrop">
      <section class="modal" role="dialog" aria-modal="true" aria-label="${kind}">
        <button class="close" id="btn-modal-close">×</button>
        ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ''}
        ${modalBody}
      </section>
    </div>
  `;

  // Close handlers
  document.getElementById('btn-modal-close').onclick = closeModal;
  document.getElementById('modal-backdrop').onclick = e => {
    if (e.target.id === 'modal-backdrop') closeModal();
  };

  // Auth form handlers
  if (kind === 'login' || kind === 'register') {
    const authForm = document.getElementById('auth-form');
    authForm.onsubmit = async e => {
      e.preventDefault();
      const fd = new FormData(authForm);
      const data = Object.fromEntries(fd.entries());
      state.busy = true;
      try {
        if (kind === 'register') {
          await api('/auth/register', 'POST', data);
        }
        const res = await api('/auth/login', 'POST', {
          email: data.email,
          password: data.password
        });
        sessionStorage.setItem('token', res.token);
        state.user = res.user;
        closeModal();
        setNotice('Welcome, ' + res.user.name);
        renderHeader();
        refresh();
      } catch (err) {
        setError(err.message);
        renderModal();
      } finally {
        state.busy = false;
      }
    };

    document.getElementById('btn-switch-auth').onclick = () => {
      openModal(kind === 'login' ? 'register' : 'login', { role: 'customer' });
    };
  }

  // Vehicle form handlers
  if (kind === 'vehicle') {
    const fileInput = document.getElementById('vehicle-file-input');
    const imageInput = document.getElementById('vehicle-image-input');
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview-img');
    const clearBtn = document.getElementById('btn-clear-image');

    // Live file upload conversion to embedded Data URL with canvas downscaling
    fileInput.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = evt => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Embedded image data URL
          const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mime, 0.85);
          imageInput.value = dataUrl;
          previewImg.src = dataUrl;
          previewContainer.style.display = 'block';
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    };

    imageInput.oninput = () => {
      const val = imageInput.value.trim();
      if (val) {
        previewImg.src = val;
        previewContainer.style.display = 'block';
      } else {
        previewContainer.style.display = 'none';
      }
    };

    clearBtn.onclick = () => {
      fileInput.value = '';
      imageInput.value = '';
      previewContainer.style.display = 'none';
    };

    const vForm = document.getElementById('vehicle-form');
    vForm.onsubmit = async e => {
      e.preventDefault();
      const fd = new FormData(vForm);
      const payload = {
        name: fd.get('name'),
        brand: fd.get('brand'),
        city: fd.get('city'),
        registration: fd.get('registration'),
        category: fd.get('category'),
        fuel: fd.get('fuel'),
        transmission: fd.get('transmission'),
        seats: fd.get('seats'),
        price: fd.get('price'),
        image: imageInput.value.trim(),
        description: fd.get('description') || '',
        available: fd.get('available') === 'on'
      };

      state.busy = true;
      try {
        if (form._id) {
          await api('/vehicles/' + form._id, 'PUT', payload);
        } else {
          await api('/vehicles', 'POST', payload);
        }
        closeModal();
        setNotice('Vehicle saved');
        await refresh();
      } catch (err) {
        setError(err.message);
        renderModal();
      } finally {
        state.busy = false;
      }
    };
  }

  // Detail booking form handlers
  if (kind === 'detail') {
    const startDateInput = document.getElementById('book-start-date');
    const endDateInput = document.getElementById('book-end-date');
    const quoteBox = document.getElementById('quote-container');
    const quoteAmount = document.getElementById('quote-amount');

    function updateQuote() {
      const s = startDateInput.value;
      const e = endDateInput.value;
      state.dates = { start: s, end: e };
      if (s && e && new Date(e) > new Date(s)) {
        const d = Math.round((new Date(e) - new Date(s)) / 86400000);
        quoteAmount.textContent = money(d * form.price);
        quoteBox.style.display = 'flex';
      } else {
        quoteBox.style.display = 'none';
      }
    }

    startDateInput.onchange = () => {
      endDateInput.min = startDateInput.value || today();
      updateQuote();
    };
    endDateInput.onchange = updateQuote;

    const bForm = document.getElementById('detail-booking-form');
    bForm.onsubmit = async e => {
      e.preventDefault();
      if (!state.user) {
        openModal('login');
        return;
      }
      state.busy = true;
      try {
        await api('/bookings', 'POST', {
          vehicle_id: form._id,
          start: startDateInput.value,
          end: endDateInput.value
        });
        closeModal();
        setPage('bookings');
        setNotice('Booking requested. The owner will review your request.');
      } catch (err) {
        setError(err.message);
        renderModal();
      } finally {
        state.busy = false;
      }
    };
  }
}

// App Initialization
async function initApp() {
  renderHeader();
  renderNotices();
  renderMain();

  const token = sessionStorage.getItem('token');
  if (token) {
    try {
      const profile = await api('/profile');
      state.user = profile;
    } catch {
      sessionStorage.removeItem('token');
      state.user = null;
    }
  }

  renderHeader();
  await refresh();
}

// Start app once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
