// All listings are fictional. Update this array to change inventory across the site.
const vehicles = [
  { id: 'mustang', brand: 'Ford', model: 'Mustang GT', year: 2022, mileage: 24500, horsepower: 450, price: 35900, color: 'red', image: 'images/mustang-gt.jpeg', badge: 'V8 PERFORMANCE' },
  { id: 'camaro', brand: 'Chevrolet', model: 'Camaro SS', year: 2021, mileage: 31200, horsepower: 455, price: 33500, color: 'blue', image: 'images/camaro-ss.jpeg', badge: 'TRACK READY' },
  { id: 'challenger', brand: 'Dodge', model: 'Challenger R/T', year: 2020, mileage: 42000, horsepower: 372, price: 29900, color: 'gold', image: 'images/challenger-rt.jpeg', badge: 'MUSCLE ICON' },
  { id: 'explorer', brand: 'Ford', model: 'Explorer ST', year: 2021, mileage: 38500, horsepower: 400, price: 32500, color: 'silver', image: 'images/explorer-st.jpeg', badge: 'DAILY PERFORMANCE' }
];


// Fictional premium performance inventory for the Super Sports Cars page.
const superCars = [
  { id: 'gt500', brand: 'Ford', model: 'Shelby GT500', year: 2022, mileage: 12500, horsepower: 760, price: 99900, image: 'images/shelby-gt500.jpeg', badge: 'SUPERCHARGED V8' },
  { id: 'gt3rs', brand: 'Porsche', model: '911 GT3 RS', year: 2023, mileage: 4400, horsepower: 518, price: 279900, image: 'images/porsche-gt3rs.jpeg', badge: 'TRACK SPECIAL' },
  { id: 'z06', brand: 'Chevrolet', model: 'Corvette Z06', year: 2024, mileage: 6100, horsepower: 670, price: 139900, image: 'images/corvette-z06.jpeg', badge: 'MID-ENGINE V8' },
  { id: 'huracan', brand: 'Lamborghini', model: 'Huracán', year: 2023, mileage: 3600, horsepower: 631, price: 289900, image: 'images/huracan.jpeg', badge: 'ITALIAN EXOTIC' }
];
const allVehicles = vehicles.concat(superCars);

const money = amount => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
const number = amount => new Intl.NumberFormat('en-US').format(amount);

function vehicleCard(vehicle) {
  const title = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
  return `<article class="vehicle-card">
    <a class="vehicle-picture vehicle-picture-link" href="vehicle.html?id=${encodeURIComponent(vehicle.id)}" aria-label="View details for ${title}"><img class="vehicle-photo" src="${vehicle.image}" alt="${title}" loading="lazy"><span class="vehicle-tag">${vehicle.badge}</span></a>
    <div class="vehicle-info"><h3><a class="vehicle-title-link" href="vehicle.html?id=${encodeURIComponent(vehicle.id)}">${vehicle.brand} ${vehicle.model}</a></h3><p class="vehicle-meta">${vehicle.year} &nbsp;•&nbsp; ${number(vehicle.mileage)} miles &nbsp;•&nbsp; ${vehicle.horsepower} HP</p>
    <div class="vehicle-bottom"><span class="vehicle-price">${money(vehicle.price)}</span><a class="card-link" href="vehicle.html?id=${encodeURIComponent(vehicle.id)}">View Details →</a></div></div></article>`;
}

function setupNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
  });
}

function setupFeatured() {
  const featured = document.getElementById('featured-vehicles');
  if (featured) featured.innerHTML = [superCars[1], superCars[2], superCars[0], vehicles[3]].map(vehicleCard).join('');
}

