axios
  .get('../tools/try.php')
  .then((data) => {
    console.log(data);
  })
  .catch((data) => {
    console.log(data);
  });
