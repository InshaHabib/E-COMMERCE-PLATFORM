import jwt from 'jsonwebtoken'

const auth = async(request,response,next)=>{
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // if(!token){
        //    token = request.query.token; 
        // }

        if(!token){
            return response.status(401).json({
                message : "Provide token"
            })
        }

        console.log("Secret Key:", process.env.JSON_WEB_TOKEN_SECRET_KEY);
        // const secretKey = String(process.env.JWT_KEY);
        // console.log("Final Secret Key:", secretKey);
        
        console.log("Received Token:", request.cookies.accessToken);
        console.log("Authorization Header:", request.headers.authorization);

        // const decode = jwt.verify(token, String(process.env.JSON_WEB_TOKEN_SECRET_KEY).trim());

        const decode = await jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);
        
        

        if(!decode){
            return response.status(401).json({
                message : "unauthorized access",
                error : true,
                success : false
            })
        }

        request.userId = decode.id

        next();

    } catch (error) {
        return response.status(500).json({
            message : "You have not login",///error.message || error,
            error : true,
            success : false
        })
    }
}

export default auth