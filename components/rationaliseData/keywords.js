
const SYDNEY = [
    'Sydney',
    'SYDNEY',
    'SYD'
];
const MELBOURNE = [
    'Melbourne',
    'MELBOURNE',
    'MELB'
];

const BRISBANE = [
    'Brisbane',
    'BRISBANE',
    'BNE'
];
const GOLD_COAST = [
    'Gold Coast',
    'GOLD COAST',
    'OOL'
];
const PERTH = [
    'Perth',
    'PERTH',
    'PER'
];
const ADELAIDE = [
    'Adelaide',
    'ADELAIDE',
    'ADL'
];
const CANBERRA = [
    'Canberra',
    'CANBERRA',
    'CBR'
];
const OTHER_AUS = [
    'Other - Australia',
    'OTHER - AUS',
    'OTHER - AU'
];
const AUSTRALIA = [
    SYDNEY,
    MELBOURNE,
    BRISBANE,
    GOLD_COAST,
    PERTH,
    ADELAIDE,
    CANBERRA,
    OTHER_AUS,
];

const AUCKLAND = [
    'Auckland',
    'AUCKLAND',
    'AKL'
  ];
  const HAMILTON = [
    'Hamilton',
    'HAMILTON'
  ];
  const TAURANGA = [
    'Tauranga',
    'TAURANGA'
  ];
  const GISBOURNE = [
    'Gisbourne',
    'GISBOURNE'
  ];
  const NAPIER = [
    'Napier',
    'NAPIER'
  ];
  const PALMERSTON_NORTH = [
    'Palmerston North',
    'PALMERSTON NORTH'
  ];
  const WELLINGTON = [
    'Wellington',
    'WELLINGTON',
    'WLG'
  ];
  const NELSON = [
    'Nelson',
    'NELSON'
  ];
  const CHRISTCHURCH = [
    'Christchurch',
    'CHRISTCHURCH',
    'CHCH'
  ];
  const QUEENSTOWN = [
    'Queenstown',
    'QUEENSTOWN',
    'QTOWN'
  ];
  const DUNEDIN = [
    'Dunedin',
    'DUNEDIN'
  ];
  const OTHER_NZ = [
    'Other - New Zealand',
    'OTHER - NEW ZEALAND',
    'OTHER - NZ',
    'UNKNOWN_NZ'
  ];

  const NEWZEALAND = [
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
  
const LONDON = [
    'London',
    'LONDON'
];
const MANCHESTER = [
    'Manchester',
    'MANCHESTER'
];
const LIVERPOOL = [
    'Liverpool',
    'LIVERPOOL'
];
const BRISTOL = [
    'Bristol',
    'BRISTOL'
];
const GLASGOW = [
    'Glasgow',
    'GLASGOW'
];
const EDINBURGH = [
    'Edinburgh',
    'EDINBURGH'
];
const CARDIFF = [
    'Cardiff',
    'CARDIFF'
];
const BELFAST = [
    'Belfast',
    'BELFAST'
];
const OTHER_UK = [
    'Other - UK',
    'OTHER - UK',
    'UNKNOWN_UK'
]
const UNITED_KINGDOM = [
    LONDON,
    MANCHESTER,
    LIVERPOOL,
    BRISTOL,
    GLASGOW,
    EDINBURGH,
    CARDIFF,
    BELFAST,
    OTHER_UK
]

const WORKSTYLE_REMOTE = [
    "Remote",
    "REMOTE",
    "OFF-SITE",
    "OFF SITE",
    "FROM HOME",
    "INTERNATIONAL",
    "ABROAD"
]
const WORKSTYLE_OFFICE = [
    "Office",
    "OFFICE",
    "ON SITE",
    "ON-SITE"
]
const WORKSTYLE_HYBRID = [
    "Hybrid",
    "HYBRID",
    "FLEXIBLE"
]
const WORKSTYLES = [
    WORKSTYLE_REMOTE,
    WORKSTYLE_OFFICE,
    WORKSTYLE_HYBRID
]

const LOCATIONS = [
    ...WORKSTYLE_REMOTE,
    ...AUSTRALIA,
    ...UNITED_KINGDOM,
    ...NEW_ZEALAND,
]

const SEN_GRAD = [
    "Entry-level/graduate",
    "ENTRY"
]
const SEN_JUNIOR = [
    "Junior (1-2 years)",
    "1-2 YEARS"
]
const SEN_MID = [
    "Mid-level (3-4 years)",
    "INTERMEDIATE",
    "3-4 years"
]
const SEN_SENIOR = [
    "Senior (5-8 years)",
    "SENIOR",
    '5+ YEARS'
]
const SEN_EXPERT =[
    "Expert & Leadership (9+ years)",
    "EXPERT",
    '9+ YEARS'
]
const SENIORITYS = [
    SEN_GRAD,
    SEN_JUNIOR,
    SEN_MID,
    SEN_SENIOR,
    SEN_EXPERT
]



const WORKTYPE_FULLTIME = [
    "Full-time",
    "FULL-TIME PERMANENT",
    "FULL-TIME",
    "FULL TIME",
    "FULLTIME",
    "FULL",
    "FT"
]
const WORKTYPE_PARTTIME = [
    "Part-time",
    "PART-TIME",
    "PART TIME",
    "PARTTIME",
    "PART",
    "PT",
]
const WORKTYPE_CONTRACT = [
    "Contract",
    "CONTRACT",
    "CONTRACTUAL"
]
const WORKTYPE_FRACTIONAL = [
    "Fractional",
    "FRACTIONAL"
]
const WORKTYPES = [
    WORKTYPE_FULLTIME,
    WORKTYPE_PARTTIME,
    WORKTYPE_CONTRACT,
    WORKTYPE_FRACTIONAL
]

const TIMING_ASAP = [
    'As soon as possible'
]
const TIMING_SIX_MONTHS = [
    '3-6 months',
    'MONTHS',
    '3',
    '4',
    '5',
    '6'
]
const TIMING_ONE_YEAR = [
    'Within the next year'
]
const TIMING_CURIOUS = [
    'Just curious'
]
const TIMING = [
    TIMING_ASAP,
    TIMING_SIX_MONTHS,
    TIMING_ONE_YEAR,
    TIMING_CURIOUS
]

const AREAS_SOFTWARE = [
    'Software Engineering',
    'SOFTWARE ENGINEERING',
    'SOFTWARE',
    'DEVELOPER',
    'DEV',
    'JAVASCRIPT',
    'PROGRAMMER',
    'NODE.JS',
    'PYTHON'
]
const AREAS_DATA = [
    'Data',
    'DATA'
]
const AREAS_ENGINEERING = [
    'Other Engineering'
]
const AREAS_PRODUCT = [
    'Product'
]
const AREAS_DESIGN = [
    'Design',
]
const AREAS_OPS = [
    'Operations & Strategy'
]
const AREAS_SALES = [
    'Sales & Account Management'
]
const AREAS_MARKETING = [
    'Marketing'
]
const AREAS_HR = [
    'People, HR, Recruitment'
]
const AREAS_FIN_LEGAL = [
    'Finance, Legal & Compliance'
]
const BUSINESS_AREAS = [
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
]

module.exports = { WORKTYPES, WORKSTYLES, SENIORITYS, LOCATIONS, TIMING, BUSINESS_AREAS }



