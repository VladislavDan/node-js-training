CREATE TABLE users
(
    Id SERIAL PRIMARY KEY,
    login CHARACTER VARYING(30),
    password CHARACTER VARYING(30),
    isDeleted boolean,
    age INTEGER
);

INSERT INTO users (login, isDeleted, password, age)
VALUES ('FirstUser', false, '123Qwery', 26),
('SecondUser', false, '123Qwery', 56),
('ThirdUser', true, 'wordQwery', 12)
