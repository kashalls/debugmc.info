export default ({ app }, inject) => {
  inject('capitalizeFirstLetter', (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  })
}
