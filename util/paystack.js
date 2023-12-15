import { request } from "https";

const getAuthorizationUrl = (email, amount) => {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email: email,
      amount: amount,
    });
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const req = request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const responseData = JSON.parse(data);
        if (
          responseData.status &&
          responseData.status === true &&
          responseData.data.authorization_url
        ) {
          resolve(responseData.data.authorization_url);
        } else {
          reject(new Error("Failed to retrieve authorization URL"));
        }
      });
    }).on("error", (error) => {
      reject(error);
    });
    req.write(params);
    req.end();
  });
};

export { getAuthorizationUrl };
