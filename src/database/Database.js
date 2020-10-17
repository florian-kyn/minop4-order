//Database.js//
const mysql = require("mysql2")

class Database {
    constructor(token, time=null) {
        this.dbUsername = token.database.username;
        this.dbDatabase = token.database.database;
        this.dbPassword = token.database.password;
        this.dbHost = token.database.host;
        this.dbPort = token.database.port;
        this.time = time;
    }
    connection() {
        return mysql.createConnection({
            user: this.dbUsername,
            database: this.dbDatabase,
            password: this.dbPassword,
            host: this.dbHost,
            port: this.dbPort
        });
    }
    checkConnectionState() {
        this.connection().query(`CREATE TABLE IF NOT EXISTS test (test VARCHAR(30))`, (err) => {
            if(err) {
                return console.log(`[${this.time(Date.now())}] The connection between the client & the Database has failed.`);
            } else {
                return console.log(`[${this.time(Date.now())}] The connection between the client & the Database has been established.`);
            }
        });
    }
    tableCheckCreation() {
        this.connection().query(`CREATE TABLE IF NOT EXISTS staffMembers (userId VARCHAR(30), authorId VARCHAR(30), promotedAt VARCHAR(30))`, (err) => {
            if (err) throw err;
        });
        this.connection().query(`CREATE TABLE IF NOT EXISTS bluePillIncrease (userId VARCHAR(30), bombId VARCHAR(30))`, (err) => {
            if (err) throw err;
        });
        this.connection().query(`CREATE TABLE IF NOT EXISTS timeBombs (name VARCHAR(255), email VARCHAR(255), word VARCHAR(255), duration VARCHAR(255))`, (err) => {
            if (err) throw err;
        });
    }
}

module.exports = {
    Database
}
