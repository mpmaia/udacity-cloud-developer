/**
 * Used to generate a valid jwt token in the command line
 */
import {generateToken} from "./auth";

var args = process.argv.slice(2);

console.log("Token: " + generateToken(args[0]));
