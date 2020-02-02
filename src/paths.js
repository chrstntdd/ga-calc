const { resolve } = require("path")

const PROJECT_ROOT = resolve(__dirname, "../")
const SOURCE_DIRECTORY = resolve(PROJECT_ROOT, "src")
const BUILD_DIRECTORY = resolve(PROJECT_ROOT, "build")
const ASSET_DIRECTORY = resolve(PROJECT_ROOT, "assets")
const PUBLIC_DIRECTORY = resolve(PROJECT_ROOT, "public")
const CLIENT_LIB = resolve(PUBLIC_DIRECTORY, "client")
const SECURE_SERVER_KEYS = resolve(PROJECT_ROOT, "keys")

exports.ASSET_DIRECTORY = ASSET_DIRECTORY
exports.BUILD_DIRECTORY = BUILD_DIRECTORY
exports.CLIENT_LIB = CLIENT_LIB
exports.PUBLIC_DIRECTORY = PUBLIC_DIRECTORY
exports.SECURE_SERVER_KEYS = SECURE_SERVER_KEYS
exports.SOURCE_DIRECTORY = SOURCE_DIRECTORY
