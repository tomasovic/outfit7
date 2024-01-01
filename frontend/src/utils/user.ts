export const getUserInitials = (firstName: string, lastName: string): string => {
  if (!firstName || !lastName) {
    return ''
  }

  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
}

export const getEmailInitials = (email: string): string => {
  if (!email) {
    return ''
  }

  return email.substring(0, 2).toUpperCase()
}
