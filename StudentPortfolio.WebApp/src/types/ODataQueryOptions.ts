export interface ODataQueryOptions {
  filter?: Record<string, number | string | ODataOPeration>;
}

// This will get typed eventually...
export type ODataOPeration = any;
