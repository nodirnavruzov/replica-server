const configSQL = require("../config/sql.config");
const DBRequests = require("../sql");
module.exports = async (posts, type) => {
  let connection;
  let users;
  let arr = [];
  try {
    connection = new DBRequests(configSQL);
    users = await connection.getUsers();
  } catch (error) {
    console.log(error);
  }
  if (type == "Array") {
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      for (let j = 0; j < users.length; j++) {
        const user = users[j];
        if (post.user_id == user.id) {
          post.name = user.name;
          post.surname = user.surname;
          post.avatar = user.avatar;
          arr.push(post);
        }
      }
    }
    
    return arr;
  } else if (type == "Object") {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.id == posts.user_id) {
        posts.name = user.name;
        posts.surname = user.surname;
        posts.avatar = user.avatar;
        arr.push(posts);
        break;
      }
    }
    return arr;
  } else if (type == undefined || type != "Object" || type != "Array") {
    return new Error(
      "Missed required argument. Please indicate as second TYPE of argument"
    );
  }
};
