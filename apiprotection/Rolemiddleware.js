
const inRole = (role) => (req, res, next) => {
    if (req.user.role === role) {
        next();
    } else {
        res.status(401).json({ message: "You are not allowed to access this resource" });
    }
}

module.exports = {
    inRole

}