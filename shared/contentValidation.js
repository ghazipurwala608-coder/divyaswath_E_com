// Content edits preserve the existing design's keys, card counts and icon positions.
export function validateContent(value, template, path = 'content') {
  if (Array.isArray(template)) {
    if (!Array.isArray(value) || value.length !== template.length) throw new Error(`${path}: keep all ${template.length} existing entries`)
    template.forEach((item, index) => validateContent(value[index], item, `${path}.${index}`))
  } else if (template && typeof template === 'object') {
    if (!value || Array.isArray(value) || typeof value !== 'object' || Object.keys(value).length !== Object.keys(template).length) throw new Error(`${path}: content structure cannot be changed`)
    for (const key of Object.keys(template)) {
      if (!Object.hasOwn(value, key)) throw new Error(`${path}.${key} is required`)
      if (['$icon', 'position', 'scale', 'className'].includes(key) && value[key] !== template[key]) throw new Error(`${path}.${key}: design settings are fixed`)
      validateContent(value[key], template[key], `${path}.${key}`)
    }
  } else if (typeof value !== typeof template || (typeof value === 'number' && !Number.isFinite(value))) {
    throw new Error(`${path}: invalid value`)
  } else if (typeof value === 'string') {
    if (value.length > 12000) throw new Error(`${path}: text is too long`)
    if (/^\s*(javascript|data|vbscript):/i.test(value) || /^\s*\/\//.test(value)) throw new Error(`${path}: unsafe link`)
  }
  return value
}
