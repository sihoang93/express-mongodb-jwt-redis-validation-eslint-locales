/* eslint-disable no-undef */
import vi from './vi';

export const getEmailTemplate = code => {
  switch (code) {
    case 'vi':
      return vi;

    default:
      return vi;
  }
};

export default getEmailTemplate(global.language);