function setupInventory() {
  const grid = document.getElementById('inventory-vehicles');
  if (!grid) return;
  const brandFilter = document.getElementById('brand-filter');
  const priceFilter = document.getElementById('price-filter');
  const resultCount = document.getElementById('inventory-count');
  const empty = document.getElementById('no-results');

  function renderInventory() {
    const brand = brandFilter.value;
    const price = priceFilter.value;
    const matching = vehicles.filter(function (vehicle) {
      const matchesBrand = brand === 'all' || vehicle.brand === brand;
      const matchesPrice = price === 'all' || vehicle.price <= Number(price);
      const params = new URLSearchParams(window.location.search);
      const matchesModel = !params.has('model') || vehicle.id === params.get('model');
      return matchesBrand && matchesPrice && matchesModel;
    });
    grid.innerHTML = matching.map(vehicleCard).join('');
    resultCount.textContent = `${matching.length} vehicle${matching.length === 1 ? '' : 's'} found`;
    empty.hidden = matching.length > 0;
  }
  const params = new URLSearchParams(window.location.search);
  if (['Ford','Chevrolet','Dodge'].includes(params.get('brand'))) brandFilter.value = params.get('brand');
  if (['30000','35000','40000'].includes(params.get('price'))) priceFilter.value = params.get('price');
  brandFilter.addEventListener('change', renderInventory);
  priceFilter.addEventListener('change', renderInventory);
  renderInventory();
}

function setupSuperCars() {
  const grid = document.getElementById('supercar-vehicles');
  if (!grid) return;
  const brandFilter = document.getElementById('super-brand-filter');
  const sortFilter = document.getElementById('super-sort-filter');
  const count = document.getElementById('supercar-count');
  const empty = document.getElementById('super-no-results');

  function renderSuperCars() {
    const matching = superCars.filter(function (car) {
      const params = new URLSearchParams(window.location.search);
      const matchesBrand = brandFilter.value === 'all' || car.brand === brandFilter.value;
      const matchesPrice = !params.has('price') || params.get('price') === 'all' || car.price <= Number(params.get('price'));
      const matchesModel = !params.has('model') || car.id === params.get('model');
      return matchesBrand && matchesPrice && matchesModel;
    });
    if (sortFilter.value === 'price-low') matching.sort(function (a, b) { return a.price - b.price; });
    if (sortFilter.value === 'price-high') matching.sort(function (a, b) { return b.price - a.price; });
    if (sortFilter.value === 'horsepower') matching.sort(function (a, b) { return b.horsepower - a.horsepower; });
    grid.innerHTML = matching.map(vehicleCard).join('');
    count.textContent = matching.length + (matching.length === 1 ? ' vehicle found' : ' vehicles found');
    empty.hidden = matching.length > 0;
  }
  const params = new URLSearchParams(window.location.search);
  if (['Ford','Chevrolet','Porsche','Lamborghini'].includes(params.get('brand'))) brandFilter.value = params.get('brand');
  brandFilter.addEventListener('change', renderSuperCars);
  sortFilter.addEventListener('change', renderSuperCars);
  renderSuperCars();
}

function setupComparison() {
  const rows = document.getElementById('comparison-rows');
  if (!rows) return;
  rows.innerHTML = vehicles.map(function (vehicle) {
    const name = `${vehicle.brand} ${vehicle.model}`;
    return `<tr><td>${name}</td><td>${vehicle.year}</td><td>${number(vehicle.mileage)} mi</td><td>${vehicle.horsepower} HP</td><td>${money(vehicle.price)}</td><td><a href="test-drive.html?vehicle=${encodeURIComponent(vehicle.id)}" aria-label="Request a test drive for ${name}">Test drive →</a></td></tr>`;
  }).join('');
}

function setupTestDriveForm() {
  const form = document.getElementById('test-drive-form');
  if (!form) return;
  const select = document.getElementById('vehicle');
  const date = document.getElementById('date');
  const confirmation = document.getElementById('form-confirmation');

  allVehicles.forEach(function (vehicle) {
    const option = document.createElement('option');
    option.value = vehicle.id;
    option.textContent = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
    select.appendChild(option);
  });

  const requestedVehicle = new URLSearchParams(window.location.search).get('vehicle');
  if (allVehicles.some(function (vehicle) { return vehicle.id === requestedVehicle; })) select.value = requestedVehicle;

  const localNow = new Date();
  const today = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
  date.min = today;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    confirmation.hidden = true;
    if (!form.reportValidity()) return;
    if (date.value < today) {
      date.setCustomValidity('Choose today or a future date.');
      date.reportValidity();
      return;
    }
    const chosen = allVehicles.find(function (vehicle) { return vehicle.id === select.value; });
    const name = document.getElementById('full-name').value.trim();
    if (name.length < 2) {
      const nameInput = document.getElementById('full-name');
      nameInput.setCustomValidity('Enter at least two characters.');
      nameInput.reportValidity();
      return;
    }
    // textContent prevents user-entered names from being interpreted as HTML.
    confirmation.textContent = `Thanks, ${name}! Your demo request for the ${chosen.year} ${chosen.brand} ${chosen.model} on ${date.value} was validated successfully. No information was sent or saved.`;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('full-name').addEventListener('input', function (event) { event.target.setCustomValidity(''); });
  date.addEventListener('input', function () { date.setCustomValidity(''); });
}


