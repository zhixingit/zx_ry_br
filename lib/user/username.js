/**
 * Created by xiong on 2017/2/17.
 */
import storage from "../storage/index";
const crypto = require('crypto');
async function getPwd(username, pwd) {
    let result = [];
    let connect = storage.connection.internalConnection;
    let collection = connect.collection("user");
    let md5pwd = md5(pwd);
    let pwd2 = md5(md5pwd.substr(4,8) + md5pwd);
    result = await collection.find({"username": username, "pwd": pwd2}).toArray();
    if (result.length > 0) {
        return true;
    } else {
        return false;
    }
}
function md5(pwd) {
    let hash = crypto.createHash('md5');
    hash.update(pwd);
    return hash.digest('base64');
}

export default getPwd;
