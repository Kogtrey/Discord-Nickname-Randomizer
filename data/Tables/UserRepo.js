class UserRepo {
    constructor(dbm) {
        this.dbm = dbm
    }

    //Creation of users table:
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT
        )`
        return this.dbm.run(sql)
    }

    //basic table methods:
    create(id, name) {
        return this.dbm.run(
            'INSERT INTO users (id, name) VALUES (?, ?)',
            [id, name]
        )
    }
    update(user) {
        const { id, name} = user
        return this.dbm.run(
            `UPDATE users 
            SET name = ?
            WHERE id = ?`,
            [name, id]
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

    getAll() {
        return this.dbm.get(
            `SELECT * FROM users`
        )
    }

}

module.exports = UserRepo;
