'use strict';

/**
 * @file Provide a way to print messages to the terminal.
 */

/**
 * @typedef {('info'|'warn'|'error'|'success')} MessageType
 */

/**
 * @private
 * @constant
 */
const Color = Object.freeze({
	INFO: 36,
	WARN: 33,
	ERROR: 31,
	SUCCESS: 32,
});

/**
 * Prints a message to the terminal.
 * @param {MessageType} type
 * @param {string} message
 * @returns {undefined}
 * @public
 */
export const print = (type, message) => {
	const color = type.toUpperCase();

	process.stdout.write(`\x1B[${Color[color]}m[${type}]\x1B[0m ${message}\n\n`);
};