function setupHeroSearch() {
  const form = document.getElementById('hero-search');
  if (!form) return;
  const brand = document.getElementById('home-brand');
  const model = document.getElementById('home-model');
  const price = document.getElementById('home-price');
  const type = document.getElementById('home-type');

  function updateModels() {
    const matching = allVehicles.filter(function (car) {
      return brand.value === 'all' || car.brand === brand.value;
    });
    model.replaceChildren(new Option('All Models','all'));
    matching.forEach(function (car) {
      model.add(new Option(car.model, car.id));
    });
  }
  brand.addEventListener('change', updateModels);
  updateModels();
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const chosen = allVehicles.find(function (car) { return car.id === model.value; });
    const wantsSuper = type.value === 'super' || (chosen && superCars.includes(chosen)) ||
      (type.value === 'all' && ['Porsche','Lamborghini'].includes(brand.value));
    const destination = wantsSuper ? 'super-sports.html' : 'inventory.html';
    const params = new URLSearchParams();
    if (brand.value !== 'all') params.set('brand',brand.value);
    if (price.value !== 'all') params.set('price',price.value);
    if (model.value !== 'all') params.set('model',model.value);
    window.location.href = destination + (params.size ? '?' + params.toString() : '');
  });
}


// Model-level descriptions are illustrative; individual-car options are not verified.
const vehicleDetails = {
  mustang: { engine: '5.0L naturally aspirated V8', transmission: '6-speed manual or 10-speed automatic', drivetrain: 'Rear-wheel drive', body: 'Sports coupe', seats: '4', highlights: ['Classic American V8 sound', 'Selectable drive modes', 'Sporty rear-wheel-drive handling'], description: 'The Mustang GT combines classic muscle-car character with modern technology. Its naturally aspirated V8 makes it an exciting choice for drivers who want everyday usability and strong acceleration.' },
  camaro: { engine: '6.2L naturally aspirated V8', transmission: '6-speed manual or 10-speed automatic', drivetrain: 'Rear-wheel drive', body: 'Sports coupe', seats: '4', highlights: ['Responsive V8 performance', 'Driver-focused cockpit', 'Sport-tuned chassis'], description: 'The Camaro SS brings sharp handling and naturally aspirated V8 performance together in a low-slung muscle coupe. Its performance-oriented layout rewards engaging drives.' },
  challenger: { engine: '5.7L HEMI V8', transmission: '6-speed manual or 8-speed automatic', drivetrain: 'Rear-wheel drive', body: 'Muscle coupe', seats: '5', highlights: ['Distinctive retro styling', 'V8 muscle-car character', 'Roomier coupe cabin'], description: 'The Challenger R/T leans into traditional muscle-car styling with a roomy cabin and unmistakable HEMI V8 personality. It is designed to make cruising as enjoyable as the drive itself.' },
  explorer: { engine: '3.0L twin-turbocharged V6', transmission: '10-speed automatic', drivetrain: 'All-wheel drive', body: 'Performance SUV', seats: 'Up to 6 or 7, configuration dependent', highlights: ['Practical three-row SUV design', 'Twin-turbo power', 'Performance-oriented ST tuning'], description: 'The Explorer ST combines the practicality of a family SUV with an energetic twin-turbo V6. It offers a flexible cabin and useful everyday capability without giving up driving excitement.' },
  gt500: { engine: '5.2L supercharged V8', transmission: '7-speed dual-clutch automatic', drivetrain: 'Rear-wheel drive', body: 'High-performance coupe', seats: '4, configuration dependent', highlights: ['Supercharged V8 performance', 'Rapid dual-clutch shifts', 'Track-focused cooling and aerodynamics'], description: 'The Shelby GT500 is an extreme interpretation of the Mustang, built around a supercharged V8 and rapid-shifting dual-clutch transmission. It emphasizes straight-line speed and serious track capability.' },
  gt3rs: { engine: '4.0L naturally aspirated flat-six', transmission: '7-speed PDK dual-clutch', drivetrain: 'Rear-wheel drive', body: 'Track-focused sports coupe', seats: '2', highlights: ['High-revving flat-six', 'Active aerodynamic elements', 'Motorsport-inspired chassis tuning'], description: 'The Porsche 911 GT3 RS puts track performance first. Lightweight thinking, sophisticated aerodynamics, and an exceptionally responsive flat-six deliver a motorsport-inspired driving experience.' },
  z06: { engine: '5.5L naturally aspirated flat-plane-crank V8', transmission: '8-speed dual-clutch automatic', drivetrain: 'Rear-wheel drive', body: 'Mid-engine sports car', seats: '2', highlights: ['Mid-engine balance', 'High-revving flat-plane-crank V8', 'Wide-body performance styling'], description: 'The Corvette Z06 pushes the mid-engine Corvette formula toward the racetrack. Its distinctive V8 character, aggressive stance, and balanced layout make it a standout American performance car.' },
  huracan: { engine: '5.2L naturally aspirated V10', transmission: '7-speed dual-clutch automatic', drivetrain: 'Rear-wheel or all-wheel drive, depending on variant', body: 'Exotic sports coupe', seats: '2', highlights: ['Naturally aspirated V10 soundtrack', 'Exotic low-slung design', 'Sharp throttle response'], description: 'The Huracán represents Lamborghini’s dramatic approach to supercar design. A naturally aspirated V10 provides an unforgettable soundtrack, while its low profile and dramatic styling draw attention everywhere.' }
};

