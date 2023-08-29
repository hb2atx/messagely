const { Router } = require("express");
const { DB_URI, BCRYPT_WORK_FACTOR } = require("../config");
const ExpressError = require("../expressError");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
Router.post("/login", async(req, res, next) => {
    const { username, password } = req.body;
    const result = await DB_URI.query(
        `SELECT password
        FROM users
        WHERE username = $1`,
        [username]);
        let user = result.rows[0];
        try {
            if(user) {
                if (await bcrypt.compare(password, user.password) === true) {
                    let token = jwt.sign({ username }, SECRET_KEY);
                    return res.json({ token });
                }
            }
            throw new ExpressError("Invalid username/password", 400);
        }catch(e) {
            return next(e);
        }
    });

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
Router.post("/register", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await DB_URI.query(
            `SELECT password 
            FROM users 
            WHERE username = $1`,
            [username]);
            let user = result.rows[0];

            if(user) {
                if(await bcrypt.compare(password, user.password) === true) {
                    let token = jwt.sign({username}, SECRET_KEY);
                    return res.json({ token });
                }
            }
            throw new ExpressError("Invalid username/password", 404);
        }catch(e) {
            return next(e);
        }
})