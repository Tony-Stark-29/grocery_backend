const admin = require("../config/firebase_admin");

 const autheicateUser=
	async (req, res, next) => {
		const token = req.headers.authorization.split(' ')[1];
		try {
			const decodeValue = await admin.auth().verifyIdToken(token);
			if (decodeValue) {
				req.user = decodeValue;
				return next();
			}
			return res.status(401).json({ message: 'UnAuthorize' });
		} catch (error) {
			return res.status(400).json({ message: 'Internal Error',Error :error.message});
		}
	};

module.exports = autheicateUser