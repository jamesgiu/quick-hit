import { DbBadge, DbHappyHour, DbMatch, DbPlayer, getTodaysDate } from "../types/database/models";
import { ApiActions, HttpMethod } from "./ApiTypes";
import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import store from "../redux/types/store";
import { setToken } from "../redux/actions/AuthActions";
const FB_URL = process.env.REACT_APP_FB_URL;
const FB_API_KEY = process.env.REACT_APP_FB_API_KEY;

export class QuickHitAPI {
    public static getPlayers(onSuccess: (players: DbPlayer[]) => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.PLAYERS, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data));
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    public static getMatches(onSuccess: (matches: DbMatch[]) => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.MATCHES, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data));
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    public static getBadges(onSuccess: (badges: DbBadge[]) => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.BADGE, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data));
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    public static addBadge(badgeToAdd: DbBadge, onSuccess: () => void, onFailure: (errorString: string) => void): void {
        QuickHitAPI.makeAxiosRequest(
            ApiActions.BADGE,
            HttpMethod.PATCH,
            `{"${badgeToAdd.id}" : ${JSON.stringify(badgeToAdd)}}`
        )
            .then(() => {
                onSuccess();
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    public static addOrUpdatePlayer(
        playerToAdd: DbPlayer,
        onSuccess: () => void,
        onFailure: (errorString: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(
            ApiActions.PLAYERS,
            HttpMethod.PATCH,
            `{"${playerToAdd.id}" : ${JSON.stringify(playerToAdd)}}`
        )
            .then(() => {
                onSuccess();
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    public static getTodaysHappyHour(
        onSuccess: (happyHour?: DbHappyHour) => void,
        onFailure: (errorString: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(
            `${ApiActions.HAPPY_HOUR}?orderBy="$key"&startAt="${getTodaysDate()}"&`,
            HttpMethod.GET
        )
            .then((response: AxiosResponse) => {
                onSuccess(response.data[getTodaysDate()]);
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    public static setHappyHourToday(
        happyHour: DbHappyHour,
        onSuccess: () => void,
        onFailure: (errorString: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(
            ApiActions.HAPPY_HOUR,
            HttpMethod.PATCH,
            `{"${happyHour.date}" : ${JSON.stringify(happyHour)}}`
        )
            .then(() => {
                onSuccess();
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    public static addNewMatch(
        matchToAdd: DbMatch,
        winningPlayer: DbPlayer,
        losingPlayer: DbPlayer,
        onSuccess: () => void,
        onFailure: (errorString: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(
            ApiActions.MATCHES,
            HttpMethod.PATCH,
            `{"${matchToAdd.id}" : ${JSON.stringify(matchToAdd)}}`
        )
            .then(() => {
                this.addOrUpdatePlayer(
                    winningPlayer,
                    () => {
                        return;
                    },
                    onFailure
                );
                this.addOrUpdatePlayer(
                    losingPlayer,
                    () => {
                        return;
                    },
                    onFailure
                );
                onSuccess();
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    private static makeAxiosRequest(uri: string, method: HttpMethod, data?: string): AxiosPromise {
        return this.authenticateToFirebase().then((token: string) => {
            return axios({
                method: method,
                baseURL: FB_URL,
                url: `${uri}?auth=${token}`.replaceAll("&?", "&"),
                data: data,
                headers: { "Content-Type": "application/json" },
            });
        });
    }

    //FIXME
    //Because we only store a string here, we don't store the expiresIn, but currently it's an hour.
    //It will get a new token on each refresh - so you'd have to be using QuickHit for over an hour before getting
    //prompted to refresh.
    private static async authenticateToFirebase(): Promise<string> {
        const getToken = (): Promise<string> => {
            // Check Redux store for existing token
            const token = store.getState().authStore.token;
            // If there wasn't one, get a new one and set it.
            if (!token) {
                return axios({
                    method: HttpMethod.POST,
                    baseURL: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FB_API_KEY}`,
                    data: {
                        email: process.env.REACT_APP_FB_SRV_ACC_NAME,
                        password: store.getState().authStore.authKey,
                        returnSecureToken: true,
                    },
                    headers: { "Content-Type": "application/json" },
                }).then((response) => {
                    const token = response.data.idToken;
                    store.dispatch(setToken(token));
                    return new Promise<string>((resolve) => {
                        resolve(token);
                    });
                });
            }
            return new Promise<string>((resolve) => {
                resolve(token);
            });
        };

        return getToken();
    }
}
