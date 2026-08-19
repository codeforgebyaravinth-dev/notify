const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'enterprise/packages/auth/dist/better-auth.guard.js');
let content = fs.readFileSync(filePath, 'utf8');

const searchStr = `const token = authorizationHeader.replace('Bearer ', '').trim();
                const db = this.userRepository.MongooseModel.db;
                const sessionData = yield db.collection('session').findOne({ token });
                
                if (!sessionData) {`;

const replaceStr = `const token = authorizationHeader.replace('Bearer ', '').trim();
                const db = this.userRepository.MongooseModel.db;
                console.log("GUARD: Searching for token:", token);
                const sessionData = yield db.collection('session').findOne({ token });
                console.log("GUARD: found session:", !!sessionData);
                
                if (!sessionData) {`;

content = content.replace(searchStr, replaceStr);
fs.writeFileSync(filePath, content);
console.log("Patched better-auth.guard.js with logs");
