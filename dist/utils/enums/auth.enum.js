"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityEnum = exports.ProviderEnum = exports.logOutTypeEnum = exports.tokenTypeEnum = exports.signatureEnum = exports.RoleEnum = exports.GenderEnum = void 0;
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "Male";
    GenderEnum["FEMALE"] = "Female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["USER"] = "User";
    RoleEnum["ADMIN"] = "Admin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var signatureEnum;
(function (signatureEnum) {
    signatureEnum[signatureEnum["USER"] = 0] = "USER";
    signatureEnum[signatureEnum["ADMIN"] = 1] = "ADMIN";
})(signatureEnum || (exports.signatureEnum = signatureEnum = {}));
var tokenTypeEnum;
(function (tokenTypeEnum) {
    tokenTypeEnum["ACCESS"] = "ACCESS";
    tokenTypeEnum["REFRESH"] = "REFRESH";
})(tokenTypeEnum || (exports.tokenTypeEnum = tokenTypeEnum = {}));
var logOutTypeEnum;
(function (logOutTypeEnum) {
    logOutTypeEnum["LOGOUT"] = "LOGOUT";
    logOutTypeEnum["LOGOUT_FROM_ALL"] = "LOGOUT_FROM_ALL";
})(logOutTypeEnum || (exports.logOutTypeEnum = logOutTypeEnum = {}));
var ProviderEnum;
(function (ProviderEnum) {
    ProviderEnum["SYSTEM"] = "SYSTEM";
    ProviderEnum["GOOGLE"] = "GOOGLE";
})(ProviderEnum || (exports.ProviderEnum = ProviderEnum = {}));
var AvailabilityEnum;
(function (AvailabilityEnum) {
    AvailabilityEnum["PUBLIC"] = "PUBLIC";
    AvailabilityEnum["PRIVATE"] = "PRIVATE";
    AvailabilityEnum["FRIENDS"] = "FRIENDS";
})(AvailabilityEnum || (exports.AvailabilityEnum = AvailabilityEnum = {}));
