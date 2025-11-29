import buildQuery from "odata-query";
import type { ODataQueryOptions } from "../types/ODataQueryOptions";

interface QueryParams {
  [key: string]: any;
}

export function convertToURLQueryParams(
  params?: QueryParams & object
): string | undefined {
  if (!params) return;

  const searchParams = new URLSearchParams();

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];

      // Handle different types and potential undefined/null values
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    }
  }
  return searchParams.toString();
}

export function appendQueryString(
  url: string,
  params?: (QueryParams & object) | string
) {
  if (!params) return url;
  else if (typeof params === "string") {
    if (params.charAt(0) === "?") return url + params;
    else return url + "?" + params;
  } else {
    const query = convertToURLQueryParams(params);
    return `${url}${query ? `?${query}` : ""}`;
  }
}

export function appendODataQueryString(
  url: string,
  opt?: ODataQueryOptions | string
) {
  if (!opt) return url;
  else if (typeof opt === "string") {
    if (opt.charAt(0) === "?") return url + opt;
    else return url + "?" + opt;
  } else {
    const query = buildQuery(opt);
    history.pushState(null, "Student Portfolio", query);
    return `${url}${query}`;
  }
}

export function ordinalSuffixOf(i: number) {
  let j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

export function getQueryStringVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return undefined;
}

export function getEnumName<TValue, TEnum extends Record<string, TValue>>(
  enumObj: TEnum,
  value: TValue
) {
  return Object.entries(enumObj).find(
    ([_key, _value]) => _value === value
  )?.[0];
}

export { buildQuery };
