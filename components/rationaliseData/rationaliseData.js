import { WORKTYPES, WORKSTYLES, SENIORITYS, LOCATIONS, TIMING, BUSINESS_AREAS } from './keywords.js';


async function dataRationaliser(jobListing) {
    const rationalisedData = {};
    for (const key in jobListing) {
        const value = jobListing[key];
        if ( key === 'description') {
            // DOM Purify
            rationalisedData[key] = value //temp before DOM purify added
        } else if ( key === 'applyLink') {
            // ensure url adheres to standard https://
            const formattedUrl = value.replace(/^(https?:\/\/)?(www\.)?/, 'https://');
            rationalisedData[key] = formattedUrl;
        } else if ( key === 'title') {
            rationalisedData[key] = toPascalCase(value)
        } else if ( key === 'workStyle') {
            const matchedArray = findMatchAndUpdate(value, WORKSTYLES);
            if (matchedArray) {
                rationalisedData[key] = matchedArray;
            }
        } else if ( key === 'workType') {
            const matchedArray = findMatchAndUpdate(value, WORKTYPES);
            if (matchedArray) {
                rationalisedData[key] = matchedArray;
            }
        } else if ( key === 'seniority') {
            const matchedArray = findMatchAndUpdate(value, SENIORITYS);
            if (matchedArray) {
                rationalisedData[key] = matchedArray;
            }
        } else if ( key === 'locations') {
            const matchedArray = findMatchAndUpdate(value, LOCATIONS);
            if (matchedArray) {
                rationalisedData[key] = matchedArray;
            }
        } else if ( key === 'timing') {
            const matchedArray = findMatchAndUpdate(value, TIMING);
            if (matchedArray) {
                rationalisedData[key] = matchedArray;
            }
        } else if ( key === 'areas' ) {
            // function to filter departments to best match
            const matchedArray = findMatchAndUpdate(value, BUSINESS_AREAS);
            if (matchedArray) {
                rationalisedData[key] = matchedArray;
            }
        } else {
            // Any values we do not want to alter, and retain as is, can be added to this if condition
            if ( key === 'exampleKey' ) {
                rationalisedData[key] = value
            } else {
                console.log(`KEY: "${key}", is not a supported job listing field and will be discarded.`)
            }
        }

    }
    return rationalisedData;
}

function findMatchAndUpdate(keyword, keywordArray) {
    let matches = {};

    // if value is a string no loop required, return as a single entry in an array
    if (typeof keyword === 'string') {
        const value = keyword.toUpperCase();
        for (const arr of keywordArray) {
            if (arr.includes(value)) {
                console.log(`Match found for ${keyword}:, ${arr[0]} from keyword: ${value}`)
                matches = [arr[0]];
                break;
            }
        }
    // if array, check each entry
    } else if (typeof keyword === 'object') { 
        for (const key in keyword) {
            if (Object.hasOwnProperty.call(keyword, key)) {
                const value = keyword[key].toUpperCase();
                for (const arr of keywordArray) {
                    if (arr.includes(value)) {
                        console.log(`Match found for ${key}:, ${arr[0]} from keyword: ${value}`)
                        matches[key] = [arr[0]];
                        break;
                    }
                }
            }
        }
    }

    if (Object.keys(matches).length > 0) {
        return matches;
    }
    console.log(`no match found for ${keyword}`)
    return null;
}

function toPascalCase(str) {
    return str.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return word.toUpperCase();
    }).replace(/^\s+|\s+$/g, '');
}

export default dataRationaliser;
