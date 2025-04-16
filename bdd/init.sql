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



INSERT INTO role ( name ) VALUES ( 'admin' );
INSERT INTO role ( name ) VALUES ( 'customer' );


INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages)
	VALUES ('Minecraft', 'Film d''aventure inspiré du célèbre jeu vidéo Minecraft, où des personnages explorent un monde en blocs.', 'imgMinecraft.jpg', '2h00', '2025-04-04', '2025-06-04', 'https://www.youtube.com/watch?v=8B1EtVPBSMw&ab_channel=WarnerBros.', ARRAY['John Doe'], ARRAY['Jack Black', 'Jason Momoa'], ARRAY['Anglais', 'Français']);
INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages)
	VALUES ('Spider-Man: No Way Home', 'Spider-Man lutte contre des menaces venant d''autres dimensions après un sort lancé par Docteur Strange.', 'imgSpiderman.jpg', '2h20', '2025-04-15', '2022-06-15', 'https://www.youtube.com/watch?v=JfVOs4VSpmA&ab_channel=SonyPicturesEntertainment', ARRAY['Jon Watts'], ARRAY['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'], ARRAY['Anglais', 'Français']);
INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages)
	VALUES ('Real Steel', 'Dans un futur proche, des robots géants combattent dans des arènes. Un père et son fils s''associent pour entraîner un robot.', 'imgRealsteel.jpg', '2h7', '2025-04-15', '2025-06-15', 'https://www.youtube.com/watch?v=vU3ZqtbIRPI&ab_channel=StreamingClips', ARRAY['Shawn Levy'], ARRAY['Hugh Jackman', 'Dakota Goyo', 'Evangeline Lilly'], ARRAY['Anglais', 'Français']); 
INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages)
	VALUES ('Sonic 3', 'Sonic, un hérisson rapide, se lie d''amitié avec un policier pour empêcher le Dr Robotnik de dominer le monde.', 'imgSonic3.jpg', '1h40',  '2025-04-15', '2025-06-15', 'https://www.youtube.com/watch?v=TQ-9We-lxiA&ab_channel=ParamountPicturesFrance', ARRAY['Jeff Fowler'], ARRAY['Ben Schwartz', 'Jim Carrey', 'James Marsden'], ARRAY['Anglais', 'Français']);
INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages)
	VALUES ('Five Nights at Freddy''s', 'Un garde de sécurité doit survivre à des créatures animées terrifiantes dans un restaurant.', 'imgFnaf.jpg', '1h43',  '2025-04-15', '2025-06-15', 'https://www.youtube.com/watch?v=0VH9WCFV6XQ&ab_channel=UniversalPictures', ARRAY['Emma Tammi'], ARRAY['Josh Hutcherson', 'Elizabeth Lail'], ARRAY['Anglais', 'Français']);
INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages)
	VALUES ('Cars', 'Lightning McQueen, une voiture de course, se retrouve dans une petite ville et apprend la vraie signification de l''amitié.', 'imgCars.jpg', '1h57',  '2025-04-15', '2025-06-15', 'https://www.youtube.com/watch?v=qCKdkbsMUA8&ab_channel=Picktzar', ARRAY['John Lasseter'], ARRAY['Owen Wilson', 'Larry the Cable Guy', 'Bonnie Hunt'], ARRAY['Anglais', 'Français']);
INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages)
	VALUES ('Teenage Mutant Ninja Turtles 2: Out of the Shadows', 'Les Tortues Ninja affrontent un nouveau méchant, le scientifique fou Baxter Stockman, et son armée de mutants.', 'imgNinjaturtles.jpg', '1h52',  '2025-04-15', '2025-06-15', 'https://www.youtube.com/watch?v=HeaugHGd1Kw&ab_channel=TMNTMovie', ARRAY['Dave Green'], ARRAY['Megan Fox', 'Will Arnett', 'Tyler Perry'], ARRAY['Anglais', 'Français']);
INSERT INTO movie (name, description, picture, duration, release_date, end_date, video, directors, actors, languages)
	VALUES ('Iron Man', 'Tony Stark, un ingénieur milliardaire, devient Iron Man après avoir créé une armure high-tech pour s''échapper de ses ravisseurs.', 'imgIronman.jpg', '2h06', '2025-04-15', '2025-06-15', 'https://www.youtube.com/watch?v=KAE5ymVLmZg&ab_channel=SeriesHunter24', ARRAY['Jon Favreau'], ARRAY['Robert Downey Jr.', 'Gwyneth Paltrow', 'Jeff Bridges'], ARRAY['Anglais', 'Français']);


INSERT INTO category (name)
	VALUES ('Action'),
		   ('Aventure'),
		   ('Animation'),
		   ('Science Fiction'),
		   ('Comédie'),
		   ('Drama'),
		   ('Fantaisie'),
		   ('Horreur'),
		   ('Famillle');


INSERT INTO movie_category (id_movie, id_category)
	VALUES (1, 1),
		   (1, 2),
		   (1, 5),
		   (2, 1),
		   (2, 4),
		   (3, 1),
		   (3, 4),
		   (4, 2),
		   (4, 3),
		   (4, 9),
		   (5, 4),
		   (5, 8),
		   (6, 1),
		   (6, 3),
		   (7, 1),
		   (7, 3),
		   (7, 7),
		   (8, 1),
		   (8, 2),
		   (8, 4);


INSERT INTO schedule (schedule_hour, language, price, id_movie)
	VALUES ('2025-04-20 09:00:00', 'Français', 40.00, 1),
		   ('2025-04-20 16:30:00', 'Français', 45.00, 1),
		   ('2025-04-22 11:00:00', 'Anglais', 35.00, 1);