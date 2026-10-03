USE vehicle_parking;

SELECT * FROM parking_areas;
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO parking_areas
(area_name, location, total_slots, available_slots, price_per_hour)
VALUES
('Kukatpally Metro Parking', 'Kukatpally, Hyderabad', 100, 75, 30),
('JNTU Parking Zone', 'Kukatpally, Hyderabad', 80, 52, 25),
('Forum Mall Parking', 'Kukatpally, Hyderabad', 150, 100, 40),
('Hitech City Parking', 'Hitech City, Hyderabad', 200, 145, 50),
('Madhapur Parking Hub', 'Madhapur, Hyderabad', 120, 80, 35);
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    area_id INT NOT NULL,

    slot_id INT NOT NULL,

    vehicle_number VARCHAR(20) NOT NULL,

    booking_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    total_amount DECIMAL(10,2) NOT NULL,

    booking_status ENUM('CONFIRMED', 'CANCELLED')
    DEFAULT 'CONFIRMED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(user_id),

    FOREIGN KEY (area_id)
    REFERENCES parking_areas(area_id),

    FOREIGN KEY (slot_id)
    REFERENCES parking_slots(slot_id)
);
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,

    booking_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    payment_method VARCHAR(50),

    transaction_id VARCHAR(100),

    payment_status ENUM('SUCCESS', 'FAILED', 'PENDING')
    DEFAULT 'PENDING',

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
    REFERENCES bookings(booking_id)
);

INSERT INTO parking_slots
(area_id, slot_number, vehicle_type, status)
VALUES
(1, 'A01', 'CAR', 'AVAILABLE'),
(1, 'A02', 'CAR', 'AVAILABLE'),
(1, 'A03', 'CAR', 'AVAILABLE'),
(1, 'A04', 'CAR', 'BOOKED'),
(1, 'A05', 'CAR', 'AVAILABLE'),

(2, 'B01', 'CAR', 'AVAILABLE'),
(2, 'B02', 'CAR', 'AVAILABLE'),
(2, 'B03', 'BIKE', 'AVAILABLE'),
(2, 'B04', 'CAR', 'BOOKED'),

(3, 'C01', 'CAR', 'AVAILABLE'),
(3, 'C02', 'CAR', 'AVAILABLE'),
(3, 'C03', 'CAR', 'AVAILABLE');
SELECT * FROM parking_areas;
