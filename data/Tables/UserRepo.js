class UserRepo {
    constructor(dbm) {
        this.dbm = dbm
    }

    //Creation of users table:
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            guildsync NUMERIC
        )`
        return this.dbm.run(sql)
    }

    //basic table methods:
    create(id, name, guildsync=0) {
        return this.dbm.run(
            'INSERT INTO users (id, name, guildsync) VALUES (?, ?, ?)',
            [id, name, guildsync]
        )
    }
    update(user) {
        const { id, name, guildsync} = user
        return this.dbm.run(
            `UPDATE users 
            SET name = ?,
                guildsync = ?
            WHERE id = ?`,
            [name, guildsync, id]
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

    // getByGuildId(guildId){
    //     return this.dbm.get(
    //         `SELECT * FROM users WHERE guildId = ?`,
    //         [guildId]
    //     )
    // }

    getAll() {
        return this.dbm.all(
            `SELECT * FROM users`
        )
    }

}

module.exports = UserRepo;
