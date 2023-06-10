CREATE TABLE `users` (
    `id` mediumint NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `courses` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `subjectcode` varchar(255) NOT NULL,
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
)

CREATE TABLE `assignments` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `points` mediumint NOT NULL,
  `dueDate` varchar(255) NOT NULL,
  `courseid` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`courseid`) REFERENCES `courses` (`id`)
)

CREATE TABLE `submissions` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `timestamp` varchar(255) NOT NULL,
  `grade` mediumint NOT NULL,
  `file` varchar(255) NOT NULL,
  `userid` mediumint NOT NULL,
  `assignmentid` mediumint NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  FOREIGN KEY (`assignmentid`) REFERENCES `assignments` (`id`)
);