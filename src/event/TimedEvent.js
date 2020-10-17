//TimedEvent.js//
const discord = require("discord.js");
const {Database} = require("../database/Database.js");
const {EMailer} = require("../api/EMailer.js");

class TimedEvent{
    constructor(client, config, language) {
        this.client = client;
        this.config = config;
        this.langauge = language;
        this.db = new Database(config);
    }
    on() {
        setInterval(() => {
            this.timeBombsEmail();
        }, 60000);
    }
    timeBombsEmail() {
        this.db.connection().query(`SELECT * FROM timeBombs`, (err, rows) => {
            if(err) throw err;
            if(rows.length >= 1) {
                for(let i = 0; rows.length > i; i++) {
                    if(Date.now() >= parseInt(rows[i].duration)) {
                        new EMailer(this.config, this.client).emailing(rows[i].email, rows[i].word);
                    }
                }
            }
        });
    }
}
module.exports = {
    TimedEvent
}
