

const apikeys = {
    "type": process.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
    "project_id": process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    "private_key_id": process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCcJq9rCUWK74Pa\nPNqyJ6pM3JYgJH9E1p1mP+FuxpNB6KcZ4RX0NTIh/oLUOJq5j/3wGd7jj5fno7Lf\nibRggisbkljFcYdWhSebMR4CQspJbp+1XAbij91cfDrA2sh7AoyqLK8IHaBOrpJw\no8dpmPLZ4mORRcJ6lV070JJGEnzALxiGyLMPhS8/zglNjAnB1Y7UgU9mYDgiEZr5\nUVQwpkPTemU//NrrTJkeIJXqDVt/qn6dRRxNcdNWwKuqH+e+jHbFTTchl+R68Dje\nR+x3GKNRJ/w8QV75adNyvHIlO4WYj6Qx18sZlE43K6q72Qf1Qws/Muq21VBTrGei\n1wWAZ/KbAgMBAAECggEABoH73pbN7ExGI4iajUE4lBEFPCfKseKenPsU2Pi5Nwip\naizVLRSOS6PCYix8HTdrHAj9E0mjbByreEQjzAWwxZkrNyHlcnZWGka3uGhPjgV0\nHJm274+qXJWzksllo3sk8nSuYAq2l4Dh3FXTa7PnF9q+IL7cTtkbNGVhZW04F1Fi\n135uL3QEyRfehEohPzhHe2h1SPZ8s3E/lt+SAQTF90jhdFJSqbHWBhNApQhJ+46C\nH6bS6RInclR+sVU2elUHWTqKXtRyEzSAl2OVdNRD/lhzXe49fBrtITfwZ9aV6EQK\nyxr4cVbkzV1rsq9QKKbSSbPBWuFNnxeh8FKXfHRNiQKBgQDQNoYdwh2tEWVNqwjS\nfGSlaMa5d65NWlKS9bCytpL8SoKGbmGuDkMlzjFcuOgtNLn9rW+p+eGCEoIhnnmC\nupR3CObfxxSGzntadm12imxVv5QwQ3+R4yy4THG89zlKaCHlKf+H5ucNhS7oagJL\nt3z4oRq9zC+QxACIAFNjyQ9wkwKBgQC//Ukea3WAsC10+qdndQOPQRr83ZO0VMOi\nPo8EaBRE718dUgZ+robc9LP75bAb/fFsjZqGQN8u8C0UBSyxuAXvRoA0fHspL1GQ\nuExAgO8C1xyGhaqfziukZVe/8w8iU7JChEX3V99EyVjkRfW9X6QdalKqJ2Ka5d9r\nvZPKxeoi2QKBgFi6Y3za8/qEpz7p2+CW0e0LMWRn9AdSrk2iFaKS2yBYQDc5Yrbh\nrQu3SqHQymA5T+kit6sfqVHcwUfCWNW03P+882X5WG36H+b1AMC7TF9ePLA0k3B/\n9tay/OUiFW/34DngI9yuMVg5oTu5sTDDCKaLQPIQyVRPskpCmUa0r7exAoGANR+K\nmeY2DzOwgEvTAmd4Yq0rIIjXE/DYaQ5SWG/MG/74HI7TyT3Vh1IWcz7s6fHsWZMd\nDMTqfHxsnLuJ0GsRCVJCq0M+ePjk4tx8DOUgPXL0K6zUt38+yDBahXxl1aO/EXS0\nP2qLFud3t0I8avgJ2zHOSdK4EBBHL/K28EavMJECgYBg+1MFRFefg7Ibehmpvl10\n3q4cQc2+yWtUPMqHGd/WNcHpqfF67TOjxuOmRKG5aaTOgAYJagXTkTBPs9OC+0uI\ns7OlKTRIyDgthQx7OhIEqXI9wiVfbU1upMJ9zVUVosAbDIPQFat5g134eEcouOXv\nfaVzCbP/vJBsDGWsGu8KSg==\n-----END PRIVATE KEY-----\n",
    "client_email": process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    "client_id": process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
    "auth_uri": process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI,
    "token_uri": process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.GOOGLE_SERVICE_ACCOUNT_UNIVERSE
}

const {google} = require('googleapis');
const SCOPE = ['https://www.googleapis.com/auth/drive'];




async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}



module.exports={
    authorize
}