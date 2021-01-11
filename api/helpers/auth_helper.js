

module.exports = function(adminOnly, selfOnly, userId, results, teamOnly, teamId){


    const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();

    if(results.length === 0){
        return  {
            result:false,
            message: "Invalid Access Token."
        };
    }else{
        let auth = results[0];

        if(currentTime - auth.last_login_time > 3600){
            return  {
                result:false,
                message: "Access Token has expired. Login again to generate a new one."
            };
        }else{
            if(!adminOnly){
                if(!selfOnly){
                    if(!teamOnly){
                        return  {
                            result:true
                        };
                    }else{
                        if(auth.team_id != teamId && !auth.is_admin){
                            return  {
                                result:false,
                                message: "You are only authorized to access/edit data related to your team."
                            };
                        }else{
                            return  {
                                result:true
                            };
                        }
                    }


                }else{
                    if(auth.user_id != userId && !auth.is_admin){
                        return  {
                            result:false,
                            message: "You are only authorized to access/edit data related to your account."
                        };
                    }else{
                        return  {
                            result:true
                        };
                    }
                }

            }else{
                if(auth.is_admin){
                    return  {
                        result:true
                    };
                }else{
                    return  {
                        result:false,
                        message: "This endpoint is restricted for admin users only"
                    };
                }
            }
        }
    }
};

// const access_token = req.header('Token');
// const adminOnly = false;
// const selfOnly = false;
// const userId = 0;
// let auth_res;
//
// Auth.find({access_token:access_token})
// //     .then(results=>{
// //
// //         auth_res = AuthHelper(adminOnly, selfOnly, userId, results);
// //
// //         if(auth_res.result){
// //
// //         }else{
// //             res.status(401).json({
// //                 message: auth_res.message,
// //             });
// //         }
// //     })
// //     .catch(err=> {
// //
// //         res.status(500).json({
// //                message: "We encountered an error while verifying your authentication token",
// //         });
// //     });