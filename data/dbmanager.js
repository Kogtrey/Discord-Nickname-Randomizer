// data/dbmanager.js
const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class DBM {
    constructor(dbFilePath, options = {}) {
        const {
            busyTimeoutMs = 5000,
            enableWAL = true,
            synchronous = 'NORMAL', // NORMAL is common with WAL
        } = options;

        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.error('Could not connect to database', err);
                return;
            }

            console.log('Connected to database');

            // Apply PRAGMAs serially.
            // Note: sqlite3's exec runs all statements.
            const pragmas = [
                'PRAGMA foreign_keys = ON;',
                `PRAGMA busy_timeout = ${busyTimeoutMs};`,
                ...(enableWAL ? ['PRAGMA journal_mode = WAL;'] : []),
                `PRAGMA synchronous = ${synchronous};`,
            ].join('\n');

            this.db.exec(pragmas, (pragmaErr) => {
                if (pragmaErr) console.error('Failed applying PRAGMAs', pragmaErr);
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.error('Error running sql:', sql);
                    console.error(err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.error('Error running sql:', sql);
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Error running sql:', sql);
                    console.error(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    exec(sql) {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err) {
                    console.error('Error exec sql:', sql);
                    console.error(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => (err ? reject(err) : resolve()));
        });
    }
}

module.exports = DBM;