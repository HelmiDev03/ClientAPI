const Users = require('.././models/user');

const jwt = require('jsonwebtoken')



const RefreshToken = async (req, res) => {
    let refreshToken = req.body.refreshToken

    try {
        // Verify the refresh token and extract the user's ID
     
        refreshToken = refreshToken.replace("Bearer ", ""); 
        const decoded  = jwt.verify(refreshToken,process.env.PRIVATE_KEY);
       
        
           
      
        const userId = decoded._id;

        // Fetch user data from the database (You might need to modify this based on your database setup)
        const findUser = await Users.findById(userId);

        // Create a new token using the user's data
        const token = jwt.sign(
            {
                _id: findUser._id,
                firstname: findUser.firstname,
                lastname: findUser.lastname,
                email: findUser.email,
                cin: findUser.cin,
                role: findUser.role,
                username: findUser.username,
                phonenumber: findUser.phonenumber,
                profilepicture: findUser.profilepicture,
                dateofbirth: findUser.dateofbirth,
                matricule: findUser.matricule,
                createdAt: findUser.createdAt,
                gender: findUser.gender,
                maritalstatus: findUser.maritalstatus,
                nationality: findUser.nationality,
                address: findUser.address,
                city: findUser.city,
                country: findUser.country,
                postalcode: findUser.postalcode,
                tfa: findUser.tfa,
                company : findUser.company,
                policy : findUser.policy,
            },
            process.env.PRIVATE_KEY,
            { expiresIn: '8h' }
        );

        // Send the new token in the response
        return res.status(200).json({ token: "Bearer " + token });
    } catch (error) {
     
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

// Define the route for token refresh





module.exports = {
    RefreshToken
}