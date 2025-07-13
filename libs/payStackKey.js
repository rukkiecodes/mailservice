export const PAYSTACK_SECRET_KEY = () => {
  if (process.env.NODE_ENV === "development")
    return process.env.healthtok_Test_Secrete_key;
  else process.env.healthtok_Live_Secrete_key;
};
