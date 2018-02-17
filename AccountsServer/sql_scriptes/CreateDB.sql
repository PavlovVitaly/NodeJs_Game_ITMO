DROP DATABASE IF EXISTS PlayersDB;
CREATE DATABASE PlayersDB CHARACTER SET utf8 COLLATE utf8_general_ci;

USE PlayersDB;

CREATE TABLE Players
(
    keyId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    login varchar(40) NOT NULL UNIQUE,
    userPassword varchar(50) NOT NULL,
    email varchar(50) DEFAULT NULL
)   ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8;

CREATE TABLE GameMatch
(
    keyId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    serverName varchar(100) DEFAULT NULL,
    serverAddress varchar(30) NOT NULL,
    mapName varchar(100) NOT NULL,
    frags INT DEFAULT 0,
    deaths INT DEFAULT 0,
    takedContainers INT DEFAULT 0,
    destoyedContainers INT DEFAULT 0,
    damageToEnemy INT DEFAULT 0,
    damageToSelf INT DEFAULT 0,
    matchDatetime DATETIME DEFAULT NOW(),
    playerId INT NOT NULL,
    FOREIGN KEY (playerId) REFERENCES Players(keyId)
)   ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8;

DROP FUNCTION IF EXISTS CalcScore;
DELIMITER $$
CREATE FUNCTION CalcScore ( frags INT, deaths INT, damageToSelf INT, damageToEnemy INT, takedContainers INT, destoyedContainers INT)
RETURNS BIGINT UNSIGNED
BEGIN
	DECLARE result BIGINT UNSIGNED;
	SET result = TRUNCATE((((damageToEnemy/100) +
						frags)/2)*10 +
                        takedContainers +
                        destoyedContainers +
                        ((damageToSelf/100) - deaths)*2, 0);
	RETURN result;
END; 
$$
DELIMITER ;

DROP VIEW IF EXISTS RankTable;

CREATE VIEW RankTable AS SELECT login AS 'Player',
							CalcScore (SUM(frags),
										SUM(deaths),
                                        SUM(damageToSelf),
                                        SUM(damageToEnemy),
                                        SUM(takedContainers),
                                        SUM(destoyedContainers)) AS 'Score',
                            SUM(frags) AS 'Frags',
                            SUM(deaths) AS 'Deaths',
                            SUM(takedContainers) AS 'TakedContainers',
                            SUM(destoyedContainers) AS 'DestoyedContainers'
						FROM Players LEFT JOIN GameMatch ON Players.keyId = GameMatch.playerId
                        GROUP BY login
                        ORDER BY 2 DESC;
