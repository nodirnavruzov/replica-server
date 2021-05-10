module.exports = async function compareUser(current, all) {
  console.log();

  for (let i = 0; i < all.length; i++) {
    if (all[i].email == current) {
      return;
    }
  }
};
