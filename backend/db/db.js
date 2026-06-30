connection.connect((err) => {
  if (err) {
    console.log("MySQL skipped");
    return;
  }

  console.log("MySQL Connected Successfully ✅");
});