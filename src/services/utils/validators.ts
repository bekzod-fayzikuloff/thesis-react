export function validateEmail(email: string): string {
  return validate(email => email.includes('@') && email.includes('.'), email, new Error("EmailError"))
}

export function validateUsername(username: string): string {
  return validate(username => username.length > 3 && !username.includes(' '), username, new Error("UsernameError"))
}

export function validatePassword(password: string): string {
  return validate(username => username.length > 7 && !username.includes(' '), password, new Error("PasswordError"))
}

export function passwordSameValidate(password: string, passwordConfirm: string): string {
  return validate(password => password === passwordConfirm, password, new Error("PasswordDiffError"))
}

export function validate(func: (value: string) => boolean, value: string, error: unknown) {
  if (func(value)) {
    return value
  } else throw error
}
