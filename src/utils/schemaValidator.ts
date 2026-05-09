import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

export function validateSchema(schema: any, data: any) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return {
    valid,
    errors: validate.errors ?? []
  };
}