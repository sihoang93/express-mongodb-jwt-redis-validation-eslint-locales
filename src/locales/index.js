/* eslint-disable no-undef */
import vi from './vi';
import en from './en';

export const getMessages = code => {
  switch (code) {
    case 'vi':
      return vi;

    case 'en':
      return en;

    default:
      return vi;
  }
};
export const messages = getMessages(global.language);
