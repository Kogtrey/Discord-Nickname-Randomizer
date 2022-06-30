class UserRepo {
    constructor(dbm) {
        this.dbm = dbm
    }

    //Creation of users table:
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            discordId INTEGER,
            name TEXT
        )`
        return this.dbm.run(sql)
    }

    //basic table methods:
    create(name, discordId) {
        return this.dbm.run(
            'INSERT INTO users (name, discordId) VALUES (?, ?)',
            [name, discordId]
        )
    }
    update(user) {
        const { id, name, discordId} = user
        return this.dbm.run(
            `UPDATE users 
            SET name = ?,
                discordId = ?
            WHERE id = ?`,
            [name, discordId, id]
        )
    }

    delete(id) {
        return this.dbm.run(
            `DELETE FROM users WHERE id = ?`,
            [id]
        )
    }

    //Querying:
    getById(id) {
        return this.dbm.get(
            `SELECT * FROM users WHERE id = ?`,
            [id]
        )
    }

    getByDiscordId(discordId) {
        return this.dbm.get(
            `SELECT * FROM users WHERE discordId = ?`,
            [discordId]
        )
    }

    getAll() {
        return this.dbm.get(
            `SELECT * FROM users`
        )
    }

}

module.exports = UserRepo;
