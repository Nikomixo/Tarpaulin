CREATE TABLE `users` (
    `id` mediumint NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`email`)
);

CREATE TABLE `courses` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `number` mediumint NOT NULL,
  `title` varchar(255) NOT NULL,
  `term` varchar(255) NOT NULL,
  `instructorid` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`instructorid`) REFERENCES `users` (`id`)
);

CREATE TABLE `userscourses` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `userid` mediumint NOT NULL,
  `courseid` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`)
);

CREATE TABLE `assignments` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `points` float,
  `due` varchar(255),
  `courseid` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`)
);

CREATE TABLE `submissions` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `timestamp` varchar(255) NOT NULL,
  `grade` float,
  `file` mediumblob,
  `userid` mediumint NOT NULL,
  `assignmentid` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  FOREIGN KEY (`assignmentid`) REFERENCES `assignments` (`id`)
);

INSERT INTO users SET
  name = 'Dave Student',
  email = 'davest@oregonstate.edu',
  password = '$2a$08$H.Jop7J.lB2kJNwirRPFLeSabLdvxCm8PqKKLA901cGMDyk94XL1a',
  role = 'student';

INSERT INTO users SET
  name = 'Jane Admin',
  email = 'janead@oregonstate.edu',
  password = '$2a$08$H.Jop7J.lB2kJNwirRPFLeSabLdvxCm8PqKKLA901cGMDyk94XL1a',
  role = 'admin';

INSERT INTO users SET
  name = 'John Instructor',
  email = 'johnin@oregonstate.edu',
  password = '$2a$08$H.Jop7J.lB2kJNwirRPFLeSabLdvxCm8PqKKLA901cGMDyk94XL1a',
  role = 'instructor';

INSERT INTO courses SET
  subject = 'CS',
  number = 422,
  title = 'introductory smart fridge programming',
  term = 'sp22',
  instructorid = 3;

INSERT INTO courses SET
  subject = 'PSY',
  number = 203,
  title = 'introductions to the human mind',
  term = 'sp22',
  instructorid = 3;

INSERT INTO userscourses SET
  userid = 1,
  courseid = 1;

INSERT INTO userscourses SET
  userid = 1,
  courseid = 2;


INSERT INTO assignments SET
  title = 'project 1',
  points = 50,
  due = '2022-06-14T17:00:00-07:00',
  courseid = 1;

INSERT INTO submissions SET
  timestamp = '2022-06-14T17:00:00-06:59',
  grade = 43.5,
  userid = 1,
  assignmentid = 1;