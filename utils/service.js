const moment = require("moment");

module.exports = class HelperService {
  constructor() {}
  userModel(user) {
    delete user[0].password;
    const d = user[0].registration_date;
    const formated = moment(d, "DD-MM-YYYY hh:mm:ss").format(
      "DD-MM-YYYY hh:mm"
    );
    user[0].registration_date = formated;
    return user;
  }

  incrementPostsCount(arg) {
    return arg.length;
  }
};
