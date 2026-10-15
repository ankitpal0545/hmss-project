-- OPTIONAL: Spring Boot creates these tables automatically (ddl-auto=update).
-- Run this only if you want to create the database/tables manually in MySQL Workbench.
CREATE DATABASE IF NOT EXISTS hms_db;
USE hms_db;

CREATE TABLE IF NOT EXISTS patient (
    patient_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    age          INT NOT NULL,
    gender       VARCHAR(20) NOT NULL,
    phone        VARCHAR(15) NOT NULL,
    email        VARCHAR(255),
    address      VARCHAR(255),
    blood_group  VARCHAR(5) NOT NULL,
    status       VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS doctor (
    doctor_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    experience     INT NOT NULL,
    phone          VARCHAR(15) NOT NULL,
    availability   VARCHAR(100) NOT NULL,
    status         VARCHAR(50) DEFAULT 'Available'
);

CREATE TABLE IF NOT EXISTS appointment (
    appointment_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_name     VARCHAR(255) NOT NULL,
    doctor_name      VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    department       VARCHAR(255) NOT NULL,
    status           VARCHAR(50) DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS medicine (
    medicine_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    category    VARCHAR(255) NOT NULL,
    quantity    INT NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    expiry_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS bills (
    bill_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_name   VARCHAR(255) NOT NULL,
    doctor_name    VARCHAR(255) NOT NULL,
    service        VARCHAR(255) NOT NULL,
    amount         DECIMAL(10,2) NOT NULL,
    bill_date      DATE,
    payment_status VARCHAR(50) DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS app_users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255),
    role          VARCHAR(100)
);
-- Demo data and the admin user (admin / admin123) are inserted by the app on first run.
