import {configure, defineRule, ErrorMessage, Field as VeeField, Form as VeeForm} from 'vee-validate'
import {
  alpha_spaces as alphaSpaces,
  confirmed,
  email,
  max,
  max_value as maxVal,
  min,
  min_value as minVal,
  not_one_of as excluded,
  numeric,
  one_of as oneOf,
  required
} from '@vee-validate/rules'

export function setupVeeValidate(app) {
  app.component('VeeForm', VeeForm)
  app.component('VeeField', VeeField)
  app.component('ErrorMessage', ErrorMessage)

  defineRule('required', required)
  defineRule('min', min)
  defineRule('max', max)
  defineRule('alpha_spaces', alphaSpaces)
  defineRule('email', email)
  defineRule('numeric', numeric)
  defineRule('min_value', minVal)
  defineRule('max_value', maxVal)
  defineRule('passwords_mismatch', confirmed)
  defineRule('excluded', excluded)
  defineRule('oneOf', oneOf)


  configure({
    generateMessage: (ctx) => {
      const field = ctx.field === 'confirm_password' ? 'confirm password' : ctx.field
      const messages = {
        required: `The field ${field} is required.`,
        min: `The field ${field} is short.`,
        passwords_mismatch: `Passwords dont match.`
      }

      return messages[ctx.rule.name]
        ? messages[ctx.rule.name]
        : `The field ${ctx.field} is invalid`
    },
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true
  })
}

export default {
  install(app) {
    setupVeeValidate(app)
  }
}
