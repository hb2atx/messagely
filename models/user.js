/** User class for message.ly */

const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const ExpressError = require("../expressError");


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    const result = await db.query(
      `INSERT INTO register(
        username,
        password,
        first_name,
        last_name,
        phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, password, first_name, last_name, phone`,
        [username, password, first_name, last_name, phone]);
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and Password required", 400);
    }
    const results = await db.query(
      `SELECT username, password
      FROM users
      WHERE username = $1`,
      [username]);
    const user = results.rows[0];
    if(user) {
      if ( await bcrypt.compare(password, user.password));
      return results.json(`Logged In!`)
    }
    throw new ExpressError("Username/password not found", 400);
   }catch(e){
    return next(e);
   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    const result = await db.query(
      `UPDATE users
      SET last_login_at = current_timestamp
      WHERE id = $1
      RETURNING id, last_login_at`,
      [username]);

      if(!result.rows[0]) {
        throw new ExpressError(`No such message: ${id}`, 404)
      }
    }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 
    const result = await db.query(
      `SELECT username, first_name, last_name, phone
      FROM users
      WHERE id = $1
      RETURNING id, username, first_name, last_name, phone`,
      [id, username, first_name, last_name, phone]
      );
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const results = await db.query(
      `SELECT username
      FROM users
      WHERE id = $1
      RETURNING username`,
      [username]
    )
   }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
      const results = await db.query(
        `SELECT messages
        FROM id, to_user, body, sent_at, read_it
        WHERE to_user IS username, first_name, last_name, phone
        RETURNING messages`,
        [username]
      )
   }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { 
    const results = await db.query(
      `SELECT messages
      FROM from_user WHERE username, first_name, last_name, phone
      RETURN messages TO id, from_user, body, sent_at, read_at
      `
    )
  }
}


module.exports = User;