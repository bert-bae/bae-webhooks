"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.WebookCipher = void 0;
var crypto_1 = __importDefault(require("crypto"));
var WebookCipher = (function () {
    function WebookCipher(secretKey) {
        this.alg = "aes-256-cbc";
        this.iv = crypto_1["default"].randomBytes(16).toString("hex").slice(0, 16);
        this.secretKey = secretKey;
    }
    WebookCipher.prototype.encrypt = function (message) {
        var cipher = crypto_1["default"].createCipheriv(this.alg, this.secretKey, this.iv);
        return cipher.update(message, "utf8", "hex") + cipher.final("hex");
    };
    WebookCipher.prototype.decrypt = function (hash) {
        var decipher = crypto_1["default"].createDecipheriv(this.alg, this.secretKey, this.iv);
        return decipher.update(hash, "hex", "utf8") + decipher.final("utf8");
    };
    return WebookCipher;
}());
exports.WebookCipher = WebookCipher;
//# sourceMappingURL=index.js.map