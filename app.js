const form = document.getElementById('rentalForm');
const daysInput = document.getElementById('days');
const quantityInput = document.getElementById('quantity');
const itemSelect = document.getElementById('item');
const message = document.getElementById('message');
const total = document.getElementById('total');
const details = document.getElementById('details');
const success = document.getElementById('success');
const calculateButton = document.getElementById('calculate');

function calculateTotal(showError = true) {
  message.textContent = '';
  success.hidden = true;
  const price = Number(itemSelect.value);
  const days = Number(daysInput.value);
  const quantity = Number(quantityInput.value);

  if (daysInput.value.trim() === '' || quantityInput.value.trim() === '') {
    if (showError) message.textContent = 'Күн саны мен жабдық санын енгізіңіз.';
    return null;
  }
  if (!Number.isInteger(days) || !Number.isInteger(quantity) || days < 1 || quantity < 1) {
    if (showError) message.textContent = 'Күн саны мен жабдық саны 1-ден кем болмауы керек.';
    return null;
  }
  if (days > 365 || quantity > 50) {
    if (showError) message.textContent = 'Күн саны 365-тен, жабдық саны 50-ден аспауы керек.';
    return null;
  }

  const sum = price * days * quantity;
  total.textContent = sum.toLocaleString('kk-KZ') + ' ₸';
  details.textContent = `${price.toLocaleString('kk-KZ')} ₸ × ${days} күн × ${quantity} дана`;
  return { price, days, quantity, sum };
}

calculateButton.addEventListener('click', () => calculateTotal(true));
[itemSelect, daysInput, quantityInput].forEach(el => {
  el.addEventListener('change', () => calculateTotal(false));
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const calculation = calculateTotal(true);
  if (!calculation) return;

  const customer = document.getElementById('customer').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const date = document.getElementById('date').value;
  const comment = document.getElementById('comment').value.trim();

  if (!customer || !phone || !date) {
    message.textContent = 'Тапсырыс беру үшін аты-жөніңізді, телефон нөмірін және күнді толтырыңыз.';
    return;
  }
  if (!/^[+0-9()\\s-]{7,20}$/.test(phone)) {
    message.textContent = 'Телефон нөмірін дұрыс форматта енгізіңіз.';
    return;
  }
  const selectedName = itemSelect.options[itemSelect.selectedIndex].text.split(' — ')[0];
  const niceDate = new Date(date + 'T00:00:00').toLocaleDateString('kk-KZ');
  success.innerHTML = `<b>Тапсырысыңыз дайын!</b><br>
    Аты-жөні: ${escapeHTML(customer)}<br>
    Телефон: ${escapeHTML(phone)}<br>
    Жабдық: ${escapeHTML(selectedName)}<br>
    Күні: ${escapeHTML(niceDate)}<br>
    Күн саны: ${calculation.days}<br>
    Жабдық саны: ${calculation.quantity}<br>
    Жалпы құны: <b>${calculation.sum.toLocaleString('kk-KZ')} ₸</b>
    ${comment ? '<br>Қосымша ақпарат: ' + escapeHTML(comment) : ''}
    <br><small>Бұл демо-нұсқа: тапсырыс серверге жіберілген жоқ.</small>`;
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  message.textContent = '';
});

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}