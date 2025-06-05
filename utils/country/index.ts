// @ts-nocheck
import * as country from "./country.json";
import * as phone from "./phone.json";

export const getPhoneCodes = () => {
  return phone;
};

export const getCountryNames = () => {
  return country;
};

export const getCountryNameByPhone = (phoneCode: string) => {
  let country_name = "";
  Object.keys(phone).forEach((key) => {
    if (phone[key] === phoneCode) {
      country_name = country[key];
      return;
    }
  });
  return country_name;
};

export const getPhoneCodeByCountry = (country: string) => {
  return phone[country];
};

export const getCountryNameByCode = (code: string) => {
  return country[code];
};

export const getCountryPhoneCodeFieldOptions = () => {
  return Object.keys(phone).flatMap((key) =>
    key === "default"
      ? []
      : {
          label: `${country[key]} (${phone[key]})`,
          value: phone[key],
        }
  );
};

export const getCountryFieldOptions = () => {
  return Object.keys(country).map((key) =>
    key === "default"
      ? []
      : {
          label: country[key],
          value: country[key],
        }
  );
};
