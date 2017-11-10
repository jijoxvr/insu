import { RequestOptionsArgs } from "@angular/http";


export interface CustomRequestOptions extends RequestOptionsArgs {
    keepInLocalStorage?: boolean,
    keepInSessionStorage?: boolean,
    keyForWebStorage?: string,
    time? : number
} 