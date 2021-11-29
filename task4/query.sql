CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    login CHARACTER VARYING(30),
    password CHARACTER VARYING(30),
    isDeleted boolean,
    age INTEGER
);

INSERT INTO users (login, isDeleted, password, age)
VALUES ('FirstUser', false, '123Qwery', 26),
('SecondUser', false, '123Qwery', 56),
('ThirdUser', true, 'wordQwery', 12);

CREATE TABLE groups
(
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(30),
    permissions CHARACTER VARYING(30)[]
);

INSERT INTO groups (name, permissions)
VALUES ('AdminsUsers', ARRAY ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']),
('UsualUsers', ARRAY ['READ', 'SHARE']);

CREATE TABLE user_groups (
  id SERIAL PRIMARY KEY,
  userId INT,
  groupId INT,
  CONSTRAINT fk_groups FOREIGN KEY(userId) REFERENCES groups(id) on delete cascade on update cascade,
  CONSTRAINT fk_users FOREIGN KEY(groupId) REFERENCES users(id) on delete cascade on update cascade
);
