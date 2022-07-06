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
            userId TEXT,
            CONSTRAINT nicknames_fk_userId FOREIGN KEY (userId)
                REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
        )`
        return this.dbm.run(sql)
    }
    //basic table methods:
    create(nickname,userId) {
        return this.dbm.run(
            `
            INSERT INTO nicknames (nickname, userId)
                VALUES (?, ?)
            `,
            [nickname, userId]
        )
    }

    update(Nickname) {
        const { id, nickname, userId} = Nickname
        return this.dbm.run(
            `
            UDPATE nicknames
            SET nickname = ?,
                userId = ?
            WHERE id = ?
            `,
            [nickname,userId,id]
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

    getAll() {
        return this.dbm.all(
            `SELECT * FROM nicknames`
        )
    }

    getNicknames(userId) {
        return this.dbm.all(
            `
            SELECT * FROM nicknames
            WHERE userId = ?
            `,
            [userId]
        )
    }
}

module.exports = NicknameRepo;
