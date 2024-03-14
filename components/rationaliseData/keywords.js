export const SYDNEY = [
    'Sydney',
    'SYDNEY',
    'SYD'
];
export const MELBOURNE = [
    'Melbourne',
    'MELBOURNE',
    'MELB'
];

export const BRISBANE = [
    'Brisbane',
    'BRISBANE',
    'BNE'
];
export const GOLD_COAST = [
    'Gold Coast',
    'GOLD COAST',
    'OOL'
];
export const PERTH = [
    'Perth',
    'PERTH',
    'PER'
];
export const ADELAIDE = [
    'Adelaide',
    'ADELAIDE',
    'ADL'
];
export const CANBERRA = [
    'Canberra',
    'CANBERRA',
    'CBR'
];
export const OTHER_AUS = [
    'Other - Australia',
    'OTHER - AUS',
    'OTHER - AU'
];
export const AUSTRALIA = [
    SYDNEY,
    MELBOURNE,
    BRISBANE,
    GOLD_COAST,
    PERTH,
    ADELAIDE,
    CANBERRA,
    OTHER_AUS,
];

export const AUCKLAND = [
    'Auckland',
    'AUCKLAND',
    'AKL'
];
export const HAMILTON = [
    'Hamilton',
    'HAMILTON'
];
export const TAURANGA = [
    'Tauranga',
    'TAURANGA'
];
export const GISBOURNE = [
    'Gisbourne',
    'GISBOURNE'
];
export const NAPIER = [
    'Napier',
    'NAPIER'
];
export const PALMERSTON_NORTH = [
    'Palmerston North',
    'PALMERSTON NORTH'
];
export const WELLINGTON = [
    'Wellington',
    'WELLINGTON',
    'WLG'
];
export const NELSON = [
    'Nelson',
    'NELSON'
];
export const CHRISTCHURCH = [
    'Christchurch',
    'CHRISTCHURCH',
    'CHCH'
];
export const QUEENSTOWN = [
    'Queenstown',
    'QUEENSTOWN',
    'QTOWN'
];
export const DUNEDIN = [
    'Dunedin',
    'DUNEDIN'
];
export const OTHER_NZ = [
    'Other - New Zealand',
    'OTHER - NEW ZEALAND',
    'OTHER - NZ',
    'UNKNOWN_NZ'
];

export const NEW_ZEALAND = [
    AUCKLAND,
    HAMILTON,
    TAURANGA,
    GISBOURNE,
    NAPIER,
    PALMERSTON_NORTH,
    WELLINGTON,
    NELSON,
    CHRISTCHURCH,
    QUEENSTOWN,
    DUNEDIN,
    OTHER_NZ
];

export const LONDON = [
    'London',
    'LONDON'
];
export const MANCHESTER = [
    'Manchester',
    'MANCHESTER'
];
export const LIVERPOOL = [
    'Liverpool',
    'LIVERPOOL'
];
export const BRISTOL = [
    'Bristol',
    'BRISTOL'
];
export const GLASGOW = [
    'Glasgow',
    'GLASGOW'
];
export const EDINBURGH = [
    'Edinburgh',
    'EDINBURGH'
];
export const CARDIFF = [
    'Cardiff',
    'CARDIFF'
];
export const BELFAST = [
    'Belfast',
    'BELFAST'
];
export const OTHER_UK = [
    'Other - UK',
    'OTHER - UK',
    'UNKNOWN_UK'
];
export const UNITED_KINGDOM = [
    LONDON,
    MANCHESTER,
    LIVERPOOL,
    BRISTOL,
    GLASGOW,
    EDINBURGH,
    CARDIFF,
    BELFAST,
    OTHER_UK
];

