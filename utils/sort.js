module.exports = (posts) => {
  let a;
  a = posts.sort(
    (a, b) =>
      new Date(+b.original_date.replace(/(\d{2})-(\d{2})/, "$2-$1")) -
      new Date(+a.original_date.replace(/(\d{2})-(\d{2})/, "$2-$1"))
  );
  return a;
};
