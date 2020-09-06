export const isNullOrEmpty = (str) => str === null || str.length === 0

export function startsWith(string, search, rawPos) {
  const pos = rawPos > 0 ? rawPos | 0 : 0
  return string.substring(pos, pos + search.length) === search
}

export function trim(s, c) {
  if (c === ']') c = '\\]'
  if (c === '\\') c = '\\\\'

  return s.replace(new RegExp('^[' + c + ']+|[' + c + ']+$', 'g'), '')
}

export function combine(...parts) {
  let result = ''
  let inQuery = false,
    inFragment = false

  for (let part of parts) {
    if (part && part != undefined) {
      part = part.toString()

      if (isNullOrEmpty(part)) continue

      if (result.endsWith('?') || startsWith(part, '?')) result = combineEnsureSingleSeparator(result, part, '?')
      else if (result.endsWith('#') || startsWith(part, '#')) result = combineEnsureSingleSeparator(result, part, '#')
      else if (inFragment) result += part
      else if (inQuery) result = combineEnsureSingleSeparator(result, part, '&')
      else result = combineEnsureSingleSeparator(result, part, '/')

      if (part.includes('#')) {
        inQuery = false
        inFragment = true
      } else if (!inFragment && part.includes('?')) {
        inQuery = true
      }
    }
  }

  return result

  function combineEnsureSingleSeparator(a, b, separator) {
    if (isNullOrEmpty(a)) return b
    if (isNullOrEmpty(b)) return a

    return trim(a, separator) + separator + trim(b, separator)
  }
}

export const sorter = (prop) => (a, b) => {
  const value = a[prop]
  const secondValue = b[prop]
  const valueType = typeof value

  if (valueType === 'string') {
    // Sort to tail
    // if (value === '-') return -1
    return value.length - secondValue.length
  }

  if (valueType === 'number') {
    // Sort to tail
    // if (value === -1) return value
    return value - secondValue
  }

  console.log('call sorter', a, b, valueType)

  return 0
}

export function debounce(func, wait, immediate) {
  let timeout

  return function executedFunction() {
    const context = this
    const args = arguments

    const later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}
