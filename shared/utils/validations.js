import i18n from '../../shared/i18n';

export const isEmpty = value => value === undefined || value === null || value === '';
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

export function cidr(value) {
  if (!/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/.test(value)) {
    return '网段地址格式错误';
  }
  return null;
}

export function hostname(value) {
  if (isEmpty(value) || !/^[0-9a-zA-Z_\-]+$/.test(value)) {
    return i18n.t('pageInstanceCreate.hostnameNotValid');
  }
  return null;
}

export function loginPassword(value) {
  if (isEmpty(value) || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(value)) {
    return i18n.t('pageInstanceCreate.passwordNotValid');
  }
  return null;
}

export function ipAddress(value) {
  if (isEmpty(value) || !/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(value)) {
    return i18n.t('validationMessage.ipAddress');
  }
  return null;
}

export function port(value) {
  if (isEmpty(value) || !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(value)) {
    return i18n.t('validationMessage.port');
  }
  return null;
}

export function weight(value) {
  if (value && !/^([0-9]{1,2}|[1][0-9]{2}|2[0-4][0-9]|25[0-6])$/.test(value)) {
    return i18n.t('validationMessage.weight');
  }
  return null;
}

export function connectionLimit(value) {
  if ((value && (!Number.isInteger(Number(value)) || (Number(value) < -1))) || (Number(value) === 0)) {
    return i18n.t('validationMessage.connectionLimit');
  }
  return null;
}

export function healthMonitorDelay(value) {
  if (value && !/^([0-9]{1}|[1-4][0-9]|50)$/.test(value)) {
    return i18n.t('validationMessage.healthMonitorDelay');
  }
  return null;
}

export function healthMonitorTimeout(value) {
  if (value && !/^([0-9]{1,2}|[1-2][0-9]{2}|300)$/.test(value)) {
    return i18n.t('validationMessage.healthMonitorTimeout');
  }
  return null;
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
