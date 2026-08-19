const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'enterprise/packages/auth/dist/better-auth.guard.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the try/catch block with direct DB query
const searchStr = `const sessionData = yield better_auth_config_1.auth.api.getSession({
                    headers: request.headers,
                });
                if (!sessionData || !sessionData.user) {
                    throw new common_1.UnauthorizedException('Invalid or expired Better Auth session');
                }
                const payload = sessionData.user;
                const email = payload.email;
                const firstName = (((_a = payload.name) === null || _a === void 0 ? void 0 : _a.split(' ')[0]) || 'User');
                const lastName = (((_b = payload.name) === null || _b === void 0 ? void 0 : _b.split(' ')[1]) || '');
                const imageUrl = (payload.image || '');
                let user = yield this.userRepository.findOne({ externalId: payload.id });
                if (!user) {
                    user = yield this.userRepository.findByEmail(email);
                }
                if (!user) {`;

const replaceStr = `
                const token = authorizationHeader.replace('Bearer ', '').trim();
                const db = this.userRepository.MongooseModel.db;
                const sessionData = yield db.collection('session').findOne({ token });
                
                if (!sessionData) {
                    throw new common_1.UnauthorizedException('Invalid or expired Better Auth session');
                }
                
                let user = yield this.userRepository.findOne({ _id: sessionData.userId });
                
                if (!user) {
                    user = yield db.collection('user').findOne({ _id: sessionData.userId });
                }
                
                if (!user) {`;

content = content.replace(searchStr, replaceStr);

fs.writeFileSync(filePath, content);
console.log("Patched better-auth.guard.js");
