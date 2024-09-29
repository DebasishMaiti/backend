const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
}

exports.comparePassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}