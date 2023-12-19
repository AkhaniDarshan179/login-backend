import jwt from "jsonwebtoken";

const GenerateTokens = (user) => {
  const payload = {
    name: user.username,
    id: user._id,
  };

  const accessToken = jwt.sign(payload, "simbanic", {
    expiresIn: "10sec",
  });

  const refreshToken = jwt.sign({accessToken}, "simbanic_refresh", {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

export default GenerateTokens;
