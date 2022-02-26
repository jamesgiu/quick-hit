import {
    DbBadge,
    DbChatRoom,
    DbHappyHour,
    DbInstance,
    DbMatch,
    DbMatchReaction,
    DbPlayer,
    DbTournament,
    getTodaysDate,
} from "../types/database/models";
import { ApiActions, HttpMethod } from "./ApiTypes";
import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import store from "../redux/types/store";
import { setAuthDetail } from "../redux/actions/AuthActions";
import ReactGA from "react-ga";
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

    public static addMatchReation(
        matchReaction: DbMatchReaction,
        onSuccess: () => void,
        onFailure: (errorStr: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(
            ApiActions.MATCH_REACTION,
            HttpMethod.PATCH,
            `{"${matchReaction.id}" : ${JSON.stringify(matchReaction)}}`
        )
            .then(onSuccess)
            .catch((error: AxiosError) => onFailure(error.message));
    }

    public static removeMatchReaction(
        reactionId: string,
        onSuccess: () => void,
        onFailure: (errorStr: string) => void
    ): void {
        // Can't use ApiActions here because we need to delete a specific key from the match reactions.
        QuickHitAPI.makeAxiosRequest(
            `matchreaction/${reactionId}.json`,
            HttpMethod.DELETE
        )
            .then(onSuccess)
            .catch((error: AxiosError) => onFailure(error.message))
    }

    public static getMatchReactions(
        onSuccess: (matchReactions: DbMatchReaction[]) => void,
        onFailure: (errorStr: string) => void
    ): void {
        QuickHitAPI.makeAxiosRequest(ApiActions.MATCH_REACTION, HttpMethod.GET)
            .then((response: AxiosResponse) => {
                onSuccess(response.data ? Object.values(response.data) : []);
            })
            .catch((error: AxiosError) => {
                onFailure(error.message);
            });
    }

    private static makeAxiosRequest(uri: string, method: HttpMethod, data?: string): AxiosPromise {
        const chosenInstance = store.getState().authStore.chosenInstance;

        if (!chosenInstance) {
            return Promise.reject({ message: "Must select an instance to proceed!" });
        }

        return this.authenticateToFirebase(chosenInstance).then((token: string) => {
            const authDetail = store.getState().authStore.authDetail;

            ReactGA.event({
                category: "Request",
                action: `Authenticated user ${authDetail.userName ?? "unknown"} (${
                    authDetail.email ?? "unknown"
                }) has made ${method} request to ${uri} with data: ${data ?? "no data"}`,
            });

            return axios({
                method: method,
                baseURL: chosenInstance.fb_url,
                url: `${uri}?auth=${token}`.replaceAll("&?", "&"),
                data: data,
                headers: { "Content-Type": "application/json" },
            });
        });
    }

    private static async authenticateToFirebase(chosenInstance: DbInstance): Promise<string> {
        const getToken = (): Promise<string> => {
            // Check Redux store for existing token
            const authDetail = store.getState().authStore.authDetail;

            if (!chosenInstance.google_auth) {
                // If there is an auth and it has expired...
                if (authDetail && Date.now() >= new Date(authDetail.expiryTime).getTime()) {
                    console.log("Updating token...");
                    return axios({
                        method: HttpMethod.POST,
                        baseURL: `https://securetoken.googleapis.com/v1/token?key=${chosenInstance.fb_api_key}`,
                        data: {
                            grant_type: "refresh_token",
                            refresh_token: authDetail.refreshToken,
                        },
                        headers: { "Content-Type": "application/json" },
                    }).then((response) => {
                        const token = response.data.id_token;
                        const refreshToken = response.data.refresh_token;
                        const uid = response.data.user_id;
                        const expiryDate = new Date(Date.now() + response.data.expires_in * 1000).toUTCString();
                        store.dispatch(
                            setAuthDetail({ idToken: token, userName: uid, refreshToken, expiryTime: expiryDate })
                        );
                        return new Promise<string>((resolve) => {
                            resolve(token);
                        });
                    });
                }
                // If there wasn't a token, and we're not using Google Auth, get a new one and set it.
                else if (!authDetail) {
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
                        const refreshToken = response.data.refreshToken;
                        const uid = response.data.localId;
                        const email = response.data.email;
                        const expiryDate = new Date(Date.now() + response.data.expiresIn * 1000).toUTCString();
                        store.dispatch(
                            setAuthDetail({
                                idToken: token,
                                userName: uid,
                                email,
                                refreshToken,
                                expiryTime: expiryDate,
                            })
                        );
                        return new Promise<string>((resolve) => {
                            resolve(token);
                        });
                    });
                }
            }
            // Return the token in Redux.
            return new Promise<string>((resolve) => {
                resolve(authDetail.idToken);
            });
        };
        // TODO refresh Google auth?
        return getToken();
    }
}
