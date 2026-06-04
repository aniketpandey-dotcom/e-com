process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
async function test() {
  const data = await fetch("https://dummyjson.com/products");
  const jsonData = await data.json();
  return jsonData;
}

console.log(test());
