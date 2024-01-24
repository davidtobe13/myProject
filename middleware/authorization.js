// const jwt = require('jsonwebtoken')
// const myModel = require('../models/userModel')

// const authorization = async (req, res, next) => {
//     try{
//         const auth = req.headers.authorization;

//         if(!auth){
//             return res.status(404).json({
//                 message: 'No authorization token found'
//             })
//         }

//         const token = auth.split(' ')[1];

//         if(!token){
//             return res.status(404).json({
//                 message: `Aurhorization failed`
//             })
//         }


//         const decodedToken = jwt.verify(token, process.env.secret);

//         const user = await myModel.findById(decodedToken.userId)

        
//         if(!user){
//             return res.status(404).json({
//                 message: `Aurhorization failed: User not found`
//             });
//         }

//         if(user.blacklist.includes(token)){
//             return res.status(403).json({
//                 message: 'This user is logged out. Cannot perform updates'
//             })
//         }


//         req.user = decodedToken
    
//         next()
//     }catch(err){

//         if(err instanceof jwt.JsonWebTokenError){
//             return res.status(500).json({
//                 message: `Session expired`
//             })
//         }
//         res.status(500).json({
//             message: err.message
//         })
//     }
// };


// module.exports = authorization



const jwt = require('jsonwebtoken');
const myModel = require('../models/userModel');

const authorization = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if (!auth) {
            return res.status(404).json({
                message: 'No authorization token found',
            });
        }

        const token = auth.split(' ')[1];

        if (!token) {
            return res.status(404).json({
                message: 'Authorization failed',
            });
        }

        const decodedToken = jwt.verify(token, process.env.secret);

        const user = await myModel.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Authorization failed: User not found',
            });
        }

        if (user.blacklist.includes(token)) {
            return res.status(403).json({
                message: 'This user is logged out. Cannot perform updates',
            });
        }

        req.user = decodedToken;
        

        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(500).json({
                message: 'Session expired',
            });
        }
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = authorization;
