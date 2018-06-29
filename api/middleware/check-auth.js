const jwt = require('jsonwebtoken');
const fs = require('fs');


    let checkAuthAdmin = (req, res, next) => {

        try {

            // Get the JWT key
            let obj = JSON.parse(fs.readFileSync('./keys.json'));
        
            // Decode the TOKEN to get informations
            const decoded = jwt.verify(req.headers.authorisation.split(' ')[1], obj.JWT_KEY);

            // Check if the user is an ADMIN
            if (decoded.type === '1_a'){

                    // Put the userData into our HTTP request
                    req.userData = decoded;
                            
                    // Move to next
                    next();

            }else { // IF not an ADMIN

                // In case user is not an admin
                return res.status(401).json({
                    message: 'You NEED authentification in order to get access'
                });

            }
            
        
            } catch (error){
        
                // In case error it means token wrong throw Response with status of 401
                return res.status(401).json({
                    message: 'You NEED authentification in order to get access'
                });
                
            }

    }

    let checkAuthNormal = (req, res, next) => {

        try {

            // Get the JWT key
            let obj = JSON.parse(fs.readFileSync('./keys.json'));
        
            // Decode the TOKEN to get informations
            const decoded = jwt.verify(req.headers.authorisation.split(' ')[1], obj.JWT_KEY);

            // Put the userData into our HTTP request
            req.userData = decoded;
                            
            // Move to next
            next();
            
        
            } catch (error){
        
                // In case error it means token wrong throw Response with status of 401
                return res.status(401).json({
                    message: 'You NEED authentification in order to get access'
                });
                
            }

    }



// Filter to check authentification
module.exports = {
    checkAuthAdmin : (req, res, next) => {
    
        try {

            // Get the JWT key
            let obj = JSON.parse(fs.readFileSync('./keys.json'));
        
            // Decode the TOKEN to get informations
            const decoded = jwt.verify(req.headers.authorisation.split(' ')[1], obj.JWT_KEY);

            // Check if the user is an ADMIN
            if (decoded.type === '1_a'){

                    // Put the userData into our HTTP request
                    req.userData = decoded;
                            
                    // Move to next
                    next();

            }else { // IF not an ADMIN

                // In case user is not an admin
                return res.status(401).json({
                    message: 'You NEED authentification in order to get access'
                });

            }
            
        
            } catch (error){
        
                // In case error it means token wrong throw Response with status of 401
                return res.status(401).json({
                    message: 'You NEED authentification in order to get access'
                });
                
            }

    }, 
    checkAuthNormal: (req, res, next)=> {

        try {

            // Get the JWT key
            let obj = JSON.parse(fs.readFileSync('./keys.json'));
        
            // Decode the TOKEN to get informations
            const decoded = jwt.verify(req.headers.authorisation.split(' ')[1], obj.JWT_KEY);

            // Put the userData into our HTTP request
            req.userData = decoded;
                            
            // Move to next
            next();
            
        
            } catch (error){
        
                // In case error it means token wrong throw Response with status of 401
                return res.status(401).json({
                    message: 'You NEED authentification in order to get access'
                });
                
            }

    }
};