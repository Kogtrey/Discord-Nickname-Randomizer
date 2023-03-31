class GuildUserRepo {
    constructor(dbm) {
        this.dbm = dbm
    }

    //Creation of users table:
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS guildusers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guildId TEXT,
            userId TEXT,
            CONSTRAINT fk_userId FOREIGN KEY (userId)
                REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
        )`
        return this.dbm.run(sql)
    }

    //basic table methods:
    create(userId, guildId) {
        return this.dbm.run(
            'INSERT INTO guildusers (guildId, userId) VALUES (?, ?)',
            [guildId, userId]
        )
    }
    update(GuildUser) {
        const { id, guildId, userId} = GuildUser
        return this.dbm.run(
            `UPDATE guildusers 
            SET guildId = ?,
                userId = ?
            WHERE id = ?`,
            [guildId, userId ,id,]
        )
    }

    delete(id) {
        return this.dbm.run(
            `DELETE FROM guildusers WHERE id = ?`,
            [id]
        )
    }

    //Querying:
    getById(id) {
        return this.dbm.get(
            `SELECT * FROM guildusers WHERE id = ?`,
            [id]
        )
    }

    getByGuildId(guildId){
        return this.dbm.all(
            `SELECT * FROM users WHERE guildId = ?`,
            [guildId]
        )
    }

    getAll() {
        return this.dbm.all(
            `SELECT * FROM guildusers`
        )
    }

    getGuildUser(userId, guildId) {
        return this.dbm.get(
            `
            SELECT * FROM guildusers
            WHERE guildId = ?
            AND userId = ?
            `,
            [guildId, userId]
        )
    }

    getByUserId(userId){
        return this.dbm.all(
            `
            SELECT * FROM guildusers
            WHERE userId = ?
            `,
            [userId]
        )
    }

    getGuildUserInfoByGuildId(guildId){
        return this.dbm.all(
            `
            SELECT 
                guildusers.id,
                guildId,
                userId,
                name,
                guildsync
            FROM guildusers
            LEFT JOIN users ON guildusers.userId = users.id
            WHERE guildId = ?
            `,
            [guildId]
        )
    }

}

module.exports = GuildUserRepo;
