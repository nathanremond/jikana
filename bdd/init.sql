DROP TABLE IF EXISTS movie_category;
DROP TABLE IF EXISTS order_schedule;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;

CREATE TABLE role (
    id_role SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_role INT NOT NULL,
    FOREIGN KEY (id_role) REFERENCES role(id_role)
);

CREATE TABLE orders (
    id_order SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    total_amount DECIMAL(4, 2) NOT NULL,
    id_user INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE category (
    id_category SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE movie (
    id_movie SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    picture VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    end_date DATE NOT NULL,
    video VARCHAR(500) NOT NULL,
    directors VARCHAR(255) ARRAY[10] NOT NULL,
    actors VARCHAR(255) ARRAY[10] NOT NULL,
    languages VARCHAR(255) ARRAY[10] NOT NULL
);

CREATE TABLE schedule (
    id_schedule SERIAL PRIMARY KEY,
    schedule_hour TIMESTAMP NOT NULL,
    language VARCHAR(255) NOT NULL,
    price DECIMAL(4, 2) NOT NULL,
    id_movie INT NOT NULL,
    FOREIGN KEY (id_movie) REFERENCES movie(id_movie)
);

CREATE TABLE order_schedule (
    id_order_schedule SERIAL PRIMARY KEY NOT NULL,
    quantity INT NOT NULL,
    id_order INT NOT NULL,
    id_schedule INT NOT NULL,   
    FOREIGN KEY (id_order) REFERENCES orders(id_order),
    FOREIGN KEY (id_schedule) REFERENCES schedule(id_schedule)
);

CREATE TABLE movie_category (
    id_movie_category SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    id_movie INT NOT NULL,
    id_category INT NOT NULL,   
    FOREIGN KEY (id_movie) REFERENCES movie(id_movie),
    FOREIGN KEY (id_category) REFERENCES category(id_category)
);