const vehicleInteriors = {
  'mustang': { image: 'images/mustang-interior.jpeg', title: 'Mustang GT interior', description: 'The Mustang GT features a driver-focused cockpit, a classic dual-cowl dashboard, and easy-to-reach driving controls.' },
  'camaro': { image: 'images/camaro-interior.jpeg', title: 'Camaro SS interior', description: 'The Camaro SS cabin emphasizes the driver with a sporty steering wheel, performance gauges, and a center console designed around driving.' },
  'challenger': { image: 'images/challenger-interior.jpeg', title: 'Challenger R/T interior', description: 'The Challenger R/T uses a wide dashboard and a spacious muscle-car cockpit, balancing familiar styling with everyday comfort.' },
  'explorer': { image: 'images/explorer-interior.jpeg', title: 'Explorer ST interior', description: 'The Explorer ST offers an SUV cabin with modern screens, convenient storage, and performance-inspired interior accents.' },
  'gt500': { image: 'images/gt500-interior.webp', title: 'Shelby GT500 interior', description: 'The Shelby GT500 adds race-inspired touches to the Mustang cockpit, including sport seats and a performance-oriented steering wheel.' },
  'gt3rs': { image: 'images/gt3rs-interior.jpeg', title: 'Porsche 911 GT3 RS interior', description: 'The Porsche 911 GT3 RS favors purposeful controls and highly supportive seating, creating an immersive, track-focused driving environment.' },
  'z06': { image: 'images/z06-interior.jpeg', title: 'Corvette Z06 interior', description: 'The Corvette Z06 surrounds the driver with a cockpit-style console, digital instruments, and distinctively modern controls.' },
  'huracan': { image: 'images/huracan-interior.jpeg', title: 'Lamborghini Huracán interior', description: 'The Huracán cockpit features an angular dashboard, bold console controls, and a dramatic design matching its exotic exterior.' }
};

// Each detail page adopts a color palette inspired by the selected vehicle.
// Kept separate from the paint customizer: repainting the illustration does not
// change the identity of the listing or its page theme.
const vehicleThemeNames = {
  mustang: 'mustang', camaro: 'camaro', challenger: 'challenger',
  explorer: 'explorer', gt500: 'gt500', gt3rs: 'gt3rs',
  z06: 'z06', huracan: 'huracan'
};

