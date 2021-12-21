import {
    DbBadge,
    DbChatRoom,
    DbHappyHour,
    DbInstance,
    DbMatch,
    DbPlayer,
    DbTournament,
    getTodaysDate,
} from "../types/database/models";
import { ApiActions, HttpMethod } from "./ApiTypes";
import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import store from "../redux/types/store";
import { setToken } from "../redux/actions/AuthActions";
const FB_CATALOGUE_URL = process.env.REACT_APP_FB_URL;
export class QuickHitAPI {
    public static getInstances(
        onSuccess: (instances: DbInstance[]) => void,
        onFailure: (errorString: string) => void
    ): void {
        axios({
            method: HttpMethod.GET,
            baseURL: FB_CATALOGUE_URL,
            url: ApiActions.INSTANCES,
            headers: { "Content-Type": "application/json" },
        })
            .then((response: AxiosResponse) => {
                onSuccess(Object.values(response.data));
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

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

    public static getTournaments(
        onSuccess: (tournaments: DbTournament[]) => void,
        onFailure: (errorString: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.TOURNAMENT, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(response.data ? Object.values(response.data) : []);
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

    public static setHappyHour(
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

    public static getTodaysChatRoom(
        onSuccess: (chatRoom?: DbChatRoom) => void,
        onFailure: (errorString: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(`${ApiActions.CHAT}?orderBy="$key"&startAt="${getTodaysDate()}"&`, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(response.data[getTodaysDate()]);
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    public static setChatRoom(
        chatRoom: DbChatRoom,
        onSuccess: () => void,
        onFailure: (errorString: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(
            ApiActions.CHAT,
            HttpMethod.PATCH,
            `{"${chatRoom.date}" : ${JSON.stringify(chatRoom)}}`
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

    public static addUpdateTournament(
        tournamentToAdd: DbTournament,
        onSuccess: () => void,
        onFailure: (errorString: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(
            ApiActions.TOURNAMENT,
            HttpMethod.PATCH,
            `{"${tournamentToAdd.id}" : ${JSON.stringify(tournamentToAdd)}}`
        )
            .then(() => onSuccess())
            .catch((error: AxiosError) => onFailure(error.message));
    }

    private static makeAxiosRequest(uri: string, method: HttpMethod, data?: string): AxiosPromise {
        const chosenInstance = store.getState().authStore.chosenInstance;

        if (!chosenInstance) {
            return Promise.reject({ message: "Must select an instance to proceed!" });
        }

        return this.authenticateToFirebase(chosenInstance).then((token: string) => {
            return axios({
                method: method,
                baseURL: chosenInstance.fb_url,
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
    private static async authenticateToFirebase(chosenInstance: DbInstance): Promise<string> {
        const getToken = (): Promise<string> => {
            // Check Redux store for existing token
            const token = store.getState().authStore.token;

            // If there wasn't one, and we're not using Google Auth, get a new one and set it.
            if (!token && !chosenInstance.google_auth) {
                return axios({
                    method: HttpMethod.POST,
                    baseURL: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${chosenInstance.fb_api_key}`,
                    data: {
                        email: chosenInstance.fb_srv_acc_name,
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
