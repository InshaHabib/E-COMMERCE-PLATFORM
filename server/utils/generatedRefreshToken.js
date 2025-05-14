import UserModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'

const genertedRefreshToken = async(userId)=>{
    const token = jwt.sign({ id : userId},
        process.env.JSON_WEB_TOKEN_SECRET_KEY,
        { expiresIn : '7d'}
    )

    const updateRefreshTokenUser = await UserModel.updateOne(
        { _id : userId},
        {
            refresh_token : token
        }
    )

    return token
}

export default genertedRefreshToken