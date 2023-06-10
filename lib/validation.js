/*
 * Performs data validation on an object by verifying that it contains
 * all required fields specified in a given schema.
 *
 * Returns true if the object is valid agianst the schema and false otherwise.
 */
exports.validateAgainstSchema = function (obj, schema) {
    return obj && Object.keys(schema).every(
        field => !schema[field].required || obj[field]
    )
}