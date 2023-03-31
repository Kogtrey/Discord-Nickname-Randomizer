class GuildUserNicknameRepo {
    constructor(dbm) {
        this.dbm = dbm
    }

    //Creation of nicknames table:
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS guildusernicknames (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nicknameId INTEGER,
            guilduserId INTEGER,
            CONSTRAINT fk_nicknameId FOREIGN KEY (nicknameId)
                REFERENCES nicknames(id) ON UPDATE CASCADE ON DELETE CASCADE
            CONSTRAINT fk_guilduserId FOREIGN KEY (guilduserId)
                REFERENCES guildusers(id) ON UPDATE CASCADE ON DELETE CASCADE
        )`
        return this.dbm.run(sql)
    }
    //basic table methods:
    create(nicknameId,guilduserId) {
        return this.dbm.run(
            `
            INSERT INTO guildusernicknames (nicknameId, guilduserId)
                VALUES (?, ?)
            `,
            [nicknameId, guilduserId]
        )
    }

    update(GuildUserNickname) {
        const { id, nicknameId, guilduserId} = GuildUserNickname
        return this.dbm.run(
            `
            UDPATE guildusernicknames
            SET nicknameId = ?,
                guilduserId = ?
            WHERE id = ?
            `,
            [nicknameId,guilduserId,id]
        )
    }

    delete(id) {
        return this.dbm.run(
            `
            DELETE FROM guildusernicknames WHERE id = ?
            `,
            [id]
        )
    }


    //Querying:
    getById(id) {
        return this.dbm.get(
            `
            SELECT * FROM guildusernicknames
            WHERE id = ?
            `,
            [id]
        )
    }

    getAll() {
        return this.dbm.all(
            `SELECT * FROM guildusernicknames`
        )
    }

    getGuildUserNicknames(guilduserId) {
        return this.dbm.all(
            `
            SELECT 
                guildusernicknames.id,
                nicknames.nickname
            FROM 
                guildusernicknames
            LEFT JOIN nicknames ON guildusernicknames.nicknameId = nicknames.id
            WHERE guilduserId = ?
            `,
            [guilduserId]
        )
    }
}

module.exports = GuildUserNicknameRepo;
