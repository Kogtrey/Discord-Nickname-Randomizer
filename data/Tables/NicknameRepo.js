class NicknameRepo {
    constructor(dbm) {
        this.dbm = dbm
    }

    //Creation of nicknames table:
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS nicknames (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname TEXT,
            creatorId TEXT,
            CONSTRAINT fk_creatorId FOREIGN KEY (creatorId)
                REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
        )`
        return this.dbm.run(sql)
    }
    //basic table methods:
    create(nickname,creatorId) {
        return this.dbm.run(
            `
            INSERT INTO nicknames (nickname, creatorId)
                VALUES (?, ?)
            `,
            [nickname, creatorId]
        )
    }

    update(Nickname) {
        const { id, nickname, creatorId} = Nickname
        return this.dbm.run(
            `
            UDPATE nicknames
            SET nickname = ?,
                creatorId = ?
            WHERE id = ?
            `,
            [nickname,creatorId,id]
        )
    }

    delete(id) {
        return this.dbm.run(
            `
            DELETE FROM nicknames WHERE id = ?
            `,
            [id]
        )
    }


    //Querying:
    getById(id) {
        return this.dbm.get(
            `
            SELECT * FROM nicknames
            WHERE id = ?
            `,
            [id]
        )
    }

    getExistingNickname(nickname,creatorId){
        return this.dbm.get(
            `
            SELECT * FROM nicknames
            WHERE nickname = ?
            AND creatorId = ?
            `,
            [nickname, creatorId]
        )
    }

    getAll() {
        return this.dbm.all(
            `SELECT * FROM nicknames`
        )
    }

    getNicknames(creatorId) {
        return this.dbm.all(
            `
            SELECT * FROM nicknames
            WHERE creatorId = ?
            `,
            [creatorId]
        )
    }
}

module.exports = NicknameRepo;
