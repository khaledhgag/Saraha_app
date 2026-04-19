//generate token 


export const generateToken = ({payload, secret, options}) => {
    const token = jwt.sign(payload, secret, options);
}


//verify token

export const verifyToken = ({token, secret, options}) => {
    const payload = jwt.verify(token, secret, options);
}