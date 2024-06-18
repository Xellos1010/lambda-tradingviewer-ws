"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
// script.ts
var jsonwebtoken_1 = require("jsonwebtoken");
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
// Load the key details from a file
var keyDetails = JSON.parse(fs.readFileSync(path.resolve(__dirname, "src/coinbase/keys/evan_cdp_api_key.json"), "utf8"));
var keyName = keyDetails.name;
var keySecret = keyDetails.privateKey;
var requestMethod = "GET";
var url = "api.coinbase.com";
var requestPath = "/api/v3/brokerage/accounts";
var algorithm = "ES256";
var uri = "".concat(requestMethod, " ").concat(url).concat(requestPath);
var generateJWT = function () {
    var payload = {
        iss: "cdp",
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        sub: keyName,
        uri: uri,
    };
    var header = {
        alg: algorithm,
        kid: keyName,
        nonce: crypto.randomBytes(16).toString("hex"),
    };
    var token = (0, jsonwebtoken_1.sign)(payload, keySecret, { algorithm: algorithm, header: header });
    return token;
};
exports.generateJWT = generateJWT;
var token = generateJWT();
console.log("export JWT=" + token);
console.log("curl --ssl-no-revoke -H \"Authorization: Bearer ".concat(token, "\" https://api.coinbase.com/api/v3/brokerage/accounts"));
