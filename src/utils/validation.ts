import * as yup from 'yup'
import { SchemaLike, ValidateOptions } from 'yup/lib/types'

yup.setLocale({
	mixed: {
		required: () => ({key: 'validation.required', values: {}})
	},
	string: {
		// @ts-ignore
		min: ({min}) => ({key: 'validation.min', values: {min}}),
		email: () => ({key: 'validation.email', values: {}}),
		required: () => ({key: 'validation.required', values: {}})
	}
})

const emailSchema = yup.object().shape({
	email: yup.string().email().required(),
})

export function validateEmail(values: any, t: any) {
	return validate(emailSchema, values, t)
}

async function validate(schema: SchemaLike, values: any, t: any, options?: ValidateOptions) {
	const message: any = {};

	try {
		await schema.validate(values, {abortEarly: false, stripUnknown: true, ...options});
	} catch ({ inner }) {
		// @ts-ignore
		inner.map(({ path, errors }) => {
		const error: any = errors[0]

		if (!message[path]) {
			message[path] = t(error.key, error.values)
		}
	});	
	} finally {
		return message;
	}
}
