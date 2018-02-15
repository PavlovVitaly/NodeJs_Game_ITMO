USE PlayersDB;

SELECT login, SUM(frags), SUM(deaths), SUM(takedContainers), SUM(destoyedContainers) FROM Players LEFT JOIN GameMatch on Players.keyId = GameMatch.playerId GROUP BY login;