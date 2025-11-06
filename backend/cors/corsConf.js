




//whitelisted connection
const devWhitelist = ["http://localhost:3000"];

export const corsDevOptions = {
  origin: function (origin, callback) {
    if (!origin || devWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};


//all allowed domains 
const domainsFromEnv = process.env.CORS_DOMAINS || "";

const productionWhitelist = domainsFromEnv
  .split(",")
  .map((item) => item.trim());

export const corsProOptions = {
  origin: function (origin, callback) {
    if (!origin || productionWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

