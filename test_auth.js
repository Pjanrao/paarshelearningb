const test = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/admin/entrance-exam/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: "123", testId: "123", collegeId: "123", batchName: "123", token: "missing" })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (e) {
    console.error(e);
  }
};
test();
