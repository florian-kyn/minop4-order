//TimeBomb.js//
const discord = require("discord.js");
const {Database} = require("../database/Database.js");
const {EMailer} = require("../api/EMailer.js");

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
                case this.prefix + "timebombs":
                    this.timeBombs();
                    break;
                case this.prefix + "redbutton":
                    this.redButton();
                    break;
            }
        }
    }
    redButton() {
        if(this.message.guild.member(this.message.author.id).hasPermission("ADMINISTRATOR")) {
            if (typeof this.args[1] !== "undefined") {
                this.db.connection().query(`SELECT * FROM timeBombs WHERE name = "${this.args[1]}"`, (err, rows) => {
                    if (err) throw err;
                    if (rows.length < 1) {
                        if(typeof this.args[2] !== "undefined") {
                            if(parseInt(this.args[2]) > 0) {
                                this.db.connection().query(`UPDATE timeBombs SET duration = "${parseInt(rows[0].duration) + (3600000 * parseInt(this.args[2]))}" WHERE name = "${this.args[1]}"`, (err) => {
                                   if(err) throw err;
                                    this.message.channel.send(this.language.redButton.messageSuccess[0].replace("TIME", this.args[2]).replace("NAME", this.args[1])).then().catch(console.error);
                                });
                            } else {
                                this.message.channel.send(this.language.redButton.messageError[4]).then(message => message.delete({timeout: 10000})).catch(console.error);
                            }
                        } else {
                            this.message.channel.send(this.language.redButton.messageError[3]).then(message => message.delete({timeout: 10000})).catch(console.error);
                        }
                    } else {
                        this.message.channel.send(this.language.redButton.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error);
                    }
                });
            } else {
                this.message.channel.send(this.language.redButton.messageError[1]).then(message => message.delete({timeout: 10000})).catch(console.error);
            }
        } else {
            this.message.channel.send(this.language.redButton.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error);

        }
    }
    timeBombs() {
        this.db.connection().query(`SELECT * FROM timeBombs`, (err, rows) => {
            if(err) throw err;
            let stuff = [];
            let time = date => `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
            for(let i = 0; rows.length > i; i++) {
                stuff.push("`" + `"${rows[i].name}" Will end at: ${time(parseInt(rows[i].duration))}` + "`")
            }
            this.message.channel.send(this.embed(1, stuff)).then().catch(console.error);
        });
    }
    timeBomb() {
        if(this.message.guild.member(this.message.author.id).hasPermission("ADMINISTRATOR")) {
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
                    } else if(typeof this.args[2] !== "undefined") {
                        if(this.args[2].toLowerCase() === "imdesperate") {
                            if (this.message.guild.member(this.message.author.id).roles.cache.some(role => role.name.toLowerCase() === "bluepill")) {
                                this.db.connection().query(`SELECT * FROM timeBombs WHERE name = "${this.args[1]}"`, (err, rows) => {
                                    if (err) throw err;
                                    let timeBombs = rows;
                                    if (rows.length >= 1) {
                                        this.db.connection().query(`SELECT * FROM bluePillIncrease WHERE userId = "${this.message.author.id}" AND bombId = "${this.args[1]}"`, (err, rows) => {
                                            if (err) throw err;
                                            if (rows.length < 1) {
                                                this.db.connection().query(`INSERT INTO bluePillIncrease (userId, bombId) VALUES ("${this.message.author.id}", "${this.args[1]}")`, (err) => {
                                                    if (err) throw err;
                                                });
                                                this.db.connection().query(`UPDATE timeBombs SET duration = "${parseInt(timeBombs[0].duration) + 604800000}" WHERE name = "${this.args[1]}"`, (err) => {
                                                    if (err) throw err;
                                                    this.message.channel.send(this.language.timeBomb.messageSuccess[1].replace("NAME", this.args[1])).then().catch(console.error);
                                                });
                                            } else {
                                                this.message.channel.send(this.language.timeBomb.messageError[10]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                            }
                                        });
                                    } else {
                                        this.message.channel.send(this.language.timeBomb.messageError[9]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                    }
                                });
                            } else {
                                this.message.channel.send(this.language.timeBomb.messageError[8]).then(message => message.delete({timeout: 10000})).catch(console.error);
                            }
                        }
                    } else if(typeof this.args[2] === "undefined") {
                        this.db.connection().query(`SELECT * FROM timeBombs WHERE name = "${this.args[1]}"`, (err, rows) => {
                            if(err) throw err;
                            if(rows.length >= 1) {
                                this.message.channel.send(this.embed(2, rows)).then().catch(console.error);
                            } else {
                                this.message.channel.send(this.language.timeBomb.messageError[9]).then(message => message.delete({timeout: 10000})).catch(console.error);
                            }
                        });
                    } else {
                        this.message.channel.send(this.language.timeBomb.messageError[1]).then(message => message.delete({timeout: 10000})).catch(console.error);
                    }
                });
            } else {
                this.message.channel.send(this.language.timeBomb.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error);
            }
        } else {
            this.message.channel.send(this.language.timeBomb.messageError[7]).then(message => message.delete({timeout: 10000})).catch(console.error);
        }
    }
    embed(Case, info=null) {
        switch (Case) {
            case 1:
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .addField("Active TimeBombs:",
                        info
                    )
                    .setColor("BLUE")
                    .setTimestamp();
            case 2:
                let time = date => `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
                return new discord.MessageEmbed()
                    .setAuthor(this.message.guild.name, this.client.user.avatarURL())
                    .setThumbnail(this.message.guild.member(this.message.author.id).user.avatarURL())
                    .addField("Active TimeBombs:",
                        "`" + `"${info[0].name}" Will end at: ${time(parseInt(info[0].duration))}` + "`"
                    )
                    .setColor("BLUE")
                    .setTimestamp();
        }
    }
}
module.exports = {
    TimeBomb
}
