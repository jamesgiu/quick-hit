import {DB_Match, DB_Player} from "../types/database/models";
import {ApiActions, HttpMethod} from "./ApiTypes";
import axios, {AxiosError, AxiosPromise, AxiosResponse} from "axios";

const FB_URL = process.env.REACT_APP_FB_URL;
const FB_API_KEY = process.env.REACT_APP_FB_API_KEY;

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

    public static addOrUpdatePlayer(playerToAdd: DB_Player, onSuccess: () => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.PLAYERS, HttpMethod.PATCH, `{"${playerToAdd.id}" : ${JSON.stringify(playerToAdd)}}`)
            .then(() => {
                onSuccess()
            }).catch((error: AxiosError) => {
                onFailure(error.message)
        });
    }

    public static addNewMatch(matchToAdd: DB_Match, winningPlayer: DB_Player, losingPlayer: DB_Player, onSuccess: () => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.MATCHES, HttpMethod.PATCH, `{"${matchToAdd.id}" : ${JSON.stringify(matchToAdd)}}`)
            .then(() => {
                this.addOrUpdatePlayer(winningPlayer,()=>{}, onFailure);
                this.addOrUpdatePlayer(losingPlayer,()=>{}, onFailure);
                onSuccess()
            }).catch((error: AxiosError) => {
            onFailure(error.message)
        });
    }

    private static makeAxiosRequest(uri: string, method: HttpMethod, data?: any): AxiosPromise {
        return this.authenticateToFirebase().then(response => {
            const idToken = response.data.idToken;

            return axios({
                method: method,
                baseURL: FB_URL,
                url: `${uri}?auth=${idToken}`,
                data: data,
                headers: {'Content-Type': 'application/json'}
            });
        });
    }

    private static authenticateToFirebase(): AxiosPromise {
        return axios({
            method: HttpMethod.POST,
            baseURL: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FB_API_KEY}`,
            data: {
                "email": process.env.REACT_APP_FB_SRV_ACC_NAME,
                "password": process.env.REACT_APP_FB_SRV_ACC_PW,
                "returnSecureToken": true
            },
            headers: {'Content-Type': 'application/json'}
        });
    }
}