function setupVehicleDetails() {
  const section = document.getElementById('vehicle-detail');
  if (!section) return;
  const id = new URLSearchParams(window.location.search).get('id');
  const vehicle = allVehicles.find(function (item) { return item.id === id; });
  const notFound = document.getElementById('vehicle-not-found');
  if (!vehicle) {
    section.hidden = true;
    notFound.hidden = false;
    document.title = 'Vehicle Not Found | CC Autosports';
    return;
  }
  // Apply the theme to the whole detail page, including the site navigation.
  document.body.classList.add('vehicle-theme', 'theme-' + vehicleThemeNames[vehicle.id]);
  const details = vehicleDetails[vehicle.id];
  const name = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
  const backPage = superCars.includes(vehicle) ? 'super-sports.html' : 'inventory.html';
  document.title = name + ' | CC Autosports';
  document.querySelector('meta[name="description"]').content = 'Explore details, performance and specifications for the ' + name + ' at CC Autosports.';
  document.getElementById('vehicle-back').href = backPage;
  document.getElementById('vehicle-back').textContent = '← Back to ' + (superCars.includes(vehicle) ? 'Super Sports Cars' : 'Inventory');
  document.getElementById('vehicle-category').textContent = vehicle.badge;
  document.getElementById('vehicle-name').textContent = name;
  document.getElementById('vehicle-description').textContent = details.description;
  const photo = document.getElementById('vehicle-large-photo');
  photo.src = vehicle.image;
  photo.alt = name + ' exterior photo';
  const interior = vehicleInteriors[vehicle.id];
  const interiorPhoto = document.getElementById('vehicle-interior-photo');
  interiorPhoto.src = interior.image;
  interiorPhoto.alt = name + ' interior dashboard and front seating area';
  document.getElementById('vehicle-interior-title').textContent = interior.title;
  document.getElementById('vehicle-interior-description').textContent = interior.description;
  document.getElementById('vehicle-price').textContent = money(vehicle.price);
  document.getElementById('vehicle-mileage').textContent = number(vehicle.mileage) + ' miles';
  document.getElementById('vehicle-horsepower').textContent = number(vehicle.horsepower) + ' HP';
  const specs = [
    ['Year', vehicle.year], ['Make', vehicle.brand], ['Model', vehicle.model],
    ['Engine', details.engine], ['Transmission', details.transmission],
    ['Drivetrain', details.drivetrain], ['Body style', details.body],
    ['Seating', details.seats], ['Horsepower', number(vehicle.horsepower) + ' HP'],
    ['Listed mileage', number(vehicle.mileage) + ' miles']
  ];
  document.getElementById('vehicle-specs').innerHTML = specs.map(function (spec) {
    return '<div class="detail-spec"><dt>' + spec[0] + '</dt><dd>' + spec[1] + '</dd></div>';
  }).join('');
  document.getElementById('vehicle-highlights').innerHTML = details.highlights.map(function (highlight) {
    return '<li>' + highlight + '</li>';
  }).join('');
  setupCustomization(vehicle);
  setupHistory(vehicle);
  document.getElementById('vehicle-test-drive').href = 'test-drive.html?vehicle=' + encodeURIComponent(vehicle.id);
}


