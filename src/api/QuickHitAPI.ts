import {DB_Match, DB_Player} from "../types/database/models";
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

    public static getMatches(onSuccess: (matches: DB_Match[]) => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.MATCHES, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data));
            }).catch((error: AxiosError) => {
            onFailure(error.message);
        });
    }

    public static addNewPlayer(playerToAdd: DB_Player, onSuccess: () => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.PLAYERS, HttpMethod.PATCH, `{"${playerToAdd.id}" : ${JSON.stringify(playerToAdd)}}`)
            .then(() => {
                onSuccess()
            }).catch((error: AxiosError) => {
                onFailure(error.message)
        });
    }

    public static addNewMatch(matchToAdd: DB_Match, onSuccess: () => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.MATCHES, HttpMethod.PATCH, `{"${matchToAdd.id}" : ${JSON.stringify(matchToAdd)}}`)
            .then(() => {
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