export const WORKSTYLE_REMOTE = [
    "Remote",
    "REMOTE",
    "OFF-SITE",
    "OFF SITE",
    "FROM HOME",
    "INTERNATIONAL",
    "ABROAD"
];
export const WORKSTYLE_OFFICE = [
    "Office",
    "OFFICE",
    "ON SITE",
    "ON-SITE"
];
export const WORKSTYLE_HYBRID = [
    "Hybrid",
    "HYBRID",
    "FLEXIBLE"
];
export const WORKSTYLES = [
    WORKSTYLE_REMOTE,
    WORKSTYLE_OFFICE,
    WORKSTYLE_HYBRID
];

export const LOCATIONS = [
    ...WORKSTYLE_REMOTE,
    ...AUSTRALIA,
    ...UNITED_KINGDOM,
    ...NEW_ZEALAND,
];

export const SEN_GRAD = [
    "Entry-level/graduate",
    "ENTRY"
];
export const SEN_JUNIOR = [
    "Junior (1-2 years)",
    "1-2 YEARS"
];
export const SEN_MID = [
    "Mid-level (3-4 years)",
    "INTERMEDIATE",
    "3-4 years"
];
export const SEN_SENIOR = [
    "Senior (5-8 years)",
    "SENIOR",
    '5+ YEARS'
];
export const SEN_EXPERT =[
    "Expert & Leadership (9+ years)",
    "EXPERT",
    '9+ YEARS'
];
export const SENIORITYS = [
    SEN_GRAD,
    SEN_JUNIOR,
    SEN_MID,
    SEN_SENIOR,
    SEN_EXPERT
];

export const WORKTYPE_FULLTIME = [
    "Full-time",
    "FULL-TIME PERMANENT",
    "FULL-TIME",
    "FULL TIME",
    "FULLTIME",
    "FULL",
    "FT"
];
export const WORKTYPE_PARTTIME = [
    "Part-time",
    "PART-TIME",
    "PART TIME",
    "PARTTIME",
    "PART",
    "PT",
];
export const WORKTYPE_CONTRACT = [
    "Contract",
    "CONTRACT",
    "CONTRACTUAL"
];
export const WORKTYPE_FRACTIONAL = [
    "Fractional",
    "FRACTIONAL"
];
export const WORKTYPES = [
    WORKTYPE_FULLTIME,
    WORKTYPE_PARTTIME,
    WORKTYPE_CONTRACT,
    WORKTYPE_FRACTIONAL
];

export const TIMING_ASAP = [
    'As soon as possible'
];
export const TIMING_SIX_MONTHS = [
    '3-6 months',
    'MONTHS',
    '3',
    '4',
    '5',
    '6'
];
export const TIMING_ONE_YEAR = [
    'Within the next year'
];
export const TIMING_CURIOUS = [
    'Just curious'
];
export const TIMING = [
    TIMING_ASAP,
    TIMING_SIX_MONTHS,
    TIMING_ONE_YEAR,
    TIMING_CURIOUS
];

export const AREAS_SOFTWARE = [
    'Software Engineering',
    'SOFTWARE ENGINEERING',
    'SOFTWARE',
    'DEVELOPER',
    'DEV',
    'JAVASCRIPT',
    'PROGRAMMER',
    'NODE.JS',
    'PYTHON'
];
export const AREAS_DATA = [
    'Data',
    'DATA'
];
export const AREAS_ENGINEERING = [
    'Other Engineering'
];
export const AREAS_PRODUCT = [
    'Product'
];
export const AREAS_DESIGN = [
    'Design',
];
export const AREAS_OPS = [
    'Operations & Strategy'
];
export const AREAS_SALES = [
    'Sales & Account Management'
];
export const AREAS_MARKETING = [
    'Marketing'
];
export const AREAS_HR = [
    'People, HR, Recruitment'
];
export const AREAS_FIN_LEGAL = [
    'Finance, Legal & Compliance'
];
export const BUSINESS_AREAS = [
    AREAS_SOFTWARE,
    AREAS_DATA,
    AREAS_ENGINEERING,
    AREAS_PRODUCT,
    AREAS_DESIGN,
    AREAS_OPS,
    AREAS_SALES,
    AREAS_MARKETING,
    AREAS_HR,
    AREAS_FIN_LEGAL
];