// The configurator is intentionally a model-neutral visual demo; it does not promise actual inventory options.
function setupCustomization(vehicle) {
  const stage = document.getElementById('custom-preview-stage');
  if (!stage) return;
  const paints = { red: '#bd2137', blue: '#2564bb', black: '#262b32', white: '#e6ebf0', silver: '#8795a8' };
  const wheelFinishes = {standard:['Silver',0,'#c7d2e2'],black:['Black',900,'#303948'],bronze:['Bronze',1200,'#b88950']};
  const interiors = {standard:['Standard black',0],red:['Red accents',650],tan:['Tan accents',650]};
  const packages = {none:['None',0],appearance:['Appearance package',1500],performance:['Performance-inspired package',3000]};
  const wheels = document.getElementById('custom-wheels');
  const interior = document.getElementById('custom-interior');
  const pack = document.getElementById('custom-package');
  const paintChoices = document.getElementById('paint-choices');
  document.getElementById('custom-preview-name').textContent = vehicle.year + ' ' + vehicle.brand + ' ' + vehicle.model;
  function update() {
    const selectedPaint = document.querySelector('input[name="custom-paint"]:checked').value;
    document.getElementById('custom-car-body').setAttribute('fill',paints[selectedPaint]);
    document.querySelectorAll('.wheel-finish').forEach(function (circle) { circle.setAttribute('fill',wheelFinishes[wheels.value][2]); });
    const additions = wheelFinishes[wheels.value][1] + interiors[interior.value][1] + packages[pack.value][1];
    document.getElementById('custom-total').textContent = money(vehicle.price + additions);
    document.getElementById('custom-summary').innerHTML = '<h3>Your example configuration</h3>' +
      '<p>Paint: <strong>' + selectedPaint[0].toUpperCase() + selectedPaint.slice(1) + '</strong></p>' +
      '<p>Wheels: <strong>' + wheelFinishes[wheels.value][0] + '</strong></p>' +
      '<p>Interior: <strong>' + interiors[interior.value][0] + '</strong></p>' +
      '<p>Package: <strong>' + packages[pack.value][0] + '</strong></p>' +
      '<p>Sample add-ons: <strong>' + money(additions) + '</strong></p>';
  }
  paintChoices.addEventListener('change',update);
  wheels.addEventListener('change',update);
  interior.addEventListener('change',update);
  pack.addEventListener('change',update);
  document.getElementById('custom-reset').addEventListener('click',function () {
    document.querySelector('input[name="custom-paint"][value="red"]').checked = true;
    wheels.value = 'standard'; interior.value = 'standard'; pack.value = 'none'; update();
  });
  update();
}

// All entries are deliberately fictional and individually linked to the selected demo listing.
const sampleHistory = {
  mustang: {owners:'1 example',title:'Not verified',condition:'Very good (sample)',steps:['Oil and filter service — example','Brake inspection — example']},
  camaro: {owners:'2 example',title:'Not verified',condition:'Good (sample)',steps:['Tire rotation — example','Fluid check — example']},
  challenger: {owners:'2 example',title:'Not verified',condition:'Good (sample)',steps:['Battery inspection — example','Oil service — example']},
  explorer: {owners:'1 example',title:'Not verified',condition:'Very good (sample)',steps:['Multi-point inspection — example','Air filter service — example']},
  gt500: {owners:'1 example',title:'Not verified',condition:'Excellent (sample)',steps:['Performance systems inspection — example','Oil and filter service — example']},
  gt3rs: {owners:'1 example',title:'Not verified',condition:'Excellent (sample)',steps:['Brake inspection — example','Scheduled maintenance — example']},
  z06: {owners:'1 example',title:'Not verified',condition:'Excellent (sample)',steps:['Fluid inspection — example','Tire check — example']},
  huracan: {owners:'1 example',title:'Not verified',condition:'Excellent (sample)',steps:['Pre-drive inspection — example','Scheduled maintenance — example']}
};
function setupHistory(vehicle) {
  const report = sampleHistory[vehicle.id];
  const stats = [['Demo mileage',number(vehicle.mileage)+' mi'],['Previous owners',report.owners],['Title status',report.title],['Accident records','Not verified'],['Overall condition',report.condition],['Service documentation','Not verified']];
  document.getElementById('history-metrics').innerHTML = stats.map(function (item) {
    return '<div class="history-metric"><span>' + item[0] + '</span><strong>' + item[1] + '</strong></div>';
  }).join('');
  document.getElementById('history-checklist').innerHTML = ['Exterior and paint — sample inspection item','Interior and controls — sample inspection item','Tires and brakes — sample inspection item','Engine compartment — sample inspection item'].map(function (item) {return '<li>' + item + '</li>';}).join('');
  document.getElementById('history-timeline').innerHTML = report.steps.map(function (item) {return '<li>' + item + '</li>';}).join('');
}

setupNavigation();
setupHeroSearch();
setupFeatured();
setupInventory();
setupSuperCars();
setupComparison();
setupTestDriveForm();
setupVehicleDetails();
const year = document.getElementById('current-year');
if (year) year.textContent = new Date().getFullYear();
