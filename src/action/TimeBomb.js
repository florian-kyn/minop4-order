//TimeBomb.js//
const discord = require("discord.js");
const {Database} = require("../database/Database.js");

class TimeBomb{
    constructor(message, config, language, client) {
        this.client = client;
        this.message = message;
        this.args = message.content.slice().split(/ /);
        this.db = new Database(config);
        this.language = language.TimeBomb;
        this.prefix = config.discord.prefix;
        this.config = config;
    }
    selector() {
        if(this.message.channel.type !== "dm" && this.message.author.id !== this.client.user.id) {
            switch (this.args[0].toLowerCase()) {
                case this.prefix + "timebomb":
                    this.timeBomb();
                    break;
            }
        }
    }
    timeBomb() {
        if(typeof this.args[1] !== "undefined")  {
            this.db.connection().query(`SELECT * FROM timeBombs WHERE name = "${this.args[1]}"`, (err, rows) => {
                if(err) throw err;
                if(rows.length < 1) {
                    if(typeof this.args[2] !== "undefined") {
                        if(this.args[2].includes("@") && this.args[2].includes(".")) {
                            if(typeof this.args[3] !== "undefined") {
                                if(typeof this.args[4] !== "undefined") {
                                    if(parseInt(this.args[4]) > 0) {
                                        let endTimestamp = Date.now() + (parseInt(this.args[4]) * 3600000);
                                        this.db.connection().query(`INSERT INTO timeBombs (name, email, word, duration) VALUES ("${this.args[1]}", "${this.args[2]}", "${this.args[3]}", "${endTimestamp}")`, (err) => {
                                            if(err) throw err;
                                            this.message.channel.send(this.language.timeBomb.messageSuccess[0]).then().catch(console.error);
                                        });
                                    } else {
                                        this.message.channel.send(this.language.timeBomb.messageError[6]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                    }
                                } else {
                                    this.message.channel.send(this.language.timeBomb.messageError[5]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                }
                            } else{
                                this.message.channel.send(this.language.timeBomb.messageError[4].replace("EMAIL", this.args[2])).then(message => message.delete({timeout: 10000})).catch(console.error);
                            }
                        } else {
                            this.message.channel.send(this.language.timeBomb.messageError[3]).then(message => message.delete({timeout: 10000})).catch(console.error);
                        }
                    } else {
                        this.message.channel.send(this.language.timeBomb.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error);
                    }
                } else {
                    this.message.channel.send(this.language.timeBomb.messageError[1]).then(message => message.delete({timeout: 10000})).catch(console.error);
                }
            });
        } else {
            this.message.channel.send(this.language.timeBomb.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error);
        }
    }
}
module.exports = {
    TimeBomb
}
