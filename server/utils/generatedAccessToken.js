import jwt from 'jsonwebtoken'

const generatedAccessToken = async (userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JSON_WEB_TOKEN_SECRET_KEY,
        { expiresIn: '24h' }
    )

    return token
}

export default generatedAccessToken