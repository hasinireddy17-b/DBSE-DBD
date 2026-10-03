const API_BASE_URL = "http://localhost:5000/api";


// =========================
// AUTH
// =========================

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return await response.json();
}


export async function loginUser(loginData) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData)
  });

  return await response.json();
}


// =========================
// PARKING
// =========================

export async function getParkingArea() {
  const response = await fetch(
    `${API_BASE_URL}/parking/areas/1`
  );

  return await response.json();
}


export async function getParkingStatus() {
  const response = await fetch(
    `${API_BASE_URL}/parking/areas/1/status`
  );

  return await response.json();
}


export async function getParkingSlots() {
  const response = await fetch(
    `${API_BASE_URL}/parking/areas/1/slots`
  );

  return await response.json();
}


export async function getAvailableSlots() {
  const response = await fetch(
    `${API_BASE_URL}/parking/areas/1/available-slots`
  );

  return await response.json();
}


// =========================
// BOOKINGS
// =========================

export async function createBooking(bookingData) {
  const response = await fetch(
    `${API_BASE_URL}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    }
  );

  return await response.json();
}


export async function getUserBookings(userId) {
  const response = await fetch(
    `${API_BASE_URL}/bookings/user/${userId}`
  );

  return await response.json();
}


export async function getBooking(bookingId) {
  const response = await fetch(
    `${API_BASE_URL}/bookings/${bookingId}`
  );

  return await response.json();
}


// =========================
// PAYMENTS
// =========================

export async function createPayment(paymentData) {

  console.log("Sending payment data:", paymentData);

  const response = await fetch(
    "http://localhost:5000/api/payments",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(paymentData)
    }
  );

  const data = await response.json();

  console.log("Payment API response:", data);

  return data;
}