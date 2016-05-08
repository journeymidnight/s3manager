const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return '请输入邮箱地址。';
  }
  return null;
}

export function required(value) {
  if (isEmpty(value)) {
    return '此项为必填项。';
  }
  return null;
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `至少需要填写 ${min} 字符`;
    }
    return null;
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `最多填写 ${max} 字符`;
    }
    return null;
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return '必须填写整型数值。';
  }
  return null;
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `必须填写以下选项中的一个: ${enumeration.join(', ')}。`;
    }
    return null;
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}
