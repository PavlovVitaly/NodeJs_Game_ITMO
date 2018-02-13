DROP DATABASE IF EXISTS PlayersDB;
CREATE DATABASE PlayersDB CHARACTER SET utf8 COLLATE utf8_general_ci;

USE PlayersDB;

CREATE TABLE Players
(
    keyId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    login varchar(40) NOT NULL,
    password varchar(50) NOT NULL
)   ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8;

CREATE TABLE GameMatch
(
    keyId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    serverName varchar(100) DEFAULT NULL,
    serverAddress varchar(30) NOT NULL,
    frags INT DEFAULT 0,
    deaths INT DEFAULT 0,
    takedContainers INT DEFAULT 0,
    destoyedContainers INT DEFAULT 0,
    damageToEnemy INT DEFAULT 0,
    damageToSelf INT DEFAULT 0,
    damageToContainer INT DEFAULT 0,
    matchDatetime DATETIME DEFAULT NOW(),
    playerId INT NOT NULL,
    FOREIGN KEY (playerId) REFERENCES Players(keyId)
)   ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8;

CREATE PROCEDURE GetPlayerStatistics()
BEGIN
END
