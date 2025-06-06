const countryPhoneCodes = [
  { id: 1, country: "Afghanistan", code: "+93" },
  { id: 2, country: "Albania", code: "+355" },
  { id: 3, country: "Algeria", code: "+213" },
  { id: 4, country: "Andorra", code: "+376" },
  { id: 5, country: "Angola", code: "+244" },
  { id: 6, country: "Antigua and Barbuda", code: "+1-268" },
  { id: 7, country: "Argentina", code: "+54" },
  { id: 8, country: "Armenia", code: "+374" },
  { id: 9, country: "Australia", code: "+61" },
  { id: 10, country: "Austria", code: "+43" },
  { id: 11, country: "Azerbaijan", code: "+994" },
  { id: 12, country: "Bahamas", code: "+1-242" },
  { id: 13, country: "Bahrain", code: "+973" },
  { id: 14, country: "Bangladesh", code: "+880" },
  { id: 15, country: "Barbados", code: "+1-246" },
  { id: 16, country: "Belarus", code: "+375" },
  { id: 17, country: "Belgium", code: "+32" },
  { id: 18, country: "Belize", code: "+501" },
  { id: 19, country: "Benin", code: "+229" },
  { id: 20, country: "Bhutan", code: "+975" },
  { id: 21, country: "Bolivia", code: "+591" },
  { id: 22, country: "Bosnia and Herzegovina", code: "+387" },
  { id: 23, country: "Botswana", code: "+267" },
  { id: 24, country: "Brazil", code: "+55" },
  { id: 25, country: "Brunei", code: "+673" },
  { id: 26, country: "Bulgaria", code: "+359" },
  { id: 27, country: "Burkina Faso", code: "+226" },
  { id: 28, country: "Burundi", code: "+257" },
  { id: 29, country: "Cabo Verde", code: "+238" },
  { id: 30, country: "Cambodia", code: "+855" },
  { id: 31, country: "Cameroon", code: "+237" },
  { id: 32, country: "Canada", code: "+1" },
  { id: 33, country: "Central African Republic", code: "+236" },
  { id: 34, country: "Chad", code: "+235" },
  { id: 35, country: "Chile", code: "+56" },
  { id: 36, country: "China", code: "+86" },
  { id: 37, country: "Colombia", code: "+57" },
  { id: 38, country: "Comoros", code: "+269" },
  { id: 39, country: "Congo, Democratic Republic of the", code: "+243" },
  { id: 40, country: "Congo, Republic of the", code: "+242" },
  { id: 41, country: "Costa Rica", code: "+506" },
  { id: 42, country: "Cote d'Ivoire", code: "+225" },
  { id: 43, country: "Croatia", code: "+385" },
  { id: 44, country: "Cuba", code: "+53" },
  { id: 45, country: "Cyprus", code: "+357" },
  { id: 46, country: "Czech Republic", code: "+420" },
  { id: 47, country: "Denmark", code: "+45" },
  { id: 48, country: "Djibouti", code: "+253" },
  { id: 49, country: "Dominica", code: "+1-767" },
  { id: 50, country: "Dominican Republic", code: "+1-809, +1-829, +1-849" },
  { id: 51, country: "Ecuador", code: "+593" },
  { id: 52, country: "Egypt", code: "+20" },
  { id: 53, country: "El Salvador", code: "+503" },
  { id: 54, country: "Equatorial Guinea", code: "+240" },
  { id: 55, country: "Eritrea", code: "+291" },
  { id: 56, country: "Estonia", code: "+372" },
  { id: 57, country: "Eswatini (formerly Swaziland)", code: "+268" },
  { id: 58, country: "Ethiopia", code: "+251" },
  { id: 59, country: "Fiji", code: "+679" },
  { id: 60, country: "Finland", code: "+358" },
  { id: 61, country: "France", code: "+33" },
  { id: 62, country: "Gabon", code: "+241" },
  { id: 63, country: "Gambia", code: "+220" },
  { id: 64, country: "Georgia", code: "+995" },
  { id: 65, country: "Germany", code: "+49" },
  { id: 66, country: "Ghana", code: "+233" },
  { id: 67, country: "Greece", code: "+30" },
  { id: 68, country: "Grenada", code: "+1-473" },
  { id: 69, country: "Guatemala", code: "+502" },
  { id: 70, country: "Guinea", code: "+224" },
  { id: 71, country: "Guinea-Bissau", code: "+245" },
  { id: 72, country: "Guyana", code: "+592" },
  { id: 73, country: "Haiti", code: "+509" },
  { id: 74, country: "Honduras", code: "+504" },
  { id: 75, country: "Hungary", code: "+36" },
  { id: 76, country: "Iceland", code: "+354" },
  { id: 77, country: "India", code: "+91" },
  { id: 78, country: "Indonesia", code: "+62" },
  { id: 79, country: "Iran", code: "+98" },
  { id: 80, country: "Iraq", code: "+964" },
  { id: 81, country: "Ireland", code: "+353" },
  { id: 82, country: "Israel", code: "+972" },
  { id: 83, country: "Italy", code: "+39" },
  { id: 84, country: "Jamaica", code: "+1-876" },
  { id: 85, country: "Japan", code: "+81" },
  { id: 86, country: "Jordan", code: "+962" },
  { id: 87, country: "Kazakhstan", code: "+7" },
  { id: 88, country: "Kenya", code: "+254" },
  { id: 89, country: "Kiribati", code: "+686" },
  { id: 90, country: "Korea, North", code: "+850" },
  { id: 91, country: "Korea, South", code: "+82" },
  { id: 92, country: "Kosovo", code: "+383" },
  { id: 93, country: "Kuwait", code: "+965" },
  { id: 94, country: "Kyrgyzstan", code: "+996" },
  { id: 95, country: "Laos", code: "+856" },
  { id: 96, country: "Latvia", code: "+371" },
  { id: 97, country: "Lebanon", code: "+961" },
  { id: 98, country: "Lesotho", code: "+266" },
  { id: 99, country: "Liberia", code: "+231" },
  { id: 100, country: "Libya", code: "+218" },
  { id: 101, country: "Liechtenstein", code: "+423" },
  { id: 102, country: "Lithuania", code: "+370" },
  { id: 103, country: "Luxembourg", code: "+352" },
  { id: 104, country: "Madagascar", code: "+261" },
  { id: 105, country: "Malawi", code: "+265" },
  { id: 106, country: "Malaysia", code: "+60" },
  { id: 107, country: "Maldives", code: "+960" },
  { id: 108, country: "Mali", code: "+223" },
  { id: 109, country: "Malta", code: "+356" },
  { id: 110, country: "Marshall Islands", code: "+692" },
  { id: 111, country: "Mauritania", code: "+222" },
  { id: 112, country: "Mauritius", code: "+230" },
  { id: 113, country: "Mexico", code: "+52" },
  { id: 114, country: "Micronesia", code: "+691" },
  { id: 115, country: "Moldova", code: "+373" },
  { id: 116, country: "Monaco", code: "+377" },
  { id: 117, country: "Mongolia", code: "+976" },
  { id: 118, country: "Montenegro", code: "+382" },
  { id: 119, country: "Morocco", code: "+212" },
  { id: 120, country: "Mozambique", code: "+258" },
  { id: 121, country: "Myanmar (Burma)", code: "+95" },
  { id: 122, country: "Namibia", code: "+264" },
  { id: 123, country: "Nauru", code: "+674" },
  { id: 124, country: "Nepal", code: "+977" },
  { id: 125, country: "Netherlands", code: "+31" },
  { id: 126, country: "New Zealand", code: "+64" },
  { id: 127, country: "Nicaragua", code: "+505" },
  { id: 128, country: "Niger", code: "+227" },
  { id: 129, country: "Nigeria", code: "+234" },
  { id: 130, country: "North Macedonia (formerly Macedonia)", code: "+389" },
  { id: 131, country: "Norway", code: "+47" },
  { id: 132, country: "Oman", code: "+968" },
  { id: 133, country: "Pakistan", code: "+92" },
  { id: 134, country: "Palau", code: "+680" },
  { id: 135, country: "Palestine", code: "+970" },
  { id: 136, country: "Panama", code: "+507" },
  { id: 137, country: "Papua New Guinea", code: "+675" },
  { id: 138, country: "Paraguay", code: "+595" },
  { id: 139, country: "Peru", code: "+51" },
  { id: 140, country: "Philippines", code: "+63" },
  { id: 141, country: "Poland", code: "+48" },
  { id: 142, country: "Portugal", code: "+351" },
  { id: 143, country: "Qatar", code: "+974" },
  { id: 144, country: "Romania", code: "+40" },
  { id: 145, country: "Russia", code: "+7" },
  { id: 146, country: "Rwanda", code: "+250" },
  { id: 147, country: "Saint Kitts and Nevis", code: "+1-869" },
  { id: 148, country: "Saint Lucia", code: "+1-758" },
  { id: 149, country: "Saint Vincent and the Grenadines", code: "+1-784" },
  { id: 150, country: "Samoa", code: "+685" },
  { id: 151, country: "San Marino", code: "+378" },
  { id: 152, country: "Sao Tome and Principe", code: "+239" },
  { id: 153, country: "Saudi Arabia", code: "+966" },
  { id: 154, country: "Senegal", code: "+221" },
  { id: 155, country: "Serbia", code: "+381" },
  { id: 156, country: "Seychelles", code: "+248" },
  { id: 157, country: "Sierra Leone", code: "+232" },
  { id: 158, country: "Singapore", code: "+65" },
  { id: 159, country: "Slovakia", code: "+421" },
  { id: 160, country: "Slovenia", code: "+386" },
  { id: 161, country: "Solomon Islands", code: "+677" },
  { id: 162, country: "Somalia", code: "+252" },
  { id: 163, country: "South Africa", code: "+27" },
  { id: 164, country: "South Sudan", code: "+211" },
  { id: 165, country: "Spain", code: "+34" },
  { id: 166, country: "Sri Lanka", code: "+94" },
  { id: 167, country: "Sudan", code: "+249" },
  { id: 168, country: "Suriname", code: "+597" },
  { id: 169, country: "Sweden", code: "+46" },
  { id: 170, country: "Switzerland", code: "+41" },
  { id: 171, country: "Syria", code: "+963" },
  { id: 172, country: "Taiwan", code: "+886" },
  { id: 173, country: "Tajikistan", code: "+992" },
  { id: 174, country: "Tanzania", code: "+255" },
  { id: 175, country: "Thailand", code: "+66" },
  { id: 176, country: "Timor-Leste", code: "+670" },
  { id: 177, country: "Togo", code: "+228" },
  { id: 178, country: "Tonga", code: "+676" },
  { id: 179, country: "Trinidad and Tobago", code: "+1-868" },
  { id: 180, country: "Tunisia", code: "+216" },
  { id: 181, country: "Turkey", code: "+90" },
  { id: 182, country: "Turkmenistan", code: "+993" },
  { id: 183, country: "Tuvalu", code: "+688" },
  { id: 184, country: "Uganda", code: "+256" },
  { id: 185, country: "Ukraine", code: "+380" },
  { id: 186, country: "United Arab Emirates", code: "+971" },
  { id: 187, country: "United Kingdom", code: "+44" },
  { id: 188, country: "United States", code: "+1" },
  { id: 189, country: "Uruguay", code: "+598" },
  { id: 190, country: "Uzbekistan", code: "+998" },
  { id: 191, country: "Vanuatu", code: "+678" },
  { id: 192, country: "Vatican City", code: "+39-06" },
  { id: 193, country: "Venezuela", code: "+58" },
  { id: 194, country: "Vietnam", code: "+84" },
  { id: 195, country: "Yemen", code: "+967" },
  { id: 196, country: "Zambia", code: "+260" },
  { id: 197, country: "Zimbabwe", code: "+263" },
];

function extractPhoneCode(phoneString: string) {
  if (!phoneString || !phoneString.startsWith("+")) {
    return null; // Invalid input
  }

  let phoneCode = "+"; // Start with the plus sign

  // Loop through string starting after the "+" sign
  for (let i = 1; i < phoneString.length; i++) {
    // Check if character is a digit
    if (/\d/.test(phoneString[i])) {
      phoneCode += phoneString[i];
    } else {
      // Stop once we hit a non-digit character
      break;
    }
  }

  // Make sure we found at least one digit
  return phoneCode.length > 1 ? phoneCode : null;
}

export { extractPhoneCode, countryPhoneCodes };
