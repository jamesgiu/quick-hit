import {DB_MatchPlayer, DB_Player} from "../types/database/models";
import {ApiActions, HttpMethod} from "./ApiTypes";
import axios, {AxiosError, AxiosPromise, AxiosResponse} from "axios";

const FB_URL = process.env.REACT_APP_FB_URL;

export class QuickHitAPI {
    public static getPlayers(onSuccess: (players: DB_Player[]) => void, onFailure: (errorString: string) => void) : void {
        QuickHitAPI.makeGetRequest(ApiActions.GET_PLAYERS)
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data))
        }).catch((error: AxiosError) => {
            onFailure(error.message)
        })
    }

    public static getMatchPlayers(onSuccess: (matches: DB_MatchPlayer[]) => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeGetRequest(ApiActions.GET_MATCH_PLAYERS)
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data));
            }).catch((error: AxiosError) => {
            onFailure(error.message);
        });
    }

    private static makeGetRequest(uri: string) : AxiosPromise {
       return axios({
            method: HttpMethod.GET,
            baseURL: FB_URL,
            url: uri,
        });
    }
}
