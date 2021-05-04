import {DB_MatchPlayer, DB_Player} from "../types/database/models";
import {ApiActions, HttpMethod} from "./ApiTypes";
import axios, {AxiosError, AxiosPromise, AxiosResponse} from "axios";

const FB_URL = process.env.REACT_APP_FB_URL;

export class QuickHitAPI {
    public static getPlayers(onSuccess: (players: DB_Player[]) => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.PLAYERS, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data))
            }).catch((error: AxiosError) => {
            onFailure(error.message)
        })
    }

    public static getMatchPlayers(onSuccess: (matches: DB_MatchPlayer[]) => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.MATCH_PLAYERS, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data));
            }).catch((error: AxiosError) => {
            onFailure(error.message);
        });
    }

    public static addNewPlayer(playerToAdd: DB_Player, onSuccess: () => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.PLAYERS, HttpMethod.PATCH, `{"${playerToAdd.id}" : ${JSON.stringify(playerToAdd)}}`)
            .then((response: AxiosResponse) => {
                onSuccess()
            }).catch((error: AxiosError) => {
                onFailure(error.message)
        });
    }

    private static makeAxiosRequest(uri: string, method: HttpMethod, data?: any): AxiosPromise {
        return axios({
            method: method,
            baseURL: FB_URL,
            url: uri,
            data: data,
            headers: {'Content-Type': 'application/json'}
        });
    }
}
