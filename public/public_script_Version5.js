// For dashboard page (index.html)
function showDashboard() {
  async function fetchDonations() {
    const res = await fetch('/api/donations');
    return await res.json();
  }
  async function updateDonations() {
    const donations = await fetchDonations();
    let total = 0;
    const tbody = document.getElementById('donationsList');
    tbody.innerHTML = '';
    donations.forEach(({name, amount}) => {
      total += amount;
      const row = document.createElement('tr');
      row.innerHTML = `<td>${name}</td><td>₹${amount}</td>`;
      tbody.appendChild(row);
    });
    document.getElementById('totalAmount').textContent = total;
  }
  updateDonations();
}

// For admin page (admin.html)
function showAdmin() {
  let adminPassword = "";
  window.checkPassword = function() {
    const pass = document.getElementById('passwordInput').value;
    if (pass === "kogatam2025") {
      adminPassword = pass;
      document.getElementById('passwordDiv').style.display = 'none';
      document.getElementById('formDiv').style.display = 'block';
    } else {
      document.getElementById('passError').textContent = "పాస్‌వర్డ్ తప్పు";
    }
  }
  document.getElementById('donationForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('donorName').value.trim();
    const amount = parseFloat(document.getElementById('donationAmount').value);
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, amount, password: adminPassword })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('formMsg').textContent = "దాత నమోదు విజయవంతం!";
      document.getElementById('donationForm').reset();
    } else {
      document.getElementById('formMsg').textContent = data.error || "లోపం జరిగింది";
    }
  });
}