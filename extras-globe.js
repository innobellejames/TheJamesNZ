/* The James NZ — Kiwi Adventures › World Clock globe (October 2026).
   A spinning globe you can drag. Tap a dot to see the date and time there,
   side by side with New Zealand time. Continents are simplified outlines drawn
   for the site; when the visitor is online a more detailed coastline is used. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef, useMemo = R.useMemo;

  // [name, flag, city, lat, lon, IANA time zone]
  var PLACES = [
    ['New Zealand', '🇳🇿', 'Wellington', -41.29, 174.78, 'Pacific/Auckland', 'Wellington', 'NZD', 'NZ dollar'],
    ['Australia (Sydney)', '🇦🇺', 'Sydney', -33.87, 151.21, 'Australia/Sydney', 'Canberra', 'AUD', 'Australian dollar'],
    ['Australia (Brisbane)', '🇦🇺', 'Brisbane', -27.47, 153.03, 'Australia/Brisbane', 'Canberra', 'AUD', 'Australian dollar'],
    ['Australia (Perth)', '🇦🇺', 'Perth', -31.95, 115.86, 'Australia/Perth', 'Canberra', 'AUD', 'Australian dollar'],
    ['Australia (Adelaide)', '🇦🇺', 'Adelaide', -34.93, 138.6, 'Australia/Adelaide', 'Canberra', 'AUD', 'Australian dollar'],
    ['Fiji', '🇫🇯', 'Suva', -18.14, 178.44, 'Pacific/Fiji', 'Suva', 'FJD', 'Fijian dollar'],
    ['Samoa', '🇼🇸', 'Apia', -13.83, -171.76, 'Pacific/Apia', 'Apia', 'WST', 'Samoan tālā'],
    ['Tonga', '🇹🇴', 'Nukuʻalofa', -21.14, -175.2, 'Pacific/Tongatapu', 'Nukuʻalofa', 'TOP', 'Tongan paʻanga'],
    ['Cook Islands', '🇨🇰', 'Avarua', -21.21, -159.78, 'Pacific/Rarotonga', 'Avarua', 'NZD', 'NZ dollar'],
    ['Niue', '🇳🇺', 'Alofi', -19.06, -169.92, 'Pacific/Niue', 'Alofi', 'NZD', 'NZ dollar'],
    ['French Polynesia', '🇵🇫', 'Papeete', -17.53, -149.57, 'Pacific/Tahiti', 'Papeete', 'XPF', 'CFP franc'],
    ['New Caledonia', '🇳🇨', 'Nouméa', -22.27, 166.45, 'Pacific/Noumea', 'Nouméa', 'XPF', 'CFP franc'],
    ['Vanuatu', '🇻🇺', 'Port Vila', -17.73, 168.32, 'Pacific/Efate', 'Port Vila', 'VUV', 'Vanuatu vatu'],
    ['Solomon Islands', '🇸🇧', 'Honiara', -9.43, 159.95, 'Pacific/Guadalcanal', 'Honiara', 'SBD', 'Solomon Islands dollar'],
    ['Papua New Guinea', '🇵🇬', 'Port Moresby', -9.44, 147.18, 'Pacific/Port_Moresby', 'Port Moresby', 'PGK', 'PNG kina'],
    ['Kiribati', '🇰🇮', 'Tarawa', 1.45, 172.98, 'Pacific/Tarawa', 'Tarawa', 'AUD', 'Australian dollar'],
    ['Tuvalu', '🇹🇻', 'Funafuti', -8.52, 179.2, 'Pacific/Funafuti', 'Funafuti', 'AUD', 'Australian dollar'],
    ['Hawaiʻi (USA)', '🇺🇸', 'Honolulu', 21.31, -157.86, 'Pacific/Honolulu', 'Washington, D.C.', 'USD', 'US dollar'],
    ['Philippines', '🇵🇭', 'Manila', 14.6, 120.98, 'Asia/Manila', 'Manila', 'PHP', 'Philippine peso'],
    ['Indonesia', '🇮🇩', 'Jakarta', -6.21, 106.85, 'Asia/Jakarta', 'Jakarta', 'IDR', 'Indonesian rupiah'],
    ['Malaysia', '🇲🇾', 'Kuala Lumpur', 3.14, 101.69, 'Asia/Kuala_Lumpur', 'Kuala Lumpur', 'MYR', 'Malaysian ringgit'],
    ['Singapore', '🇸🇬', 'Singapore', 1.35, 103.82, 'Asia/Singapore', 'Singapore', 'SGD', 'Singapore dollar'],
    ['Thailand', '🇹🇭', 'Bangkok', 13.76, 100.5, 'Asia/Bangkok', 'Bangkok', 'THB', 'Thai baht'],
    ['Vietnam', '🇻🇳', 'Hanoi', 21.03, 105.85, 'Asia/Ho_Chi_Minh', 'Hanoi', 'VND', 'Vietnamese đồng'],
    ['Cambodia', '🇰🇭', 'Phnom Penh', 11.56, 104.92, 'Asia/Phnom_Penh', 'Phnom Penh', 'KHR', 'Cambodian riel'],
    ['Myanmar', '🇲🇲', 'Yangon', 16.87, 96.2, 'Asia/Yangon', 'Naypyidaw', 'MMK', 'Myanmar kyat'],
    ['China', '🇨🇳', 'Beijing', 39.9, 116.4, 'Asia/Shanghai', 'Beijing', 'CNY', 'Chinese yuan'],
    ['Hong Kong', '🇭🇰', 'Hong Kong', 22.32, 114.17, 'Asia/Hong_Kong', 'Hong Kong', 'HKD', 'Hong Kong dollar'],
    ['Taiwan', '🇹🇼', 'Taipei', 25.03, 121.57, 'Asia/Taipei', 'Taipei', 'TWD', 'New Taiwan dollar'],
    ['Japan', '🇯🇵', 'Tokyo', 35.68, 139.69, 'Asia/Tokyo', 'Tokyo', 'JPY', 'Japanese yen'],
    ['South Korea', '🇰🇷', 'Seoul', 37.57, 126.98, 'Asia/Seoul', 'Seoul', 'KRW', 'South Korean won'],
    ['Mongolia', '🇲🇳', 'Ulaanbaatar', 47.89, 106.91, 'Asia/Ulaanbaatar', 'Ulaanbaatar', 'MNT', 'Mongolian tögrög'],
    ['India', '🇮🇳', 'New Delhi', 28.61, 77.21, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee'],
    ['Sri Lanka', '🇱🇰', 'Colombo', 6.93, 79.86, 'Asia/Colombo', 'Sri Jayawardenepura Kotte', 'LKR', 'Sri Lankan rupee'],
    ['Nepal', '🇳🇵', 'Kathmandu', 27.72, 85.32, 'Asia/Kathmandu', 'Kathmandu', 'NPR', 'Nepalese rupee'],
    ['Bangladesh', '🇧🇩', 'Dhaka', 23.81, 90.41, 'Asia/Dhaka', 'Dhaka', 'BDT', 'Bangladeshi taka'],
    ['Pakistan', '🇵🇰', 'Islamabad', 33.68, 73.05, 'Asia/Karachi', 'Islamabad', 'PKR', 'Pakistani rupee'],
    ['Afghanistan', '🇦🇫', 'Kabul', 34.56, 69.21, 'Asia/Kabul', 'Kabul', 'AFN', 'Afghan afghani'],
    ['Iran', '🇮🇷', 'Tehran', 35.69, 51.39, 'Asia/Tehran', 'Tehran', 'IRR', 'Iranian rial'],
    ['United Arab Emirates', '🇦🇪', 'Dubai', 25.2, 55.27, 'Asia/Dubai', 'Abu Dhabi', 'AED', 'UAE dirham'],
    ['Qatar', '🇶🇦', 'Doha', 25.29, 51.53, 'Asia/Qatar', 'Doha', 'QAR', 'Qatari riyal'],
    ['Saudi Arabia', '🇸🇦', 'Riyadh', 24.71, 46.68, 'Asia/Riyadh', 'Riyadh', 'SAR', 'Saudi riyal'],
    ['Israel', '🇮🇱', 'Jerusalem', 31.77, 35.21, 'Asia/Jerusalem', 'Jerusalem', 'ILS', 'Israeli shekel'],
    ['Lebanon', '🇱🇧', 'Beirut', 33.89, 35.5, 'Asia/Beirut', 'Beirut', 'LBP', 'Lebanese pound'],
    ['Türkiye', '🇹🇷', 'Ankara', 39.93, 32.86, 'Europe/Istanbul', 'Ankara', 'TRY', 'Turkish lira'],
    ['Russia (Moscow)', '🇷🇺', 'Moscow', 55.76, 37.62, 'Europe/Moscow', 'Moscow', 'RUB', 'Russian rouble'],
    ['Russia (Vladivostok)', '🇷🇺', 'Vladivostok', 43.12, 131.89, 'Asia/Vladivostok', 'Moscow', 'RUB', 'Russian rouble'],
    ['Ukraine', '🇺🇦', 'Kyiv', 50.45, 30.52, 'Europe/Kyiv', 'Kyiv', 'UAH', 'Ukrainian hryvnia'],
    ['Greece', '🇬🇷', 'Athens', 37.98, 23.73, 'Europe/Athens', 'Athens', 'EUR', 'euro'],
    ['Italy', '🇮🇹', 'Rome', 41.9, 12.5, 'Europe/Rome', 'Rome', 'EUR', 'euro'],
    ['Vatican City', '🇻🇦', 'Vatican City', 41.9, 12.45, 'Europe/Vatican', 'Vatican City', 'EUR', 'euro'],
    ['Germany', '🇩🇪', 'Berlin', 52.52, 13.4, 'Europe/Berlin', 'Berlin', 'EUR', 'euro'],
    ['France', '🇫🇷', 'Paris', 48.86, 2.35, 'Europe/Paris', 'Paris', 'EUR', 'euro'],
    ['Spain', '🇪🇸', 'Madrid', 40.42, -3.7, 'Europe/Madrid', 'Madrid', 'EUR', 'euro'],
    ['Portugal', '🇵🇹', 'Lisbon', 38.72, -9.14, 'Europe/Lisbon', 'Lisbon', 'EUR', 'euro'],
    ['Netherlands', '🇳🇱', 'Amsterdam', 52.37, 4.9, 'Europe/Amsterdam', 'Amsterdam', 'EUR', 'euro'],
    ['Switzerland', '🇨🇭', 'Bern', 46.95, 7.45, 'Europe/Zurich', 'Bern', 'CHF', 'Swiss franc'],
    ['Poland', '🇵🇱', 'Warsaw', 52.23, 21.01, 'Europe/Warsaw', 'Warsaw', 'PLN', 'Polish złoty'],
    ['Sweden', '🇸🇪', 'Stockholm', 59.33, 18.07, 'Europe/Stockholm', 'Stockholm', 'SEK', 'Swedish krona'],
    ['Norway', '🇳🇴', 'Oslo', 59.91, 10.75, 'Europe/Oslo', 'Oslo', 'NOK', 'Norwegian krone'],
    ['Finland', '🇫🇮', 'Helsinki', 60.17, 24.94, 'Europe/Helsinki', 'Helsinki', 'EUR', 'euro'],
    ['Ireland', '🇮🇪', 'Dublin', 53.35, -6.26, 'Europe/Dublin', 'Dublin', 'EUR', 'euro'],
    ['United Kingdom', '🇬🇧', 'London', 51.51, -0.13, 'Europe/London', 'London', 'GBP', 'pound sterling'],
    ['Iceland', '🇮🇸', 'Reykjavík', 64.15, -21.94, 'Atlantic/Reykjavik', 'Reykjavík', 'ISK', 'Icelandic króna'],
    ['Egypt', '🇪🇬', 'Cairo', 30.04, 31.24, 'Africa/Cairo', 'Cairo', 'EGP', 'Egyptian pound'],
    ['Kenya', '🇰🇪', 'Nairobi', -1.29, 36.82, 'Africa/Nairobi', 'Nairobi', 'KES', 'Kenyan shilling'],
    ['Ethiopia', '🇪🇹', 'Addis Ababa', 9.03, 38.74, 'Africa/Addis_Ababa', 'Addis Ababa', 'ETB', 'Ethiopian birr'],
    ['Nigeria', '🇳🇬', 'Lagos', 6.52, 3.38, 'Africa/Lagos', 'Abuja', 'NGN', 'Nigerian naira'],
    ['Ghana', '🇬🇭', 'Accra', 5.6, -0.19, 'Africa/Accra', 'Accra', 'GHS', 'Ghanaian cedi'],
    ['Morocco', '🇲🇦', 'Rabat', 34.02, -6.83, 'Africa/Casablanca', 'Rabat', 'MAD', 'Moroccan dirham'],
    ['South Africa', '🇿🇦', 'Johannesburg', -26.2, 28.05, 'Africa/Johannesburg', 'Pretoria (executive)', 'ZAR', 'South African rand'],
    ['Zimbabwe', '🇿🇼', 'Harare', -17.83, 31.05, 'Africa/Harare', 'Harare', 'USD', 'US dollar (widely used)'],
    ['Mauritius', '🇲🇺', 'Port Louis', -20.16, 57.5, 'Indian/Mauritius', 'Port Louis', 'MUR', 'Mauritian rupee'],
    ['Canada (Toronto)', '🇨🇦', 'Toronto', 43.65, -79.38, 'America/Toronto', 'Ottawa', 'CAD', 'Canadian dollar'],
    ['Canada (Vancouver)', '🇨🇦', 'Vancouver', 49.28, -123.12, 'America/Vancouver', 'Ottawa', 'CAD', 'Canadian dollar'],
    ['USA (New York)', '🇺🇸', 'New York', 40.71, -74.01, 'America/New_York', 'Washington, D.C.', 'USD', 'US dollar'],
    ['USA (Chicago)', '🇺🇸', 'Chicago', 41.88, -87.63, 'America/Chicago', 'Washington, D.C.', 'USD', 'US dollar'],
    ['USA (Denver)', '🇺🇸', 'Denver', 39.74, -104.99, 'America/Denver', 'Washington, D.C.', 'USD', 'US dollar'],
    ['USA (Los Angeles)', '🇺🇸', 'Los Angeles', 34.05, -118.24, 'America/Los_Angeles', 'Washington, D.C.', 'USD', 'US dollar'],
    ['USA (Alaska)', '🇺🇸', 'Anchorage', 61.22, -149.9, 'America/Anchorage', 'Washington, D.C.', 'USD', 'US dollar'],
    ['Mexico', '🇲🇽', 'Mexico City', 19.43, -99.13, 'America/Mexico_City', 'Mexico City', 'MXN', 'Mexican peso'],
    ['Cuba', '🇨🇺', 'Havana', 23.11, -82.37, 'America/Havana', 'Havana', 'CUP', 'Cuban peso'],
    ['Jamaica', '🇯🇲', 'Kingston', 18.02, -76.8, 'America/Jamaica', 'Kingston', 'JMD', 'Jamaican dollar'],
    ['Colombia', '🇨🇴', 'Bogotá', 4.71, -74.07, 'America/Bogota', 'Bogotá', 'COP', 'Colombian peso'],
    ['Peru', '🇵🇪', 'Lima', -12.05, -77.04, 'America/Lima', 'Lima', 'PEN', 'Peruvian sol'],
    ['Chile', '🇨🇱', 'Santiago', -33.45, -70.67, 'America/Santiago', 'Santiago', 'CLP', 'Chilean peso'],
    ['Argentina', '🇦🇷', 'Buenos Aires', -34.6, -58.38, 'America/Argentina/Buenos_Aires', 'Buenos Aires', 'ARS', 'Argentine peso'],
    ['Brazil', '🇧🇷', 'São Paulo', -23.55, -46.63, 'America/Sao_Paulo', 'Brasília', 'BRL', 'Brazilian real'],
    ['India (Kerala)', '🇮🇳', 'Kochi', 9.93, 76.27, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Kerala capital: Thiruvananthapuram · backwaters, houseboats and tea hills'],
    ['India (Thiruvananthapuram)', '🇮🇳', 'Thiruvananthapuram', 8.52, 76.94, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Kerala’s capital · Padmanabhaswamy Temple and Kovalam beach'],
    ['India (Indore)', '🇮🇳', 'Indore', 22.72, 75.86, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Madhya Pradesh · street food at Sarafa Bazaar'],
    ['India (Bhopal)', '🇮🇳', 'Bhopal', 23.26, 77.41, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Capital of Madhya Pradesh · the City of Lakes'],
    ['India (Mumbai)', '🇮🇳', 'Mumbai', 19.08, 72.88, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Maharashtra · Gateway of India and Bollywood'],
    ['India (Pune)', '🇮🇳', 'Pune', 18.52, 73.86, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Maharashtra · universities and hill forts'],
    ['India (Goa)', '🇮🇳', 'Panaji', 15.49, 73.83, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Beaches and old Portuguese churches'],
    ['India (Bengaluru)', '🇮🇳', 'Bengaluru', 12.97, 77.59, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Karnataka · India’s tech city'],
    ['India (Chennai)', '🇮🇳', 'Chennai', 13.08, 80.27, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Tamil Nadu · Marina Beach and temples'],
    ['India (Hyderabad)', '🇮🇳', 'Hyderabad', 17.39, 78.49, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Telangana · Charminar and biryani'],
    ['India (Kolkata)', '🇮🇳', 'Kolkata', 22.57, 88.36, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'West Bengal · Victoria Memorial and Durga Puja'],
    ['India (Darjeeling)', '🇮🇳', 'Darjeeling', 27.04, 88.27, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'West Bengal · tea gardens and Himalayan views'],
    ['India (Ahmedabad)', '🇮🇳', 'Ahmedabad', 23.02, 72.57, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Gujarat · Sabarmati Ashram'],
    ['India (Jaipur)', '🇮🇳', 'Jaipur', 26.91, 75.79, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Rajasthan · the Pink City'],
    ['India (Agra)', '🇮🇳', 'Agra', 27.18, 78.02, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Uttar Pradesh · the Taj Mahal'],
    ['India (Varanasi)', '🇮🇳', 'Varanasi', 25.32, 82.97, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Uttar Pradesh · ghats on the Ganges'],
    ['India (Lucknow)', '🇮🇳', 'Lucknow', 26.85, 80.95, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Capital of Uttar Pradesh'],
    ['India (Punjab)', '🇮🇳', 'Amritsar', 31.63, 74.87, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'The Golden Temple'],
    ['India (Chandigarh)', '🇮🇳', 'Chandigarh', 30.73, 76.78, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Capital of Punjab and Haryana'],
    ['India (Kashmir)', '🇮🇳', 'Srinagar', 34.08, 74.8, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Dal Lake and houseboats'],
    ['India (Shimla)', '🇮🇳', 'Shimla', 31.1, 77.17, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Himachal Pradesh · hill station'],
    ['India (Assam)', '🇮🇳', 'Guwahati', 26.14, 91.74, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Tea country on the Brahmaputra'],
    ['India (Odisha)', '🇮🇳', 'Bhubaneswar', 20.3, 85.82, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Temple city · Konark Sun Temple nearby'],
    ['India (Mysuru)', '🇮🇳', 'Mysuru', 12.3, 76.64, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Karnataka · Mysore Palace'],
    ['India (Madurai)', '🇮🇳', 'Madurai', 9.93, 78.12, 'Asia/Kolkata', 'New Delhi', 'INR', 'Indian rupee', 'Tamil Nadu · Meenakshi Temple'],
    ['New Zealand (Auckland)', '🇳🇿', 'Auckland', -36.85, 174.76, 'Pacific/Auckland', 'Wellington', 'NZD', 'NZ dollar', 'The City of Sails'],
    ['New Zealand (Queenstown)', '🇳🇿', 'Queenstown', -45.03, 168.66, 'Pacific/Auckland', 'Wellington', 'NZD', 'NZ dollar', 'Adventure capital'],
    ['New Zealand (Chatham Islands)', '🇳🇿', 'Waitangi', -43.95, -176.56, 'Pacific/Chatham', 'Wellington', 'NZD', 'NZ dollar', '45 minutes ahead of the mainland'],
    ['Australia (Melbourne)', '🇦🇺', 'Melbourne', -37.81, 144.96, 'Australia/Melbourne', 'Canberra', 'AUD', 'Australian dollar', 'Laneways, coffee and the MCG'],
    ['Australia (Gold Coast)', '🇦🇺', 'Gold Coast', -28.02, 153.4, 'Australia/Brisbane', 'Canberra', 'AUD', 'Australian dollar', 'Theme parks and surf beaches'],
    ['Australia (Darwin)', '🇦🇺', 'Darwin', -12.46, 130.84, 'Australia/Darwin', 'Canberra', 'AUD', 'Australian dollar', 'Gateway to Kakadu'],
    ['Australia (Hobart)', '🇦🇺', 'Hobart', -42.88, 147.33, 'Australia/Hobart', 'Canberra', 'AUD', 'Australian dollar', 'Tasmania · MONA and Mt Wellington'],
    ['Australia (Uluru)', '🇦🇺', 'Uluru', -25.34, 131.04, 'Australia/Darwin', 'Canberra', 'AUD', 'Australian dollar', 'The Red Centre'],
    ['Philippines (Cebu)', '🇵🇭', 'Cebu City', 10.32, 123.89, 'Asia/Manila', 'Manila', 'PHP', 'Philippine peso', 'Santo Niño Basilica and island hopping'],
    ['Philippines (Davao)', '🇵🇭', 'Davao City', 7.19, 125.46, 'Asia/Manila', 'Manila', 'PHP', 'Philippine peso', 'Mt Apo and durian'],
    ['Philippines (Baguio)', '🇵🇭', 'Baguio', 16.4, 120.6, 'Asia/Manila', 'Manila', 'PHP', 'Philippine peso', 'Summer capital in the pines'],
    ['Philippines (Boracay)', '🇵🇭', 'Boracay', 11.97, 121.92, 'Asia/Manila', 'Manila', 'PHP', 'Philippine peso', 'White Beach'],
    ['Philippines (Palawan)', '🇵🇭', 'Puerto Princesa', 9.74, 118.74, 'Asia/Manila', 'Manila', 'PHP', 'Philippine peso', 'El Nido and the Underground River'],
    ['Philippines (Iloilo)', '🇵🇭', 'Iloilo City', 10.72, 122.56, 'Asia/Manila', 'Manila', 'PHP', 'Philippine peso', 'Heritage churches and La Paz batchoy'],
    ['Indonesia (Bali)', '🇮🇩', 'Denpasar', -8.65, 115.22, 'Asia/Makassar', 'Jakarta', 'IDR', 'Indonesian rupiah', 'Temples, rice terraces and surf'],
    ['Thailand (Phuket)', '🇹🇭', 'Phuket', 7.88, 98.39, 'Asia/Bangkok', 'Bangkok', 'THB', 'Thai baht', 'Beaches and islands'],
    ['Vietnam (Ho Chi Minh City)', '🇻🇳', 'Ho Chi Minh City', 10.82, 106.63, 'Asia/Ho_Chi_Minh', 'Hanoi', 'VND', 'Vietnamese đồng', 'Saigon street life'],
    ['Malaysia (Penang)', '🇲🇾', 'George Town', 5.41, 100.33, 'Asia/Kuala_Lumpur', 'Kuala Lumpur', 'MYR', 'Malaysian ringgit', 'Street art and hawker food'],
    ['Sri Lanka (Kandy)', '🇱🇰', 'Kandy', 7.29, 80.63, 'Asia/Colombo', 'Colombo', 'LKR', 'Sri Lankan rupee', 'Temple of the Tooth'],
    ['Nepal (Pokhara)', '🇳🇵', 'Pokhara', 28.21, 83.99, 'Asia/Kathmandu', 'Kathmandu', 'NPR', 'Nepalese rupee', 'Gateway to the Annapurnas'],
    ['China (Shanghai)', '🇨🇳', 'Shanghai', 31.23, 121.47, 'Asia/Shanghai', 'Beijing', 'CNY', 'Chinese yuan', 'The Bund'],
    ['Japan (Osaka)', '🇯🇵', 'Osaka', 34.69, 135.5, 'Asia/Tokyo', 'Tokyo', 'JPY', 'Japanese yen', 'Street food capital'],
    ['Japan (Kyoto)', '🇯🇵', 'Kyoto', 35.01, 135.77, 'Asia/Tokyo', 'Tokyo', 'JPY', 'Japanese yen', 'Temples and cherry blossoms'],
    ['South Korea (Busan)', '🇰🇷', 'Busan', 35.18, 129.08, 'Asia/Seoul', 'Seoul', 'KRW', 'South Korean won', 'Beaches and seafood markets'],
    ['UAE (Abu Dhabi)', '🇦🇪', 'Abu Dhabi', 24.45, 54.38, 'Asia/Dubai', 'Abu Dhabi', 'AED', 'UAE dirham', 'Sheikh Zayed Grand Mosque'],
    ['Saudi Arabia (Mecca)', '🇸🇦', 'Mecca', 21.39, 39.86, 'Asia/Riyadh', 'Riyadh', 'SAR', 'Saudi riyal', 'The holiest city in Islam'],
    ['Türkiye (Istanbul)', '🇹🇷', 'Istanbul', 41.01, 28.98, 'Europe/Istanbul', 'Ankara', 'TRY', 'Turkish lira', 'Hagia Sophia and the Bosphorus'],
    ['Greece (Santorini)', '🇬🇷', 'Fira', 36.42, 25.43, 'Europe/Athens', 'Athens', 'EUR', 'Euro', 'White villages and sunsets'],
    ['Italy (Venice)', '🇮🇹', 'Venice', 45.44, 12.32, 'Europe/Rome', 'Rome', 'EUR', 'Euro', 'Canals and gondolas'],
    ['Italy (Florence)', '🇮🇹', 'Florence', 43.77, 11.26, 'Europe/Rome', 'Rome', 'EUR', 'Euro', 'Renaissance art'],
    ['Italy (Milan)', '🇮🇹', 'Milan', 45.46, 9.19, 'Europe/Rome', 'Rome', 'EUR', 'Euro', 'Fashion and the Duomo'],
    ['Italy (Assisi)', '🇮🇹', 'Assisi', 43.07, 12.62, 'Europe/Rome', 'Rome', 'EUR', 'Euro', 'Home of St Francis'],
    ['France (Lourdes)', '🇫🇷', 'Lourdes', 43.09, -0.05, 'Europe/Paris', 'Paris', 'EUR', 'Euro', 'Marian shrine and grotto'],
    ['France (Nice)', '🇫🇷', 'Nice', 43.7, 7.27, 'Europe/Paris', 'Paris', 'EUR', 'Euro', 'The French Riviera'],
    ['Portugal (Fátima)', '🇵🇹', 'Fátima', 39.63, -8.67, 'Europe/Lisbon', 'Lisbon', 'EUR', 'Euro', 'Sanctuary of Our Lady of Fátima'],
    ['Spain (Barcelona)', '🇪🇸', 'Barcelona', 41.39, 2.17, 'Europe/Madrid', 'Madrid', 'EUR', 'Euro', 'Sagrada Família'],
    ['Spain (Santiago de Compostela)', '🇪🇸', 'Santiago de Compostela', 42.88, -8.54, 'Europe/Madrid', 'Madrid', 'EUR', 'Euro', 'End of the Camino pilgrimage'],
    ['Germany (Munich)', '🇩🇪', 'Munich', 48.14, 11.58, 'Europe/Berlin', 'Berlin', 'EUR', 'Euro', 'Bavaria and the Alps'],
    ['Switzerland (Zurich)', '🇨🇭', 'Zurich', 47.38, 8.54, 'Europe/Zurich', 'Bern', 'CHF', 'Swiss franc', 'Lakes and mountains'],
    ['Austria', '🇦🇹', 'Vienna', 48.21, 16.37, 'Europe/Vienna', 'Vienna', 'EUR', 'Euro', 'Music and coffee houses'],
    ['Czechia', '🇨🇿', 'Prague', 50.08, 14.44, 'Europe/Prague', 'Prague', 'CZK', 'Czech koruna', 'Charles Bridge'],
    ['Hungary', '🇭🇺', 'Budapest', 47.5, 19.04, 'Europe/Budapest', 'Budapest', 'HUF', 'Hungarian forint', 'Thermal baths on the Danube'],
    ['Denmark', '🇩🇰', 'Copenhagen', 55.68, 12.57, 'Europe/Copenhagen', 'Copenhagen', 'DKK', 'Danish krone', 'Nyhavn harbour'],
    ['Belgium', '🇧🇪', 'Brussels', 50.85, 4.35, 'Europe/Brussels', 'Brussels', 'EUR', 'Euro', 'Chocolate and waffles'],
    ['Croatia', '🇭🇷', 'Dubrovnik', 42.65, 18.09, 'Europe/Zagreb', 'Zagreb', 'EUR', 'Euro', 'Old town walls'],
    ['United Kingdom (Edinburgh)', '🇬🇧', 'Edinburgh', 55.95, -3.19, 'Europe/London', 'London', 'GBP', 'Pound sterling', 'Scotland · castle and festivals'],
    ['United Kingdom (Manchester)', '🇬🇧', 'Manchester', 53.48, -2.24, 'Europe/London', 'London', 'GBP', 'Pound sterling', 'Football and music'],
    ['Egypt (Giza)', '🇪🇬', 'Giza', 29.98, 31.13, 'Africa/Cairo', 'Cairo', 'EGP', 'Egyptian pound', 'The Great Pyramids'],
    ['Kenya (Mombasa)', '🇰🇪', 'Mombasa', -4.04, 39.67, 'Africa/Nairobi', 'Nairobi', 'KES', 'Kenyan shilling', 'Indian Ocean beaches'],
    ['South Africa (Cape Town)', '🇿🇦', 'Cape Town', -33.92, 18.42, 'Africa/Johannesburg', 'Pretoria', 'ZAR', 'South African rand', 'Table Mountain'],
    ['Canada (Montréal)', '🇨🇦', 'Montréal', 45.5, -73.57, 'America/Toronto', 'Ottawa', 'CAD', 'Canadian dollar', 'Old Montréal'],
    ['Canada (Calgary)', '🇨🇦', 'Calgary', 51.05, -114.07, 'America/Edmonton', 'Ottawa', 'CAD', 'Canadian dollar', 'Gateway to Banff'],
    ['USA (San Francisco)', '🇺🇸', 'San Francisco', 37.77, -122.42, 'America/Los_Angeles', 'Washington, D.C.', 'USD', 'US dollar', 'Golden Gate Bridge'],
    ['USA (Las Vegas)', '🇺🇸', 'Las Vegas', 36.17, -115.14, 'America/Los_Angeles', 'Washington, D.C.', 'USD', 'US dollar', 'The Strip · Grand Canyon nearby'],
    ['USA (Seattle)', '🇺🇸', 'Seattle', 47.61, -122.33, 'America/Los_Angeles', 'Washington, D.C.', 'USD', 'US dollar', 'Space Needle'],
    ['USA (Orlando)', '🇺🇸', 'Orlando', 28.54, -81.38, 'America/New_York', 'Washington, D.C.', 'USD', 'US dollar', 'Theme parks'],
    ['USA (Washington, D.C.)', '🇺🇸', 'Washington, D.C.', 38.91, -77.04, 'America/New_York', 'Washington, D.C.', 'USD', 'US dollar', 'The capital'],
    ['Mexico (Cancún)', '🇲🇽', 'Cancún', 21.16, -86.85, 'America/Cancun', 'Mexico City', 'MXN', 'Mexican peso', 'Caribbean beaches and Mayan ruins'],
    ['Peru (Machu Picchu)', '🇵🇪', 'Cusco', -13.53, -71.97, 'America/Lima', 'Lima', 'PEN', 'Peruvian sol', 'The Inca citadel'],
    ['Brazil (Rio de Janeiro)', '🇧🇷', 'Rio de Janeiro', -22.91, -43.17, 'America/Sao_Paulo', 'Brasília', 'BRL', 'Brazilian real', 'Christ the Redeemer'],
    ['Antarctica (Scott Base)', '🇦🇶', 'Scott Base', -77.85, 166.76, 'Antarctica/McMurdo', '— (no capital)', 'NZD', 'NZ dollar (Scott Base)']
  ];
  // Simplified continents [lon, lat], drawn for the site
  var LAND = [
    [[-168,66],[-162,70],[-156,71],[-140,70],[-128,70],[-115,68],[-100,68],[-95,72],[-85,70],[-80,63],[-90,58],[-94,59],[-82,52],[-78,55],[-77,60],[-70,59],[-65,60],[-60,55],[-56,52],[-60,47],[-66,45],[-70,42],[-74,40],[-76,35],[-81,31],[-80,26],[-82,26],[-83,29],[-90,30],[-94,29],[-97,26],[-97,21],[-95,18],[-90,21],[-87,21],[-88,16],[-84,15],[-83,10],[-79,9],[-80,7],[-85,10],[-87,13],[-92,14],[-97,16],[-105,20],[-106,23],[-110,24],[-112,29],[-115,31],[-117,32],[-120,34],[-124,40],[-124,46],[-125,49],[-130,54],[-135,58],[-140,60],[-146,61],[-152,59],[-158,57],[-162,55],[-158,59],[-165,61],[-166,64]],
    [[-73,78],[-60,82],[-35,83],[-20,80],[-18,75],[-22,70],[-30,68],[-40,65],[-44,60],[-50,63],[-53,67],[-56,71],[-60,76]],
    [[-80,73],[-68,70],[-62,66],[-73,64],[-80,68]], [[-118,72],[-100,73],[-102,69],[-112,68]], [[-90,81],[-65,82],[-75,77],[-90,77]],
    [[-85,22],[-80,23],[-75,20],[-78,20]], [[-74,19],[-69,19],[-69,18],[-74,18]],
    [[-80,8],[-77,8],[-72,12],[-64,10],[-60,8],[-52,5],[-50,0],[-44,-2],[-35,-5],[-35,-9],[-39,-14],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-62,-39],[-65,-42],[-67,-46],[-69,-51],[-68,-55],[-72,-53],[-74,-47],[-73,-40],[-71,-30],[-70,-18],[-76,-14],[-80,-6],[-81,-2],[-80,1],[-78,4]],
    [[-10,36],[-9,39],[-9,43],[-2,43],[-1,46],[-4,48],[2,51],[5,53],[8,54],[8,57],[11,58],[6,58],[5,61],[10,64],[14,67],[18,69],[25,71],[31,70],[40,68],[44,66],[52,68],[60,69],[66,69],[60,60],[60,50],[50,47],[48,42],[40,41],[29,41],[26,40],[23,36],[20,40],[19,42],[13,45],[16,41],[12,38],[10,44],[7,44],[3,43],[0,39],[-5,36]],
    [[-5,50],[1,51],[2,53],[0,54],[-2,56],[-2,58],[-5,58],[-6,56],[-5,55],[-3,54],[-4,52]], [[-10,52],[-6,52],[-6,55],[-8,55],[-10,54]], [[-24,64],[-22,66],[-15,66],[-13,65],[-18,63]],
    [[-17,21],[-13,28],[-10,30],[-6,35],[0,36],[10,37],[11,33],[20,31],[25,32],[32,31],[35,28],[37,22],[39,16],[43,12],[51,12],[51,10],[48,5],[42,-1],[40,-5],[40,-10],[36,-18],[35,-24],[33,-28],[30,-31],[26,-34],[20,-35],[18,-33],[16,-28],[12,-18],[13,-12],[12,-5],[9,-1],[9,4],[5,5],[0,5],[-5,5],[-8,4],[-13,8],[-17,12],[-17,15]],
    [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]],
    [[26,40],[36,36],[35,33],[34,28],[39,21],[43,13],[45,13],[52,16],[57,19],[59,23],[56,26],[50,30],[48,30],[52,27],[57,25],[62,25],[67,24],[72,21],[73,16],[77,8],[80,10],[80,15],[87,21],[92,22],[94,17],[98,16],[98,8],[101,3],[104,1],[103,6],[101,13],[105,9],[109,12],[108,16],[106,20],[109,21],[113,22],[117,23],[120,26],[122,30],[121,32],[119,35],[122,37],[118,38],[121,40],[125,40],[129,35],[129,38],[129,42],[135,43],[140,48],[141,53],[136,54],[143,59],[155,59],[160,61],[163,66],[175,66],[180,66],[180,70],[160,70],[150,72],[140,72],[130,71],[113,74],[105,78],[100,76],[88,75],[80,73],[70,73],[66,69],[60,69],[60,60],[60,50],[50,47],[48,42],[40,41],[29,41]],
    [[156,51],[160,54],[163,57],[162,61],[156,58]],
    [[130,31],[132,34],[135,34],[140,35],[141,38],[142,41],[140,41],[140,38],[137,37],[133,35],[130,33]], [[140,42],[145,43],[143,45],[141,45]],
    [[80,6],[82,7],[81,9],[80,9]], [[120,22],[122,25],[121,25]],
    [[95,5],[98,4],[104,-2],[106,-6],[102,-4]], [[105,-6],[114,-7],[114,-8],[106,-7]], [[109,1],[110,-3],[116,-4],[118,1],[119,5],[117,7],[113,4]], [[119,-5],[121,-2],[124,1],[121,1],[120,-1]],
    [[131,-1],[138,-2],[146,-6],[150,-10],[143,-9],[138,-8],[132,-4]], [[120,18],[122,18],[124,13],[126,8],[126,6],[122,7],[123,11],[120,14]],
    [[113,-22],[114,-26],[115,-34],[118,-35],[123,-34],[131,-31],[135,-35],[138,-35],[140,-38],[146,-39],[150,-37],[153,-31],[153,-25],[149,-21],[146,-18],[145,-15],[142,-11],[141,-14],[141,-17],[136,-15],[137,-12],[132,-11],[130,-13],[125,-14],[122,-17],[119,-20]],
    [[145,-41],[148,-41],[148,-43],[146,-44]],
    [[172.7,-34.4],[174.5,-36],[175.5,-36.5],[178.5,-37.7],[177.9,-39.2],[176.9,-39.7],[176,-41.3],[174.8,-41.5],[174.5,-40],[173.8,-39.2],[174.6,-38.5],[174.6,-37],[173,-35]],
    [[172.5,-40.5],[174.3,-41.7],[173.2,-43],[172.6,-43.8],[171.2,-44.5],[170.8,-45.9],[169,-46.6],[166.5,-46],[166.7,-45.2],[168.2,-44],[170.5,-43],[171.5,-41.8],[172.1,-40.8]],
    [[-180,-70],[-120,-73],[-60,-64],[-30,-77],[0,-70],[60,-67],[120,-66],[180,-70],[180,-90],[-180,-90]]
  ];
  var MW = 720, MH = 360, mask = null;
  function buildMask(polys) {
    var c = document.createElement('canvas'); c.width = MW; c.height = MH;
    var g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, MW, MH); g.fillStyle = '#fff';
    polys.forEach(function (ring) {
      g.beginPath();
      ring.forEach(function (p, i) { var x = (p[0] + 180) / 360 * MW, y = (90 - p[1]) / 180 * MH; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
      g.closePath(); g.fill();
    });
    var d = g.getImageData(0, 0, MW, MH).data, m = new Uint8Array(MW * MH);
    for (var i = 0; i < m.length; i++) m[i] = d[i * 4] > 127 ? 1 : 0;
    return m;
  }
  // Optional detailed coastline (Natural Earth via world-atlas) when online
  function topoRings(topo) {
    var t = topo.transform, arcs = topo.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (p) { x += p[0]; y += p[1]; return [x * t.scale[0] + t.translate[0], y * t.scale[1] + t.translate[1]]; }); });
    function arc(i) { return i < 0 ? arcs[~i].slice().reverse() : arcs[i]; }
    var out = [];
    function geom(gm) {
      if (gm.type === 'GeometryCollection') return gm.geometries.forEach(geom);
      var polys = gm.type === 'Polygon' ? [gm.arcs] : gm.type === 'MultiPolygon' ? gm.arcs : [];
      polys.forEach(function (poly) { poly.forEach(function (ring) { var pts = []; ring.forEach(function (ai) { var a = arc(ai); pts = pts.concat(pts.length ? a.slice(1) : a); }); out.push(pts); }); });
    }
    geom(topo.objects.land);
    return out;
  }
  var detailTried = false;
  function loadDetail(done) {
    if (detailTried) return; detailTried = true;
    try {
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json').then(function (r) { if (!r.ok) throw Error(); return r.json(); })
        .then(function (topo) { var rings = topoRings(topo).filter(function (r) { return r.length > 3; }); if (rings.length > 20) { mask = buildMask(rings); done(); } }).catch(function () {});
    } catch (e) {}
  }


  // Offline fallback only: approximate units per 1 US dollar (late October 2026). Live rates are fetched when online.
  var USD = { NZD: 1.754, AUD: 1.52, FJD: 2.25, WST: 2.72, TOP: 2.35, XPF: 107, VUV: 119, SBD: 8.3, PGK: 4.1, USD: 1, PHP: 64.05, IDR: 16400, MYR: 4.2, SGD: 1.281, THB: 32.5, VND: 26200, KHR: 4020, MMK: 2100, CNY: 7.1,
    HKD: 7.78, TWD: 30.5, JPY: 157.7, KRW: 1380, MNT: 3450, INR: 87, LKR: 300, NPR: 139, BDT: 122, PKR: 282, AFN: 70, IRR: 42000, AED: 3.6725, QAR: 3.64, SAR: 3.75, ILS: 3.6, LBP: 89500, TRY: 41, RUB: 80,
    UAH: 41.5, EUR: 0.897, CHF: 0.80, PLN: 3.8, SEK: 9.6, NOK: 10.2, GBP: 0.76, ISK: 125, EGP: 49, KES: 129, ETB: 140, NGN: 1550, GHS: 12, MAD: 9.1, ZAR: 18, MUR: 46, CAD: 1.38, MXN: 18.5, CUP: 24, JMD: 160,
    COP: 4100, PEN: 3.6, CLP: 950, ARS: 1300, BRL: 5.5 };
  var RATES = { src: 'approx', date: 'Oct 2026', perNZD: {} };
  USD.CZK = USD.CZK || 23.2; USD.HUF = USD.HUF || 365; USD.DKK = USD.DKK || 6.9;
  Object.keys(USD).forEach(function (k) { RATES.perNZD[k] = USD[k] / USD.NZD; });
  var ratesTried = false, rateSubs = [];
  function loadRates() {
    if (ratesTried) return; ratesTried = true;
    function done() { rateSubs.forEach(function (f) { try { f(); } catch (e) {} }); }
    fetch('https://open.er-api.com/v6/latest/NZD').then(function (r) { if (!r.ok) throw Error(); return r.json(); }).then(function (d) {
      if (!d || !d.rates) throw Error(); RATES = { src: 'live', date: (d.time_last_update_utc || '').slice(5, 16), perNZD: d.rates }; done();
    }).catch(function () {
      fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/nzd.json').then(function (r) { if (!r.ok) throw Error(); return r.json(); }).then(function (d) {
        var o = {}; Object.keys(d.nzd || {}).forEach(function (k) { o[k.toUpperCase()] = d.nzd[k]; }); if (!o.USD) throw Error(); RATES = { src: 'live', date: d.date || '', perNZD: o }; done();
      }).catch(function () {});
    });
  }
  function money(n, code) {
    return n.toLocaleString('en-NZ', { minimumFractionDigits: n >= 1000 ? 0 : 2, maximumFractionDigits: n >= 1000 ? 0 : 2 }) + ' ' + code;
  }
  function CurrencyBox(props) {
    var P = props.place, code = P[7], st = useState(100), amt = st[0], setAmt = st[1], dir = useState('nzd'), d = dir[0], setD = dir[1], tick = useState(0);
    useEffect(function () { var f = function () { tick[1](function (x) { return x + 1; }); }; rateSubs.push(f); loadRates(); return function () { rateSubs = rateSubs.filter(function (g) { return g !== f; }); }; }, []);
    var rate = RATES.perNZD[code];
    if (code === 'NZD') return h('div', { className: 'jx-globe-card is-money' }, h('small', null, '💱 MONEY'), h('strong', null, 'NZ dollar (NZD)'), h('span', null, 'Same money as home — no exchange needed.'));
    var a = +amt || 0, out = !rate ? null : d === 'nzd' ? a * rate : a / rate;
    return h('div', { className: 'jx-globe-card is-money' },
      h('small', null, '💱 MONEY · ' + P[8].toUpperCase() + ' (' + code + ')'),
      h('div', { className: 'jx-money-row' },
        h('input', { type: 'number', min: 0, step: 'any', value: amt, 'aria-label': 'Amount', onChange: function (e) { setAmt(e.target.value); } }),
        h('button', { type: 'button', className: 'secondary', onClick: function () { setD(d === 'nzd' ? 'local' : 'nzd'); }, 'aria-label': 'Swap currencies' }, d === 'nzd' ? 'NZD → ' + code : code + ' → NZD')),
      rate ? h('strong', null, money(a, d === 'nzd' ? 'NZD' : code) + ' = ' + money(out, d === 'nzd' ? code : 'NZD')) : h('span', null, 'Rate unavailable'),
      rate && h('span', null, '1 NZD = ' + (rate >= 100 ? Math.round(rate).toLocaleString('en-NZ') : rate.toFixed(rate < 1 ? 4 : 2)) + ' ' + code + ' · ' + (RATES.src === 'live' ? 'live rate ' + RATES.date : 'approximate rate (' + RATES.date + ') — connect to update')),
      h('small', { className: 'jx-muted' }, 'A guide only — banks and money changers add fees.'));
  }
  var D2R = Math.PI / 180;
  function project(lat, lon, lat0, lon0) {
    var p = lat * D2R, l = (lon - lon0) * D2R, p0 = lat0 * D2R;
    var cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    return { x: Math.cos(p) * Math.sin(l), y: Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l), vis: cosc > 0.02 };
  }
  function render(cv, view, sel, dark) {
    var S = cv.width, r = S / 2 - 4, cx = S / 2, cy = S / 2, g = cv.getContext('2d');
    if (!mask) mask = buildMask(LAND);
    var img = g.createImageData(S, S), d = img.data;
    var p0 = view.lat * D2R, sp0 = Math.sin(p0), cp0 = Math.cos(p0), l0 = view.lon * D2R;
    for (var py = 0; py < S; py++) {
      var y = (cy - py) / r;
      for (var px = 0; px < S; px++) {
        var x = (px - cx) / r, rho2 = x * x + y * y, o = (py * S + px) * 4;
        if (rho2 > 1) { continue; }
        var rho = Math.sqrt(rho2), c = Math.asin(Math.min(1, rho)), sc = Math.sin(c), cc = Math.cos(c);
        var lat = rho < 1e-9 ? p0 : Math.asin(cc * sp0 + (y * sc * cp0) / rho);
        var lon = l0 + Math.atan2(x * sc, rho * cc * cp0 - y * sc * sp0);
        var LON = ((lon / D2R + 540) % 360) - 180, LAT = lat / D2R;
        var mx = Math.min(MW - 1, Math.max(0, Math.floor((LON + 180) / 360 * MW))), my = Math.min(MH - 1, Math.max(0, Math.floor((90 - LAT) / 180 * MH)));
        var land = mask[my * MW + mx], shade = 0.55 + 0.45 * cc;
        var grid = (Math.abs(LAT % 15) < 0.35 || Math.abs(LON % 15) < 0.35) ? 0.9 : 1;
        var R0, G0, B0;
        if (land) { if (LAT < -62) { R0 = 236; G0 = 242; B0 = 246; } else { R0 = 120 + 40 * (LAT > 50 ? 1 : 0); G0 = 182; B0 = 112; } }
        else { R0 = 52; G0 = 132; B0 = 196; }
        d[o] = R0 * shade * grid; d[o + 1] = G0 * shade * grid; d[o + 2] = B0 * shade * grid; d[o + 3] = 255;
      }
    }
    g.clearRect(0, 0, S, S); g.putImageData(img, 0, 0);
    // rim and glow
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = dark ? 'rgba(255,255,255,.35)' : 'rgba(20,60,90,.35)'; g.stroke();
    var hl = g.createRadialGradient(cx - r * 0.4, cy - r * 0.45, r * 0.05, cx - r * 0.3, cy - r * 0.3, r * 1.1);
    hl.addColorStop(0, 'rgba(255,255,255,.28)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = hl; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    // places
    var dots = [];
    PLACES.forEach(function (pl, i) {
      var q = project(pl[3], pl[4], view.lat, view.lon); if (!q.vis) return;
      var X = cx + q.x * r, Y = cy - q.y * r, isNZ = i === 0, isSel = sel === i;
      g.beginPath(); g.arc(X, Y, isSel ? 7 : isNZ ? 6 : 4.2, 0, Math.PI * 2);
      g.fillStyle = isSel ? '#ffcf33' : isNZ ? '#ff5a5f' : '#ffffff'; g.fill();
      g.lineWidth = 1.5; g.strokeStyle = 'rgba(0,0,0,.55)'; g.stroke();
      if (isSel || isNZ) { g.font = '600 ' + Math.round(S / 26) + 'px system-ui, sans-serif'; g.fillStyle = '#fff'; g.strokeStyle = 'rgba(0,0,0,.7)'; g.lineWidth = 3; var lab = isNZ ? 'NZ' : pl[2]; g.strokeText(lab, X + 9, Y - 8); g.fillText(lab, X + 9, Y - 8); }
      dots.push({ i: i, x: X, y: Y });
    });
    return dots;
  }

  function parts(date, tz) {
    var f = new Intl.DateTimeFormat('en-NZ', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(date), o = {};
    f.forEach(function (p) { o[p.type] = p.value; });
    return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour % 24, +o.minute);
  }
  function show(date, tz) {
    return new Intl.DateTimeFormat('en-NZ', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(date).replace(/\b(am|pm)\b/i, function (m) { return m.toLowerCase(); });
  }
  function diffText(date, tz) {
    var m = Math.round((parts(date, tz) - parts(date, 'Pacific/Auckland')) / 60000);
    if (m === 0) return 'Same time as New Zealand';
    var a = Math.abs(m), hh = Math.floor(a / 60), mm = a % 60;
    return (hh ? hh + ' hour' + (hh === 1 ? '' : 's') : '') + (mm ? (hh ? ' ' : '') + mm + ' min' : '') + (m < 0 ? ' behind' : ' ahead of') + ' New Zealand';
  }
  function nzLabel(date) {
    try { var n = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', timeZoneName: 'short' }).formatToParts(date).find(function (p) { return p.type === 'timeZoneName'; }); return n ? n.value : 'NZT'; } catch (e) { return 'NZT'; }
  }


  /* ---------- grouping for the dropdowns ---------- */
  function countryOf(p) { var n = p[0]; if (/^Hawaiʻi/.test(n)) return 'USA'; if (/^Antarctica/.test(n)) return 'Antarctica'; n = n.replace(/\s*\(.*\)$/, ''); return n === 'UAE' ? 'United Arab Emirates' : n; }
  function regionOf(p) { var tz = p[5]; if (/^(Pacific|Australia)/.test(tz)) return 'Pacific & Australia'; if (/^Antarctica/.test(tz)) return 'Antarctica'; if (/^(Europe|Atlantic)/.test(tz)) return 'Europe'; if (/^(Africa|Indian)/.test(tz)) return 'Africa'; if (/^America/.test(tz)) return 'Americas'; if (/^Asia\/(Kolkata|Colombo|Kathmandu|Dhaka|Karachi|Kabul)/.test(tz)) return 'South Asia'; if (/^Asia\/(Tehran|Dubai|Qatar|Riyadh|Jerusalem|Beirut)/.test(tz)) return 'Middle East'; return 'East & South-East Asia'; }
  function placeLabel(p) { var c = countryOf(p), m = p[0].match(/\((.*)\)$/); var sub = m && !/^Hawaiʻi|Antarctica/.test(p[0]) ? m[1] : p[2]; if (/^Hawaiʻi/.test(p[0])) sub = 'Hawaiʻi'; return sub === c ? sub : sub + (sub !== p[2] ? ' · ' + p[2] : ''); }
  var REGIONS = ['Pacific & Australia', 'East & South-East Asia', 'South Asia', 'Middle East', 'Europe', 'Africa', 'Americas', 'Antarctica'];
  var BYC = {}; PLACES.forEach(function (p, i) { var c = countryOf(p); (BYC[c] = BYC[c] || []).push(i); });
  Object.keys(BYC).forEach(function (c) { BYC[c].sort(function (a, b) { var A = PLACES[a], B = PLACES[b]; var capA = A[2] === A[6] || !/\(/.test(A[0]) ? 0 : 1, capB = B[2] === B[6] || !/\(/.test(B[0]) ? 0 : 1; return capA - capB || placeLabel(A).localeCompare(placeLabel(B)); }); });
  var QUICK = ['New Zealand', 'Australia (Sydney)', 'Philippines', 'India (Kerala)', 'United Kingdom', 'USA (Los Angeles)'];
  function recentGet() { try { return JSON.parse(localStorage.getItem('jnzx-globe-recent')) || []; } catch (e) { return []; } }
  function recentAdd(i) { try { var r = recentGet().filter(function (x) { return x !== PLACES[i][0]; }); r.unshift(PLACES[i][0]); localStorage.setItem('jnzx-globe-recent', JSON.stringify(r.slice(0, 4))); } catch (e) {} }

  function WorldGlobe(props) {
    var cvRef = useRef(null), dotsRef = useRef([]), viewRef = useRef({ lat: -15, lon: 150 }), drag = useRef(null), spin = useRef(true), frame = useRef(0);
    var st = useState(18), sel = st[0], setSel = st[1];
    var nw = useState(Date.now()), now = nw[0], setNow = nw[1];
    var go = useState(function () { try { return window.matchMedia('(min-width: 900px)').matches; } catch (e) { return false; } }), globeOpen = go[0], setGlobeOpen = go[1];
    var dark = (function () { try { return document.documentElement.getAttribute('data-reading-theme') === 'dark'; } catch (e) { return false; } })();
    useEffect(function () { var id = setInterval(function () { setNow(Date.now()); }, 15000); return function () { clearInterval(id); }; }, []);
    useEffect(function () {
      var cv = cvRef.current; if (!cv) return;
      var alive = true, target = null;
      function draw() { dotsRef.current = render(cv, viewRef.current, selRef.current, dark); }
      function loop() {
        if (!alive) return;
        if (cv.offsetParent === null) { frame.current = requestAnimationFrame(loop); return; }
        var v = viewRef.current;
        if (target) {
          var dl = ((target.lon - v.lon + 540) % 360) - 180, dp = target.lat - v.lat;
          v.lon += dl * 0.12; v.lat += dp * 0.12;
          if (Math.abs(dl) < 0.3 && Math.abs(dp) < 0.3) target = null;
          draw();
        } else if (spin.current && !drag.current) { v.lon = ((v.lon + 0.25 + 540) % 360) - 180; draw(); }
        frame.current = requestAnimationFrame(loop);
      }
      cv._goto = function (i) { spin.current = false; target = { lat: Math.max(-60, Math.min(60, PLACES[i][3])), lon: PLACES[i][4] }; };
      cv._draw = draw;
      draw(); loop();
      loadDetail(draw);
      var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
      if (reduce) spin.current = false;
      return function () { alive = false; cancelAnimationFrame(frame.current); };
    }, []);
    var selRef = useRef(sel); selRef.current = sel;
    useEffect(function () { var cv = cvRef.current; if (cv && cv._draw) cv._draw(); }, [sel]);
    function pos(e) { var cv = cvRef.current, b = cv.getBoundingClientRect(); return { x: (e.clientX - b.left) * cv.width / b.width, y: (e.clientY - b.top) * cv.height / b.height }; }
    function down(e) { var p = pos(e); drag.current = { x: p.x, y: p.y, lat: viewRef.current.lat, lon: viewRef.current.lon, moved: false }; spin.current = false; try { e.target.setPointerCapture(e.pointerId); } catch (x) {} }
    function move(e) {
      var d = drag.current; if (!d) return; var p = pos(e), k = 180 / (cvRef.current.width);
      if (Math.abs(p.x - d.x) + Math.abs(p.y - d.y) > 4) d.moved = true;
      viewRef.current.lon = ((d.lon - (p.x - d.x) * k + 540) % 360) - 180; viewRef.current.lat = Math.max(-75, Math.min(75, d.lat + (p.y - d.y) * k));
      cvRef.current._draw();
    }
    function up(e) {
      var d = drag.current; drag.current = null; if (!d || d.moved) return;
      var p = pos(e), best = null, bd = 1e9;
      dotsRef.current.forEach(function (o) { var dd = (o.x - p.x) * (o.x - p.x) + (o.y - p.y) * (o.y - p.y); if (dd < bd) { bd = dd; best = o; } });
      if (best && bd < 22 * 22 * (cvRef.current.width / 360) * (cvRef.current.width / 360)) { setSel(best.i); }
    }
    function choose(i) { setSel(i); if (cvRef.current && cvRef.current._goto) cvRef.current._goto(i); }
    var P = PLACES[sel], date = new Date(now), nz = show(date, 'Pacific/Auckland'), there = show(date, P[5]);
    var shareText = P[1] + ' ' + P[0] + ' (' + P[2] + '; capital ' + P[6] + '): ' + there + '\n🇳🇿 ' + nzLabel(date) + ': ' + nz + '\nMoney: ' + P[8] + ' (' + P[7] + ')';
    var T1 = tparts(date, P[5]), T0 = tparts(date, 'Pacific/Auckland');
    var placeName = /\(/.test(P[0]) ? placeLabel(P).split(' · ')[0] : P[2];
    return h('section', { className: 'jx-globe jx-wc' + (props.compact ? ' is-compact' : '') },
      h('div', { className: 'jx-wc-times', 'aria-live': 'polite' },
        h('div', { className: 'jx-wc-t is-there' }, h('p', { className: 'jx-wc-where' }, P[1] + ' ' + placeName + (placeName !== countryOf(P) ? ', ' + countryOf(P) : '')), h('p', { className: 'jx-wc-clock' }, T1.time), h('p', { className: 'jx-wc-day' }, T1.day)),
        h('div', { className: 'jx-wc-diff' }, h('span', null, sel === 0 ? 'Home' : diffText(date, P[5]).replace(' New Zealand', ' NZ'))),
        h('div', { className: 'jx-wc-t is-nz' }, h('p', { className: 'jx-wc-where' }, '🇳🇿 New Zealand · ' + nzLabel(date)), h('p', { className: 'jx-wc-clock' }, T0.time), h('p', { className: 'jx-wc-day' }, T0.day))),
      h('p', { className: 'jx-wc-facts' }, '🏛️ Capital: ' + P[6] + '  ·  💵 ' + P[8] + ' (' + P[7] + ')' + (P[9] ? '  ·  ✨ ' + P[9] : '')),
      h(Picker, { sel: sel, choose: choose }),
      h('div', { className: 'jx-row jx-wc-actions' }, h(JNZX.ShareMini, { title: 'Time in ' + placeName, text: shareText, label: 'Share these times' })),
      h('details', { className: 'jx-wc-more' }, h('summary', null, '💱 Money converter'), h(CurrencyBox, { key: 'cur-' + sel, place: P })),
      h('details', { className: 'jx-wc-more', open: globeOpen, onToggle: function (e) { setGlobeOpen(e.currentTarget.open); } }, h('summary', null, '🌏 Spin the globe'),
        h('div', { className: 'jx-globe-stage' },
          h('canvas', { ref: cvRef, width: 360, height: 360, className: 'jx-globe-canvas', role: 'img', 'aria-label': 'Globe showing ' + P[0], onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: function () { drag.current = null; } }),
          h('div', { className: 'jx-row jx-globe-ctl' },
            h('button', { type: 'button', className: 'secondary', onClick: function () { spin.current = !spin.current; } }, '⟳ Spin'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { choose(0); } }, '🇳🇿 Home')),
          h('p', { className: 'jx-muted jx-wc-hint' }, 'Drag to turn the globe and tap a dot to choose a place.'))));
  }
  function tparts(date, tz) {
    try {
      return { time: new Intl.DateTimeFormat('en-NZ', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(date).replace(/\s?([ap])\.?m\.?/i, function (m, a) { return ' ' + a.toLowerCase() + 'm'; }),
        day: new Intl.DateTimeFormat('en-NZ', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date) };
    } catch (e) { return { time: show(date, tz), day: '' }; }
  }
  function Picker(props) {
    var sel = props.sel, P = PLACES[sel], country = countryOf(P), sub = BYC[country] || [sel];
    var q = useState(''), text = q[0], setText = q[1];
    var labels = useMemo(function () { return PLACES.map(function (p) { var c = countryOf(p), l = placeLabel(p); return l === c ? c : c + ' — ' + l; }); }, []);
    var recent = recentGet().map(function (n) { return PLACES.findIndex(function (p) { return p[0] === n; }); }).filter(function (i) { return i >= 0; });
    var quick = recent.concat(QUICK.map(function (n) { return PLACES.findIndex(function (p) { return p[0] === n; }); })).filter(function (i, k, a) { return i >= 0 && a.indexOf(i) === k; }).slice(0, 5);
    function pick(i) { if (i >= 0) { recentAdd(i); props.choose(i); } }
    function typed(v) { setText(v); var k = labels.indexOf(v); if (k < 0) { var lv = v.trim().toLowerCase(); if (lv.length > 2) k = labels.findIndex(function (l) { return l.toLowerCase() === lv || l.toLowerCase().split(' — ').pop().split(' · ')[0] === lv; }); } if (k >= 0) { pick(k); setText(''); } }
    var countries = {}; REGIONS.forEach(function (r) { countries[r] = []; });
    Object.keys(BYC).forEach(function (c) { var r = regionOf(PLACES[BYC[c][0]]); (countries[r] = countries[r] || []).push(c); });
    Object.keys(countries).forEach(function (r) { countries[r].sort(function (a, b) { return a === 'New Zealand' ? -1 : b === 'New Zealand' ? 1 : a.localeCompare(b); }); });
    return h('div', { className: 'jx-gp' },
      h('div', { className: 'jx-gp-quick', role: 'group', 'aria-label': 'Quick picks' }, quick.map(function (i) { var p = PLACES[i]; return h('button', { key: i, type: 'button', className: 'jx-gp-chip' + (i === sel ? ' is-on' : ''), onClick: function () { pick(i); } }, p[1] + ' ' + (/\(/.test(p[0]) ? placeLabel(p).split(' · ')[0] : countryOf(p))); })),
      h('div', { className: 'jx-gp-row' },
        h('label', { className: 'jx-gp-field' }, h('span', null, '🌍 Country'),
          h('select', { value: country, onChange: function (e) { pick(BYC[e.target.value][0]); } },
            REGIONS.filter(function (r) { return countries[r] && countries[r].length; }).map(function (r) { return h('optgroup', { key: r, label: r }, countries[r].map(function (c) { var f = PLACES[BYC[c][0]][1]; return h('option', { key: c, value: c }, f + ' ' + c + (BYC[c].length > 1 ? ' (' + BYC[c].length + ')' : '')); })); }))),
        sub.length > 1 && h('label', { className: 'jx-gp-field' }, h('span', null, '📍 City or region'),
          h('select', { value: sel, onChange: function (e) { pick(+e.target.value); } }, sub.map(function (i) { return h('option', { key: i, value: i }, placeLabel(PLACES[i]) + (PLACES[i][2] === PLACES[i][6] ? ' (capital)' : '')); })))),
      h('label', { className: 'jx-gp-field jx-gp-search' }, h('span', null, '🔎 Search'),
        h('input', { type: 'search', list: 'jx-gp-list', value: text, placeholder: 'e.g. Kerala, Indore, Cebu, Paris', onChange: function (e) { typed(e.target.value); } }),
        h('datalist', { id: 'jx-gp-list' }, labels.map(function (l, i) { return h('option', { key: i, value: l }); }))),
      h('p', { className: 'jx-muted jx-gp-count' }, PLACES.length + ' places in ' + Object.keys(BYC).length + ' countries and territories.'));
  }
  JNZX.WorldGlobe = WorldGlobe;
  JNZX.register('x:world-clock', function WorldClockPage(props) {
    return h('div', null, JNZX.Header('KIWI ADVENTURES · WORLD CLOCK', 'What time is it there?', 'Keep in touch with whānau and friends overseas — check their time before you call.'), h(WorldGlobe, {}), h(JNZX.ShareBar, { tab: props.tab }));
  });

  (function () {
    var css = '.jx-wc{display:grid;gap:14px;max-width:900px}.jx-wc .jx-gp{margin:0}' +
      '.jx-wc-times{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:stretch}' +
      '.jx-wc-t{border-radius:18px;padding:16px 18px;background:#fff;border:1px solid #e1e8e4;text-align:center;display:flex;flex-direction:column;justify-content:center}' +
      '.jx-wc-t.is-there{background:#fffaf0;border-color:#f0e2bf}.jx-wc-t.is-nz{background:#f2f8ff;border-color:#d4e5f7}' +
      '.jx-wc-where{margin:0;font-weight:700;font-size:.95rem;color:#3b4a46}.jx-wc-clock{margin:6px 0 2px;font-size:clamp(2rem,7vw,3rem);font-weight:800;letter-spacing:-.01em;line-height:1.05;font-variant-numeric:tabular-nums;color:#1b2a28}.jx-wc-day{margin:0;font-size:.95rem;color:#55625f}' +
      '.jx-wc-diff{display:flex;align-items:center;justify-content:center}.jx-wc-diff span{background:#245a45;color:#fff;border-radius:999px;padding:6px 12px;font-weight:700;font-size:.85rem;text-align:center;max-width:120px}' +
      '.jx-wc-facts{margin:0;font-size:.98rem;line-height:1.6;color:#3b4a46;text-align:center}.jx-wc-actions{justify-content:center}' +
      '.jx-wc-more{border:1px solid #e1e8e4;border-radius:16px;padding:10px 14px;background:#fff}.jx-wc-more summary{cursor:pointer;font-weight:700;min-height:32px;display:flex;align-items:center}.jx-wc-more .jx-globe-card{margin:10px 0 0}.jx-wc-more .jx-globe-canvas{max-width:300px;margin-top:10px}.jx-wc-hint{text-align:center;font-size:.85rem;margin:6px 0 0}' +
      '@media (max-width:600px){.jx-wc-times{grid-template-columns:1fr}.jx-wc-diff span{max-width:none}}' +
      'html[data-reading-theme="dark"] .jx-wc-t,html[data-reading-theme="dark"] .jx-wc-more{background:#18211f;border-color:#33433f}html[data-reading-theme="dark"] .jx-wc-t.is-there{background:#2a2410;border-color:#4a3f1a}html[data-reading-theme="dark"] .jx-wc-t.is-nz{background:#10243a;border-color:#23405f}' +
      'html[data-reading-theme="dark"] .jx-wc-where,html[data-reading-theme="dark"] .jx-wc-facts,html[data-reading-theme="dark"] .jx-wc-day{color:#d7e2de}html[data-reading-theme="dark"] .jx-wc-clock{color:#fff}html[data-reading-theme="dark"] .jx-wc-diff span{background:#7fc4a2;color:#0f1a17}' +
      '.jx-gp{display:grid;gap:12px;margin:0 0 12px;padding:14px;border-radius:16px;background:#f1f6f3;color:#1f2a2a;border:1px solid #dbe5df}' +
      '.jx-gp-quick{display:flex;flex-wrap:wrap;gap:6px}.jx-gp-chip{border:1px solid #cfdad3;background:#fff;color:#1f2a2a;border-radius:999px;padding:7px 12px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;min-height:38px}.jx-gp-chip.is-on{background:#1f4d3a;border-color:#1f4d3a;color:#fff}' +
      '.jx-gp-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:10px}.jx-gp-field{display:grid;gap:4px;font-weight:700;font-size:14px}' +
      '.jx-gp-field select,.jx-gp-field input{font:inherit;font-size:16px;font-weight:500;padding:10px 12px;border-radius:12px;border:1px solid #c6d3cb;background:#fff;color:#1f2a2a;width:100%;box-sizing:border-box;min-height:46px}' +
      '.jx-gp-note{margin:0;font-size:15px}.jx-gp-count{margin:0;font-size:13px}' +
      'html[data-reading-theme="dark"] .jx-gp{background:#1b2524;color:#eef3f1;border-color:#33433f}html[data-reading-theme="dark"] .jx-gp-chip,html[data-reading-theme="dark"] .jx-gp-field select,html[data-reading-theme="dark"] .jx-gp-field input{background:#141c1b;color:#eef3f1;border-color:#3a4a46}' +
      'html[data-reading-theme="dark"] .jx-gp-chip.is-on{background:#7fc4a2;color:#0f1a17;border-color:#7fc4a2}html[data-reading-theme="dark"] .jx-gp-field,html[data-reading-theme="dark"] .jx-gp-note{color:#eef3f1}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  })();
})();
